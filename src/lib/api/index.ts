import axios, { AxiosError } from "axios";

export enum BookStatus {
    None = "none",
    OnHold = "on_hold",
    CheckedOut = "checked_out",
    Overdue = "overdue",
    Unavailable = "unavailable"
}

type NoneStatus = { status: BookStatus.None };
type HoldStatus = { status: BookStatus.OnHold; hold: Hold; position: number };
type CheckoutStatus = { status: BookStatus.CheckedOut | BookStatus.Overdue; checkout: Checkout };
export type Status = CheckoutStatus | HoldStatus | NoneStatus;
export type Activity = (Checkout & { type: "checkout" }) | (Hold & { type: "hold" });


function makeUri(segments: string[], query?: { [index: string]: any }) {
    // tslint:disable:prefer-template
    let uri = `/api/` + segments.join("/");

    if (query) {
        uri += "?";
        for (const key in query) {
            if (!query.hasOwnProperty(key)) continue;

            uri += `${query[key]}&`;
        }
        uri = uri.substr(0, uri.length - 1);
    }
    // tslint:enable:prefer-template

    return uri;
}



export namespace Api {

    async function del<T>(data: any, segments: string[], query?: { [index: string]: any }): Promise<T | null> {
        try {
            const res = await axios.delete(makeUri(segments, query), data);
            return res.data || res.status === 200;
        }
        catch (err) {
            const res = (err as AxiosError).response;
            if (res && res.status in [404]) // 404 is the only acceptable rejection so far
                return null;

            throw err;
        }
    }

    async function post<T>(data: any, segments: string[], query?: { [index: string]: any }): Promise<T | null> {
        try {
            const res = await axios.post(makeUri(segments, query), data);
            return res.data || res.status === 200;
        }
        catch (err) {
            const res = (err as AxiosError).response;
            if (res && res.status in [404]) // 404 is the only acceptable rejection so far
                return null;

            throw err;
        }
    }

    async function get<T>(segments: string[], query?: { [index: string]: any }): Promise<T | null> {
        try {
            const res = await axios.get(makeUri(segments, query));
            return res.data !== null ? res.data : res.status === 200;
        }
        catch (err) {
            const res = (err as AxiosError).response;
            if (res && res.status in [404]) // 404 is the only acceptable rejection so far
                return null;

            throw err;
        }
    }

    function getId<T extends { id: string }>(obj: T | string): string {
        return typeof obj === "string" ? obj : obj.id;
    }

    export namespace Checkouts {
        export function inDays(days: number): Promise<Checkout[] | null> {
            return get(["book", "all", "checkedout"], { days });
        }

        export function forBook(id: string): Promise<Checkout | null> {
            return get(["book", "copy", id, "checkout"]);
        }
    }

    export namespace Fines {
        export function inDays(days: number): Promise<Fine[] | null> {
            return get(["book", "all", "fined"], { days });
        }
    }

    export namespace Books {
        interface CheckoutData {
            user: string;
            length?: number;
            penalty?: number;
        }

        export function checkIn(id: string): Promise<boolean | null> {
            return post(null, ["book", "copy", id, "checkin"]);
        }

        export function checkOut(id: string, data: CheckoutData): Promise<boolean | null> {
            return post(data, ["book", "copy", id, "checkout"]);
        }

        export function byAuthor(authorId: string) {
            return get<Book[]>(["book", "author", authorId]);
        }

        export function byIsbn(isbn: string) {
            return get<Book>(["book", isbn]);
        }

        export function byId(id: string) {
            return get<Book>(["book", "copy", id]);
        }

        export function search(query: string, limit?: number) {
            return get<Book[]>(["book", "search", query], { limit });
        }

    }

    export namespace Holds {
        export function place(isbn: string): Promise<boolean | null> {
            return post(null, ["hold", "me", isbn]);
        }

        export function remove(isbn: string): Promise<boolean | null> {
            return post<boolean>(null, ["hold", "me", isbn]);
        }

        export function forBook(isbn: string) {
            return get<Hold[]>(["hold", "book", isbn]);
        }

        export function count(isbn: string) {
            return get<number>(["hold", "book", isbn, "count"]);
        }
    }

    export namespace Me {
        export function statusForBook(isbn: string) {
            return get<Status>(["person", "me", "status", isbn]);
        }
    }

    export namespace People {
        export function checkouts(id: string) {
            return get<Checkout[]>(["person", id, "status", "checkedout"]);
        }

        export function holds(id: string) {
            return get<Checkout[]>(["person", id, "status", "onhold"]);
        }

        export function currentActivities(id: string) {
            return get<Activity[]>(["person", id, "status", "current"]);
        }

        export function activities(id: string) {
            return get<Activity[]>(["person", id, "status", "all"]);
        }

        export function byUsername(username: string) {
            return get<Person>(["person", "u", username]);
        }

        export function byId(id: string, person?: Person) {
            if (person) {
                // duplicate object b/c objects are passed by reference
                const data = { ...person };

                // id cannot be set, and server returns error if you try
                delete data._id;
                delete data.id;

                return post<Person>(data, ["person", id]);
            }

            return get<Person>(["person", id]);
        }

        export function search(query: string, limit?: number) {
            return get<Person[]>(["person", "search", query], { limit });
        }
    }
}

export declare interface Document {
    id: string;
    _id: string;
}

export declare type Permission =
    | "check_out"
    | "place_hold"
    | "modify_hold"
    | "modify_book"
    | "modify_fine"
    | "modify_person"
    | "admin"
    | "author"
    | "user"
    | "test";

export interface Person extends Document {
    username: string | null;
    wiki?: string;
    bio?: string;
    name: { first: string; last: string };
    permissions: Permission[];
    limits?: { days: number; books: number };
}

export interface Book extends Document {
    name: string;
    copy?: string;
    edition: { version: number; publisher: string };
    authors: Person[] | string[];
    copies: string[];
    genre: string[];
    rating: number;
    isbn: string;
}

export interface Checkout extends Document {
    start: Date | string;
    due: Date | string | null;
    completed: boolean;
    penalty: number;
    book: string | Book;
    person: string | Person;
}

export interface Hold extends Document {
    date: Date | string;
    completed: boolean;
    isbn: string;
    person: string | Person;
    ready: boolean;
}

export interface Fine extends Document {
    date: Date | string;
    completed: boolean;
    amount: number;
    book: string | Book;
    person: string | Person;
}

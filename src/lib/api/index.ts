import axios from "axios";

export enum BookStatus
{
    None = "none",
    OnHold = "on_hold",
    CheckedOut = "checked_out",
    Overdue = "overdue",
    Unavailable = "unavailable"
}

// tslint:disable:interface-over-type-literal
type NoneStatus = { status: BookStatus.None };
type HoldStatus = { status: BookStatus.OnHold; hold: Hold; position: number };
type CheckoutStatus = { status: BookStatus.CheckedOut; checkout: Checkout };
export type Status = CheckoutStatus | HoldStatus | NoneStatus;
export type Activity = (Checkout & { type: "checkout" }) | (Hold & { type: "hold" });

export abstract class Api
{
    static async placeHold(isbn: string): Promise<boolean>
    {
        try
        {
            const res = await axios.post(`/api/hold/me/${isbn}`);
            return res.status === 200;
        } catch {
            return false;
        }
    }

    static async cancelHold(isbn: string): Promise<boolean>
    {
        try
        {
            const res = await axios.delete(`/api/hold/me/${isbn}`);
            return res.status === 200;
        } catch {
            return false;
        }
    }

    static async getBooksByAuthor(id: string)
    {
        try
        {
            const res = await axios.get(`/api/book/author/${id}`);
            return res.data as Book[];
        } catch {
            return null;
        }
    }

    static async getBookByIsbn(isbn: string)
    {
        try
        {
            const res = await axios.get(`/api/book/${isbn}`);
            return res.data as Book;
        } catch {
            return null;
        }
    }

    static async getStatusForBook(isbn: string): Promise<Status | null>
    {
        try
        {
            const res = await axios.get(`/api/person/me/status/${isbn}`);
            return res.data as Status;
        } catch {
            return null;
        }
    }

    static async getCurrentCheckedOut(id?: string): Promise<Checkout[] | null>
    {
        try
        {
            const res = await axios.get(`/api/person/${id || "me"}/status/checkedout`);
            return res.data;
        } catch {
            return null;
        }
    }

    static async getCurrentHolds(id?: string): Promise<Hold[] | null>
    {
        try
        {
            const res = await axios.get(`/api/person/${id || "me"}/status/onhold`);
            return res.data;
        } catch {
            return null;
        }
    }


    static async getActivities(id?: string): Promise<Activity[] | null>
    {
        try
        {
            const res = await axios.get(`/api/person/${id || "me"}/status/all`);
            return res.data;
        } catch {
            return null;
        }
    }

    static async getHoldCountForBook(isbn: string)
    {
        try
        {
            const res = await axios.get(`/api/hold/book/${isbn}/count`);
            return res.data as number;
        } catch {
            return null;
        }
    }

    static async getPersonById(id: string)
    {
        try
        {
            const res = await axios.get(`/api/person/${id}`);
            return res.data as Person;
        } catch {
            return null;
        }
    }

    static async setPersonById(id: string, person: Person)
    {
        try
        {
            // duplicate object b/c objects are passed by reference
            const data = Object.assign({}, person);

            // id cannot be set, and server returns error if you try
            delete data._id;
            delete data.id;

            const res = await axios.post(`/api/person/${id}`, data);
            return res.data as Person;
        } catch {
            return null;
        }
    }

    static async searchBooks(query: string, limit?: number)
    {
        try
        {
            let url = `/api/book/search/${query}`;
            if (limit) url += `?limit=${limit}`;
            const res = await axios.get(url);
            return res.data as Book[];
        } catch {
            return null;
        }
    }

    static async searchPeople(query: string, limit?: number)
    {
        try
        {
            let url = `/api/person/search/${query}`;
            if (limit) url += `?limit=${limit}`;
            const res = await axios.get(url);
            return res.data as Person[];
        } catch {
            return null;
        }
    }
}

export declare interface Document
{
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

export declare interface Person extends Document
{
    username: string | null;
    wiki?: string;
    bio?: string;
    name: { first: string; last: string };
    permissions: Permission[];
    limits?: { days: number; books: number };
}

export declare interface Book extends Document
{
    name: string;
    edition: { version: number; publisher: string };
    authors: Person[] | string[];
    copies: string[];
    genre: string[];
    rating: number;
    isbn: string;
}

export interface Checkout extends Document
{
    start: Date;
    due: Date | null;
    completed: boolean;
    penalty_factor: number;
    book: string | Book;
    person: string | Person;
}

export interface Hold extends Document
{
    date: Date;
    completed: boolean;
    isbn: string;
    person: string | Person;
    ready: boolean;
}

export interface Fine extends Document
{
    date: Date;
    completed: boolean;
    amount: number;
    book: string | Book;
    person: string | Person;
}

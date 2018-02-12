import axios, { AxiosError } from "axios";

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
    static async getWeeklyCheckouts(): Promise<Checkout[] | null>
    {
        const res = await axios.get(`/api/book/all/checkedout?days=7`);
        return res.data;
    }

    static async getWeeklyFines(): Promise<Fine[] | null>
    {
        const res = await axios.get(`/api/book/all/fined?days=7`);
        return res.data;
    }

    static async getCheckoutForBook(id: string): Promise<Checkout | null>
    {
        try
        {
            const res = await axios.get(`/api/book/copy/${id}/checkout`);
            return res.data;
        }
        catch (err)
        {
            const res = (err as AxiosError).response;
            if (res && res.status === 404)
                return null;

            throw err;
        }
    }

    static async checkIn(id: string): Promise<boolean>
    {
        const res = await axios.post(`/api/book/copy/${id}/checkin`);
        return res.status === 200;
    }

    static async checkOut(id: string, user: string, length?: number, penalty?: number): Promise<boolean>
    {
        const res = await axios.post(`/api/book/copy/${id}/checkout`,
            {
                user, length, penalty
            });
        return res.status === 200;
    }

    static async placeHold(isbn: string): Promise<boolean>
    {
        const res = await axios.post(`/api/hold/me/${isbn}`);
        return res.status === 200;
    }

    static async cancelHold(isbn: string): Promise<boolean>
    {
        const res = await axios.delete(`/api/hold/me/${isbn}`);
        return res.status === 200;
    }

    static async getBooksByAuthor(id: string)
    {
        const res = await axios.get(`/api/book/author/${id}`);
        return res.data as Book[];
    }

    static async getBookByIsbn(isbn: string)
    {
        const res = await axios.get(`/api/book/${isbn}`);
        return res.data as Book;
    }

    static async getBookById(id: string)
    {
        const res = await axios.get(`/api/book/copy/${id}`);
        return res.data as Book;
    }

    static async getStatusForBook(isbn: string): Promise<Status>
    {
        const res = await axios.get(`/api/person/me/status/${isbn}`);
        return res.data as Status;
    }

    static async getCurrentCheckedOut(id?: string): Promise<Checkout[]>
    {
        const res = await axios.get(`/api/person/${id || "me"}/status/checkedout`);
        return res.data;
    }

    static async getCurrentHolds(id?: string): Promise<Hold[]>
    {
        const res = await axios.get(`/api/person/${id || "me"}/status/onhold`);
        return res.data;
    }


    static async getActivities(id?: string): Promise<Activity[]>
    {
        const res = await axios.get(`/api/person/${id || "me"}/status/current`);
        return res.data;
    }

    static async getHoldCountForBook(isbn: string)
    {
        const res = await axios.get(`/api/hold/book/${isbn}/count`);
        return res.data as number;
    }

    static async getHoldsForBook(isbn: string)
    {
        const res = await axios.get(`/api/hold/book/${isbn}`);
        return res.data as Hold[];
    }

    static async getPersonByUsername(username: string)
    {
        const res = await axios.get(`/api/person/u/${username}`);
        return res.data as Person;
    }

    static async getPersonById(id: string)
    {
        const res = await axios.get(`/api/person/${id}`);
        return res.data as Person;
    }

    static async setPersonById(id: string, person: Person)
    {
        // duplicate object b/c objects are passed by reference
        const data = Object.assign({}, person);

        // id cannot be set, and server returns error if you try
        delete data._id;
        delete data.id;

        const res = await axios.post(`/api/person/${id}`, data);
        return res.data as Person;
    }

    static async searchBooks(query: string, limit?: number)
    {

        let url = `/api/book/search/${query}`;
        if (limit) url += `?limit=${limit}`;
        const res = await axios.get(url);
        return res.data as Book[];
    }

    static async searchPeople(query: string, limit?: number)
    {
        let url = `/api/person/search/${query}`;
        if (limit) url += `?limit=${limit}`;
        const res = await axios.get(url);
        return res.data as Person[];
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
    start: Date | string;
    due: Date | string | null;
    completed: boolean;
    penalty: number;
    book: string | Book;
    person: string | Person;
}

export interface Hold extends Document
{
    date: Date | string;
    completed: boolean;
    isbn: string;
    person: string | Person;
    ready: boolean;
}

export interface Fine extends Document
{
    date: Date | string;
    completed: boolean;
    amount: number;
    book: string | Book;
    person: string | Person;
}

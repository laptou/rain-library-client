import axios from "axios";

export enum BookStatus
{
    None = "none",
    OnHold = "on_hold",
    CheckedOut = "checked_out"
}

// tslint:disable:interface-over-type-literal
type NoneStatus = { status: BookStatus.None };
type HoldStatus = { status: BookStatus.OnHold, hold: Hold };
type CheckoutStatus = { status: BookStatus.CheckedOut, checkout: Checkout };
export type Status = CheckoutStatus | HoldStatus | NoneStatus;

export abstract class Api
{
    static async getBooksByAuthor(id: string)
    {
        try
        {
            const res = await axios.get(`/api/book/author/${id}`);
            return res.data as Book[];
        }
        catch
        {
            return null;
        }
    }

    static async getBookById(id: string)
    {
        try
        {
            const res = await axios.get(`/api/book/id/${id}`);
            return res.data as Book;
        }
        catch
        {
            return null;
        }
    }

    static async getBookByIsbn(isbn: string)
    {
        try
        {
            const res = await axios.get(`/api/book/isbn/${isbn}`);
            return res.data as Book;
        }
        catch
        {
            return null;
        }
    }

    static async getStatus(bookId: string): Promise<Status | null>
    {
        try
        {
            const res = await axios.get(`/api/book/status/${bookId}`);
            return res.data as Status;
        }
        catch
        {
            return null;
        }
    }

    static async getCheckedOut(): Promise<Book[] | null>
    {
        try
        {
            const res = await axios.get(`/api/book/checked_out`);
            return res.data as Book[];
        }
        catch
        {
            return null;
        }
    }

    static async getHoldCountForBook(isbn: string)
    {
        try
        {
            const res = await axios.get(`/api/hold/book/${isbn}/count`);
            return res.data as number;
        }
        catch
        {
            return null;
        }
    }

    static async getPersonById(id: string)
    {
        try
        {
            const res = await axios.get(`/api/person/id/${id}`);
            return res.data as Person;
        }
        catch
        {
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
        }
        catch
        {
            return null;
        }
    }
}

export interface Person
{
    id: string;
    username: string | undefined;
    name: { first: string, last: string };
    permissions: string[];
    bio: string;
    wiki: string;
}

export interface Book
{
    id: string;
    name: string;
    edition: { version: number, publisher: string };
    authors: Person[] | string[];
    genre: string[];
    year: number;
    isbn: string;
}

export interface Hold
{
    id: string;
    date: Date;
    completed: boolean;
    isbn: string;
    person: string | Person;
}

export interface Checkout
{
    id: string;
    start: Date;
    end: Date | null;
    penalty_factor: number;
    book: string | Book;
    person: string | Person;
}

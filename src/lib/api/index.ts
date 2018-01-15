import axios from "axios";

export abstract class Api
{
    public static async getBookById (id: string)
    {
        let res = await axios.get(`/api/book/id/${id}`);
        return <Book>res.data;
    }
    
    public static async getBookByIsbn (isbn: string)
    {
        try
        {
            let res = await axios.get(`/api/book/isbn/${isbn}`);
            return <Book>res.data;
        }
        catch
        {
            return null;
        }
    }
    
    public static async getCheckedOut ()
    {
        try
        {
            let res = await axios.get(`/api/book/checked_out`);
            return <Book[]>res.data;
        }
        catch
        {
            return null;
        }
    }
    
    public static async getHoldCountForBook (isbn: string)
    {
        try
        {
            let res = await axios.get(`/api/hold/book/${isbn}/count`);
            return <number>res.data;
        }
        catch
        {
            return null;
        }
    }
    
    public static async getPersonById (id: string)
    {
        try
        {
            let res = await axios.get(`/api/person/id/${id}`);
            return <Person>res.data;
        }
        catch
        {
            return null;
        }
    }
    
    public static async searchBooks (query: string, limit?: number)
    {
        try
        {
            let url = `/api/book/search/${query}`;
            if (limit) url += `?limit=${limit}`;
            let res = await axios.get(url);
            return <Book[]>res.data;
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
    date: Date;
    completed: boolean;
    isbn: string;
    person: string | Person;
}
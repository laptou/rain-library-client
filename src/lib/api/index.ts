import axios from "axios";

export abstract class Api
{
    public static async getBookByIsbn (isbn: string)
    {
        let res = await axios.get(`/api/book/isbn/${isbn}`);
        return <Book>res.data;
    }
    
    public static async getBookById (id: string)
    {
        let res = await axios.get(`/api/book/id/${id}`);
        return <Book>res.data;
    }
    
    public static async getCheckedOut ()
    {
        let res = await axios.get(`/api/book/checked_out`);
        return <Book[]>res.data;
    }
    
    public static async getPersonById (id: string)
    {
        let res = await axios.get(`/api/person/id/${id}`);
        return <Person>res.data;
    }
    
    public static async searchBooks (query: string, limit?: number)
    {
        let url = `/api/book/search/${query}`;
        if (limit) url += `?limit=${limit}`;
        let res = await axios.get(url);
        return <Book[]>res.data;
    }
}

export declare interface Person
{
    id: string;
    username: string | undefined;
    name: { first: string, last: string };
    permissions: string[];
}

export declare interface Book
{
    id: string;
    name: string;
    edition: { version: number, publisher: string } [];
    authors: Person[] | string[];
    genre: string[];
    year: number;
}
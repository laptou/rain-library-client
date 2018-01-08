import axios from "axios";

export abstract class Api
{
    public static async getBookByIsbn (isbn: string)
    {
        let res = await axios.get(`/api/book/isbn/${isbn}`);
        return <Book>res.data;
    }
    
    public static async searchBooksByTitle (query: string)
    {
        let res = await axios.get(`/api/book/search/title/${query}`);
        return <Book[]>res.data;
    }
}

export declare interface Person
{
    username: string | undefined;
    name: { first: string, last: string };
    permissions: string[];
}

export declare interface Book
{
    name: string;
    edition: { version: number, publisher: string } [];
    authors: Person[] | string[];
    genre: string[];
}
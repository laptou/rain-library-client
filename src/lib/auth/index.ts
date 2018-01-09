import axios from "axios";

export interface Person
{
    name: { first: string, last: string }
    id: string;
}

export interface User extends Person
{
    username: string;
}

export async function getCurrentUser (): Promise<User | null>
{
    try
    {
    
        let res = await axios.get("/auth/me", { responseType: "application/json" });
        if (res.status === 200)
            return <User>res.data;
    }
    catch
    {
    }
    
    return null;
}

export async function login (username: string, password: string)
{
    let res = await axios.post("/auth/login", { username, password });
    return res.status === 200;
}
import Cookies from "js-cookie";

export interface Person
{
    name: { first: string, last: string }
    id: string;
}

export interface User extends Person
{
    username: string;
}

export function getCurrentUser (): User | null
{
    let base64 = Cookies.get("koa:sess");
    
    if (!base64) return null;
    
    let json = atob(base64);
    return <User>JSON.parse(json);
}
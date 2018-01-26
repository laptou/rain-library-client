import { Person } from "@lib/api";
import axios from "axios";
import Vue from "vue";
import * as Vuex from "vuex";

async function getCurrentUser(): Promise<Person | null>
{
    try
    {

        const res = await axios.get("/auth/me", { responseType: "application/json" });
        if (res.status === 200)
            return res.data as Person;
    }
    catch
    {
    }

    return null;
}

async function login(username: string, password: string): Promise<number>
{
    try
    {
        const res = await axios.post("/auth/login", { username, password });
        return res.status;
    }
    catch (err)
    {
        return err.response.status;
    }
}

async function logout(): Promise<boolean>
{
    try
    {
        const res = await axios.get("/auth/logout");
        return res.status === 200;
    }
    catch
    {
        return false;
    }
}

interface VuexState
{
    user: Person | null;
}

export const vuexModule: Vuex.Module<VuexState, object> = {
    state: { user: null },
    mutations: {
        setUser: (state: VuexState, payload: Person) =>
        {
            state.user = payload;
        }
    },
    namespaced: true,
    actions: {
        update: async ctx =>
        {
            ctx.commit("setUser", await getCurrentUser());
        },
        login: async (ctx, { username, password }) =>
        {
            const response = await login(username, password);
            if (response === 200)
                ctx.commit("setUser", await getCurrentUser());

            return response;
        },
        logout: async ctx =>
        {
            if (ctx.state.user)
            {
                await logout();
                ctx.commit("setUser", null);
            }
        }
    }
};
export const vueInit = async (vue: Vue) =>
{
    vue.$store.dispatch("auth/update");
};

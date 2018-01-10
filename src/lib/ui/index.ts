import * as blobTools from "@lib/util/blob";
import * as colors from "color-convert";
import * as dtob from "dataurl-to-blob";
import Unsplash, { toJson } from "unsplash-js";
import * as Vuex from "vuex";

export enum Theme
{
    Colorful = "colorful",
    Dark = "dark",
    Light = "light"
}

export interface Size
{
    width: number;
    height: number;
}

export namespace Background
{
    export interface BackgroundInfo
    {
        author: { name: string; url: string; };
        color?: string;
        size?: Size;
        data: Blob;
    }
    
    async function getRandomBackground (): Promise<BackgroundInfo | null>
    {
        try
        {
            const unsplash = new Unsplash(
                {
                    applicationId: "52fb1b97ba5a2853f124e0c23a6e4a8856beb527a41e776ae00efb84a4468b5c",
                    secret: "cffc16665cb4f8d0c1a4d7d812fffd0d1def0cd2137b7a8073831ad38f020ca4",
                    callbackUrl: "urn:ietf:wg:oauth:2.0:oob"
                });
            
            const width = window.innerWidth;
            const orientation = window.innerHeight < width ? "landscape" : "portrait";
            const bgData: any = await toJson(await unsplash.photos.getRandomPhoto(
                {
                    width, query: "rain", orientation
                }));
            const height = width / bgData.width * bgData.height;
            
            return {
                author: { name: bgData.user.name, url: bgData.user.links.html },
                size: { height, width },
                data: await blobTools.getRemoteURLAsBlob(bgData.urls.custom),
                color: bgData.color
            };
            
        }
        catch
        {
            // didn't work, just let the old cached info shine
            return getBackground();
        }
    }
    
    async function getThemeForBackground (image: BackgroundInfo): Promise<Theme>
    {
        try
        {
            if (image.size)
            {
                const info = await blobTools.colorInfo(image.data, image.size.width, image.size.height);
                
                if (info.saturation < -0.9 ||
                    Math.abs(info.saturation * info.brightness) < 0.1) return Theme.Colorful;
                else if (info.brightness < -0.3) return Theme.Dark;
                else if (info.brightness > 0.3) return Theme.Light;
                else return Theme.Colorful;
            }
        }
        catch
        {
        
        }
        
        if (image.color)
        {
            const color = colors.hex.hsl.raw(image.color);
            
            if (color[1] < 10) return Theme.Colorful;
            else if (color[2] < 40) return Theme.Dark;
            else return Theme.Light;
        }
        
        return Theme.Colorful;
    }
    
    function saveTheme (theme: Theme)
    {
        localStorage.setItem("ui::info::theme", <string>theme);
    }
    
    function getTheme ()
    {
        return <Theme>localStorage.getItem("ui::info::theme");
    }
    
    async function saveBackground (image: BackgroundInfo)
    {
        localStorage.setItem("ui::info::data", await blobTools.getBlobAsDataURL(image.data));
        localStorage.setItem("ui::info::author::name", image.author.name);
        localStorage.setItem("ui::info::author::url", image.author.url);
    }
    
    function getBackground (): BackgroundInfo | null
    {
        let data = <string>localStorage.getItem("ui::info::data");
        if (data)
        {
            return {
                author: {
                    name: <string>localStorage.getItem("ui::info::author::name"),
                    url: <string>localStorage.getItem("ui::info::author::url")
                },
                // should work with data urls
                data: dtob(data)
            };
        }
        return null;
    }
    
    interface VuexState
    {
        info: BackgroundInfo | null;
    }
    
    export let vuexModule: Vuex.Module<VuexState, object>;
    
    vuexModule = {
        state: {
            info: getBackground()
        },
        getters: {
            url: (state: VuexState) =>
            {
                if (state.info)
                    return `url(${blobTools.getBlobAsObjectURL(state.info.data)})`;
                
                return null;
            }
        },
        mutations: {
            setBackground: (state: VuexState, payload: BackgroundInfo) =>
            {
                state.info = payload;
            }
        },
        actions: {
            refresh: async (ctx) =>
            {
                const background = await getRandomBackground();
                
                if (background)
                {
                    await saveBackground(background);
                    
                    ctx.commit("setBackground", background);
                    
                    const theme = await getThemeForBackground(background);
                    
                    saveTheme(theme);
                    
                    ctx.commit("ui/setTheme", theme, { root: true });
                }
            }
        },
        namespaced: true
    };
}

interface VuexState
{
    theme: Theme;
}

export const vuexModule: Vuex.Module<VuexState, object> = {
    state: {
        theme: Theme.Colorful
    },
    mutations: {
        setTheme: (state: VuexState, payload: Theme) =>
        {
            state.theme = payload;
        }
    },
    namespaced: true,
    modules: {
        "background": Background.vuexModule
    }
};
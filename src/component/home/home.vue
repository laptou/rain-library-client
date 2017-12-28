<template>
    <div id="root">
        <div id="background"
             :style="{ 'background-image': background.image }"
             :class="[ background.loaded ? 'loaded' : null ]">

        </div>
        <div id="old-background"
             :style="{ 'background-image': background.oldImage }"
             :class="[ !background.loaded ? 'loaded' : null ]">
        </div>
        <span id="background-attribution" v-if="background.author" v-bind:class="`block-${theme}`">
            Photo by <a :href="background.author.url">{{ background.author.name }}</a>
        </span>
        <div id="title-container">
            <h1 id="title" v-bind:class="`text-${theme}`">
                RAIN <br/>
                INSTITUTE <br/>
                LIBRARY
            </h1>
        </div>
        <div id="content-container">

        </div>
    </div>
</template>

<script lang="ts">
    import * as vue from "av-ts";
    import Unsplash, { toJson } from "unsplash-js";
    import Vue from "vue";
    import axios, { AxiosResponse } from "axios";
    import * as colors from "color-convert";
    import { color_info } from "../../lib/brightness";

    enum Theme
    {
        Colorful = "colorful",
        Dark = "dark",
        Light = "light"
    }

    @vue.Component
    export default class Home extends Vue
    {
        background: {
            image: string | null;
            oldImage: string | null;
            loaded: boolean,
            author: { name: string, url: string } | null
        } = { image: null, oldImage: null, loaded: false, author: null };

        theme: Theme | null = null;

        @vue.Lifecycle
        created ()
        {
            {
                const background = localStorage.getItem("home::background");
                const theme = localStorage.getItem("home::theme");

                if (background && theme)
                {
                    this.background.oldImage = `${background}`;
                    this.theme = <Theme>theme;
                }
            }

            (async () =>
            {
                const unsplash = new Unsplash(
                    {
                        applicationId: "52fb1b97ba5a2853f124e0c23a6e4a8856beb527a41e776ae00efb84a4468b5c",
                        secret: "cffc16665cb4f8d0c1a4d7d812fffd0d1def0cd2137b7a8073831ad38f020ca4",
                        callbackUrl: "urn:ietf:wg:oauth:2.0:oob"
                    });

                let width = window.innerWidth;
                let bgData: any = await toJson(await unsplash.photos.getRandomPhoto(
                    {
                        width: width, query: "rain", orientation: "landscape"
                    }));

                let response: AxiosResponse<Blob> = await axios.get(
                    bgData.urls.custom,
                    {
                        method: "GET",
                        responseType: "blob"
                    });
                const blob = response.data;
                const reader = new FileReader();
                const data = await new Promise((resolve, reject) =>
                                               {
                                                   reader.onerror = () => reject(reader.error);
                                                   reader.onloadend = () => resolve(reader.result);
                                                   reader.readAsDataURL(blob);
                                               });

                this.background.image = `url(${data})`;

                try
                {
                    const height = width / bgData.width * bgData.height;
                    const info = await color_info(blob, width, height);

                    console.log(`color_info returned ${JSON.stringify(info)}`);

                    if (info.saturation < -0.9) this.theme = Theme.Colorful;
                    else if (info.brightness < -0.3) this.theme = Theme.Dark;
                    else if (info.brightness > 0.3) this.theme = Theme.Light;
                    else this.theme = Theme.Colorful;
                }
                catch
                {
                    const color = colors.hex.hsl.raw(bgData.color);

                    if (color[1] < 10) this.theme = Theme.Colorful;
                    else if (color[2] < 40) this.theme = Theme.Dark;
                    else this.theme = Theme.Light;
                }

                localStorage.setItem("home::background", this.background.image);
                localStorage.setItem("home::theme", this.theme);

                this.background.author = { name: bgData.user.name, url: bgData.user.links.html };
                this.background.loaded = true;
            })();
        }
    };
</script>

<style scoped src="./home.scss" lang="sass"></style>
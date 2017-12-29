<template>
    <div class="root">
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

        <div id="logo-container">
            <div id="logo-box">
                <acrylic :background="background.image">
                    <div id="logo-border" :class="`text-${theme}`"></div>
                </acrylic>
                <div id="title-container">
                    <h1 id="title" :class="`text-${theme}`">
                        RAIN <br/>
                        INSTITUTE <br/>
                        LIBRARY
                    </h1>
                </div>
            </div>
        </div>
        <div id="content-container">
            <div id="search-container">
                <input id="search-box" placeholder="search for books, authors, and more!"
                       v-model.trim="query"/>
                {{ suggestions }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Acrylic from "@control/acrylic.vue";
    import * as blobTools from "@lib/blob-tools";
    import * as vue from "av-ts";
    import axios from "axios";
    import * as colors from "color-convert";

    import Unsplash, { toJson } from "unsplash-js";
    import Vue from "vue";

    enum Theme
    {
        Colorful = "colorful",
        Dark = "dark",
        Light = "light"
    }


    @vue.Component({ components: { Acrylic } })
    export default class Home extends Vue
    {
        background: {
            image: string | null;
            oldImage: string | null;
            loaded: boolean,
            author: { name: string, url: string } | null
        } = { image: null, oldImage: null, loaded: false, author: null };

        theme: Theme | null = null;

        suggestions: any[] = [];

        query: string = "";

        @vue.Lifecycle
        created ()
        {
            this.retrieveBackground();
            this.refreshBackground();
        }

        @vue.Watch("query")
        onQueryChanged (newVal: string, oldVal: string)
        {
            this.suggestions = [];

            if (this.query)
            {
                (async () =>
                {
                    try
                    {
                        let res = await axios.get("/api/book/find/title:" + this.query);
                        this.suggestions.push(... res.data);
                    }
                    catch
                    {
                        // do nothing for now
                    }
                })();
            }
        }

        retrieveBackground ()
        {
            const background = localStorage.getItem("home::background");
            const theme = localStorage.getItem("home::theme");

            if (background && theme)
            {
                this.background.oldImage = `url(${background})`;
                this.theme = <Theme>theme;
            }
        }

        async refreshBackground ()
        {
            const unsplash = new Unsplash(
                {
                    applicationId: "52fb1b97ba5a2853f124e0c23a6e4a8856beb527a41e776ae00efb84a4468b5c",
                    secret: "cffc16665cb4f8d0c1a4d7d812fffd0d1def0cd2137b7a8073831ad38f020ca4",
                    callbackUrl: "urn:ietf:wg:oauth:2.0:oob"
                });

            let width = window.innerWidth;
            let orientation = window.innerHeight < width ? "landscape" : "portrait";
            let bgData: any = await toJson(await unsplash.photos.getRandomPhoto(
                {
                    width: width, query: "rain", orientation
                }));

            const imgData = await blobTools.getURLAsBlob(bgData.urls.custom);

            this.background.image = `url(${blobTools.getBlobAsObjectURL(imgData)})`;

            try
            {
                const height = width / bgData.width * bgData.height;
                const info = await blobTools.colorInfo(imgData, width, height);

                if (info.saturation < -0.9 ||
                    Math.abs(info.saturation * info.brightness) < 0.1) this.theme = Theme.Colorful;
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

            localStorage.setItem("home::background", await blobTools.getBlobAsDataURL(imgData));
            localStorage.setItem("home::theme", <string>this.theme);

            this.background.author = { name: bgData.user.name, url: bgData.user.links.html };
            this.background.loaded = true;
        }
    };
</script>

<style src='@lib/base.scss' lang="sass"></style>
<style scoped src="./home.scss" lang="sass"></style>
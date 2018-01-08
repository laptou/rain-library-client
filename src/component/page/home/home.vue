<template>
    <div class="root">
        <div id="background"
             :style="{ 'background-image': image }"
             :class="[ background.loaded ? 'loaded' : null ]">

        </div>
        <div id="old-background"
             :style="{ 'background-image': oldImage }"
             :class="[ !background.loaded ? 'loaded' : null ]">
        </div>

        <span id="background-attribution" v-if="background.author" v-bind:class="`block-${theme}`">
            Photo by <a :href="background.author.url">{{ background.author.name }}</a>
        </span>

        <span v-if="user" class="user-container" v-bind:class="`block-${theme}`">
            Welcome, {{ user.name.first + " " + user.name.last }}
        </span>

        <div id="logo-container">
            <div id="logo-box">
                <acrylic :background="image || oldImage" :mode="'image'">
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
                <autocomplete :itemsSource="suggestions"
                              :itemLabelSelector="(item) => item.name"
                              :itemDescriptionSelector="(item) => printInfo(item)"
                              :placeholder="'search for books, authors, and more!'"
                              :acrylic-background="image || oldImage"
                              @querychanged="onQueryChanged">

                </autocomplete>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Acrylic from "@control/acrylic/acrylic.vue";
    import Autocomplete from "@control/autocomplete/autocomplete.vue";
    import * as auth from "@lib/auth";
    import * as blob from "@lib/util/blob";

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

    @vue.Component({ components: { Acrylic, Autocomplete } })
    export default class Home extends Vue
    {
        background: {
            loaded: boolean,
            author: { name: string, url: string } | null
        } = { loaded: false, author: null };

        image: string = "";
        oldImage: string = "";
        theme: Theme = Theme.Dark;

        suggestions: any[] = [];
        user: auth.User | null;

        @vue.Lifecycle
        created ()
        {
            this.retrieveBackground();
            this.refreshBackground();

            this.user = auth.getCurrentUser();
        }

        onQueryChanged (newVal: string, oldVal: string)
        {
            if (newVal)
            {
                (async () =>
                {
                    let suggestions = [];
                    try
                    {
                        let res = await axios.get("/api/book/find/title:" + newVal);
                        suggestions.push(... res.data);
                    }
                    catch
                    {
                        // do nothing for now
                    }

                    this.suggestions = suggestions;
                })();
            }
            else this.suggestions = [];
        }

        printInfo (item: any): string
        {
            let info = "";
            if (item.authors)
            {
                info += item.authors.map((a: any) => a.name.first + " " + a.name.last).join(" ");
            }
            return info;
        }

        retrieveBackground ()
        {
            const background = localStorage.getItem("home::background");
            const theme = localStorage.getItem("home::theme");

            if (background && theme)
            {
                this.oldImage = `url(${background})`;
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

            const imgData = await blob.getURLAsBlob(bgData.urls.custom);

            this.image = `url(${blob.getBlobAsObjectURL(imgData)})`;

            try
            {
                const height = width / bgData.width * bgData.height;
                const info = await blob.colorInfo(imgData, width, height);

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

            localStorage.setItem("home::background", await blob.getBlobAsDataURL(imgData));
            localStorage.setItem("home::theme", <string>this.theme);

            this.background.author = { name: bgData.user.name, url: bgData.user.links.html };
            this.background.loaded = true;
        }
    };
</script>

<style src='@lib/base.scss' lang="scss"></style>
<style scoped src="./home.scss" lang="scss"></style>

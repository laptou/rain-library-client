<template>
    <div id="root">
        <div id="background" v-bind:style="{ 'background-image': images }">
        </div>
        <div id="title-container">
            <h1 id="title" v-bind:class="textStyle">
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
    import * as colors from "color-convert";

    @vue.Component
    export default class Home extends Vue
    {
        images = "";
        textStyle = "text-dodge";

        @vue.Lifecycle
        beforeCreate ()
        {
            (async () =>
            {
                const unsplash = new Unsplash(
                    {
                        applicationId: "52fb1b97ba5a2853f124e0c23a6e4a8856beb527a41e776ae00efb84a4468b5c",
                        secret: "cffc16665cb4f8d0c1a4d7d812fffd0d1def0cd2137b7a8073831ad38f020ca4",
                        callbackUrl: "urn:ietf:wg:oauth:2.0:oob"
                    });

                let bgData: any = await toJson(await unsplash.photos.getRandomPhoto(
                    {
                        width: 1920, query: "rain", orientation: "landscape"
                    }));

                var color = colors.hex.hsl.raw(bgData.color);

                console.log(bgData.color);
                console.log(color);

                if (color[0] < 60) this.textStyle = "light-text";
                else this.textStyle = "dark-text";

                this.images = `url("${bgData.urls.custom}"), ` +
                              `url("${bgData.urls.regular}"), ` +
                              `url("${bgData.urls.small}"), ` +
                              `url("${bgData.urls.thumb}")`;
            })();
        }
    };
</script>

<style scoped src="./home.scss" lang="sass"></style>
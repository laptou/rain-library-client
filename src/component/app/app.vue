<template>
    <div>
        <div id="background"
             :style="{ 'background-image': urls.current }"
             :class="[ urls.current ? 'loaded' : null ]">

        </div>

        <div id="old-background"
             :style="{ 'background-image': urls.old }"
             :class="[ !urls.current ? 'loaded' : null ]">
        </div>

        <div id="scroll-root" v-bar>
            <div>
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import * as vue from "av-ts";
    import Vue from "vue";

    @vue.Component
    export default class App extends Vue
    {
        get background (): string
        {
            return this.$store.getters["ui/background/url"];
        }

        urls: { old: string | null, current: string | null } = { old: null, current: null };

        @vue.Watch("background")
        backgroundChanged (current: string, old: string)
        {
            this.urls = { current: <string>current, old: <string>old };
        }

        @vue.Lifecycle
        created ()
        {
            this.urls = { current: this.background, old: null };
            this.$store.dispatch("ui/background/refresh");
        }
    }
</script>

<style src="./app.scss" lang="scss"></style>

<template>
    <div>
        <transition :duration="1500">
            <div class="background"
                 :style="{ 'background-image': urls.back }"
                 v-show="bg === 'back'">
            </div>
        </transition>

        <transition :duration="1500">
            <div class="background"
                 :style="{ 'background-image': urls.front }"
                 v-show="bg === 'front'">
            </div>
        </transition>

        <div id="scroll-root">
            <transition>
                <router-view/>
            </transition>
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

        urls: { front: string | null, back: string | null } = { front: null, back: null };
        bg: "front" | "back" = "front";

        @vue.Watch("background")
        backgroundChanged (current: string, old: string)
        {
            this.bg = "front";
            this.urls.front = old;
            this.urls.back = current;
            this.bg = "back";
        }

        @vue.Lifecycle
        created ()
        {
            this.urls = { front: this.background, back: null };

            setTimeout(() => this.$store.dispatch("ui/background/refresh"), 0);
        }
    }
</script>

<style src="./app.scss" lang="scss"></style>

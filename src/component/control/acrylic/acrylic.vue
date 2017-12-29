<template>
    <div class="acrylic">
        <div id="acrylic-background-blank"></div>
        <div id="acrylic-background" :style="style">
        </div>
        <div id="acrylic-content">
            <slot/>
        </div>
    </div>
</template>

<script lang="ts">
    import * as vue from "av-ts";
    import Vue from "vue";

    export enum Mode
    {
        Image = "image",
        Color = "color"
    }

    @vue.Component
    export default class Acrylic extends Vue
    {
        @vue.Prop background = vue.p(String);
        @vue.Prop mode: string | Mode = vue.p(String) || Mode.Image; // underlying type of enum is number

        get style ()
        {
            return this.mode == Mode.Color
                ? { "background-color": this.background }
                : { "background-image": this.background };
        }
    }
</script>

<style lang="scss" scoped>
    .acrylic
    {
        overflow: hidden;
        position: relative;
        transition-duration: 0.15s;
    }

    @mixin outset($dist)
    {
        top: $dist;
        left: $dist;
        right: $dist;
        bottom: $dist;
    }

    %background
    {
        background-size: cover;
        background-attachment: fixed;
        position: absolute;
        z-index: -1;
    }

    #acrylic-background-blank
    {
        @extend %background;
        @include outset(0);
        background-color: white;
    }

    #acrylic-background
    {
        @extend %background;
        @include outset(-0.5em);
        filter: blur(0.5em);
        opacity: 0.8;
    }

    #acrylic-content
    {
    }
</style>
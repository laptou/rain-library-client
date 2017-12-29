<template>
    <div class="acrylic">
        <div id="acrylic-background-blank"></div>
        <div id="acrylic-background" :style="{ 'background-image': background }"></div>
        <div id="acrylic-content">
            <slot/>
        </div>
    </div>
</template>

<script lang="ts">
    import * as vue from "av-ts";
    import Vue from "vue";

    @vue.Component
    export default class Acrylic extends Vue
    {
        @vue.Prop background = vue.p(String);
    }
</script>

<style lang="scss" scoped>
    .acrylic
    {
        overflow: hidden;
        position: relative;
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
        @include outset(-1em);
        filter: blur(1em);
        opacity: 0.8;
    }

    #acrylic-content
    {
    }
</style>
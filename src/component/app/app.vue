<template>
    <div>
        <router-view/>
    </div>
</template>

<script lang="ts">
    import * as vue from "av-ts";
    import Vue from "vue";

    @vue.Component
    export default class App extends Vue
    {

    }
</script>

<style>
    /*noinspection CssUnknownTarget*/
    @import url("https://fonts.googleapis.com/css?family=Noto+Serif|Roboto|Roboto+Condensed:700");
</style>
<style src="@lib/base.scss" lang="scss"></style>
<template>
<div v-if="person" id="root">
    <rl-acrylic>
        <div id="wrapper">
            <header>
                <router-link to="/">
                    <img id="logo" :src="require('@res/img/logo-sm.png')" />
                </router-link>
                <div id="title-wrapper">
                    <slot name="header" />
                </div>
            </header>
            <div class="page-content-scroll-wrapper" v-bar>
                    <div class="page-content-wrapper">
                        <section class="page-content">
                            <slot name="body" />
                            </section>
                    </div>
                </div>
                <section id="actions">
                    <rl-page-actions :buttons="buttons"/>
                </section>
        </div>
    </rl-acrylic>
</div>
</template>

<script lang="ts">
import { Page } from "./page";
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class PageLayout extends Page {
}
</script>

<style src="./page.scss" lang="scss">

</style>

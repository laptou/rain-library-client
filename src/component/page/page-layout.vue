<template>
    <div id="root">
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
                            <transition name="fade">
                                <div class="banner-top" :class="['banner-' + page.message.type]" v-if="page.message">
                                    {{ page.message.text }}
                                </div>
                            </transition>
                            <slot name="body" />
                        </section>
                    </div>
                </div>
                <section id="actions">
                    <rl-page-actions :buttons="page.buttons" />
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
    @vue.Prop public page: Page = vue.p({ type: Page, required: true });
}
</script>

<style src="./page.scss" lang="scss" scoped>

</style>

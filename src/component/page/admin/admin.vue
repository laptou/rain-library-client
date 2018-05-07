<template>
    <div id="root">
        <rl-acrylic>
            <div id="wrapper">
                <header>
                    <router-link to="/">
                        <img id="logo" :src="require('@res/img/logo-sm.png')" />
                    </router-link>
                    <div id="title-wrapper">
                        <h1 class="title">Manage Library</h1>
                    </div>
                </header>
                <div class="page-content-scroll-wrapper" v-bar>
                    <div class="page-content-wrapper">
                        <transition name="page">
                            <router-view class="page-content" :buttons.sync="buttons" />
                        </transition>
                    </div>
                </div>
                <page-actions :buttons="buttons" />
            </div>
        </rl-acrylic>
    </div>
</template>

<script lang="ts">
import { Api, Person } from "@lib/api";
import { Page } from "@page/page";
import * as PageActions from "@page/page-actions.vue";
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class AdminPage extends Page {
    @vue.Lifecycle
    public mounted() {
        this.$router.afterEach((to, from) => {

        });
    }

    get user(): Person {
        return this.$store.state.auth.user;
    }
}
</script>

<style src="@page/page.scss" lang="scss">

</style>

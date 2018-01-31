<template>
    <div id="root">
        <rl-acrylic class="elevation-1">
            <div id="wrapper">
                <header>
                    <img id="logo" :src="require('@res/img/logo-sm.png')" />
                    <div id="title-wrapper">
                        <h1 class="title">Manage Library</h1>
                    </div>
                </header>
                <div id="content-scroll-wrapper" v-bar>
                    <div id="content-wrapper">
                        <transition name="page">
                            <router-view id="content" />
                        </transition>
                    </div>
                </div>
                <section id="actions">
                    <button @click="$router.back()" class="btn-auxilary">
                        Back
                    </button>
                </section>
            </div>
        </rl-acrylic>
    </div>
</template>

<script lang="ts">
import { Api, Person } from "@lib/api";
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class AdminPage extends Vue {
    get user(): Person {
        return this.$store.state.auth.user;
    }
}
</script>

<style src="../page.scss" lang="scss">

</style>

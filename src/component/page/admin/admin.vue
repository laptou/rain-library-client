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
                <div class="page-content-scroll-wrapper" v-bar>
                    <div class="page-content-wrapper">
                        <transition name="page">
                            <router-view class="page-content" @buttonupdate="onButtonsUpdated" />
                        </transition>
                    </div>
                </div>
                <section id="actions">
                    <button @click="$router.back()" class="btn-auxilary btn-back">
                        Back
                    </button>
                    <template v-for="(button, index) in buttons">
                        <router-link v-if="button.link" :key="index">
                            <button :class="[`btn-${button.type}`, `btn-${button.status}`]">{{ button.name }}</button>
                        </router-link>

                        <button v-else 
                            @click="action(button, $event)" 
                            :key="index"
                            :class="[`btn-${button.type}`, `btn-${button.status}`]">{{ button.name }}</button>
                    </template>
                </section>
            </div>
        </rl-acrylic>
    </div>
</template>

<script lang="ts">
import { Api, Person } from "@lib/api";
import { Page } from "@page/page";
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class AdminPage extends Page{
    get user(): Person    {
        return this.$store.state.auth.user;
    }
}
</script>

<style src="@page/page.scss" lang="scss">

</style>

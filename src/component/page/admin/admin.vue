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
import * as vue from "av-ts";
import Vue from "vue";

interface Button{
    name: string;
    action?: (evt?: Event) => void | Promise<void>;
    link?: string;
    type: "primary" | "secondary" | "danger" | "auxilary" | "fake";
    status: "working" | "success" | "error" | null;
}

@vue.Component
export default class AdminPage extends Vue{
    buttons: Button[] = [];

    get user(): Person    {
        return this.$store.state.auth.user;
    }

    onButtonsUpdated(buttons: Button[])    {
        this.buttons = buttons;
    }

    async action(btn: Button, evt: Event)    {
        if (!btn.action) return;

        btn.status = "working";

        const p = btn.action(evt);

        try        {
            if (p instanceof Promise)            {
                await p;
            }

            btn.status = "success";

            setTimeout(() =>            {
                btn.status = null;
            }, 2000);
        } catch {
            btn.status = "error";

            setTimeout(() =>            {
                btn.status = null;
            }, 2000);
        }
    }
}
</script>

<style src="@page/page.scss" lang="scss">

</style>

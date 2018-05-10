<template>
    <div id="menu-container" :class="{ 'menu-open': open }">
        <rl-acrylic>
            <button id="menu-button" @click="open = !open" aria-hidden>
                &#x2630;
            </button>
        </rl-acrylic>

        <ul>
            <li v-if="user">
                <button class="btn-fake">
                    Welcome, {{ user.name.first + " " + user.name.last }}
                </button>
            </li>

            <rl-permission tag="li" permissions="admin">
                <router-link to="/admin/reports/checkouts">
                    <button class="btn-primary">
                        Checkouts
                    </button>
                </router-link>

                <router-link to="/admin/reports/fines">
                    <button class="btn-primary">
                        Fines
                    </button>
                </router-link>
            </rl-permission>

            <a href="https://github.com/laptou/rain-library-client">
                <button class="btn-secondary">
                    Client Documentation
                </button>
            </a>

            <a href="https://github.com/laptou/rain-library-server/">
                <button class="btn-secondary">
                    Server Documentation
                </button>
            </a>

            <li v-if="user">
                <a href="javascript:void(0)" @click="$store.dispatch('auth/logout')">
                    <button class="btn-auxilary">
                        Log Out
                    </button>
                </a>
            </li>

            <router-link v-else to="/login" tag="li">
                <a>
                    <button class="btn-auxilary">
                        Log In
                    </button>
                </a>
            </router-link>
        </ul>
    </div>
</template>

<script lang="ts">
import { Api, Book, Person, Hold, Checkout, Activity } from "@lib/api";
import { Theme } from "@lib/ui";

import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class SiteNav extends Vue {
    public open: boolean = false;

    get user(): Person | null {
        return this.$store.state.auth.user;
    }
}
</script>

<style lang="scss" scoped>
@import "~@res/base.scss";

#menu-button
{
    font-weight: bold;

    width: 100%;
    height: 100%;

    background: transparent;
}

#menu-container
{
    z-index: 199;

    width: auto;
    max-width: 100vw;
    height: 3.2em;

    text-align: right;

    .acrylic
    {
        display: inline-block;

        width: 3.2em;
        height: 3.2em;

        transition-duration: 0.15s;
        transition-property: width;
    }

    ul
    {
        z-index: 199;

        visibility: collapse;

        width: 100%;
        margin: 0;

        list-style: none;

        transition-duration: 0.15s;
        transition-property: transform;
        transform: translateY(-100%);

        opacity: 0;

        li, button
        {
            width: 100%;
            margin-bottom: 1pt;
        }

        button a
        {
            color: white;
        }
    }

    &.menu-open
    {
        width: 100%;
        height: auto;

        .acrylic
        {
            width: 100%;
        }

        #menu-button
        {
            width: 100%;
        }

        ul
        {
            visibility: visible;

            transform: translateY(0);

            opacity: 1;
        }
    }
}

@media #{$screen-lg}
{
    #menu-container
    {
        position: absolute;
        top: 0;
        right: 0;

        display: box;

        width: auto;
        padding: 1em;

        .acrylic
        {
            margin-bottom: 2pt;

            text-align: right;
        }

        ul
        {
            position: relative;
            z-index: 199;

            visibility: visible;

            width: 100%;
            max-height: 0;

            transform: scaleY(0) translateY(-100%);

            opacity: 1;
        }

        &.menu-open
        {
            width: auto;

            .acrylic
            {
                width: 100%;
            }

            ul
            {
                max-height: 100%;

                transform: scaleY(1) translateY(0);
            }
        }
    }
}

</style>

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
                <div id="content-wrapper">
                    <section id="content">
                        <ul>
                            <li>
                                <router-link to="/admin/users"
                            </li>
                        </ul>
                    </section>
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

<style scoped src="../page.scss" lang="scss">

</style>

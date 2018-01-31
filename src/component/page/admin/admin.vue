<template>
    <div id="root">
        <acrylic :background="$store.getters['ui/background/url-blurred']"
                 class="elevation-1">
            <div id="wrapper">
                <header>
                    <img id="logo" :src="require('@res/img/logo-sm.png')"/>
                    <div id="title-wrapper">
                        <h1 class="title">Manage Library</h1>
                    </div>
                </header>
                <div id="content-wrapper">
                <section id="content">
                </section>
                </div>
                <section id="actions">
                    <button @click="$router.back()" class="btn-auxilary">
                        Back
                    </button>
                </section>
            </div>
        </acrylic>
    </div>
</template>

<script lang="ts">
import Acrylic from "@control/acrylic/acrylic.vue";
import SeeMore from "@control/see-more/see-more.vue";

import { Api, Person } from "@lib/api";
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component({ components: { Acrylic, SeeMore } })
export default class AdminPage extends Vue {
    get user(): Person {
        return this.$store.state.auth.user;
    }
}
</script>

<style scoped src="../page.scss" lang="scss">

</style>

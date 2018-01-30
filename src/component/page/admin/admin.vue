<template>
    <div>
        Welcome to the admin page.
    </div>
</template>

<script lang="ts">
import Acrylic from "@control/acrylic/acrylic.vue";
import SeeMore from "@control/see-more/see-more.vue";

import { Api, Person } from "@lib/api";
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component({ components: { Acrylic, SeeMore } })
export default class AdminPage extends Vue
{

    get user(): Person { return this.$store.state.auth.user; }
}
</script>

<style scoped src="../page.scss" lang="scss">

</style>

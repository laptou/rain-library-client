<template>
    <div>
        <slot v-if="authenticated"/>
    </div>
</template>

<script lang="ts">
import { Person, Permission } from "@lib/api";

import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class SeeMore extends Vue {
    @vue.Prop permissions = vue.p({ required: true, type: String });

    get authenticated() {
        const user: Person = this.$store.getters["auth/user"];

        if (user) {
            if (user.permissions.indexOf("admin") !== -1) return true;
            if (user.permissions.indexOf("user") === -1) return false;

            const required = this.permissions.split(" ") as Permission[];
            for (const r of required) {
                if (user.permissions.indexOf(r) === -1) return false;
            }
            return true;
        }
    }
}
</script>

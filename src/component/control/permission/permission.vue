<template>
    <div>
        <slot v-if="authenticated"/>
    </div>
</template>

<script lang="ts">
import { Person, Permission as PermissionType } from "@lib/api";

import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class Permission extends Vue {
    @vue.Prop permissions = vue.p({ required: true, type: String });

    get authenticated() {
        const user: Person = this.$store.state.auth.user;

        if (user) {
            if (user.permissions.indexOf("admin") !== -1) return true;
            if (user.permissions.indexOf("user") === -1) return false;

            const required = this.permissions.split(" ") as PermissionType[];
            for (let r of required) {
                if (r.startsWith("-")) {
                    r = r.replace(/^-+/, "") as PermissionType;
                    if (user.permissions.indexOf(r) !== -1) return false;
                    continue;
                } else if (r.startsWith("*")) {
                    r = r.replace(/^\*+/, "") as PermissionType;
                    if (user.permissions.indexOf(r) !== -1) return true;
                    continue;
                }
                if (user.permissions.indexOf(r) === -1) return false;
            }
            return true;
        }
    }
}
</script>

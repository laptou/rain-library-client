<template>
<div>
    <form v-if="person">
        <h2>Name</h2>
        <label>Username</label>
        <input type="text" v-model="person.username" v-if="person.permissions.indexOf('user') !== -1" />
        <input type="text" v-model="person.username" disabled="disabled" 
            placeholder="Must be a user to have a username" v-else />

        <label>First Name</label>
        <input type="text" v-model="person.name.first" />

        <label>Last Name</label>
        <input type="text" v-model="person.name.last" />

        <h2>Permissions</h2>

        <ul class="checkbox-list">
            <li>
                <input type="checkbox" id="permission-admin" value="admin" v-model="person.permissions" />
                <label for="permission-admin">
                    Administrator
                </label>
            </li>
            <template v-if="person.permissions.indexOf('admin') === -1">
                <li>
                    <input type="checkbox" id="permission-check-out" value="check_out" v-model="person.permissions" />
                    <label for="permission-check-out">
                        Can check out books
                    </label>
                </li>
                <li>
                    <input type="checkbox" id="permission-place-hold" value="place_hold" v-model="person.permissions" />
                    <label for="permission-place-hold">
                        Can place holds
                    </label>
                </li>
                <li>
                    <input type="checkbox" id="permission-modify-hold" value="modify_hold" v-model="person.permissions" />
                    <label for="permission-modify-hold">
                        Can manage holds
                    </label>
                </li>
                <li>
                    <input type="checkbox" id="permission-modify-book" value="modify_book" v-model="person.permissions" />
                    <label for="permission-modify-book">
                        Can manage books
                    </label>
                </li>
                <li>
                    <input type="checkbox" id="permission-modify-fine" value="modify_fine" v-model="person.permissions" />
                    <label for="permission-modify-fine">
                        Can manage fines
                    </label>
                </li>
                <li>
                    <input type="checkbox" id="permission-modify-person" value="modify_person" v-model="person.permissions" />
                    <label for="permission-modify-person">
                        Can manage users
                    </label>
                </li>
                <li>
                    <input type="checkbox" id="permission-author" value="author" v-model="person.permissions" />
                    <label for="permission-author">
                        Can be an author
                    </label>
                </li>
                <li>
                    <input type="checkbox" id="permission-user" value="user" v-model="person.permissions" />
                    <label for="permission-user">
                        Can be a user
                    </label>
                </li>
            </template>
            <li>
                <input type="checkbox" id="permission-limits" 
                    @input="hasLimitsChanged($event)"
                    @loaded="hasLimitsChanged($event)" />
                <label for="permission-limits">
                    Limits
                </label>
                <ul class="checkbox-list" v-if="person.limits">
                    <li>
                        <input type="checkbox" id="permission-user" 
                        value="user" 
                        v-model="person.limits.books" />
                        <label for="permission-user">
                            Book limit: <input type="text" v-model.number="person.limits.books"/>
                        </label>
                    </li>
                </ul>
            </li>
        </ul>
        <span class="subtitle" v-if="person.permissions.indexOf('admin') !== -1">
            Administrators have all permissions.
        </span>
    </form>
</div>
</template>

<script lang="ts">
import { Api, Person } from "@lib/api";
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class AdminUserPage extends Vue {
    person: Person | null = null;

    get user(): Person {
        return this.$store.state.auth.user;
    }

    hasLimitsChanged(evt: Event) {
        console.log("ree");
        if (!this.person) return false;

        return !!this.person.limits;

        // if (!this.person) return;
        // this.person.limits = { days: 0, books: 0 };
    }

    @vue.Lifecycle
    created() {
        console.log("fuq");
        (async () => {
            this.person = await Api.getPersonById(this.$route.params.id);
        })();
    }
}
</script>

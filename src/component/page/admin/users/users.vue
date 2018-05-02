<template>
    <div>
        <input type="search" placeholder="search users" v-model="query" />
        <ul class="tile-list tile-small">
            <router-link tag="li" class="tile-link" :to="`user/${user.id}`" :key="user.id" v-for="user in results">
                {{ user.name | name }}<br/>
                <span class="subtitle">
                    {{ user.permissions | status }}
                </span>
            </router-link>
        </ul>
    </div>
</template>

<script lang="ts">
import { Api, Person } from "@lib/api";
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class AdminUsersPage extends Vue {
    public query: string = "";
    public results: Person[] = [];

    get user(): Person {
        return this.$store.state.auth.user;
    }

    @vue.Lifecycle
    public mounted() {
        this.$emit("buttonupdate", []);
    }

    @vue.Watch("query")
    public onQueryChanged(newVal: string, oldVal: string) {
        Api.searchPeople(newVal)
            .then(result => this.results = result || this.results)
            .catch(console.error);
    }
}
</script>

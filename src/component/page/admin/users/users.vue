<template>
  <div>
      <input type="search" placeholder="search users" v-model="query"/>
      <ul class="tile-list tile-small">
        <router-link tag="li"
            class="tile-link"
            :to="`user/${user.id}`" 
            :key="user.id"
            v-for="user in results">
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
    query: string = "";
    results: Person[] = [];

    get user(): Person {
        return this.$store.state.auth.user;
    }

    @vue.Lifecycle
    mounted() {
        this.$emit("buttonupdate", []);
    }

    @vue.Watch("query")
    onQueryChanged(newVal: string, oldVal: string) {
        (async () => {
            if (newVal) {
                this.results = (await Api.searchPeople(newVal)) || [];
            } else {
                this.results = [];
            }
        })();
    }
}
</script>

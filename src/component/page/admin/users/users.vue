<template>
  <div>

      <input type="search" placeholder="search users" v-model="query"/>
      {{ results }}
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

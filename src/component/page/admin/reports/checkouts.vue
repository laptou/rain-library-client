<template>
  <div>
      <h2>Checkouts in the past week</h2>
      <ul class="tile-list">
        <li :key="checkout.id" v-for="checkout in checkouts">
            <router-link :to="`/book/${checkout.book.isbn}`">
                <h3>{{ checkout.book.name }}</h3>
            </router-link>
            <span class="subtitle">
                Checked out by <router-link :to="`/admin/user/${checkout.person.id}`">{{ checkout.person.name | name }}</router-link>
            </span>
            <table>
                <tr>
                    <td>Borrowed</td>
                    <td>{{ checkout.start | time }}</td>
                </tr>
                <tr>
                    <td>Due</td>
                    <td>{{ checkout.due | time }}</td>
                </tr>
                <tr>
                    <td>Returned</td>
                    <td v-if="checkout.completed">{{ checkout.end | time }}</td>
                    <td v-else>Not yet</td>
                </tr>
            </table>
        </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Api, Checkout } from "@lib/api";
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class AdminCheckoutReportPage extends Vue{
    checkouts: Checkout[] = [];

    @vue.Lifecycle
    mounted()    {
        this.$emit("buttonupdate", []);
        (async () => 
        {
            this.checkouts = await Api.getWeeklyCheckouts() || [];
            this.checkouts = this.checkouts.sort(
                (a, b) =>                {
                    if (a.start < b.start) return 1;
                    else return -1;
                });
        })();
    }
}
</script>
<template>
    <rl-page-layout :page="this">
        <template slot="header">
        <h2>Fines in the past week</h2>
        </template>
        <template slot="body">

        <ul class="tile-list">
            <li :key="fine.id" v-for="fine in fines">
                <h3>
                    <router-link :to="`/book/${fine.book.isbn}`">
                        {{ fine.book.name }}
                    </router-link>
                </h3>
                <span class="subtitle">
                    Assigned to
                    <router-link :to="`/admin/user/${fine.person.id}`">{{ fine.person.name | name }}</router-link>
                </span>

                <br/>
                <br/>
                <h4>Fine</h4>
                <table>
                    <tr>
                        <td>Amount</td>
                        <td>${{ parseFloat(fine.amount["$numberDecimal"]).toFixed(2) }}</td>
                    </tr>
                    <tr>
                        <td>Multiplier Used</td>
                        <td>{{ fine.checkout.penalty }}</td>
                    </tr>
                    <tr>
                        <td>Paid</td>
                        <td>{{ fine.completed ? "Yes" : "No" }}</td>
                    </tr>
                </table>

                <br/>
                <h4>Checkout</h4>
                <table>
                    <tr>
                        <td>Borrowed</td>
                        <td>{{ fine.checkout.start | time }}</td>
                    </tr>
                    <tr>
                        <td>Due</td>
                        <td>{{ fine.checkout.due | time }}</td>
                    </tr>
                    <tr>
                        <td>Returned</td>
                        <td>{{ fine.checkout.end | time }}</td>
                    </tr>
                </table>
            </li>
        </ul>
        </template>
    </rl-page-layout>
</template>

<script lang="ts">
import { Api, Fine } from "@lib/api";
import { sort } from "@lib/util";
import { Page } from "@page/page";
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class FineReportPage extends Page {
    public fines: Fine[] = [];

    @vue.Lifecycle
    public mounted() {
        this.buttons = [{ name: "Print", action: () => window.print(), type: "secondary", status: null }];
        Api.Fines.inDays(7)
            .then(result => this.fines = result ? sort(result, t => t.date) : this.fines)
            .catch(console.error);
    }
}
</script>


<style src="@page/page.scss" lang="scss" scoped>

</style>
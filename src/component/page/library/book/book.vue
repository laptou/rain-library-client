<template>
    <div id="root">
        <rl-acrylic>
            <div id="wrapper">
                <header>
                    <router-link to="/">
                        <img id="logo" :src="require('@res/img/logo-sm.png')" />
                    </router-link>
                    <div id="title-wrapper">
                        <h1 class="title">Check in/out</h1>
                    </div>
                </header>
                <div class="page-content-scroll-wrapper" v-bar>
                    <div class="page-content-wrapper">
                        <section class="page-content">
                            <transition name="fade">
                                <span class="banner banner-error banner-top" v-if="error">{{ error }}</span>
                            </transition>

                            <template v-if="checkout">
                                <h2>
                                    <router-link v-if="book" :to="`/book/${book.isbn}`">
                                        {{ book.name }}
                                    </router-link> is currently checked out to
                                    <router-link v-if="checkout.person" :to="`/admin/user/${checkout.person.id}`">
                                        {{ checkout.person.name | name }}</router-link>.</h2>
                                <br/>
                                <h3>Information</h3>
                                <h4>Checkout</h4>

                                <table>
                                    <tr>
                                        <td>Borrowed</td>
                                        <td>{{ checkout.start | relative-time-verbose }}</td>
                                    </tr>
                                    <tr>
                                        <td>Due</td>
                                        <td>{{ checkout.due | relative-time-verbose }}</td>
                                    </tr>
                                    <tr v-if="checkoutOverdue">
                                        <td>Fine</td>
                                        <td>{{ checkoutPenalty }}</td>
                                    </tr>
                                </table>
                            </template>
                            <template v-else>
                                <h2>
                                    <router-link v-if="book" :to="`/book/${book.isbn}`">
                                        {{ book.name }}
                                    </router-link> is not currently checked out.</h2>
                                <br/>
                                <h3>Information</h3>
                                <div>
                                    <template v-if="hold">
                                        {{ hold.person.name | name }} ({{hold.person.username}}) currently has a hold on this book.
                                    </template>
                                    <template v-if="[hold].every(_ => !_)">
                                        <span class="text-secondary">N/A</span>
                                    </template>
                                </div>

                                <br/>
                                <h3>Check out</h3>
                                <label>Username:&ensp;<input class="inline" type="text" v-model="username" /></label>
                                <label>Due in:&ensp;<input class="inline" type="number" min="1" v-model.number="due" />&ensp;days</label><br/>
                            </template>

                        </section>
                    </div>
                </div>
                <section id="actions">
                    <button @click="$router.back()" class="btn-auxilary btn-back">
                        Back
                    </button>
                    <template v-for="(button, index) in buttons">
                        <button @click="action(button, $event)" :key="index" :disabled="!('enabled' in button ? button.enabled() : true)" :class="[`btn-${button.type}`, `btn-${button.status}`]">{{ button.name }}</button>
                    </template>
                </section>
            </div>
        </rl-acrylic>
    </div>
</template>

<script lang="ts">
import { Api, Book, Checkout, Hold } from "@lib/api";
import { Page } from "@page/page";


import * as vue from 'av-ts';
import Vue from 'vue';

@vue.Component
export default class LibraryBookPage extends Page {
    public book: Book | null = null;
    public checkout: Checkout | null = null;
    public hold: Hold | null = null;

    public username: string | null = null;
    public due: number | null = null;

    public error: string | null = null;

    @vue.Lifecycle
    public mounted() {
        this.init().catch(alert);
    }

    public setError(error: string) {
        this.error = error;
        setTimeout(() => this.error = null, 5000);
    }

    public async init() {
        this.error = null;

        try {
            const id = this.$route.params.id;
            this.checkout = await Api.getCheckoutForBook(id);

            if (this.checkout) {
                this.book = this.checkout.book as Book;

                this.$emit("buttonupdate", [{
                    name: "Check in",
                    action: this.checkIn,
                    status: null,
                    type: "primary"
                }]);
            }
            else {
                this.book = await Api.getBookById(id);

                if (this.book) {
                    const holds = await Api.getHoldsForBook(this.book.isbn);

                    this.hold = (holds && holds.length) ? holds[0] : null;
                }

                this.$emit("buttonupdate", [{
                    name: "Check out",
                    action: this.checkOut,
                    type: "primary",
                    status: null,
                    enabled: () => !!this.username && !!this.due && this.due > 0
                }]);
            }
        }
        catch (err) {
            this.setError(err.response.statusText);
        }
    }

    get checkoutOverdue() {
        if (this.checkout)
            return Date.parse(this.checkout.due as string) < Date.now();
    }

    get checkoutPenalty() {
        if (this.checkout) {
            let days = (Date.now() - Date.parse(this.checkout.due as string)) / 86400000;
            days = Math.ceil(days);
            return `$${(days * this.checkout.penalty).toFixed(2)}`;
        }
    }

    public async checkIn() {
        this.error = null;

        const id = this.$route.params.id;

        try {
            if (await Api.checkIn(id)) {
                await this.init();
            }
        }
        catch (err) {
            this.setError(err.response.statusText);
            throw err;
        }
    }

    public async checkOut() {
        this.error = null;

        try {
            const id = this.$route.params.id;

            const person = await Api.getPersonByUsername(this.username as string);

            if (!person) return;

            if (!await Api.checkOut(id, person.id, this.due as number)) return;

            await this.init();
        }
        catch (err) {
            this.setError(err.response.statusText);
            throw err;
        }
    }
}
</script>

<style src="@page/page.scss" lang="scss" scoped></style>

<template>
    <div id="root">
        <rl-nav :open="false" />

        <div id="logo-container">
            <div id="logo-box">
                <rl-acrylic>
                    <div id="logo-wrapper">
                        <div id="logo-border" :class="`logo-${theme}`">
                            <div id="title-container">
                                <h1 id="title">
                                    RAIN
                                    <br/> INSTITUTE
                                    <br/> LIBRARY
                                </h1>
                            </div>
                        </div>
                    </div>
                </rl-acrylic>
            </div>
        </div>

        <div id="content-container">

            <div id="search-container">
                <rl-autocomplete :items-source="results" placeholder='search for books!' v-model="query" />
            </div>

            <div id="info-container">
                <section id="info-fines" v-if="user && activities.some(a => a.type === 'fine')">
                    <h2>Fines</h2>
                    <ul>
                        <router-link tag="li" v-for="fine in activities.filter(a => a.type === 'fine')" :key="fine.id" :to="`/book/${fine.book.isbn}`"
                            class="fine">
                            <div class="content">
                                <span class="book-name">{{ fine.book.name }}</span>
                                <span class="book-info text-secondary">
                                    copy {{fine.copy}}
                                </span>
                                <span class="book-info text-secondary">
                                    {{ fine.book.genre | list }}
                                </span>
                            </div>
                            <span class="tag tag-danger">
                                ${{ parseFloat(fine.amount["$numberDecimal"]).toFixed(2) }}
                            </span>
                        </router-link>
                    </ul>
                </section>

                <section id="info-checkout" v-if="user">
                    <h2>Checked out</h2>
                    <ul v-if="activities && activities.some(a => a.type === 'checkout')">
                        <router-link tag="li" v-for="checkout in activities.filter(a => a.type === 'checkout')" :key="checkout._id" :to="`/book/${checkout.book.isbn}`"
                            class="checkout" :class="{ overdue: Date.parse(checkout.due) <= new Date() }">
                            <div class="content">
                                <span class="book-name">{{ checkout.book.name }}</span>
                                <span class="book-info no-wrap">
                                    {{ checkout.book.authors.map(a => a.name) | name-list }}
                                </span>
                                <span class="book-info text-secondary">
                                    {{ checkout.book.genre | list }}
                                </span>
                            </div>
                            <span class="tag tag-info" v-if="Date.parse(checkout.due) > new Date()">
                                <span>{{ checkout.due | relative-time }}</span>
                                <span class="subtitle">remaining</span>
                            </span>
                            <span class="tag tag-danger" v-else>
                                overdue
                            </span>
                        </router-link>
                    </ul>
                    <span class="empty-message" v-else>
                        Go to the library to check out some books!
                    </span>
                </section>

                <section id="info-trending" v-if="false">
                    <h2>Trending</h2>
                    <span class="empty-message">
                        This feature hasn't been implemented yet.
                    </span>
                </section>

                <section id="info-holds" v-if="user">
                    <h2>Holds</h2>
                    <ul v-if="activities && activities.some(a => a.type === 'hold')">
                        <router-link tag="li" v-for="hold in activities.filter(a => a.type === 'hold')" :key="hold._id" :to="`/book/${hold.book.isbn}`">
                            <div class="content">
                                <span class="book-name">{{ hold.book.name }}</span>
                                <span class="book-info no-wrap">
                                    {{ hold.book.authors.map(a => a.name) | name-list }}
                                </span>
                                <span class="book-info text-secondary">
                                    {{ hold.book.genre | list }}
                                </span>
                            </div>
                            <span class="tag tag-primary" v-if="hold.ready">
                                ready for pickup
                            </span>
                        </router-link>
                    </ul>
                    <span class="empty-message" v-else>
                        You don't have any books on hold.
                    </span>
                </section>
            </div>
        </div>

        <footer id="attribution-container">
            <template v-if="backgroundInfo && backgroundInfo.author">
                Photo by
                <a :href="backgroundInfo.author.url">{{ backgroundInfo.author.name }}</a>
                <br/>
            </template>
            © 2017-2018 Ibiyemi Abiodun
            <br/> Source code for the
            <a href="https://github.com/laptou/rain-library-client">client</a> and the
            <a href="https://github.com/laptou/rain-library-server/">server</a>
        </footer>
    </div>
</template>

<script lang="ts">
import Autocomplete from "@control/autocomplete/autocomplete.vue";

import { Api, Book, Person, Hold, Checkout, Activity } from "@lib/api";
import { Theme } from "@lib/ui";

import * as vue from "av-ts";
import Vue from "vue";

export declare type NextFunc = ((vm: Vue) => void) | (() => void);

@vue.Component
export default class HomePage extends Vue {
    public results: Book[] = [];
    public activities: Activity[] = [];
    public query: string = "";


    get user(): Person | null {
        return this.$store.state.auth.user;
    }

    get backgroundInfo() {
        return this.$store.state.ui.background.background;
    }

    get theme(): Theme {
        return this.$store.state.ui.theme;
    }

    @vue.Lifecycle
    public async created() {
        if (this.user)
            this.activities = await Api.People.currentActivities(this.user.id) || [];
    }

    @vue.Watch("user")
    public async onUserChanged(newVal: Person | null, oldVal: Person | null) {
        if (newVal) {
            this.activities = await Api.People.currentActivities(newVal.id) || [];
        }
    }

    @vue.Watch("query")
    public async onQueryChanged(newVal: string) {
        if (newVal) {
            const suggestions: Book[] = [];

            if (newVal.match(/[A-Za-z0-9\s]{24}/)) {
                const id = newVal.replace(/[^A-Za-z0-9]+/g, "");
                const book = await Api.Books.byId(id);
                if (book) {
                    book.copy = id;
                    suggestions.push(book);
                }
            }

            try {
                const books = await Api.Books.search(newVal, 7);
                if (books) suggestions.push(...books);
            } catch {
                // do nothing for now
            }

            this.results = suggestions;
        } else this.results = [];
    }
}
</script>

<style src="./home.scss" lang="scss" scoped>

</style>

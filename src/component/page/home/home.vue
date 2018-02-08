<template>
    <div id="root">
    <div>
        <div id="menu-container" :class="{ 'menu-open': menuOpen }">
        <rl-acrylic>
            <button id="menu-button" @click="menuOpen = !menuOpen" aria-hidden>
                &#x2630;
            </button>
        </rl-acrylic>
        
        <ul>
            <li v-if="user">
                <button class="btn-fake">
                    Welcome, {{ user.name.first + " " + user.name.last }}
                </button>
            </li>

            <rl-permission tag="li" permissions="admin">
                <router-link to="/admin">
                    <button class="btn-primary">
                        Manage Library
                    </button>
                </router-link>
            </rl-permission>

             <rl-permission tag="li" permissions="check_out">
                <router-link to="/checkout">
                    <button class="btn-primary">
                        Manage Checkouts
                    </button>
                </router-link>
            </rl-permission>

            <li v-if="user">
                <a href="javascript:void(0)" @click="$store.dispatch('auth/logout')">
                    <button class="btn-auxilary">
                        Log Out
                    </button>
                </a>
            </li>

            <router-link v-else to="/login" tag="li">
                <a>
                    <button class="btn-auxilary">
                        Log In
                    </button>
                </a>
            </router-link>
        </ul>
        </div>

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
                <autocomplete :itemsSource="suggestions" :itemLabelSelector="label" :itemDescriptionSelector="describe" :itemTagSelector="() => null"
                    :itemTemplateSelector="template" :placeholder="'search for books, authors, and more!'"
                    @querychanged="onQueryChanged">

                </autocomplete>
            </div>
            <div id="info-container">
                <section id="info-checkout" v-if="user">
                    <h2>Checked out</h2>
                    <ul v-if="checkedOut.length">
                        <router-link tag="li" v-for="checkout in checkedOut" :key="checkout._id" 
                            :to="`/book/${checkout.book.isbn}`" class="checkout"
                            :class="{ overdue: Date.parse(checkout.due) <= new Date() }">
                            <div class="content">
                                <span class="book-name">{{ checkout.book.name }}</span>
                                <span class="book-authors no-wrap">
                                    {{ checkout.book.authors.map(a => a.name) | name-list }}
                                </span>
                                <span class="book-genre text-secondary">
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

                <section id="info-trending">
                    <h2>Trending</h2>
                    <span class="empty-message">
                        This feature hasn't been implemented yet.
                    </span>
                </section>

                <section id="info-holds" v-if="user">
                    <h2>Holds</h2>
                    <ul v-if="holds.length">
                        <router-link tag="li" v-for="hold in holds" :key="hold._id" :to="`/book/${hold.book.isbn}`">
                            <div class="content">
                                <span class="book-name">{{ hold.book.name }}</span>
                                <span class="book-authors no-wrap">
                                    {{ hold.book.authors.map(a => a.name) | name-list }}
                                </span>
                                <span class="book-genre text-secondary">
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
            <span v-if="backgroundInfo && backgroundInfo.author">
                Photo by
                <a :href="backgroundInfo.author.url">{{ backgroundInfo.author.name }}</a>
                <br/>
            </span>
            © 2017-2018 Ibiyemi Abiodun
        </footer>
    </div>
</div>
</template>

<script lang="ts">
import Autocomplete from "@control/autocomplete/autocomplete.vue";
import LinkAutocompleteItem from "./link-autocomplete-item";

import { Api, Book, Person, Hold } from "@lib/api";
import { Theme } from "@lib/ui";

import * as vue from "av-ts";
import Vue from "vue";

export declare type NextFunc = ((vm: Vue) => void) | (() => void);

@vue.Component({ components: { Autocomplete } })
export default class HomePage extends Vue{
    suggestions: any[] = [];
    checkedOut: Book[] = [];
    holds: Hold[] = [];
    menuOpen: boolean = false;

    get user(): Person | null    {
        return this.$store.state.auth.user;
    }

    get backgroundInfo()    {
        return this.$store.state.ui.background.background;
    }

    get theme(): Theme    {
        return this.$store.state.ui.theme;
    }

    @vue.Lifecycle
    created()    {
        this.$watch(() => this.user, this.onUserChanged);
        this.onUserChanged(this.user, null);
    }

    async onUserChanged(newVal: Person | null, oldVal: Person | null)    {
        if (newVal)        {
            this.checkedOut = ((await Api.getCheckedOut()) as Book[]) || [];
            this.holds = ((await Api.getPendingHolds()) as Hold[]) || [];
            this.holds = this.holds.sort(
                (a, b) => (a.ready > b.ready ? 1 : a.ready < b.ready ? -1 : 0)
            );
        }
    }

    async onQueryChanged(newVal: string)    {
        if (newVal)        {
            const suggestions: Book[] = [];
            try            {
                const books = await Api.searchBooks(newVal, 7);
                if (books) suggestions.push(...books);
            } catch {
                // do nothing for now
            }

            this.suggestions = suggestions;
        } else this.suggestions = [];
    }

    label(item: any): string    {
        if (item.title) return item.title;
        if (typeof item.name === "string") return item.name;
        return item.name.first + " " + item.name.last;
    }

    describe(item: any): string    {
        if (item.authors)        {
            const book = item as Book;
            const authors = book.authors as Person[];
            let info = authors
                .map((a: Person) => a.name.first + " " + a.name.last)
                .join(", ");
            info += " | ";
            info += book.genre.join(", ");
            return info;
        }

        return "";
    }

    template(item: any)    {
        return LinkAutocompleteItem;
    }
}
</script>

<style src="./home.scss" lang="scss" scoped>

</style>

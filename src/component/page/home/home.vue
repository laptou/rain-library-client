<!--suppress JSMethodCanBeStatic -->
<template>
    <div id="root" v-bar>
        <div>
            <header id="user-container">
                <button v-if="user" class="btn-auxilary">
                    Welcome, {{ user.name.first + " " + user.name.last }}
                </button>
                <a href="#" @click="$store.dispatch('auth/logout')">
                    <button v-if="user" class="btn-secondary">
                        Log out
                    </button>
                </a>
                <router-link v-if="!user" to="/login">
                    <button class="btn-primary">Log in</button>
                </router-link>
            </header>

            <div id="logo-container">
                <div id="logo-box">
                    <acrylic :background="backgroundAcrylic" :mode="'image'">
                        <div id="logo-wrapper">
                            <div id="logo-border" :class="`text-${theme}`">
                                <div id="title-container">
                                    <h1 id="title" :class="`text-${theme}`">
                                        RAIN <br/>
                                        INSTITUTE <br/>
                                        LIBRARY
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </acrylic>
                </div>
            </div>

            <div id="content-container">
                
                <div id="search-container">
                    <autocomplete :itemsSource="suggestions"
                                  :itemLabelSelector="label"
                                  :itemDescriptionSelector="describe"
                                  :itemTagSelector="() => null"
                                  :itemTemplateSelector="template"
                                  :placeholder="'search for books, authors, and more!'"
                                  :acrylic-background="background"
                                  @querychanged="onQueryChanged">

                    </autocomplete>
                </div>
                <div id="info-container">
                    <section id="info-checkout" v-if="user">
                        <h2>Checked out</h2>
                        <ul>
                            <router-link tag="li"
                                         v-for="checkout in checkedOut"
                                         :key="checkout.id"
                                         :to="`/book/${checkout.book.id}`"
                                         class="checkout"
                                         :class="{ overdue: Date.parse(checkout.due) <= new Date() }">
                                <div class="content">
                                    <span class="checkout-book-name">{{ checkout.book.name }}</span>
                                    &ensp;
                                    <ul class="checkout-book-authors flat-list">
                                        <li v-for="author in checkout.book.authors" :key="author.id">
                                            {{ author.name | name }}
                                        </li>
                                    </ul>
                                    <ul class="checkout-book-genre flat-list text-secondary">
                                        <li v-for="genre in checkout.book.genre" :key="genre">
                                            {{ genre }}
                                        </li>
                                    </ul>
                                </div>
                                <span class="tag tag-info"
                                      v-if="Date.parse(checkout.due) > new Date()">
                                    due {{ checkout.due | relative-time }}
                                </span>
                                <span class="tag tag-danger"
                                      v-if="Date.parse(checkout.due) <= new Date()">
                                    overdue
                                </span>
                            </router-link>
                        </ul>
                    </section>
                    <section id="info-trending">
                        <h2>Trending</h2>
                        <ul>
                            <li>heehee</li>
                        </ul>
                    </section>
                </div>
            </div>

            <footer id="attribution-container" v-if="backgroundInfo.author">
                Photo by <a :href="backgroundInfo.author.url">{{ backgroundInfo.author.name }}</a><br/>
                © 2017-2018 Ibiyemi Abiodun
            </footer>
        </div>
    </div>
</template>

<script lang="ts">
import Acrylic from "@control/acrylic/acrylic.vue";
import Autocomplete from "@control/autocomplete/autocomplete.vue";
import LinkAutocompleteItem from "./link-autocomplete-item";

import { Api, Book, Person } from "@lib/api";
import { Theme } from "@lib/ui";

import * as vue from "av-ts";
import Vue from "vue";

@vue.Component({ components: { Acrylic, Autocomplete } })
export default class HomePage extends Vue
{
    suggestions: any[] = [];
    checkedOut: Book[] = [];

    get user(): Person | null
    {
        return this.$store.state.auth.user;
    }

    get background(): string
    {
        return this.$store.getters["ui/background/url"];
    }

    get backgroundAcrylic(): string
    {
        return this.$store.getters["ui/background/url-blurred"];
    }

    get backgroundInfo()
    {
        return this.$store.state.ui.background.background;
    }

    get theme(): Theme
    {
        return this.$store.state.ui.theme;
    }

    @vue.Lifecycle
    created()
    {
        setTimeout(async () =>
        {
            if (this.user) {
                this.checkedOut = await Api.getCheckedOut() as Book[] || [];
            }
        }, 0);
    }

    async onQueryChanged(newVal: string)
    {
        if (newVal)
        {
            const suggestions: Book[] = [];
            try
            {
                const books = await Api.searchBooks(newVal, 7);
                if (books) suggestions.push(...books);
            }
            catch
            {
                // do nothing for now
            }

            this.suggestions = suggestions;
        }
        else this.suggestions = [];
    }

    label(item: any): string
    {
        if (item.title) return item.title;
        if (typeof item.name === "string") return item.name;
        return item.name.first + " " + item.name.last;
    }

    describe(item: any): string
    {
        if (item.authors)
        {
            const book = item as Book;
            const authors = book.authors as Person[];
            let info = authors.map((a: Person) => a.name.first + " " + a.name.last)
                .join(", ");
            info += " | ";
            info += book.genre.join(", ");
            return info;
        }

        return "";
    }

    template(item: any)
    {
        return LinkAutocompleteItem;
    }
}
</script>

<style src="./home.scss" lang="scss" scoped></style>


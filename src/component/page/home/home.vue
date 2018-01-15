<!--suppress JSMethodCanBeStatic -->
<template>
    <div id="root">
        <div>
            <ul id="user-container">
                <li v-if="user">
                    Welcome, {{ user.name.first + " " + user.name.last }}
                </li>
                <li v-if="user">
                    <a href="#" @click="$store.dispatch('auth/logout')">Log out</a>
                </li>
                <router-link tag="li" v-if="!user" to="/login">
                    <a>Log in</a>
                </router-link>
            </ul>

            <div id="logo-container">
                <div id="logo-box">
                    <acrylic :background="backgroundAcrylic" :mode="'image'">
                        <div id="logo-border" :class="`text-${theme}`">
                            <div id="title-container">
                                <h1 id="title" :class="`text-${theme}`">
                                    RAIN <br/>
                                    INSTITUTE <br/>
                                    LIBRARY
                                </h1>
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
                <section id="info-container" v-if="user">
                    <h2>Checked out</h2>
                    <ul>
                        <router-link tag="li"
                                     v-for="checkout in checkedOut"
                                     :key="checkout.id"
                                     :to="`/book/${checkout.book.id}`"
                                     class="checkout"
                                     :class="{ overdue: Date.parse(checkout.due) <= new Date() }">
                            <span class="checkout-book-name">{{ checkout.book.name }}</span>
                            &ensp;
                            <ul class="checkout-book-authors flat-list">
                                <li v-for="author in checkout.book.authors">
                                    {{ author.name | name }}
                                </li>
                            </ul>
                            <span>&nbsp;|&nbsp;</span>
                            <span class="checkout-book-genre">
                                <span v-for="genre in checkout.book.genre">{{ genre }}</span>
                            </span>
                            <span class="checkout-due"
                                  v-if="Date.parse(checkout.due) > new Date()">
                                due {{ checkout.due | relative-time }}
                            </span>
                            <span class="checkout-due"
                                  v-if="Date.parse(checkout.due) <= new Date()">
                                overdue
                            </span>
                        </router-link>
                    </ul>
                </section>
            </div>

            <footer id="attribution-container" v-if="backgroundInfo.author">
                Photo by <a :href="backgroundInfo.author.url">{{ backgroundInfo.author.name }}</a>
            </footer>
        </div>
    </div>
</template>

<script lang="ts">
    import Acrylic from "@control/acrylic/acrylic.vue";
    import Autocomplete from "@control/autocomplete/autocomplete.vue";
    import { Api, Book, Person } from "@lib/api";
    import { Theme } from "@lib/ui";

    import * as vue from "av-ts";
    import Vue from "vue";
    import LinkAutocompleteItem from "./link-autocomplete-item.ts";


    @vue.Component({ components: { Acrylic, Autocomplete } })
    export default class HomePage extends Vue
    {
        suggestions: any[] = [];
        checkedOut: Book[] = [];

        get user (): Person | null
        {
            return this.$store.state.auth.user;
        }

        get background (): string
        {
            return this.$store.getters["ui/background/url"];
        }

        get backgroundAcrylic (): string
        {
            return this.$store.getters["ui/background/url-blurred"];
        }

        get backgroundInfo ()
        {
            return this.$store.state.ui.background.background;
        }

        get theme (): Theme
        {
            return this.$store.state.ui.theme;
        }

        @vue.Lifecycle
        created ()
        {
            setTimeout(async () =>
                       {
                           this.checkedOut = await Api.getCheckedOut() || [];
                       }, 0);
        }

        async onQueryChanged (newVal: string)
        {
            if (newVal)
            {
                let suggestions: Book[] = [];
                try
                {
                    let books = await Api.searchBooks(newVal, 7);
                    if (books) suggestions.push(... books);
                }
                catch
                {
                    // do nothing for now
                }

                this.suggestions = suggestions;
            }
            else this.suggestions = [];
        }

        label (item: any): string
        {
            if (item.title) return item.title;
            if (typeof item.name === "string") return item.name;
            return item.name.first + " " + item.name.last;
        }

        describe (item: any): string
        {
            if (item.authors)
            {
                let book = <Book>item;
                let authors = <Person[]>book.authors;
                let info = authors.map((a: Person) => a.name.first + " " + a.name.last)
                                  .join(", ");
                info += " | ";
                info += book.genre.join(", ");
                return info;
            }

            return "";
        }

        template (item: any)
        {
            return LinkAutocompleteItem;
        }
    };
</script>

<style src="./home.scss" lang="scss" scoped></style>


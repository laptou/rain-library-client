<template>
    <rl-page-layout v-if="book" :page="this">
        <template slot="header">
            <h1 class="title">{{ book.name }}</h1>
            <rl-see-more class="subtitle" :inline="true">
                <router-link tag="span" v-for="(author, index) in book.authors" :to="`/person/${author._id}`" :key="author._id">
                    <a>{{ author.name | name }}</a>
                    <span v-if="index < book.authors.length - 1">,&#32;<wbr/></span>
                </router-link>
            </rl-see-more>
        </template>
        <template slot="body">
            <table class="info">
                <tr>
                    <td>{{ book.genre.length === 1 ? "Genre" : "Genres" }}</td>
                    <td class="text-secondary">
                        <ul id="genres" class="flat-list">
                            <li v-for="genre in book.genre" :key="genre">{{ genre }}</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>Year</td>
                    <td class="text-secondary">{{ book.year }}</td>
                </tr>
                <tr v-if="book.edition">
                    <td>Edition</td>
                    <td class="text-secondary">{{ book.edition.version }}</td>
                </tr>
                <tr v-if="book.edition">
                    <td>Publisher</td>
                    <td class="text-secondary">{{ book.edition.publisher }}</td>
                </tr>
                <tr>
                    <td>ISBN</td>
                    <td class="text-secondary">{{ book.isbn }}</td>
                </tr>
                <tr>
                    <td>IDs of Copies</td>
                    <td class="text-secondary">
                        <ul class="book-copy-list">
                            <li :key="copy" v-for="copy in book.copies">
                                <router-link :to="`/library/checkout/${copy}`">
                                    <span class="text">{{ copy | segment }}</span>
                                </router-link>
                            </li>
                        </ul>
                    </td>
                </tr>
            </table>
        </template>
    </rl-page-layout>
</template>

<script lang="ts">
import { Api, Book, BookStatus, Status, Person } from "@lib/api";
import { hasPermission } from "@lib/auth";
import { Page, Button } from "@page/page";
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class BookPage extends Page {
    public book: Book | null = null;
    public holdCount: number | null = null;
    public status: Status | null = null;

    @vue.Lifecycle
    public async created() {

        this.book = await Api.Books.byIsbn(this.$route.params.isbn);

        if (this.book && this.user) {
            [this.holdCount, this.status] = await Promise.all([
                Api.Holds.count(this.book.isbn),
                Api.Me.statusForBook(this.book.isbn)
            ]);
        }

        this.update();
    }

    get user(): Person {
        return this.$store.state.auth.user;
    }

    public async placeHold() {
        if (this.book && (await Api.Holds.place(this.book.isbn))) {
            this.status = await Api.Me.statusForBook(this.book.isbn);
        }

        this.update();
    }

    public async cancelHold() {
        if (this.book && (await Api.Holds.remove(this.book.isbn))) {
            this.status = await Api.Me.statusForBook(this.book.isbn);
        }

        this.update();
    }

    private update() {


        // determine which buttons to show
        if (!this.user) {
            // not logged in? please log in
            this.buttons = [{
                name: "Log in",
                action: () => this.$router.push("/login"),
                type: "primary",
                status: null
            }];
            return;
        }

        let holdButton: Button | null = null;
        const editButton: Button =
            {
                name: "Edit",
                type: "secondary",
                action: () => this.$router.push(`/book/edit/${this.$route.params.isbn}`),
                status: null
            };

        if (this.status) {
            switch (this.status.status) {
                case null:
                case BookStatus.None:
                    // user doesn't have a hold on this book?
                    // show the button to place one
                    if (hasPermission(this.user, "place_hold")) {
                        // if they have sufficient permissions
                        holdButton = {
                            name: "Place hold",
                            action: this.placeHold,
                            type: "primary",
                            status: null
                        };
                    }
                    break;
                case BookStatus.OnHold:
                    if (this.status.position === 0) {
                        holdButton = {
                            name: "Ready for Pickup",
                            type: "fake",
                            status: null
                        };
                        break;
                    }

                    holdButton = {
                        name: "Cancel hold",
                        action: this.cancelHold,
                        type: "danger",
                        status: null
                    };
                    break;

                case BookStatus.Overdue:
                    holdButton = {
                        name: "Overdue",
                        type: "danger",
                        status: null
                    };
                    break;
            }

            const buttons = [];
            if (holdButton) buttons.push(holdButton);
            if (hasPermission(this.user, "modify_book")) buttons.push(editButton);
            this.buttons = buttons;
        }
    }
}
</script>
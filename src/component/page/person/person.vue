<template>
    <rl-page-layout v-if="person" :page="this">
        <template slot="header">
            <h1>{{ person.name | name }}</h1>
            <span class="subtitle">
                <template v-if="person.username">@{{person.username}} &bullet;</template>
                {{ person.permissions | list }}
            </span>
        </template>
        <template slot="body">
            <table class="info">
                <tr v-if="person.bio">
                    <td>Bio</td>
                    <td class="text-secondary">
                        <p>
                            {{ person.bio }}
                        </p>
                    </td>
                </tr>
                <tr v-if="person.wiki">
                    <td>Wiki</td>
                    <td class="text-secondary">
                        <a :href="person.wiki">Wikipedia</a>
                    </td>
                </tr>
            </table>

            <h2>Books</h2>

            <ul v-if="books && books.length" class="tile-list tile-small">
                <router-link tag="li" class="tile-link" :to="`/book/${book.isbn}`" :key="book._id" v-for="book in sortedBooks">
                    {{ book.name }}
                    <span class="subtitle" v-if="book.authors.length > 1">
                        + {{ book.authors.length - 1 }} {{ book.authors.length > 2 ? "authors" : "author" }}
                    </span>
                    <span class="subtitle">
                        <br/> {{ book.year }} &nbsp;&bullet;&nbsp; {{ book.genre.join(", ") }}
                    </span>
                </router-link>
            </ul>

            <span v-else>
                This user has not authored any books.
            </span>

        </template>
    </rl-page-layout>
</template>

<script lang="ts">
import { hasPermission } from "@lib/auth";
import { Api, Book, Person } from "@lib/api";
import { Page } from "@page/page";
import * as vue from "av-ts";
import Vue from "vue";

type NextFunc = (fn: (vm: PersonPage) => void) => void;

@vue.Component
export default class PersonPage extends Page {
    public person: Person | null = null;
    public books: Book[] | null = [];

    get sortedBooks(): Book[] | null {
        if (this.books) {
            const books = this.books;
            books.sort((a, b) => a.name.localeCompare(b.name));
            return books;
        }

        return null;
    }

    @vue.Lifecycle
    public async beforeRouteUpdate(to: any, from: any, n: any) {
        try {
            await fetch(to.params.id);
        } catch (err) {
            this.post({ text: err, type: "error" });
        }
    }

    @vue.Lifecycle
    public created() {
        // try to retrieve the data relevant to this page, and post an
        // error banner if it doesn't work
        this.fetch(this.$route.params.id)
            .catch(err => this.post({ text: err, type: "error" }));
    }

    @vue.Lifecycle
    public mounted() {
        const user = this.$store.state.auth.user;
        const id = this.$route.params.id;

        if (user && hasPermission(user, "modify_person")) {
            this.buttons = [{
                name: "Edit",
                type: "secondary",
                status: null,
                action: () => this.$router.push(`/person/edit/${id}`)
            }];
        }
    }

    private async fetch(id: string) {
        const [person, books] = await Promise.all([
            Api.People.byId(id),
            Api.Books.byAuthor(id)
        ]);
        [this.person, this.books] = [person, books];
    }
}
</script>

<style scoped src="../page.scss" lang="scss">

</style>

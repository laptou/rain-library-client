<template>
    <rl-page-layout :page="this">
        <template slot="header">
            <h1 v-if="book">
                {{ book.name }}
            </h1>
        </template>
        <template slot="body">
            <div v-if="book">
                <label>Title</label>
                <input type="text" v-model="book.name" />

                <br />

                <label>Authors</label>
                <rl-badge-cloud :items-source="book.authors" :item-key-selector="x => x.id" :item-format-selector="x => x.name.first + ' ' + x.name.last"
                    :allow-remove="() => book.authors.length > 1" />
                <rl-autocomplete :items-source="authorCandidates" :item-template-selector="authorTemplateSelector" placeholder="select an author to add them"
                    v-model="authorQuery" @itemclick="(evt, item) => addAuthor(item)" />
                <br />

                <label>Genres</label>
                <rl-badge-cloud :items-source="book.genre" :allow-remove="() => book.genre.length > 1" />
                <rl-autocomplete :items-source="genreCandidates" :item-template-selector="genreTemplateSelector" placeholder="select a genre to add it"
                    v-model="genreQuery" @itemclick="(evt, item) => addGenre(item)" />
                <br />

                <label>ISBN</label>
                <input type="text" v-model="book.isbn" pattern="^(\d{13}|\d{10})$" placeholder="XXXXXXXXXXXXX" />

            </div>
        </template>
    </rl-page-layout>
</template>

<script lang="ts">
import { Api, Book, Person } from "@lib/api";
import { hasPermission } from "@lib/auth";
import * as vue from "av-ts";
import Vue from "vue";
import { Page } from "@page/page";

const PersonAutocompleteItem = require("@control/autocomplete/person-autocomplete-item.vue").default;
const SimpleAutocompleteItem = require("@control/autocomplete/simple-autocomplete-item.vue").default;

@vue.Component
export default class EditBookPage extends Page {
    public book: Book | null = null;

    public authorQuery: string = "";
    public authorCandidates: Person[] = [];

    public genreQuery: string = "";
    public genreCandidates: string[] = [];

    @vue.Lifecycle
    public async beforeRouteUpdate(to: any, from: any, next: ((vm: Vue) => void) | (() => void)) {
        await this.fetch(this.$route.params.isbn);
    }

    @vue.Lifecycle
    public async created() {
        await this.fetch(this.$route.params.isbn);
        this.buttons = [{ name: "Save", action: this.save, type: "primary", status: null }];
    }

    public async save() {
        if (!this.book) return;
        const isbn = this.$route.params.isbn;

        try {
            await Api.Books.byIsbn(isbn, this.book);
            this.post({ text: "Book saved.", type: "success" });
        }
        catch (err) {
            this.post({ text: err.response.statusText, type: "error" });
            throw err;
        }
    }

    public genreTemplateSelector() {
        return SimpleAutocompleteItem;
    }

    // utility method necessary b/c we don't want duplicates
    public addGenre(genre: string) {
        if (!this.book) return;

        if (this.book.genre === null) this.book.genre = [];

        if (this.book.genre.indexOf(genre) !== -1) return;

        this.book.genre.push(genre);

        this.genreQuery = "";
    }

    @vue.Watch("genreQuery")
    public onGenreQueryChanged(newVal: string) {
        if (newVal) {
            this.genreCandidates = [
                "mystery",
                "horror",
                "history",
                "adventure",
                "romance",
                "young-adult",
                "thriller",
                "action",
                "adult",
                "child"
            ].filter(f => f.startsWith(newVal));
        }
        else {
            this.genreCandidates = [];
        }

    }

    public authorTemplateSelector() {
        return PersonAutocompleteItem;
    }

    // utility method necessary b/c we don't want duplicates
    public addAuthor(author: Person) {
        if (!this.book) return;

        if (this.book.authors === null) this.book.authors = [];

        // typescript will whine if we don't make a kludgy type assertion
        const authors = this.book.authors as (Person | string)[];

        if (authors.find(a => typeof a === "string" ? a === author.id : a.id === author.id)) return;

        authors.push(author);

        this.authorQuery = "";
    }

    @vue.Watch("authorQuery")
    public async onAuthorQueryChanged(newVal: string) {
        try {
            if (newVal) {
                const results = await Api.People.search(newVal);
                if (results) this.authorCandidates = results.filter(p => hasPermission(p, "author"));
            }
            else {
                this.authorCandidates = [];
            }
        }
        catch {
            // fail silently
        }
    }

    private async fetch(isbn: string) {
        [this.book] = await Promise.all([Api.Books.byIsbn(isbn)]);
    }
}
</script>

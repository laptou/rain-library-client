<template>
    <div v-if="author" id="root">
        <rl-acrylic>
            <div id="wrapper">
                <header>
                    <router-link to="/">
                        <img id="logo" :src="require('@res/img/logo-sm.png')" />
                    </router-link>
                    <div id="title-wrapper">
                        <h1>{{ author.name | name }}</h1>
                        <span class="subtitle">Author</span>
                    </div>
                </header>
                <div class="page-content-scroll-wrapper" v-bar>
                    <div class="page-content-wrapper">
                        <section class="page-content">
                            <table class="info">
                                <tr v-if="author.bio">
                                    <td>Bio</td>
                                    <td class="text-secondary">
                                        <p>
                                            {{ author.bio }}
                                        </p>
                                    </td>
                                </tr>
                                <tr v-if="author.wiki">
                                    <td>Wiki</td>
                                    <td class="text-secondary">
                                        <a :href="author.wiki">Wikipedia</a>
                                    </td>
                                </tr>
                            </table>

                            <h2>Books</h2>

                            <ul v-if="books" class="tile-list tile-small">
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

                        </section>
                    </div>
                </div>
                <section id="actions">
                    <button class="btn-back btn-auxilary" @click="$router.back()">
                        Back
                    </button>
                </section>
            </div>
        </rl-acrylic>
    </div>
</template>

<script lang="ts">
import { Api, Book, Person } from "@lib/api";
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class AuthorPage extends Vue {
    public author: Person | null = null;
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
    public created() {
        Promise.all([
            Api.getPersonById(this.$route.params.id),
            Api.getBooksByAuthor(this.$route.params.id)
        ])
            .then(res => [this.author, this.books] = res)
            .catch(console.error);
    }
}
</script>

<style scoped src="../page.scss" lang="scss">

</style>

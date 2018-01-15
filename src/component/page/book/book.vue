<template>
    <div v-if="book" id="root">
        <acrylic :background="$store.getters['ui/background/url-blurred']"
                 class="elevation-1">
            <div id="wrapper">
                <header>
                    <img :src="require('@res/img/logo-sm.png')"/>
                </header>
                <section id="content">
                    <h1>{{ book.name }}</h1>

                    <ul id="authors" class="flat-list">
                        <li v-for="author in book.authors">{{ author.name | name }}</li>
                    </ul>

                    <table id="info">
                        <tr>
                            <td>{{ book.genre.length === 1 ? "Genre" : "Genres" }}</td>
                            <td class="text-secondary">
                                <ul id="genres" class="flat-list">
                                    <li v-for="genre in book.genre">{{ genre }}</li>
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
                    </table>
                </section>
                <section id="actions">
                    <button class="btn-auxilary" @click="$router.go(-1)">
                        Back
                    </button>
                    <button id="btn-hold" class="btn-primary">
                        Place hold
                        <span class="text-secondary">
                            {{ holdCount }}
                        </span>
                    </button>
                </section>
            </div>
        </acrylic>
    </div>
</template>

<script lang="ts">
    import Acrylic from "@control/acrylic/acrylic.vue";
    import { Api, Book } from "@lib/api";
    import * as vue from "av-ts";
    import Vue from "vue";


    @vue.Component({ components: { Acrylic } })
    export default class BookPage extends Vue
    {
        book: Book | null = null;
        holdCount: number | null = null;

        @vue.Lifecycle
        created ()
        {
            (async () =>
            {
                this.book = await Api.getBookById(this.$route.params.id);
                this.holdCount = await Api.getHoldCountForBook(this.book.isbn);
            })();
        }
    }
</script>

<style scoped src="./book.scss" lang="scss">

</style>
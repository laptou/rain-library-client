<template>
    <div v-if="book" id="root">
        <acrylic :background="background" class="elevation-1">
            <div id="wrapper">
                <section id="content">
                    <h1>{{ book.name }}</h1>

                    <ul id="authors" class="flat-list">
                        <li v-for="author in book.authors">{{ author.name | name }}</li>
                    </ul>

                    <ul id="genres" class="flat-list">
                        <li v-for="genre in book.genre">{{ genre }}</li>
                    </ul>

                    <table id="info">
                        <tr>
                            <td>Year</td>
                            <td>{{ book.year }}</td>
                        </tr>
                        <tr v-if="book.edition">
                            <td>Edition</td>
                            <td>{{ book.edition.version }}</td>
                        </tr>
                        <tr v-if="book.edition">
                            <td>Publisher</td>
                            <td>{{ book.edition.publisher }}</td>
                        </tr>
                        <tr v-if="book.edition">
                            <td>Publisher</td>
                            <td>{{ book.edition.publisher }}</td>
                        </tr>
                    </table>
                </section>
                <section id="actions">
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

        get background (): string
        {
            return this.$store.getters["ui/background/url-blurred"];
        }

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
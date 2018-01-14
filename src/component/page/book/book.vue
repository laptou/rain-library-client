<template>
    <div v-if="book" id="root">
        <acrylic :background="background">
            <div id="wrapper">
                <section id="content">
                    <h1>{{ book.name }}</h1>

                    <ul id="authors" class="flat-list">
                        <li v-for="author in book.authors">{{ author.name | name }}</li>
                    </ul>

                    <ul id="genres" class="flat-list">
                        <li v-for="genre in book.genre">{{ genre }}</li>
                    </ul>

                    <h2>Year</h2>
                    {{ book.year }}

                    <button id="btn-checkout" class="btn-primary">Check out</button>
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

        get background (): string
        {
            return this.$store.getters["ui/background/url"];
        }

        @vue.Lifecycle
        created ()
        {
            (async () =>
            {
                this.book = await Api.getBookById(this.$route.params.id);
            })();
        }
    }
</script>

<style scoped src="./book.scss" lang="scss">

</style>
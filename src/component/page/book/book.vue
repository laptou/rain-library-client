<template>
    <div v-if="book">
        <h1>{{ book.name }}</h1>
        <span v-for="author in book.authors">{{ author.name | name }}</span>
    </div>
</template>

<script lang="ts">
    import { Api, Book } from "@lib/api";
    import * as vue from "av-ts";
    import Vue from "vue";
    
    @vue.Component
    export default class BookPage extends Vue
    {
        book: Book | null = null;

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

<style scoped src="./book.scss">

</style>
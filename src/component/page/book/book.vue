<template>
    <div v-if="book" id="root">
        <acrylic :background="$store.getters['ui/background/url-blurred']"
                 class="elevation-1">
            <div id="wrapper">
                <header>
                    <img id="logo" :src="require('@res/img/logo-sm.png')"/>
                    <div id="title-wrapper">
                        <h1 class="title">{{ book.name }}</h1>
                        <see-more class="subtitle" :inline="true">
                            <router-link tag="span"
                                v-for="author in book.authors" 
                                :to="`/author/${author.id}`"
                                :key="author.id">
                                <a>{{ author.name | name }}</a><span v-if="author.id != book.authors[book.authors.length - 1].id">,&#32;<wbr/></span>
                            </router-link>
                        </see-more>
                    </div>
                </header>
                <div id="content-wrapper">
                <section id="content">
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
                    </table>
                </section>
                </div>
                <section id="actions">
                    <button class="btn-auxilary" @click="$router.go(-1)">
                        Back
                    </button>
                    <button id="btn-hold" class="btn-primary" v-if="!checkedOut">
                        Place hold
                        <span class="text-secondary">
                            {{ holdCount }}
                        </span>
                    </button>
                    <button class="btn-neutral btn-disabled" v-if="checkedOut">
                        Checked out
                    </button>
                </section>
            </div>
        </acrylic>
    </div>
</template>

<script lang="ts">
import Acrylic from "@control/acrylic/acrylic.vue";
import SeeMore from "@control/see-more/see-more.vue";

import { Api, Book } from "@lib/api";
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component({ components: { Acrylic, SeeMore } })
export default class BookPage extends Vue
{
    book: Book | null = null;
    holdCount: number | null = null;
    checkedOut: boolean | null = false;

    @vue.Lifecycle
    created()
    {
        (async () =>
        {
            this.book = await Api.getBookById(this.$route.params.id);

            if (this.book && this.$store.state.auth.user) {
                [this.holdCount, this.checkedOut] = await Promise.all([
                    Api.getHoldCountForBook(this.book.isbn),
                    Api.getCheckedOut(this.book.id)
                ]);
            }
        })();
    }
}
</script>

<style scoped src="../page.scss" lang="scss">

</style>
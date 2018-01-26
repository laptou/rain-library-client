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
                    <button class="btn-auxilary" @click="$router.back()">
                        Back
                    </button>
                    <button id="btn-hold" class="btn-primary" v-if="mode === 'place_hold'">
                        Place hold
                        <span class="text-secondary">
                            {{ holdCount }}
                        </span>
                    </button>
                    <button class="btn-danger" v-if="status && status.status === 'on_hold'">
                        Cancel hold
                    </button>
                    <button class="btn-neutral btn-disabled" v-if="status && status.status === 'checked_out'">
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

import { Api, Book, BookStatus, Status, Person } from "@lib/api";
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component({ components: { Acrylic, SeeMore } })
export default class BookPage extends Vue
{
    book: Book | null = null;
    holdCount: number | null = null;
    status: Status | null = null;

    @vue.Lifecycle
    created()
    {
        (async () =>
        {
            this.book = await Api.getBookById(this.$route.params.id);

            if (this.book && this.user)            {
                [this.holdCount, this.status] = await Promise.all([
                    Api.getHoldCountForBook(this.book.isbn),
                    Api.getStatus(this.book.id)
                ]);
            }
        })();
    }

    get user(): Person { return this.$store.state.auth.user; }

    get mode()
    {
        if (!this.status) return null;

        switch (this.status.status)
        {
            case BookStatus.None:
                if (this.user.permissions.indexOf("place_hold") === -1)
                    return "none";
                else
                    return "place_hold";
            case BookStatus.OnHold:
                return "on_hold";
            case BookStatus.CheckedOut:
                return "checked_out";
        }
    }
}
</script>

<style scoped src="../page.scss" lang="scss">

</style>
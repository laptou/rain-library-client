<template>
    <div v-if="book" id="root">
        <rl-acrylic>
            <div id="wrapper">
                <header>
                    <router-link to="/">
                        <img id="logo" :src="require('@res/img/logo-sm.png')" />
                    </router-link>
                    <div id="title-wrapper">
                        <h1 class="title">{{ book.name }}</h1>
                        <rl-see-more class="subtitle" :inline="true">
                            <router-link tag="span" v-for="(author, index) in book.authors" :to="`/author/${author._id}`" :key="author._id">
                                <a>{{ author.name | name }}</a>
                                <span v-if="index < book.authors.length - 1">,&#32;<wbr/></span>
                            </router-link>
                        </rl-see-more>
                    </div>
                </header>
                <div class="page-content-wrapper">
                    <section class="page-content">
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
                                        <router-link :key="copy" v-for="copy in book.copies" :tag="'li'" :to="`/checkout/${copy}`">
                                            <span class="text">{{ copy | segment }}</span>
                                            <span class="badge">Check out</span>
                                        </router-link>
                                    </ul>
                                </td>
                            </tr>
                        </table>
                    </section>
                </div>
                <section id="actions">
                    <router-link v-if="mode === 'log_in'" to="/login" tag="button" class="btn-secondary">
                        Log in
                        <br/>
                        <span class="subtitle">
                            to place hold
                        </span>
                    </router-link>
                    <button v-else-if="mode === 'place_hold'" class="btn-primary" @click="placeHold">
                        Place hold
                        <span class="text-secondary">
                            {{ holdCount }}
                        </span>
                    </button>
                    <button v-else-if="mode === 'on_hold'" class="btn-danger" @click="cancelHold">
                        Cancel hold
                    </button>
                    <button v-else-if="mode === 'ready'" class="btn-fake text-accent">
                        Ready for pickup
                    </button>
                    <button v-else-if="mode === 'checked_out'" class="btn-fake">
                        Checked out
                    </button>
                    <button v-else-if="mode === 'overdue'" class="btn-fake text-danger">
                        Overdue
                    </button>
                    <button v-else class="btn-fake">
                        Unavailable
                    </button>
                    <button @click="$router.back()" class="btn-back btn-auxilary">
                        Back
                    </button>
                </section>
            </div>
        </rl-acrylic>
    </div>
</template>

<script lang="ts">
import { Api, Book, BookStatus, Status, Person } from "@lib/api";
import { Page } from "@page/page";
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
    }

    get user(): Person {
        return this.$store.state.auth.user;
    }

    get mode() {
        if (!this.status) {
            if (!this.user) return "log_in";
            return "none";
        }

        switch (this.status.status) {
            case null:
            case BookStatus.None:
                if (this.user.permissions.indexOf("place_hold") === -1 &&
                    this.user.permissions.indexOf("admin") === -1)
                    return "none";
                else return "place_hold";
            case BookStatus.OnHold:
                if (this.status.position === 0) return "ready";
                else return "on_hold";
            default:
                return this.status.status;
        }
    }

    public async placeHold() {
        if (this.book && (await Api.Holds.place(this.book.isbn))) {
            this.status = await Api.Me.statusForBook(this.book.isbn);
        }
    }

    public async cancelHold() {
        if (this.book && (await Api.Holds.remove(this.book.isbn))) {
            this.status = await Api.Me.statusForBook(this.book.isbn);
        }
    }
}
</script>

<style scoped src="@page/page.scss" lang="scss">

</style>

<style lang="scss">
@import "~@res/style/theme";
@import "~@res/style/mixin";

.book-copy-list {
  li {
    display: flex;
    flex-flow: horizontal;

    cursor: pointer;

    &:hover,
    &:active {
      margin: -0.5em;
      padding: 0.5em 0 0.5em 0.5em;

      transition-property: box-shadow;

      border-radius: $round-small;
      background: $bg-light;

      @include elevation(1);

      .badge {
        opacity: 1;
      }
    }

    .text {
      flex-grow: 1;

      color: $text-colorful;
    }

    .badge {
      font: $font-action;

      margin: -0.5em 0 -0.5em 0.5em;
      padding: 0.5em;

      text-align: left;
      text-transform: uppercase;

      opacity: 0;
      color: $text-light;
      border-radius: 0 $round-small $round-small 0;
      background: $accent-secondary;
    }
  }
}
</style>
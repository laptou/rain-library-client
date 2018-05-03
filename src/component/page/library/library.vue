<template>
    <div id="root">
        <rl-acrylic>
            <div id="wrapper">
                <header>
                    <router-link to="/">
                        <img id="logo" :src="require('@res/img/logo-sm.png')" />
                    </router-link>
                    <div id="title-wrapper">
                        <h1 class="title">Manage Checkouts</h1>
                    </div>
                </header>
                <section class="page-content">
                    <ul class="link-list">
                        <li>
                            <h2>
                                Enter a book ID:&ensp;
                                <input type="text" v-model="bookId" class="inline" placeholder="bef9d3fbc8a5885159da132d" />
                            </h2>

                            <router-link :to="`/library/book/${bookId}`" v-if="book">
                                <br/>
                                <div class="tile-link">
                                    <h3>{{ book.name }}</h3>
                                    <span class="text-secondary no-wrap">{{ book.authors.map(a => a.name) | name-list }}</span><br/>
                                    <span class="text-secondary no-wrap">{{ book.year }}</span>
                                </div>
                            </router-link>
                        </li>
                    </ul>
                </section>
                <section id="actions">
                    <button @click="$router.back()" class="btn-auxilary btn-back">
                        Back
                    </button>

                </section>
            </div>
        </rl-acrylic>
    </div>
</template>

<script lang="ts">
import { Api, Book } from "@lib/api";
import { Page } from "@page/page";

import * as vue from 'av-ts';
import Vue from 'vue';

@vue.Component
export default class LibraryPage extends Vue {
    public bookId: string = "";
    public book: Book | null = null;

    get isIdValid() {
        return !!this.bookId.match(/^[a-z0-9]{24}$/i);
    }

    @vue.Lifecycle
    public mounted() {
        this.$watch("isIdValid", async (n: any, old: any) => {
            if (n) {
                this.book = await Api.Books.byId(this.bookId);
            }
        });
    }
}
</script>

<style src="@page/page.scss" lang="scss" scoped></style>

<template>
    <div id="root">
        <rl-acrylic class="elevation-1">
            <div id="wrapper">
                <header>
                    <img id="logo" :src="require('@res/img/logo-sm.png')" />
                    <div id="title-wrapper">
                        <h1 class="title">Manage Checkouts</h1>
                    </div>
                </header>
                <section class="page-content">
                    <ul class="link-list">
                        <li>
                            <h2>Enter a book ID:&emsp;<input type="text" v-model="bookId" class="inline"/></h2>
                            
                            <router-link :to="`/library/book/${bookId}`" v-if="book">
                                <br/>
                                <div class="tile-link">
                                    <h3>{{ book.name }}</h3>
                                    <span class="text-secondary no-wrap">{{ book.authors.map(a => a.name) | name-list }}</span><br/>
                                    <span class="text-secondary no-wrap">{{ book.year }}</span>
                                </div>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/library/scanner">
                                <h2>Scan a barcode</h2>
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
export default class LibraryPage extends Vue
{
    bookId: string = "";
    book: Book | null = null;

    get isIdValid()    {
        return !!this.bookId.match(/^[a-z0-9]{24}$/i);
    }

    @vue.Lifecycle
    mounted()    {
        this.$watch("isIdValid", async (n: any, old: any) =>        {
            if (n)
            {
                this.book = await Api.getBookById(this.bookId);
            }
        });
    }
}
</script>

<style src="@page/page.scss" lang="scss" scoped></style>

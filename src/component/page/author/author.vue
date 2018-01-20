<template>
    <div v-if="author" id="root">
        <acrylic :background="$store.getters['ui/background/url-blurred']"
                 class="elevation-1">
            <div id="wrapper">
                <header>
                    <img :src="require('@res/img/logo-sm.png')"/>
                    <div>
                        <h1>{{ author.name | name }}</h1>
                        <span class="subtitle">Author</span>
                    </div>
                </header>
                <div id="content-wrapper" v-bar>
                    <section id="content">
                        <table id="info">
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
                                <td class="text-secondary"><a :href="author.wiki">Wikipedia</a></td>
                            </tr>
                        </table>

                        <h2>Books</h2>

                        <ul v-if="books">
                            <li v-for="book in books" :key="book.id">
                                {{ book.name }}
                            </li>
                        </ul>
                        
                    </section>
                </div>
                <section id="actions">
                    <button class="btn-auxilary" @click="$router.go(-1)">
                        Back
                    </button>
                </section>
            </div>
        </acrylic>
    </div>
</template>

<script lang="ts">
import Acrylic from "@control/acrylic/acrylic.vue";
import { Api, Book, Person } from "@lib/api";
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component({ components: { Acrylic } })
export default class AuthorPage extends Vue
{
    author: Person | null = null;
    books: Book[] | null = [];

    @vue.Lifecycle
    created()
    {
        (async () =>
        {
            [this.author, this.books] =
                await Promise.all([
                    Api.getPersonById(this.$route.params.id),
                    Api.getBooksByAuthor(this.$route.params.id)]);
        })();
    }
}
</script>

<style scoped src="../page.scss" lang="scss">

</style>
<template>
    <router-link tag="li"
                 class="search-item"
                 :to="`/book/${content.isbn}`">
        <span class="search-item-label">{{ label }}</span>
        <span class="search-item-desc">{{ description }}</span>

        <rl-permission permissions="check_out"
                       tag="span"
                       v-if="copy">
            <router-link :to="`/library/checkout/${copy}`"
                         tag="button"
                         class="search-item-action btn-primary btn-subtle">
                Check out
            </router-link>
        </rl-permission>
    </router-link>
</template>

<script lang="ts">
import { Book, Person } from "@lib/api";
import * as vue from "av-ts";
import SearchItem from "./search-item";

@vue.Component
export default class BookSearchItem extends SearchItem<Book> {
    get copy() {
        if (!this.content) return null;
        if (this.content.copy) return this.content.copy;
        if (this.content.copies.length === 1) return this.content.copies[0];
        return null;
    }

    // default label selection function
    public static selectLabel(item: Book) {
        return item.name;
    }

    // default description selection function
    public static selectDescription(item: Book) {
        if (item.authors) {
            const book = item as Book;
            const authors = book.authors as Person[];
            let info = authors
                .map((a: Person) => `${a.name.first} ${a.name.last}`)
                .join(", ");
            info += " | ";
            info += book.genre.join(", ");
            return info;
        }

        return "";
    }
}
</script>
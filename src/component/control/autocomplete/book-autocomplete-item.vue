<template>
    <li @click="$emit('click', $event)" class="autocomplete-item">
        <span class="autocomplete-item-label">{{ label }}</span>
        <span class="autocomplete-item-desc">{{ description }}</span>
    </li>
</template>

<script lang="ts">
import { Book, Person } from "@lib/api";
import * as vue from "av-ts";
import AutocompleteItem from "./autocomplete-item";

@vue.Component
export default class BookAutocompleteItem extends AutocompleteItem<Book> {
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
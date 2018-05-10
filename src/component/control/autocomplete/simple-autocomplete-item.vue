<template>
    <li @click="$emit('click', $event)" class="autocomplete-item">
        <span class="autocomplete-item-label">{{ label }}</span>
    </li>
</template>

<script lang="ts">
import { Book, Person } from "@lib/api";
import * as vue from "av-ts";
import AutocompleteItem from "./autocomplete-item";

@vue.Component
export default class SimpleAutocompleteItem extends AutocompleteItem<string> {
    // default label selection function
    public static selectLabel(item: string) {
        return item;
    }

    // default description selection function
    public static selectDescription(item: string) {
        return item;
    }
}
</script>
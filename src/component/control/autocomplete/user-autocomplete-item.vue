<template>
    <router-link tag="li" class="autocomplete-item" :to="`/user/${content.id}`">
        <span class="autocomplete-item-label">{{ label }}</span>
        <span class="autocomplete-item-desc">{{ description }}</span>
    </router-link>
</template>

<script lang="ts">
import { Person } from "@lib/api";
import * as vue from "av-ts";
import AutocompleteItem from "./autocomplete-item";

@vue.Component
export default class UserAutocompleteItem extends AutocompleteItem<Person> {
    // default label selection function
    public static selectLabel(item: Person) {
        // disable prefer-template b/c it doesn't make much sense to use
        // a template string for something this simple
        // tslint:disable-next-line:prefer-template
        return item.name.first + " " + item.name.last;
    }

    // default description selection function
    public static selectDescription(item: Person) {

        return "test";
    }
}
</script>
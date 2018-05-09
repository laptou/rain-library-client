<template>
    <router-link tag="li" class="autocomplete-item" :to="`/person/${content.id}`">
        <span class="autocomplete-item-label">{{ label }}</span>
        <span class="autocomplete-item-desc">{{ description }}</span>
    </router-link>
</template>

<script lang="ts">
import { Person } from "@lib/api";
import * as vue from "av-ts";
import AutocompleteItem from "./autocomplete-item";

@vue.Component
export default class PersonAutocompleteItem extends AutocompleteItem<Person> {
    // default label selection function
    public static selectLabel(item: Person) {
        // disable tslint rule b/c this is simple concatenation
        // tslint:disable-next-line:prefer-template
        return item.name.first + " " + item.name.last;
    }

    // default description selection function
    public static selectDescription(item: Person) {
        if (item.username) {
            // disable tslint rule b/c this is simple concatenation
            // tslint:disable-next-line:prefer-template
            return "@" + item.username;
        }

        return null;
    }
}
</script>
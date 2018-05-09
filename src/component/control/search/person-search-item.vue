<template>
    <router-link tag="li" class="search-item" :to="`/person/${content.id}`">
        <span class="search-item-label">{{ label }}</span>
        <span class="search-item-desc">{{ description }}</span>
    </router-link>
</template>

<script lang="ts">
import { Person } from "@lib/api";
import * as vue from "av-ts";
import SearchItem from "./search-item";

@vue.Component
export default class PersonSearchItem extends SearchItem<Person> {
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
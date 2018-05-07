<template>
    <router-link tag="li" class="autocomplete-item" :to="`/book/${content.isbn}`">
        <span class="autocomplete-item-label">{{ label }}</span>
        <span class="autocomplete-item-desc">{{ description }}</span>

        <rl-permission permissions="check_out" tag="span" v-if="content.copy">
            <router-link :to="`/library/book/${content.copy}`"
                tag="button" class="autocomplete-item-action btn-primary">
                Check out
            </router-link>
        </rl-permission>
    </router-link>
</template>

<script lang="ts">
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component({ name: "autocomplete-item" })
export default class BookAutocompleteItem extends Vue {
    @vue.Prop public content: any | undefined = vue.p({ required: true });
    @vue.Prop public label: string | undefined = vue.p({ type: String, required: true });
    @vue.Prop public description: string | undefined = vue.p({ type: String });
    @vue.Prop public tags: any[] | undefined = vue.p({ type: Array });
}
</script>
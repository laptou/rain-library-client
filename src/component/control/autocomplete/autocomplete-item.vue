<template>
    <li class="autocomplete-item">
        <span class="autocomplete-item-label">{{ label }}</span>&ensp;
        <span class="autocomplete-item-desc">{{ description }}</span>
    </li>
</template>

<script lang="ts">
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component({ name: "autocomplete-item" })
export default class AutocompleteItem extends Vue
{
    @vue.Prop public content: any | undefined = vue.p({ required: true });
    @vue.Prop public label: string | undefined = vue.p({ type: String, required: true });
    @vue.Prop public description: string | undefined = vue.p({ type: String });
    @vue.Prop public tags: any[] | undefined = vue.p({ type: Array });
}
</script>
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
        @vue.Prop content: any | undefined = vue.p({ required: true });
        @vue.Prop label: string | undefined = vue.p({ type: String, required: true });
        @vue.Prop description: string | undefined = vue.p({ type: String });
        @vue.Prop tags: any[] | undefined = vue.p({ type: Array });
    }
</script>

<style lang="scss">
    .autocomplete-item-desc
    {
        opacity: 0.7;
        font-size: 0.7em;
    }

    .autocomplete-item-label
    {
        font-family: "Noto Serif";
    }
</style>
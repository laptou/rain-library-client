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
        @vue.Prop content = vue.p({ required: true });
        @vue.Prop label = vue.p({ type: String, required: true });
        @vue.Prop description = vue.p({ type: String });
    }
</script>

<style lang="scss">
    .autocomplete-item-desc
    {
        opacity: 0.7;
        font-size: 0.7em;
    }
</style>
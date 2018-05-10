<template>
    <ul>
        <li v-for="(item) in itemsSource" :key="itemKeySelector(item)">
            <span class="label">{{ itemFormatSelector(item) }}</span>
            <button class="btn-danger remove" v-if="allowRemove(item)" @click="removeItem(item)">&times;</button>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
@import "~@res/base.scss";

ul
{
    display: block;

    li
    {
        display: inline-block;

        margin: 0.2em;

        cursor: pointer;

        border-radius: $round-small;
        background: $bg-light-textured;

@include elevation(1);

        .label
        {
            display: inline-block;

            padding: 0.2em 0.5em;
        }

        .remove
        {
            display: inline-block;

            width: 1.75em;
            height: 1.75em;
            padding: 0 0.2em;

            border-radius: 0 $round-small $round-small 0;
        }
    }
}

</style>


<script lang="ts">
import * as vue from "av-ts";
import Vue from "vue";
import { Book } from "@lib/api";

@vue.Component
export default class BadgeCloud extends Vue {
    @vue.Prop public itemsSource: any[] = vue.p({ type: Array, required: true });

    @vue.Prop
    public itemFormatSelector = vue.p({
        type: Function,
        defaultFunc: (x: any) => x.toString()
    });

    @vue.Prop
    public itemKeySelector = vue.p({
        type: Function,
        defaultFunc: (x: any) => x
    });

    @vue.Prop
    public allowRemove = vue.p({
        type: Function,
        defaultFunc: (x: any): boolean => true
    });

    public removeItem(item: any) {
        this.itemsSource.splice(this.itemsSource.indexOf(item), 1);
    }
}
</script>
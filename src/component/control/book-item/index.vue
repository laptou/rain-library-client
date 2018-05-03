<template>
    <div class="book-item">

    </div>
</template>

<style lang="scss">
@import "~@res/style/mixin";

.book-item
{
    @include elevation(1);
}

</style>


<script lang="ts">
import * as vue from "av-ts";
import Vue from "vue";
import { Book } from "@lib/api";

@vue.Component
export default class BookItem extends Vue {
    @vue.Prop public book: Book = vue.p({ required: true });
}
</script>

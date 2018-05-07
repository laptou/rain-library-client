<template>
    <div class="autocomplete" @focusin="onFocus" @focusout="onBlur">
        <rl-acrylic>
            <input class="autocomplete-input" title="title" type="search" :placeholder="placeholder" v-model="query" ref="input" />
        </rl-acrylic>
        <div class="autocomplete-suggestions-container">
            <div>
                <ul class="autocomplete-suggestions" :class="{ focused: focused && itemsSource.length > 0 }">
                    <li :is="itemTemplateSelector()" v-for="(item, index) in itemsSource" :content="item" :label="itemLabelSelector(item)" :description="itemDescriptionSelector(item)" :tabindex="index" :key="index">
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Api, Book, Person, Hold, Checkout, Activity } from "@lib/api";
import * as vue from "av-ts";
import Vue from "vue";

const BookAutoCompleteItem = require("./book-autocomplete-item.vue").default;

@vue.Component
export default class Autocomplete extends Vue {
    public query = "";
    public focused = false;

    // appearance
    @vue.Prop public placeholder = vue.p(String);

    // templating
    @vue.Prop public itemsSource = vue.p(Array);

    @vue.Prop
    public itemTemplateSelector = vue.p({
        type: Function,
        defaultFunc: this.selectTemplate
    });

    @vue.Prop
    public itemLabelSelector = vue.p({
        type: Function,
        defaultFunc: this.selectLabel
    });

    @vue.Prop
    public itemDescriptionSelector = vue.p({
        type: Function,
        defaultFunc: this.selectDescription
    });

    @vue.Watch("query")
    public onQueryChanged(newVal: string, oldVal: string) {
        this.$emit("querychanged", newVal, oldVal);
    }

    @vue.Watch("itemsSource")
    public onItemSourceChanged(newVal: any[], oldVal: any[]) {
        this.scrollTo();
    }

    public onFocus(evt: FocusEvent) {
        this.focused = true;
        if (evt.srcElement === this.$refs.input) this.scrollTo();
    }

    public onBlur(evt: FocusEvent) {
        this.focused = false;
    }

    public scrollTo() {
        const elem = this.$refs.input as Element;

        if (elem) elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    private selectTemplate(item: any) {
        return BookAutoCompleteItem;
    }

    private selectLabel(item: any) {
        return item.name;
    }

    private selectDescription(item: any) {
        if (item.authors) {
            const book = item as Book;
            const authors = book.authors as Person[];
            let info = authors
                .map((a: Person) => `${a.name.first} ${a.name.last}`)
                .join(", ");
            info += " | ";
            info += book.genre.join(", ");
            return info;
        }

        return "";
    }
}
</script>

<style lang="scss" src="./autocomplete.scss">







</style>

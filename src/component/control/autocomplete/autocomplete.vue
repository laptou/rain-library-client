<template>
    <div class="autocomplete" @focusin="onFocus" @focusout="onBlur">
        <acrylic :background="acrylicBackground">
            <input class="autocomplete-input" title="title"
                   :placeholder="placeholder" v-model="query"
                   ref="input"/>
        </acrylic>
        <div class="autocomplete-suggestions-container" v-bar="{ preventParentScroll: true }">
            <div>
                <ul class="autocomplete-suggestions" :class="{ focused }" v-if="itemsSource.length > 0">
                    <li :is="itemTemplateSelector()" v-for="(item, index) in itemsSource"
                        :content="item"
                        :label="itemLabelSelector(item)"
                        :description="itemDescriptionSelector(item)"
                        :tabindex="index">
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Acrylic from "@control/acrylic/acrylic.vue";
    import * as vue from "av-ts";
    import Vue from "vue";

    const AutocompleteItem = require("./autocomplete-item.vue").default;

    @vue.Component({ components: { Acrylic } })
    export default class Autocomplete extends Vue
    {
        query = "";
        focused = false;

        // appearance
        @vue.Prop acrylicBackground = vue.p({ type: String, required: true });
        @vue.Prop placeholder = vue.p(String);

        // templating
        @vue.Prop itemsSource = vue.p(Array);

        @vue.Prop itemTemplateSelector = vue.p({
                                                   type: Function,
                                                   defaultFunc: () => AutocompleteItem
                                               });

        @vue.Prop itemLabelSelector = vue.p({
                                                type: Function,
                                                defaultFunc: (item: any) => item
                                            });

        @vue.Prop itemDescriptionSelector = vue.p({
                                                      type: Function,
                                                      defaultFunc: (item: any) => item
                                                  });

        @vue.Watch("query")
        onQueryChanged (newVal: string, oldVal: string)
        {
            this.$emit("querychanged", newVal, oldVal);

        }

        @vue.Watch("itemsSource")
        onItemSourceChanged (newVal: any[], oldVal: any[])
        {
            setTimeout(() => (<Element>this.$refs.input).scrollIntoView({ behavior: "smooth", block: "start" }), 150);
        }

        onFocus (evt: FocusEvent)
        {
            this.focused = true;

            setTimeout(() => (<Element>this.$refs.input).scrollIntoView({ behavior: "smooth", block: "start" }), 150);
        }

        onBlur (evt: FocusEvent)
        {
            this.focused = false;
        }
    }
</script>

<style lang="scss" src="./autocomplete.scss">
</style>
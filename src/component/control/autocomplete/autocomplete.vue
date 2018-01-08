<template>
    <div class="autocomplete">
        <acrylic :background="acrylicBackground">
            <input class="autocomplete-input" title="title"
                   :placeholder="placeholder" v-model="query"
                   @focus="onFocus" @blur="onBlur"/>
        </acrylic>
        <div class="autocomplete-suggestions-container">
            <ul class="autocomplete-suggestions" :class="{ focused: focused }">
                <li :is="itemTemplateSelector()" v-for="item in itemsSource"
                    :content="item"
                    :label="itemLabelSelector(item)"
                    :description="itemDescriptionSelector(item)">
                </li>
            </ul>
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

        onFocus (evt: FocusEvent)
        {
            this.focused = true;
        }

        onBlur (evt: FocusEvent)
        {
            this.focused = false;
        }
    }
</script>

<style lang="scss" src="./autocomplete.scss">
</style>
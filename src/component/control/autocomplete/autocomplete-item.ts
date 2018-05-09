// base class for autocomplete items
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class AutocompleteItem<T> extends Vue {
    @vue.Prop public content: T | undefined = vue.p({ required: true });
    @vue.Prop public label: string | undefined = vue.p({ type: String, required: true });
    @vue.Prop public description: string | undefined = vue.p({ type: String });
    @vue.Prop public tags: any[] | undefined = vue.p({ type: Array });
}
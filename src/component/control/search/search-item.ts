import * as vue from "av-ts";
import Vue from "vue";

// base class for search items
@vue.Component
export default class SearchItem<T> extends Vue {
    @vue.Prop public content: T | undefined = vue.p({ required: true });
    @vue.Prop public label: string | undefined = vue.p({ type: String, required: true });
    @vue.Prop public description: string | undefined = vue.p({ type: String });
    @vue.Prop public tags: any[] | undefined = vue.p({ type: Array });
}
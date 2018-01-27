import * as vue from "av-ts";
import Vue from "vue";

@vue.Component({
                   template:
                       `<router-link tag="li"
                                     class="autocomplete-item"
                                     :to="\`/book/\${content._id}\`">
                            <span class="autocomplete-item-label">{{ label }}</span>
                            <span class="autocomplete-item-desc">{{ description }}</span>
                        </router-link>`
               })
export default class LinkAutocompleteItem extends Vue
{
    @vue.Prop content: any | undefined = vue.p({ required: true });
    @vue.Prop label: string | undefined = vue.p({ type: String, required: true });
    @vue.Prop description: string | undefined = vue.p({ type: String });
    @vue.Prop tags: any[] | undefined = vue.p({ type: Array });
}

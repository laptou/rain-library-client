<!--suppress JSMethodCanBeStatic -->
<template>
    <div id="root" v-bar>
        <div>
            <span id="attribution-container" v-if="backgroundInfo.author" v-bind:class="`block-${theme}`">
                Photo by <a :href="backgroundInfo.author.url">{{ backgroundInfo.author.name }}</a>
            </span>

            <span id="user-container" v-bind:class="`block-${theme}`">
                <span v-if="user">
                    Welcome, {{ user.name.first + " " + user.name.last }}
                </span>
                <router-link v-if="!user" to="/login">
                    Log in
                </router-link>
            </span>

            <div id="logo-container">
                <div id="logo-box">
                    <acrylic :background="background" :mode="'image'">
                        <div id="logo-border" :class="`text-${theme}`"></div>
                    </acrylic>
                    <div id="title-container">
                        <h1 id="title" :class="`text-${theme}`">
                            RAIN <br/>
                            INSTITUTE <br/>
                            LIBRARY
                        </h1>
                    </div>
                </div>
            </div>
            <div id="content-container">
                <div id="search-container">
                    <autocomplete :itemsSource="suggestions"
                                  :itemLabelSelector="(item) => item.name"
                                  :itemDescriptionSelector="(item) => printInfo(item)"
                                  :placeholder="'search for books, authors, and more!'"
                                  :acrylic-background="background"
                                  @querychanged="onQueryChanged">

                    </autocomplete>
                </div>
                <p>
                    Lorem ipsum dolor sit amet, id imperdiet interpretaris sed, natum appetere salutatus ei sit. Unum
                    posse
                    facilis has cu, ea sanctus menandri mea, et vis mazim everti lobortis. Inermis maiorum ius ex, esse
                    idque cu eos. Solet mentitum lobortis ius id.

                    Sit saperet platonem evertitur ea, te congue nostrum eum. Usu wisi verear reprehendunt in, sea ea
                    nonumes disputando, eum meliore deleniti consequuntur ne. Duo sapientem accusamus adipiscing in, has
                    omnium nonumes forensibus an. Omittam consetetur eu vim, pro ut primis luptatum conceptam, sea ad
                    erat
                    repudiandae. Ea nullam fabellas sea, denique quaerendum dissentiet ea vis.

                    Verterem atomorum constituto ea sed. Eam ne movet melius, omnesque appareat et duo, usu ei ubique
                    persius. At apeirian senserit cum, putant lobortis pericula cu mel. Ei libris denique per, et pri
                    facilisis forensibus. Et esse solet suscipit has, eos labitur argumentum in.

                    Eu ius maiorum alienum periculis. In ius offendit consulatu, eros putant inciderint his et. Eos
                    option
                    detraxit voluptatum ea, eirmod appareat ne ius. Ei est pericula intellegat. Vis novum commune
                    accusamus
                    ut, ei his minim melius maluisset, sed no labore similique. Te mollis cetero perfecto eos, cum ad
                    latine
                    dissentiet, sed id vero modus illum.

                    Postea minimum mea ne, simul viderer delicata ea mei, zril qualisque torquatos ad vix. No ullum
                    scaevola
                    antiopam sed, an tempor labore aliquam sed, eum cu pertinax praesent efficiantur. Nec accumsan
                    moderatius ei, an dicta detraxit mei, labore labitur oportere eu eum. Mea diam graece ad.
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Acrylic from "@control/acrylic/acrylic.vue";
    import Autocomplete from "@control/autocomplete/autocomplete.vue";
    import { Api, Book } from "@lib/api";
    import * as auth from "@lib/auth";

    import * as vue from "av-ts";

    import Vue from "vue";
    import { Theme } from "../../../lib/ui";

    @vue.Component({ components: { Acrylic, Autocomplete } })
    export default class Home extends Vue
    {
        suggestions: any[] = [];
        user: auth.User | null = null;

        get background (): string
        {
            return this.$store.getters["ui/background/url"];
        }

        get backgroundInfo ()
        {
            return this.$store.state.ui.background.info;
        }

        get theme (): Theme
        {
            return this.$store.state.ui.theme;
        }

        @vue.Lifecycle
        created ()
        {
            setTimeout(async () =>
                       {
                           // authentication
                           this.user = await auth.getCurrentUser();
                       }, 0);
        }

        async onQueryChanged (newVal: string)
        {
            if (newVal)
            {
                let suggestions: Book[] = [];
                try
                {
                    suggestions.push(... await Api.searchBooksByTitle(newVal));
                }
                catch
                {
                    // do nothing for now
                }

                this.suggestions = suggestions;
            }
            else this.suggestions = [];
        }

        printInfo (item: any): string
        {
            let info = "";
            if (item.authors)
            {
                info += item.authors.map((a: any) => a.name.first + " " + a.name.last).join(" ");
            }
            return info;
        }
    };
</script>


<style src='@lib/base.scss' lang="scss"></style>
<style src="./home.scss" lang="scss"></style>


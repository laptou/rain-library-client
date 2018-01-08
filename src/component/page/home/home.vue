<template>
    <div id="root" v-bar>
        <div>
            <div id="background"
                 :style="{ 'background-image': image }"
                 :class="[ background.loaded ? 'loaded' : null ]">

            </div>
            <div id="old-background"
                 :style="{ 'background-image': oldImage }"
                 :class="[ !background.loaded ? 'loaded' : null ]">
            </div>

            <span id="attribution-container" v-if="background.author" v-bind:class="`block-${theme}`">
            Photo by <a :href="background.author.url">{{ background.author.name }}</a>
        </span>

            <span v-if="user" id="user-container" v-bind:class="`block-${theme}`">
            Welcome, {{ user.name.first + " " + user.name.last }}
        </span>

            <div id="logo-container">
                <div id="logo-box">
                    <acrylic :background="image || oldImage" :mode="'image'">
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
                                  :acrylic-background="image || oldImage"
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
    import * as blobTools from "@lib/util/blob";

    import * as vue from "av-ts";

    import * as colors from "color-convert";
    import Unsplash, { toJson } from "unsplash-js";
    import Vue from "vue";

    enum Theme
    {
        Colorful = "colorful",
        Dark = "dark",
        Light = "light"
    }

    @vue.Component({ components: { Acrylic, Autocomplete } })
    export default class Home extends Vue
    {
        background: {
            loaded: boolean,
            author: { name: string, url: string } | null
        } = { loaded: false, author: null };

        image: string = "";
        oldImage: string = "";
        theme: Theme = Theme.Dark;

        suggestions: any[] = [];
        user: auth.User | null = null;

        @vue.Lifecycle
        created ()
        {
            this.retrieveBackground();
            this.refreshBackground();

            (async () =>
            {
                console.log(await auth.login("reeraa", "ahh"));
                this.user = await auth.getCurrentUser();
            })();
        }

        onQueryChanged (newVal: string, oldVal: string)
        {
            if (newVal)
            {
                (async () =>
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
                })();
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

        retrieveBackground ()
        {
            const background = localStorage.getItem("home::background");
            const theme = localStorage.getItem("home::theme");

            if (background && theme)
            {
                this.oldImage = `url(${background})`;
                this.theme = <Theme>theme;
            }
        }

        async refreshBackground ()
        {
            const unsplash = new Unsplash(
                {
                    applicationId: "52fb1b97ba5a2853f124e0c23a6e4a8856beb527a41e776ae00efb84a4468b5c",
                    secret: "cffc16665cb4f8d0c1a4d7d812fffd0d1def0cd2137b7a8073831ad38f020ca4",
                    callbackUrl: "urn:ietf:wg:oauth:2.0:oob"
                });

            let width = window.innerWidth;
            let orientation = window.innerHeight < width ? "landscape" : "portrait";
            let bgData: any = await toJson(await unsplash.photos.getRandomPhoto(
                {
                    width: width, query: "rain", orientation
                }));

            const imgData = await blobTools.getURLAsBlob(bgData.urls.custom);

            this.image = `url(${blobTools.getBlobAsObjectURL(imgData)})`;

            try
            {
                const height = width / bgData.width * bgData.height;
                const info = await blobTools.colorInfo(imgData, width, height);

                if (info.saturation < -0.9 ||
                    Math.abs(info.saturation * info.brightness) < 0.1) this.theme = Theme.Colorful;
                else if (info.brightness < -0.3) this.theme = Theme.Dark;
                else if (info.brightness > 0.3) this.theme = Theme.Light;
                else this.theme = Theme.Colorful;
            }
            catch
            {
                const color = colors.hex.hsl.raw(bgData.color);

                if (color[1] < 10) this.theme = Theme.Colorful;
                else if (color[2] < 40) this.theme = Theme.Dark;
                else this.theme = Theme.Light;
            }

            localStorage.setItem("home::background", await blobTools.getBlobAsDataURL(imgData));
            localStorage.setItem("home::theme", <string>this.theme);

            this.background.author = { name: bgData.user.name, url: bgData.user.links.html };
            this.background.loaded = true;
        }
    };
</script>


<style src='@lib/base.scss' lang="scss"></style>
<style scoped src="./home.scss" lang="scss"></style>


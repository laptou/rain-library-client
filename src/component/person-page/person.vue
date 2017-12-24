<template>
    <div id="view">
        <div id="banner"></div>
        <div v-if="!person" class="loading">

        </div>
        <div v-if="person">
            <article>
                <p id="status">{{ statuses.join(" \u2022 ") }}</p>
                <h1 id="name">{{ person.firstName + " " + person.lastName }}</h1>
                <section id="books-authored" v-if="person.status & (1 << 1) == (1 << 1)">
                    <h2><span class="icon icon-book"></span> Books Authored</h2>
                    <ul>
                        <li v-for="id in person.creations">
                            <book-listing :book-id="id"></book-listing>
                        </li>
                    </ul>
                </section>
            </article>
        </div>
    </div>
</template>

<script lang="ts">
    import axios from "axios";
    import * as _ from "lodash";
    import * as model from "../../../../server/model";
    import { Component, Vue, Watch, Data, Prop, p, Lifecycle } from "av-ts";
    import BookListing from "../book-listing/book-listing.vue";
    import "vue-router";

    @Component({ name: "person-page", components: { "book-listing": BookListing } })
    export default class PersonPage extends Vue
    {
        person: model.Person = null;
        statuses: string[] = [];

        @Lifecycle
        created ()
        {
            this.getData();
        }

        async getData ()
        {
            try
            {
                console.log("hi");
                let res = await axios.get(`/api/person/id:${this.$route.params.id}`);
                this.person = <model.Person>res.data;

                // unfold the Status enum, which is bit-flagged
                let i = 0;
                while(model.Status[1 << i])
                {
                    let val = this.person.status & (1 << i);
                    if(model.Status[val])
                        this.statuses.push(model.Status[val]);
                    i++;
                }
            }
            catch (err)
            {
                console.log("phuck");
                console.log(err);
            }
        }
    }
</script>

<style lang="scss" src="./person.scss" scoped></style>
<style lang="scss" src="../../sass/icons.scss"></style>

<template>
    <div id="view">
        <div class="background-grey"></div>
        <div class="search-container">
            <div class="search">
                <img id="search-logo" src="../../img/wordmark-large.png" title="Rain Institute Library"/>

                <input id="search-box-ghost"
                       :value="results[0] ? query + results[0].name.substr(query.length) : null"/>

                <input id="search-box"
                       title="search by name, isbn, or genre"
                       placeholder="search by name, isbn, or genre"
                       v-model="query"/>

                <div class="search-autocomplete-container">
                    <ul class="search-autocomplete">
                        <li v-for="result in results">
                            <router-link :to="{ name: 'person', params: { id: result.id }}">
                                {{ result.name }}
                                <span class="search-result-type">{{ result.type }}</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import axios from "axios";
    import * as _ from "lodash";
    import { Component, Vue, Watch, Data, Prop, p } from "av-ts";
    import "vue-router";

    @Component({ name: "home-page" })
    export default class HomePage extends Vue
    {
        query = "";
        results: any[] = [];

        @Watch("query")
        handler (newVal, oldVal)
        {
            _.throttle(this.search)();
        }

        async search ()
        {
            try
            {
                if (this.query.length > 0)
                {
                    let people = await axios.get(`/api/person/search/${this.query}`);
                    let books = await axios.get(`/api/book/find/title:${this.query}`);

                    this.results = _.concat(
                        people.data.map(x =>
                                        {
                                            x.type = "Person";
                                            return x;
                                        }),
                        books.data.map(x =>
                                       {
                                           x.type = "Book";
                                           return x;
                                       })
                    );
                }
                else
                {
                    this.results = [];
                }
            }
            catch (err)
            {
                console.log("search failed: " + err);
                this.results = [];
            }
        }
    };
</script>

<style src="./home.scss" lang="scss" scoped></style>
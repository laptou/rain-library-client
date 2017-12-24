<template>
    <div id="root">
        <div v-if="book">
            <span id="title">{{ book.name }}</span>
            <span id="info">{{ book.year }} &#8226; 5 editions, 7 copies &#8226; Historical Fic/Adventure</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    #root
    {
        padding-left: 30pt;
        height: 60pt;

        #title
        {
            font-family: "Roboto Slab", serif;
            display: block;
            font-size: 15pt;
        }

        #info
        {
            font-family: "Roboto Slab", serif;
            font-size: 12pt;
            opacity: 0.64;
        }
    }
</style>

<script lang="ts">
    import axios from "axios";
    import * as _ from "lodash";
    import * as model from "../../../../server/model";
    import { Component, Vue, Watch, Data, Prop, p, Lifecycle } from "av-ts";

    @Component({ name: "book-listing" })
    export default class BookListing extends Vue
    {
        @Prop bookId = p({ type: String, required: true });
        book : model.Book = null;

        @Lifecycle
        created ()
        {
            this.getData();
        }

        async getData ()
        {
            try
            {
                let res = await axios.get(`/api/book/id:${this.bookId}`);
                this.book = <model.Book>res.data;
            }
            catch (err)
            {
                console.log("phuck");
                console.log(err);
            }
        }
    }
</script>
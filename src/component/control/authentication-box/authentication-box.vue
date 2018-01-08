<template>
    <div>
       <span class="user-welcome" v-if="user" v-bind:class="`block-${theme}`">
            Welcome, {{ user.username }}
        </span>
    </div>

</template>

<script lang="ts">
    import * as vue from "av-ts";
    import Vue from "vue";

    interface User
    {
        id: string;
        username: string;
        name: { first: string, last: string };
    }
    
    @vue.Component
    export default class  extends Vue
    {
        @vue.Prop user: User = vue.p({});

        @vue.Lifecycle
        created ()
        {

        }
    }
</script>

<style scoped>

</style>
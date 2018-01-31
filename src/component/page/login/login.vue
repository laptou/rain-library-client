<template>
    <div id="root" class="page-narrow">
        <rl-acrylic class="elevation-1">
            <form id="wrapper" method="post" @submit.prevent="onSubmit">
                <header>
                    <img :src="require('@res/img/logo-md.png')" id="logo"/>
                    <div id="title-wrapper">
                        <h1>
                            Log in
                        </h1>
                    </div>
                </header>
                <section id="content">
                    <div id="form">
                        <label for="input-username" id="label-username">Username </label>
                        <input name="username" id="input-username" type="text" v-model="username"/>

                        <label for="input-password" id="label-password">Password </label>
                        <input name="password" id="input-password" type="password" v-model="password"/>

                        <span id="error" v-if="error">
                            {{ error }}
                        </span>
                    </div>
                </section>
                <section id="actions">
                    <button @click.prevent="$router.go(-1)" class="btn-auxilary">Back</button>
                    <button id="btn-login" class="btn-primary">Log in</button>
                </section>
            </form>
        </rl-acrylic>
    </div>
</template>

<script lang="ts">
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class LoginPage extends Vue {
    username: string = "";
    password: string = "";
    error: string | null = null;

    async onSubmit() {
        if (!this.username || !this.password) {
            this.error = "You need a username and password.";
            return;
        }

        const response = await this.$store.dispatch("auth/login", {
            username: this.username,
            password: this.password
        });

        switch (response) {
            case 200:
                this.$router.back();
                break;
            case 401:
                this.error = "The username or password is wrong.";
                break;
            default:
                this.error =
                    "Something went wrong... Check your internet connection.";
                break;
        }
    }
}
</script>

<style src="../page.scss" lang="scss" scoped>

</style>
<style src="./login.scss" lang="scss" scoped>

</style>

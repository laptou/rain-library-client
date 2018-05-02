<template>
    <div id="root" class="page-narrow">
        <rl-acrylic >
            <form id="wrapper" method="post" @submit.prevent="onSubmit">
                <header>
                    <router-link to="/">
                        <img id="logo" :src="require('@res/img/logo-sm.png')"/>
                    </router-link>
                    <div id="title-wrapper">
                        <h1>
                            Log in
                        </h1>
                    </div>
                </header>
                <section class="page-content">
                    <form>
                        <label for="input-username" id="label-username">Username </label>
                        <input name="username" id="input-username" type="text" v-model="username"/>

                        <label for="input-password" id="label-password">Password </label>
                        <input name="password" id="input-password" type="password" v-model="password"/>

                        <span id="error" v-if="error">
                            {{ error }}
                        </span>
                    </form>
                </section>
                <section id="actions">
                    <button id="btn-login" class="btn-primary">Log in</button>
                    <button @click.prevent="$router.back()" class="btn-back btn-auxilary">Back</button>
                </section>
            </form>
        </rl-acrylic>
    </div>
</template>

<script lang="ts">
import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class LoginPage extends Vue{
    public username: string = "";
    public password: string = "";
    public error: string | null = null;

    public async onSubmit()    {
        if (!this.username || !this.password)        {
            this.error = "You need a username and password.";
            return;
        }

        const response = await this.$store.dispatch("auth/login", {
            username: this.username,
            password: this.password
        });

        switch (response)        {
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

<template>
    <div id="root">
        <acrylic id="login-container"
                 :background="$store.getters['ui/background/url-blurred']"
                 class="elevation-1">
            <section>
                <form id="form" method="post" @submit.prevent="onSubmit">
                    <header>
                        <img :src="require('@res/img/logo-md.png')" id="logo"/>
                    </header>

                    <label for="input-username" id="label-username">Username </label>
                    <input name="username" id="input-username" type="text" v-model="username"/>

                    <label for="input-password" id="label-password">Password </label>
                    <input name="password" id="input-password" type="password" v-model="password"/>

                    <span id="error" v-if="error">
                        {{ error }}
                    </span>

                    <footer>
                        <button id="btn-login" class="btn-primary">Log in</button>
                    </footer>
                </form>
            </section>
        </acrylic>
    </div>
</template>

<script lang="ts">
    import Acrylic from "@control/acrylic/acrylic.vue";
    import * as vue from "av-ts";
    import Vue from "vue";

    @vue.Component({ components: { Acrylic } })
    export default class LoginPage extends Vue
    {
        username: string = "";
        password: string = "";
        error: string | null = null;

        async onSubmit ()
        {
            if (!this.username || !this.password)
            {
                this.error = "Enter a username and password.";
                return;
            }

            const response = await this.$store.dispatch("auth/login", {
                username: this.username,
                password: this.password
            });

            switch (response)
            {
                case 200:
                    this.$router.back();
                    break;
                case 401:
                    this.error = "Invalid username or password.";
                    break;
                default:
                    this.error = "An error occurred. Check your internet connection.";
                    break;
            }
        }
    }
</script>

<style src="./login.scss" lang="scss" scoped></style>
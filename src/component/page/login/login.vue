<template>
    <rl-page-layout :page="this" class="page-narrow">
        <template slot="header">
            <h1>
                Log in
            </h1>
        </template>
        <template slot="body">
            <form>
                <label for="input-username" id="label-username">Username </label>
                <input name="username" id="input-username" type="text" v-model="username" />

                <label for="input-password" id="label-password">Password </label>
                <input name="password" id="input-password" type="password" v-model="password" />

                <span id="error" v-if="error">
                    {{ error }}
                </span>
            </form>
        </template>
    </rl-page-layout>
</template>

<script lang="ts">
import * as vue from "av-ts";
import Vue from "vue";
import { Page } from "@page/page";

@vue.Component
export default class LoginPage extends Page {
    public username: string = "";
    public password: string = "";
    public error: string | null = null;

    @vue.Lifecycle
    public created() {
        this.buttons = [{
            name: "Log in",
            action: this.onSubmit,
            type: "primary",
            status: null
        }];
    }

    public async onSubmit() {
        if (!this.username || !this.password) {
            this.post({ text: "You need a username and password.", type: "error" });
            throw null; // this is probably not a good idea, but ending with a throw indicates that the function failed
        }

        const response = await this.$store.dispatch("auth/login", {
            username: this.username,
            password: this.password
        });

        switch (response) {
            case 200:
                this.$router.back();
                return;
            case 401:
                this.post({ text: "The username or password is wrong.", type: "error" });
                break;
            default:
                this.post({ text: "Something went wrong. Please check your internet connection.", type: "error" });
                break;
        }

        throw response;
    }
}
</script>

<style src="../page.scss" lang="scss" scoped>

</style>
<style src="./login.scss" lang="scss" scoped>

</style>

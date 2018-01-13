import * as auth from "@lib/auth";
import * as ui from "@lib/ui";
import Vue from "vue";
import * as Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store(
    {
        modules: {
            "ui": ui.vuexModule,
            "auth": auth.vuexModule
        }
    });
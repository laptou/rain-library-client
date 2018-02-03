import App from "@component/app/app.vue";
import Acrylic from "@component/control/acrylic/acrylic.vue";
import Permission from "@component/control/permission/permission.vue";
import SeeMore from "@component/control/see-more/see-more.vue";
import * as Api from "@lib/api";
import store from "@lib/state";
import axios from "axios";
import moment from "moment";
import Vue from "vue";
import VueRouter from "vue-router";
import Vuebar from "vuebar";

axios.defaults.headers["Accept"] = "application/json";

Vue.use(Vuebar);
Vue.use(VueRouter);
Vue.component("rl-acrylic", Acrylic);
Vue.component("rl-permission", Permission);
Vue.component("rl-see-more", SeeMore);

Vue.filter("name", (value: string | { first: string; last: string }) => {
    if (!value) return "";

    if (value instanceof String) return value;
    else return value.first + " " + value.last;
});

Vue.filter("status", (value: Api.Permission[]) => {
    if (value.indexOf("admin") !== -1) return "Administrator";
    if (value.indexOf("user") !== -1) return "User";
    return "Author";
});

Vue.filter("relative-time", (time: string | Date) => {
    if (!time) return "";

    return moment(time).fromNow(true);
});

if (module.hot) {
    module.hot.accept(["./lib/state"], () => {
        const newStore = require("./lib/state");
        // swap in the new actions and mutationsa
        store.hotUpdate({
            modules: newStore.modules
        });
    });

    module.hot.accept();
}

const v = new Vue({
    el: "#app",
    router: require("@lib/routes").default,
    template: "<App />",
    store,
    components: {
        App
    },
    created() {
        require("@lib/ui").vueInit(this);
        require("@lib/auth").vueInit(this);
    }
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then(registration => {
                console.log("SW registered: ", registration);
            })
            .catch(registrationError => {
                console.log("SW registration failed: ", registrationError);
            });
    });
}

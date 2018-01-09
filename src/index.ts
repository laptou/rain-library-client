import store from "@lib/state";
import Vue from "vue";
import VueRouter from "vue-router";
import Vuebar from "vuebar";
import App from "./component/app/app.vue";

Vue.use(Vuebar);
Vue.use(VueRouter);

if (module.hot)
{
    module.hot.accept(["./lib/state"], () =>
    {
        const newStore = require("./lib/state");
        // swap in the new actions and mutations
        store.hotUpdate({
                            modules: newStore.modules
                        });
    });
    
    module.hot.accept();
}

new Vue(
    {
        el: "#app",
        router: new VueRouter({ routes: require("./routes").routes }),
        template: "<div><App /></div>",
        store,
        components: {
            App
        }
    });
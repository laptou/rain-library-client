import store from "@lib/state";
import axios from "axios";
import moment from "moment";
import Vue from "vue";
import VueRouter from "vue-router";
import Vuebar from "vuebar";
import App from "./component/app/app.vue";

axios.defaults.headers["Accept"] = "application/json";

Vue.use(Vuebar);
Vue.use(VueRouter);

Vue.filter("name", function (value: string | { first: string; last: string })
{
    if (!value) return "";
    
    if (value instanceof String)
        return value;
    else
        return value.first + " " + value.last;
});

Vue.filter("relative-time", function (time: string | Date)
{
    if (!time) return "";
    
    return moment(time).fromNow();
});

if (module.hot)
{
    module.hot.accept(["./lib/state"], () =>
    {
        const newStore = require("./lib/state");
        // swap in the new actions and mutationsa
        store.hotUpdate({
                            modules: newStore.modules
                        });
    });
    
    module.hot.accept();
}

new Vue(
    {
        el: "#app",
        router: new VueRouter({
                                  routes: require("./routes").default,
                                  //mode: "history"
                              }),
        template: "<div id='app'><App /></div>",
        store,
        components: {
            App
        },
        created ()
        {
            require("@lib/ui").vueInit(this);
            require("@lib/auth").vueInit(this);
        }
    });
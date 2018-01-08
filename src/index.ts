import Vue from "vue";
import VueRouter from "vue-router";
import Vuebar from "vuebar";
import Vuex from "vuex";
import App from "./component/app/app.vue";

if (module.hot)
{
    module.hot.accept();
}

Vue.use(Vuebar);
Vue.use(Vuex);
Vue.use(VueRouter);

new Vue(
    {
        el: "#app",
        router: new VueRouter({ routes: require("./routes").routes }),
        template: "<div><App /></div>",
        components: {
            App
        }
    });
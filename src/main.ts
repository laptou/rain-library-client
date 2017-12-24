import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "./component/home-page/home.vue";
import PersonPage from "./component/person-page/person.vue";
import BookListing from "./component/book-listing/book-listing.vue";

if (module.hot)
{
    module.hot.accept();
    console.log("hot module replacement activated!");
}

// register the plugin
Vue.use(VueRouter);

let router = new VueRouter({
                               routes:
                                   [
                                       { path: "/", name: "home", component: HomePage },
                                       { path: "/person/:id", name: "person", component: PersonPage }
                                   ]
                           });

new Vue(
    {
        el: "#app",
        router,
        components: {
            "book-listing": BookListing
        }
    });
import Vue from "vue";
import HomePage from "./component/home/home.vue";

if(module.hot) {
    module.hot.accept();
    console.log("it's a 100 degrees :)");
}

new Vue(
    {
        el: "#app",
        template: "<HomePage />",
        components: {
            HomePage
        }
    });
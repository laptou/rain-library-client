import Vue from "vue";
import VueRouter from "vue-router";
import App from "./component/app/app.vue";

if(module.hot) {
    module.hot.accept();
    console.log("it's a 100 degrees :)");
}

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
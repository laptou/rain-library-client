"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var home_vue_1 = require("./component/home-page/home.vue");
var person_vue_1 = require("./component/person-page/person.vue");
if (module.hot) {
    module.hot.accept();
    console.log("hot module replacement activated!");
}
// register the plugin
vue_1.default.use(vue_router_1.default);
var router = new vue_router_1.default({
    routes: [
        { path: "/", name: "home", component: home_vue_1.default },
        { path: "/person/:id", name: "person", component: person_vue_1.default }
    ]
});
router.beforeResolve(function (to, from, next) {
    console.log(to);
    console.log(from);
    console.log(next);
    console.log();
    next();
});
new vue_1.default({
    router: router
}).$mount("#app");

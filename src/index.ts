import Vue from "vue";
import HomePage from "./component/home/home.vue";
/// <reference types="model" />
var model = require("model");
var b = new model.Book(null, null, null);

new Vue(
    {
        el: "#app",
        template: "<HomePage />",
        components: {
            HomePage
        }
    });
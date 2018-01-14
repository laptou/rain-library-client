import Book from "@page/book/book.vue";
import Home from "@page/home/home.vue";
import Login from "@page/login/login.vue";

export default [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/book/:id", component: Book }
];
import Book from "@page/book/book.vue";
import Home from "@page/home/home.vue";
import Login from "@page/login/login.vue";
import Author from "@page/author/author.vue";

export default [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/book/:id", component: Book },
    { path: "/author/:id", component: Author }
];

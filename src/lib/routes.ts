import { RouteConfig } from "vue-router";

const routes: RouteConfig[] = [
    { path: "/", component: () => import("@page/home/home.vue") },
    { path: "/login", component: () => import("@page/login/login.vue") },
    {
        path: "/admin",
        component: () => import("@page/admin/admin.vue"),
        meta: { permissions: ["admin"] },
        children: [
            {
                path: "",
                component: () => import("@page/admin/home/home.vue")
            },
            {
                path: "users",
                component: () => import("@page/admin/users/users.vue")
            },
            {
                path: "user/:id",
                component: () => import("@page/admin/users/user.vue")
            },
            {
                path: "books",
                component: () => import("@page/admin/books/books.vue")
            },
            {
                path: "book/:isbn",
                component: () => import("@page/admin/books/book.vue")
            }
        ]
    },
    { path: "/book/:isbn", component: () => import("@page/book/book.vue") },
    { path: "/author/:id", component: () => import("@page/author/author.vue") }
];
export default routes;

import { Permission, Person } from "@lib/api";
import { hasPermission } from "@lib/auth";
import store from "@lib/state";
import VueRouter from "vue-router";

const router = new VueRouter({
    routes: [
        { path: "/", component: () => import("@page/home/home.vue") },
        {
            path: "/login",
            component: () => import(/* webpackChunkName: "auth" */ "@page/login/login.vue")
        },
        {
            path: "/admin",
            component: () =>
                import(/* webpackChunkName: "admin" */ "@page/admin/admin.vue"),
            meta: { permissions: ["admin"] },
            children: [
                {
                    path: "",
                    meta: { permissions: ["admin"] },
                    component: () =>
                        import(/* webpackChunkName: "admin" */ "@page/admin/home/home.vue")
                },
                {
                    path: "users",
                    meta: { permissions: ["admin"] },
                    component: () =>
                        import(/* webpackChunkName: "admin" */ "@page/admin/users/users.vue")
                },
                {
                    path: "user/:id",
                    meta: { permissions: ["admin"] },
                    component: () =>
                        import(/* webpackChunkName: "admin" */ "@page/admin/users/user.vue")
                },
                {
                    path: "books",
                    meta: { permissions: ["admin"] },
                    component: () =>
                        import(/* webpackChunkName: "admin" */ "@page/admin/books/books.vue")
                },
                {
                    path: "book/:isbn",
                    meta: { permissions: ["admin"] },
                    component: () =>
                        import(/* webpackChunkName: "admin" */ "@page/admin/books/book.vue")
                },
                {
                    path: "reports/checkouts",
                    meta: { permissions: ["admin"] },
                    component: () =>
                        import(/* webpackChunkName: "admin" */ "@page/admin/reports/checkouts.vue")
                },
                {
                    path: "reports/fines",
                    meta: { permissions: ["admin"] },
                    component: () =>
                        import(/* webpackChunkName: "admin" */ "@page/admin/reports/fines.vue")
                }
            ]
        },
        {
            path: "/book/:isbn",
            component: () => import(/* webpackChunkName: "info" */ "@page/book/book.vue")
        },
        {
            path: "/person/:id",
            component: () => import(/* webpackChunkName: "info" */ "@page/person/person.vue")
        },
        {
            path: "/person/edit/:id",
            meta: { permissions: ["modify_person"] },
            component: () => import(/* webpackChunkName: "library" */ "@page/person/edit.vue")
        },
        {
            path: "/library/scanner",
            component: () => import(/* webpackChunkName: "library" */ "@page/library/scanner/scanner.vue")
        },
        {
            path: "/library/checkout/:id",
            component: () => import(/* webpackChunkName: "library" */ "@page/library/checkout/checkout")
        },
    ],
    mode: process.env.NODE_ENV === "development" ? "hash" : "history"
});

router.afterEach((to, from) => {
    store.commit("ui/setLoading", false);
});

router.beforeResolve((to, from, next) => {
    store.commit("ui/setLoading", true);
    next();
});

router.beforeEach(async (to, from, next) => {
    if (!to.meta.permissions) {
        next();
        return;
    }

    const state = store.state as any;

    if (!state.auth.initialized)
        await new Promise((resolve, reject) => {
            const handle = store.watch(
                s => (s as any).auth.user,
                (val, old) => {
                    resolve(val);
                    handle();
                }
            );
        });

    to.meta.permissions.every((p: Permission) => hasPermission(state.auth.user as Person, p)) ? next() : next("/");
});

export default router;

import { Permission, Person } from "@lib/api";
import store from "@lib/state";
import VueRouter from "vue-router";

const router = new VueRouter({
    routes: [
        { path: "/", component: () => import("@page/home/home.vue") },
        {
            path: "/login",
            component: () =>
                import(/* webpackChunkName: "auth" */ "@page/login/login.vue")
        },
        {
            path: "/admin",
            component: () =>
                import(/* webpackChunkName: "admin" */ "@page/admin/admin.vue"),
            meta: { permissions: ["admin"] },
            children: [
                {
                    path: "",
                    component: () =>
                        import(/* webpackChunkName: "admin" */ "@page/admin/home/home.vue")
                },
                {
                    path: "users",
                    component: () =>
                        import(/* webpackChunkName: "admin" */ "@page/admin/users/users.vue")
                },
                {
                    path: "user/:id",
                    component: () =>
                        import(/* webpackChunkName: "admin" */ "@page/admin/users/user.vue")
                },
                {
                    path: "books",
                    component: () =>
                        import(/* webpackChunkName: "admin" */ "@page/admin/books/books.vue")
                },
                {
                    path: "book/:isbn",
                    component: () =>
                        import(/* webpackChunkName: "admin" */ "@page/admin/books/book.vue")
                }
            ]
        },
        {
            path: "/book/:isbn",
            component: () =>
                import(/* webpackChunkName: "info" */ "@page/book/book.vue")
        },
        {
            path: "/author/:id",
            component: () =>
                import(/* webpackChunkName: "info" */ "@page/author/author.vue")
        }
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

    const user: Person = state.auth.user;
    if (!user) next("/login");
    else if (
        !to.meta.permissions.every(
            (p: Permission) => user.permissions.indexOf(p) !== -1
        )
    )
        next("/");
    else next();
});

export default router;

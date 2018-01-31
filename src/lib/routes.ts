import { Person } from '@lib/api';
import store from '@lib/state';
import Admin from '@page/admin/admin.vue';
import Author from '@page/author/author.vue';
import Book from '@page/book/book.vue';
import Home from '@page/home/home.vue';
import Login from '@page/login/login.vue';
import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    {
        path: "/admin",
        component: Admin,
        beforeEnter: async (to, from, next) => {
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
            if (!user || (user && user.permissions.indexOf("admin") === -1))
                next("/");
            else next();
        }
    },
    { path: "/book/:isbn", component: Book },
    { path: "/author/:id", component: Author }
];
export default routes;

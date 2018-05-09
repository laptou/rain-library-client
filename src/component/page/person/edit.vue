<template>
    <div>
        <transition name="fade">
            <div v-if="error"
                 class="banner banner-error banner-top">{{ error }}</div>
        </transition>
        <transition name="fade">
            <div v-if="message"
                 class="banner banner-info banner-top">{{ message }}</div>
        </transition>
        <form v-if="person">
            <h2>Name</h2>
            <label>First Name</label>
            <input type="text"
                   v-model="person.name.first" />

            <label>Last Name</label>
            <input type="text"
                   v-model="person.name.last" />

            <label>Username</label>
            <input type="text"
                   v-model="person.username"
                   v-if="person.permissions.indexOf('user') !== -1" />
            <input type="text"
                   v-model="person.username"
                   disabled="disabled"
                   placeholder="Must be a user to have a username"
                   v-else />

            <label>Password</label>
            <input type="password"
                   v-model="person.password"
                   v-if="person.permissions.indexOf('user') !== -1" />
            <input type="password"
                   v-model="person.password"
                   disabled="disabled"
                   placeholder="Must be a user to have a password"
                   v-else />

            <h2>Permissions</h2>

            <ul class="checkbox-list">
                <rl-permission tag="li"
                               :permissions="'admin'">
                    <input type="checkbox"
                           id="permission-admin"
                           value="admin"
                           v-model="person.permissions" />
                    <label for="permission-admin">
                        Administrator
                        <span class="subtitle"
                              v-if="person.permissions.indexOf('admin') !== -1">
                            Administrators have all permissions.
                        </span>
                    </label>
                </rl-permission>
                <template v-if="person.permissions.indexOf('admin') === -1">
                    <rl-permission tag="li"
                                   :permissions="'check_out'">
                        <input type="checkbox"
                               id="permission-check-out"
                               value="check_out"
                               v-model="person.permissions" />
                        <label for="permission-check-out">
                            Can check out books
                        </label>
                    </rl-permission>
                    <rl-permission tag="li"
                                   :permissions="'place_hold'">
                        <input type="checkbox"
                               id="permission-place-hold"
                               value="place_hold"
                               v-model="person.permissions" />
                        <label for="permission-place-hold">
                            Can place holds
                        </label>
                    </rl-permission>
                    <rl-permission tag="li"
                                   :permissions="'modify_hold'">
                        <input type="checkbox"
                               id="permission-modify-hold"
                               value="modify_hold"
                               v-model="person.permissions" />
                        <label for="permission-modify-hold">
                            Can manage holds
                        </label>
                    </rl-permission>
                    <rl-permission tag="li"
                                   :permissions="'modify_book'">
                        <input type="checkbox"
                               id="permission-modify-book"
                               value="modify_book"
                               v-model="person.permissions" />
                        <label for="permission-modify-book">
                            Can manage books
                        </label>
                    </rl-permission>
                    <rl-permission tag="li"
                                   :permissions="'modify_fine'">
                        <input type="checkbox"
                               id="permission-modify-fine"
                               value="modify_fine"
                               v-model="person.permissions" />
                        <label for="permission-modify-fine">
                            Can manage fines
                        </label>
                    </rl-permission>
                    <rl-permission tag="li"
                                   :permissions="'modify_person'">
                        <input type="checkbox"
                               id="permission-modify-person"
                               value="modify_person"
                               v-model="person.permissions" />
                        <label for="permission-modify-person">
                            Can manage users
                        </label>
                    </rl-permission>
                    <rl-permission tag="li"
                                   :permissions="'modify_person'">
                        <input type="checkbox"
                               id="permission-author"
                               value="author"
                               v-model="person.permissions" />
                        <label for="permission-author">
                            Can be an author
                        </label>
                    </rl-permission>
                    <rl-permission tag="li"
                                   :permissions="'modify_person'">
                        <input type="checkbox"
                               id="permission-user"
                               value="user"
                               v-model="person.permissions" />
                        <label for="permission-user">
                            Can be a user
                        </label>
                    </rl-permission>
                </template>
                <rl-permission tag="li"
                               :permissions="'modify_person'">
                    <input type="checkbox"
                           id="permission-limits"
                           @change="$set(person, 'limits', $event.srcElement.checked ? {} : null)"
                           :checked="person.limits" />
                    <label for="permission-limits">
                        Limits
                    </label>
                    <ul class="checkbox-list"
                        v-if="person.limits">
                        <li>
                            <input type="checkbox"
                                   id="permission-book-limit"
                                   value="user"
                                   @change="$set(person.limits, 'books', $event.srcElement.checked ? 7 : null)"
                                   :checked.prop="person.limits.books" />
                            <label for="permission-book-limit">Book limit:</label>
                            <input type="number"
                                   min="1"
                                   v-model.number="person.limits.books"
                                   class="inline" /> &nbsp;
                            <span>books</span>
                        </li>

                        <li>
                            <input type="checkbox"
                                   id="permission-day-limit"
                                   value="user"
                                   @change="$set(person.limits, 'days', $event.srcElement.checked ? 7 : null)"
                                   :checked.prop="person.limits.days" />
                            <label for="permission-day-limit">Checkout length limit:</label>
                            <input type="number"
                                   min="1"
                                   max="364"
                                   v-model.number="person.limits.days"
                                   class="inline" />
                            <span>&nbsp;days</span>
                        </li>
                    </ul>
                </rl-permission>
            </ul>

            <h2>Activity</h2>
            <template v-if="activities.some(a =>  a.type === 'hold')">
                <h3>On hold</h3>

                <ul class="tile-list"
                    v-if="activities">
                    <li v-for="hold in activities.filter(a =>  a.type === 'hold')"
                        :key="hold.id">
                        <h4>
                            <router-link :to="`/book/${hold.book.isbn}`">{{ hold.book.name }}</router-link>
                        </h4>
                        <table class="info">
                            <tr>
                                <td>Hold placed</td>
                                <td>{{ hold.date | time }}</td>
                            </tr>
                        </table>
                    </li>
                </ul>
            </template>

            <template v-if="activities.some(a =>  a.type === 'checkout' && !a.completed)">
                <h3>Checked out</h3>

                <ul class="tile-list"
                    v-if="activities">
                    <li v-for="checkout in activities.filter(a =>  a.type === 'checkout' && !a.completed)"
                        :key="checkout.id">
                        <h4>
                            <router-link :to="`/book/${checkout.book.isbn}`">{{ checkout.book.name }}</router-link>
                        </h4>
                        <table class="info">
                            <tr>
                                <td>Checked out</td>
                                <td>{{ checkout.start | time }}</td>
                            </tr>
                            <tr>
                                <td>Due</td>
                                <td>{{ checkout.due | time }}</td>
                            </tr>
                            <tr v-if="checkout.penalty !== 1">
                                <td>Fine Multiplier</td>
                                <td>{{ checkout.penalty }}</td>
                            </tr>
                        </table>
                    </li>
                </ul>
            </template>

            <template v-if="activities.some(a =>  a.type === 'checkout' && a.completed)">
                <h3>Returned</h3>
                <ul class="tile-list"
                    v-if="activities">
                    <li v-for="checkout in activities.filter(a => a.type === 'checkout' && a.completed)"
                        :key="checkout.id">
                        <h4>
                            <router-link :to="`/book/${checkout.book.isbn}`">{{ checkout.book.name }}</router-link>
                        </h4>
                        <table class="info">
                            <tr>
                                <td>Checked out</td>
                                <td>{{ checkout.start | time }}</td>
                            </tr>
                            <tr>
                                <td>Due</td>
                                <td>{{ checkout.due | time }}</td>
                            </tr>
                            <tr>
                                <td>Checked in</td>
                                <td>{{ checkout.end | time }}</td>
                            </tr>
                            <tr v-if="checkout.penalty !== 1">
                                <td>Fine Multiplier</td>
                                <td>{{ checkout.penalty }}</td>
                            </tr>
                            <tr v-if="checkout.fine">
                                <td>Fine Amount</td>
                                <td>{{ checkout.fine.amount }}</td>
                            </tr>
                        </table>
                    </li>
                </ul>
            </template>

            <template v-if="activities.length === 0">
                This user has never checked out any books or placed any holds.
            </template>
        </form>
    </div>
</template>

<script lang="ts">
import { Api, Person, Activity } from "@lib/api";
import * as vue from "av-ts";
import Vue from "vue";
import { Page } from "@page/page";

@vue.Component
export default class EditPersonPage extends Page {
    public person: Person | null = null;
    public activities: Activity[] | null = null;

    get user(): Person {
        return this.$store.state.auth.user;
    }

    @vue.Lifecycle
    public beforeRouteEnter(to: any, from: any, next: ((vm: Vue) => void) | (() => void)) {
        Api.People.byId(to.params.id)
            .then(person => (next as any)((vm: EditPersonPage) => (vm.person = person)))
            .catch(console.error);
    }

    @vue.Lifecycle
    public beforeRouteUpdate(to: any, from: any, next: ((vm: Vue) => void) | (() => void)) {
        Api.People.byId(to.params.id)
            .then(person => (next as any)((vm: EditPersonPage) => (vm.person = person)))
            .catch(console.error);
    }

    @vue.Lifecycle
    public mounted() {
        if (!this.person)
            Api.People.byId(this.$route.params.id)
                .then(person => this.person = person)
                .catch(console.error);
        else
            Api.People.activities(this.$route.params.id)
                .then(activities => this.activities = activities)
                .catch(console.error);

        this.buttons = [{ name: "Save", action: this.save, type: "primary", status: null }];
    }

    public async save() {
        if (!this.person) return;

        try {
            this.person =
                (await Api.People.byId(this.person.id, this.person)) ||
                this.person;
            this.post({ text: "User saved.", type: "success" });
        }
        catch (err) {
            this.post({ text: err.response.statusText, type: "error" });
        }
    }
}
</script>

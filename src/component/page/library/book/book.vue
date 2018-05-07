<template>
    <div id="root">
        <rl-acrylic>
            <div id="wrapper">
                <header>
                    <router-link to="/">
                        <img id="logo" :src="require('@res/img/logo-sm.png')" />
                    </router-link>
                    <div id="title-wrapper">
                        <h1 class="title">
                            <router-link v-if="book" :to="`/book/${book.isbn}`">
                                {{ book.name }}
                            </router-link>
                        </h1>
                    </div>
                </header>
                <div class="page-content-scroll-wrapper" v-bar>
                    <div class="page-content-wrapper">
                        <section class="page-content">
                            <transition name="fade">
                                <span class="banner banner-error banner-top" v-if="error">{{ error }}</span>
                            </transition>

                            <template v-if="checkout">
                                <h2>
                                    <router-link v-if="book" :to="`/book/${book.isbn}`">
                                        {{ book.name }}
                                    </router-link> is currently checked out to
                                    <router-link v-if="checkout.person" :to="`/admin/user/${checkout.person.id}`">
                                        {{ checkout.person.name | name }}</router-link>.</h2>
                                <br/>
                                <h3>Information</h3>
                                <h4>Checkout</h4>

                                <table>
                                    <tr>
                                        <td>Borrowed</td>
                                        <td>{{ checkout.start | relative-time-verbose }}</td>
                                    </tr>
                                    <tr>
                                        <td>Due</td>
                                        <td>{{ checkout.due | relative-time-verbose }}</td>
                                    </tr>
                                    <tr v-if="checkoutOverdue">
                                        <td>Fine</td>
                                        <td>{{ checkoutPenalty }}</td>
                                    </tr>
                                </table>
                            </template>
                            <template v-else>
                                <div>
                                    <template v-if="hold">
                                        {{ hold.person.name | name }} ({{hold.person.username}}) currently has a hold on this book.
                                    </template>
                                    <template v-if="[hold].every(_ => !_)">
                                        <span class="text-secondary">N/A</span>
                                    </template>
                                </div>

                                <br/>
                                <h3>Check out</h3>
                                <label>Username:&ensp;<input class="inline" type="text" v-model="username" /></label>
                                <label>Due in:&ensp;<input class="inline" type="number" min="1" v-model.number="due" />&ensp;days</label><br/>
                            </template>

                        </section>
                    </div>
                </div>
                <rl-page-actions :buttons="buttons" />
            </div>
        </rl-acrylic>
    </div>
</template>

<script src="./book.ts" lang="ts">

</script>

<style src="@page/page.scss" lang="scss" scoped></style>

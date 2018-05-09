<template>
    <rl-page-layout v-if="book">
        <template slot="header">
            <h1 class="title">
                Check out
            </h1>
        </template>
        <template slot="body">
            <h2>Book</h2>
            <table>
                <tr>
                    <td>Title</td>
                    <td>
                        <router-link :to="`/book/${book.isbn}`">{{ book.name }}</router-link>
                    </td>
                </tr>
                <tr>
                    <td>Copy ID</td>
                    <td>{{ copy | segment }}</td>
                </tr>
            </table>

            <template v-if="checkout">
                <br/>
                <h3>Checkout</h3>

                <table>
                    <tr>
                        <td>Borrowed</td>
                        <td>{{ checkout.start | relative-time-verbose }} ({{ checkout.start | time }})</td>
                    </tr>
                    <tr>
                        <td>Due</td>
                        <td>{{ checkout.due | relative-time-verbose }} ({{ checkout.start | time }})</td>
                    </tr>
                    <tr v-if="checkoutOverdue">
                        <td>Fine</td>
                        <td>{{ checkoutPenalty }}</td>
                    </tr>
                </table>
            </template>
            <template v-else>

                <template v-if="hold">
                    <br/>
                    <h3>Hold</h3>
                    <table>
                        <tr>
                            <td>Placed by</td>
                            <td>{{ hold.person.name | name }} ({{hold.person.username}})</td>
                        </tr>
                        <tr>
                            <td>Placed</td>
                            <td>{{ hold.date | relative-time-verbose }}</td>
                        </tr>
                    </table>
                </template>
                <br/>
                <h3>Check out</h3>
                <rl-autocomplete v-model="username"
                                 placeholder="Check out to..."
                                 :items-source="userCandidates"
                                 :item-template-selector="userTemplateSelector" />
                <label>Due in:&ensp;<input class="inline"
                           type="number"
                           min="1"
                           v-model.number="due" />&ensp;days</label><br/>
            </template>

        </template>
    </rl-page-layout>
</template>

<script src="./checkout.ts" lang="ts">

</script>

<style src="@page/page.scss" lang="scss" scoped></style>

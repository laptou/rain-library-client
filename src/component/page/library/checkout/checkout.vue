<template>
    <rl-page-layout>
        <template name="header">
            <h1 class="title">
                Check out
            </h1>
        </template>
        <template name="body">
            <template v-if="checkout">
                <h2>
                    Book
                </h2>

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

                <template v-if="hold">
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
                <rl-autocomplete v-model="username" placeholder="Check out to..." :items-source="userCandidates" :item-template-selector="userTemplateSelector" @itemselected="onUserSelected" />
                <label>Due in:&ensp;<input class="inline" type="number" min="1" v-model.number="due" />&ensp;days</label><br/>
            </template>

        </template>
    </rl-page-layout>
</template>

<script src="./checkout.ts" lang="ts">

</script>

<style src="@page/page.scss" lang="scss" scoped></style>

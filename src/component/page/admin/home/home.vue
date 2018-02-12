<template>
<div>
    <ul class="link-list">
        <li>
            <router-link to="/admin/users">
                <h2>Manage Users</h2>
                <span class="subtitle">Add, remove, or modify users and their permissions</span>
            </router-link>
        </li>
        <!-- <li>
            <router-link to="/admin/books">
                <h2>Manage Books</h2>
                <span class="subtitle">Add, remove, or modify books</span>
            </router-link>
        </li> -->
        <li>
            <router-link to="/admin/reports/checkouts">
                <h2>Checkout Reports</h2>
                <span class="subtitle">View information about all books checked out in the last week</span>
            </router-link>
        </li>
        <li>
            <router-link to="/admin/reports/fines">
                <h2>Fine Reports</h2>
                <span class="subtitle">View information about all fines assigned in the last week</span>
            </router-link>
        </li>
    </ul>
</div>
</template>

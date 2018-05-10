# Client 

This repository contains the code for the client of this application. It runs on [Node.js](http://nodejs.org/) and is written primarily in [Typescript](http://typescriptlang.org/). It uses a REST API to a [MongoDB](http://mongodb.com/) database.

This application employs [Vue.js](http://vuejs.org) for displaying the interface and uses [Sass](https://sass-lang.com/) for styling.

## How to Use This Application

Everything important in this application can be accessed either through the hamburger menu in the top right or through the search bar on the home screen.

To find a book or a person (author, librarian, student), simply start typing into the search box.

To find reports of recent checkouts and fines, click the hamburger menu 

## If-Then Sequence that Saves the User Steps

Here's an example from [`book-search-item.vue`](https://github.com/laptou/rain-library-client/blob/master/src/component/control/search/book-search-item.vue):

```vue
<rl-permission permissions="check_out"
                tag="span"
                v-if="copy">
    <router-link :to="`/library/checkout/${copy}`"
                    tag="button"
                    class="search-item-action btn-primary btn-subtle">
        Check out
    </router-link>
</rl-permission>
```
If there is only one copy of a given book, then the user is presented with a button to take them directly to the checkout page.

![shortcut-screenshot](https://imgur.com/3KxsPdN.png)

Here's another example: when the user is signed in and viewing a book, they see these options at the bottom of the page:

![book-edit-screenshot](https://imgur.com/oXyYb8Q.png)

But when they are not signed in, then they see an option to sign in directly from the book page, instead of having to navigate back to the home screen and click the menu and then sign in.

![book-login-screenshot](https://imgur.com/OfBXvJA.png)

The entire program is built around a permissions model, and the user is simply not shown options that they do not have permission to take. This keeps the interface simple and as linear as possible.
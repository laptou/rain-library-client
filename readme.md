# Client 

This repository contains the code for the client of this application. It runs on [Node.js](http://nodejs.org/) and is written primarily in [Typescript](http://typescriptlang.org/). It uses a REST API to a [MongoDB](http://mongodb.com/) database.

This application employs [Vue.js](http://vuejs.org) for displaying the interface and uses [Sass](https://sass-lang.com/) for styling.

## An If-Then Sequence that saves the user time

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

![shortcut-screenshot](https://pasteboard.co/images/HkoK0dk.png/download)
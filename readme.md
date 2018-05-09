# Client 

This repository contains the code for the client of this application. It runs on [Node.js](http://nodejs.org/) and is written primarily in [Typescript](http://typescriptlang.org/). It uses a REST API to a [MongoDB](http://mongodb.com/) database.

This application employs [Vue.js](http://vuejs.org) for displaying the interface and uses [Sass](https://sass-lang.com/) for styling.

## An If-Then Sequence that saves the user time

Here's an example from `src/component/control/autocomplete/book-autocomplete-item.vue`:

```vue
<rl-permission permissions="check_out"
                tag="span"
                v-if="copy">
    <router-link :to="`/library/checkout/${copy}`"
                    tag="button"
                    class="autocomplete-item-action btn-primary btn-subtle">
        Check out
    </router-link>
</rl-permission>
```
If there is only one copy of a given book, then the user is presented with a button to take them directly to the checkout page.

![shortcut-screenshot](https://1drv.ms/u/s!ArxIZJX6JnbQjWtehh_a19_h_4Xj)
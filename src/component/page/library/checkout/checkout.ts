import { Api, Book, Checkout, Hold, Person } from "@lib/api";
import { Page } from "@page/page";
import * as vue from "av-ts";

type NextFunc = (fn: (vm: vue.Vue) => void) => void;
const UserAutocompleteItem = require("@control/autocomplete/user-autocomplete-item.vue").default;

@vue.Component
export default class CheckoutPage extends Page {
    public book: Book | null = null;
    public checkout: Checkout | null = null;
    public hold: Hold | null = null;

    public username: string = "";
    public due: number | null = null;

    // autocomplete for users
    public userCandidates: Person[] = [];

    @vue.Lifecycle
    public async beforeRouteEnter(to: any, from: any, n: any) {
        const book = await Api.Books.byId(to.params.id);
        const next = n as NextFunc;
        next(vm => (vm as CheckoutPage).book = book);
    }

    @vue.Lifecycle
    public mounted() {
        this.fetch().catch(err => {
            this.post({ text: err, type: "error" });
        });
    }

    // get data relevant to this page
    public async fetch() {
        const id = this.$route.params.id;
        this.checkout = await Api.Checkouts.forBook(id);

        if (this.checkout) {
            this.book = this.checkout.book as Book;

            this.buttons = [{
                name: "Check in",
                action: this.checkIn,
                status: null,
                type: "primary"
            }];
        }
        else {
            this.book = await Api.Books.byId(id);

            if (this.book) {
                const holds = await Api.Holds.forBook(this.book.isbn);

                this.hold = (holds && holds.length) ? holds[0] : null;
            }

            this.buttons = [{
                name: "Check out",
                action: this.checkOut,
                type: "primary",
                status: null,
                enabled: () => !!this.username && !!this.due && this.due > 0
            }];
        }
    }

    public async checkIn() {
        const id = this.$route.params.id;

        try {
            if (await Api.Books.checkIn(id)) {
                await this.fetch();
            }
        }
        catch (err) {
            this.post({ text: err.response.statusText, type: "error" });
        }
    }

    public async checkOut() {
        try {
            const id = this.$route.params.id;

            const person = await Api.People.byUsername(this.username as string);

            if (!person) return;

            if (!await Api.Books.checkOut(id, { user: person.id, length: this.due || undefined })) return;

            await this.fetch();
        }
        catch (err) {
            this.post({ text: err.response.statusText, type: "error" });
        }
    }

    public userTemplateSelector() {
        return UserAutocompleteItem;
    }

    get copy() {
        return this.$route.params.id;
    }

    get checkoutOverdue() {
        if (this.checkout)
            return Date.parse(this.checkout.due as string) < Date.now();
    }

    get checkoutPenalty() {
        if (this.checkout) {
            let days = (Date.now() - Date.parse(this.checkout.due as string)) / 86400000;
            days = Math.ceil(days);
            return `$${(days * this.checkout.penalty).toFixed(2)}`;
        }
    }

    @vue.Watch("username")
    private async usernameChanged(newVal: string) {
        try {
            if (newVal) {
                // query the API
                const results = await Api.People.search(newVal);
                this.userCandidates = results || [];
            }
            else {
                this.userCandidates = [];
            }
        }
        catch
        {
            this.userCandidates = [];
        }
    }
}
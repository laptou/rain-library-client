import { Api, Book, Checkout, Hold } from "@lib/api";
import { Page } from "@page/page";
import * as vue from "av-ts";


@vue.Component
export default class LibraryBookPage extends Page {
    public book: Book | null = null;
    public checkout: Checkout | null = null;
    public hold: Hold | null = null;

    public username: string | null = null;
    public due: number | null = null;

    @vue.Lifecycle
    public mounted() {
        this.init().catch(err => {
            this.post({ text: err, type: "error" });
        });
    }

    public async init() {
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

    public async checkIn() {
        const id = this.$route.params.id;

        try {
            if (await Api.Books.checkIn(id)) {
                await this.init();
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

            await this.init();
        }
        catch (err) {
            this.post({ text: err.response.statusText, type: "error" });
        }
    }
}
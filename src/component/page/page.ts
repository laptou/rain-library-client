import * as vue from "av-ts";
import Vue from "vue";

export interface Button {
    name: string;
    action?: (evt?: Event) => void | Promise<void>;
    enabled?: () => boolean;
    link?: string;
    type: "primary" | "secondary" | "danger" | "auxilary" | "fake";
    status: "working" | "success" | "error" | null;
}

export interface Message {
    text: string;
    type: "working" | "success" | "error" | null;
    icon?: string;
}

@vue.Component
export class Page extends Vue {
    public buttons: Button[] = [];
    public data: any = {};
    public message: Message | null = null;

    @vue.Lifecycle
    public created() {
    }

    public async action(btn: Button, evt: Event) {
        if (!btn.action) return;

        btn.status = "working";

        const p = btn.action(evt);

        try {
            if (p instanceof Promise) {
                await p;
            }

            btn.status = "success";

            setTimeout(() => {
                btn.status = null;
            }, 2000);
        } catch {
            btn.status = "error";

            setTimeout(() => {
                btn.status = null;
            }, 2000);
        }
    }

    public post(message: Message) {
        this.message = message;
        setTimeout(() => this.message = null);
    }
}
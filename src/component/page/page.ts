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
    public message: Message | null = null;

    private messageTimer?: NodeJS.Timer;

    public post(message: Message) {
        this.message = message;
        if (this.messageTimer) clearTimeout(this.messageTimer);
        this.messageTimer = setTimeout(() => {
            this.message = null;
            delete this.messageTimer;
        }, 5000);
    }
}
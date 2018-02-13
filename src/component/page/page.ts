import * as vue from "av-ts";
import Vue from "vue";

export interface Button
{
    name: string;
    action?: (evt?: Event) => void | Promise<void>;
    link?: string;
    type: "primary" | "secondary" | "danger" | "auxilary" | "fake";
    status: "working" | "success" | "error" | null;
}

@vue.Component
export class Page extends Vue
{
    buttons: Button[] = [];
    data: any = {};

    @vue.Lifecycle
    created()
    {
        this.$on("buttonupdate", this.onButtonsUpdated);
        this.$on("dataupdate", this.onDataUpdated);
    }

    onButtonsUpdated(buttons: Button[])
    {
        this.$set(this, "buttons", buttons);
    }

    onDataUpdated(data: any)
    {
        this.data = Object.assign(this.data, data);
    }

    async action(btn: Button, evt: Event)
    {
        if (!btn.action) return;

        btn.status = "working";

        const p = btn.action(evt);

        try
        {
            if (p instanceof Promise)
            {
                await p;
            }

            btn.status = "success";

            setTimeout(() =>
            {
                btn.status = null;
            }, 2000);
        } catch {
            btn.status = "error";

            setTimeout(() =>
            {
                btn.status = null;
            }, 2000);
        }
    }
}
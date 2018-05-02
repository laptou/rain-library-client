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
    public buttons: Button[] = [];
    public data: any = {};

    @vue.Lifecycle
    public created()
    {
        this.$on("buttonupdate", this.onButtonsUpdated);
        this.$on("dataupdate", this.onDataUpdated);
    }

    public onButtonsUpdated(buttons: Button[])
    {
        this.$set(this, "buttons", buttons);
    }

    public onDataUpdated(data: any)
    {
        Object.assign(this.data, data);
    }

    public async action(btn: Button, evt: Event)
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
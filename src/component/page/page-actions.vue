<template>
    <section id="actions">
        <template v-for="(button, index) in buttons">
            <button @click="action(button, $event)"
                    :key="index"
                    :disabled="!('enabled' in button ? button.enabled() : true)"
                    :class="[`btn-${button.type}`, `btn-${button.status}`]">{{ button.name }}</button>
        </template>
        <button @click="$router.back()"
                class="btn-auxilary btn-back">
            Back
        </button>
    </section>
</template>

<script lang="ts">
import Vue from 'vue';
import * as vue from "av-ts";
import { Button } from '@component/page/page';

@vue.Component
export default class PageActions extends Vue {
    @vue.Prop public buttons?: Button[] = vue.p<Button[]>({ type: Array });

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
}
</script>

<style lang="scss" scoped>
@import "~@res/base.scss";

#actions
{
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    justify-content: flex-end;

    width: 100%;
    margin-top: 1em;

    button
    {
        font-size: 1.25em;

        padding: 1em;
    }
}

@media #{$screen-lg}
{
    #actions
    {
        flex-direction: row;

        .btn-back
        {
            order: -1;

            border-top-left-radius: 4pt;
        }
    }
}

@media print
{
    #actions
    {
        display: none;
    }
}

</style>


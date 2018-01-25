<template>
    <div class="see-more" :class="{ inline, open, overflow }">
        <div class="see-more-content" ref="content">
            <slot/>
        </div>
        <a href='#' class="see-more-link" @click="toggle">
            {{ open ? 'less' : 'more' }}
        </a>
    </div>
</template>

<script lang="ts">
import * as resize from "@lib/ui/resize-listener.js";

import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class SeeMore extends Vue
{
    @vue.Prop inline: boolean = vue.p({ type: Boolean, default: false });
    open: boolean = false;
    overflow: boolean = false;

    @vue.Lifecycle mounted()
    {
        resize.addResizeListener(this.$refs.content, this.onResize);
    }

    @vue.Lifecycle destroyed()
    {
        resize.removeResizeListener(this.$refs.content, this.onResize);
    }

    toggle()
    {
        this.open = !this.open;
    }

    private onResize(evt: UIEvent)
    {
        const content: HTMLDivElement = this.$refs.content as HTMLDivElement;
        this.overflow = content.scrollHeight > content.clientHeight;
    }
}
</script>

<style lang="scss" scoped src="./see-more.scss">

</style>
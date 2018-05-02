<template>
    <div class="see-more" :class="{ inline, open, overflow }">
        <div class="see-more-content" ref="wrapper">
            <div ref="content">
                <slot/>
            </div>
        </div>
        <a href='javascript:void(0)' class="see-more-link" @click="toggle">
            {{ open ? 'less' : 'more' }}
        </a>
    </div>
</template>

<script lang="ts">
import * as resize from "@lib/ui/resize-listener.js";

import * as vue from "av-ts";
import Vue from "vue";

@vue.Component
export default class SeeMore extends Vue{
    @vue.Prop public inline: boolean = vue.p({ type: Boolean, default: false });
    public open: boolean = false;
    public overflow: boolean = false;

    @vue.Lifecycle
    public mounted()    {
        resize.addResizeListener(this.$refs.content, this.onResize);

        this.onResize();
    }

    @vue.Lifecycle
    public beforeDestroy()    {
        resize.removeResizeListener(this.$refs.content, this.onResize);
    }

    public toggle()    {
        this.open = !this.open;

        this.onResize();
    }

    private onResize(evt?: UIEvent)    {
        const content: HTMLDivElement = this.$refs.content as HTMLDivElement;
        const wrapper: HTMLDivElement = this.$refs.wrapper as HTMLDivElement;
        this.overflow = content.scrollHeight > wrapper.clientHeight;
    }
}
</script>

<style lang="scss" scoped src="./see-more.scss">

</style>

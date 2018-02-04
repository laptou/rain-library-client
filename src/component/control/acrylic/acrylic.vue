<template>
    <div class="acrylic" :style="style">
        <div class="acrylic-content">
            <slot/>
        </div>
    </div>
</template>

<script lang="ts">
import * as vue from "av-ts";
import Vue from "vue";

enum Mode {
    Image = "image",
    Color = "color"
}

@vue.Component
export default class Acrylic extends Vue {
    @vue.Prop background = vue.p({ type: String });
    @vue.Prop
    mode: string | Mode = vue.p({ type: String, default: Mode.Image });

    get style() {
        // this stuff just doesn't work in Chrome for Android, so gracefully fallback
        // to some plain old alpha transparency
        if (
            navigator.userAgent.indexOf("Chrome") !== -1 &&
            navigator.userAgent.lastIndexOf("Android") !== -1
        )
            return { "background-color": "rgba(0, 0, 0, 0.3)" };

        return this.mode === Mode.Color
            ? { "background-color": this.background }
            : {
                  "background-image":
                      this.background ||
                      this.$store.getters["ui/background/css-url-blurred"]
              };
    }
}
</script>

<style lang="scss">
.acrylic
{
    position: relative;

    overflow: hidden;

    background-attachment: fixed;
    background-size: cover;
}
.acrylic-content
{
    width: 100%;
    height: 100%;
}

</style>

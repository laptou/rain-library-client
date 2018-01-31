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
        return this.mode === Mode.Color
            ? { "background-color": this.background }
            : {
                  "background-image":
                      this.background ||
                      this.$store.getters["ui/background/url-blurred"]
              };
    }
}
</script>

<style lang="scss" scoped src="./acrylic.scss">


</style>

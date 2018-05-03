<template lang="html">
<div id="root">
    <rl-acrylic >
        <div id="wrapper">
            <div class="page-content">
                <div class="viewfinder" ref="viewfinder">
                    
                </div>
                <div class="viewfinder-prompt" v-show="confidence < 10">
                    {{ prompt }}
                </div>
                <transition name="fade">
                    <div class="viewfinder-overlay" v-show="confidence > 10">
                        <span>Barcode scanned</span>
                        <img :src="require('@res/img/check-white.svg')" />
                        <span v-if="!!book">{{ book.name }}</span>
                    </div>
                </transition>
            </div>
            <section id="actions">
                <button @click="$router.back()" class="btn-auxilary btn-back">
                    Back
                </button>
            </section>
        </div>
        
    </rl-acrylic>
</div>
</template>

<script lang="ts">
import { Api, Book } from "@lib/api";
import * as vue from "av-ts";
import quagga from "quagga";
import Vue from "vue";

@vue.Component
export default class ScannerPage extends Vue {
    public confidence: number = 0;
    public id: string | null = null;
    public book: Book | null = null;
    public prompt: string | null = null;

    public onBlur(ev: FocusEvent) {
        quagga.stop();
    }

    public onFocus(ev: FocusEvent) {
        quagga.start();
    }

    @vue.Lifecycle
    public mounted() {
        window.addEventListener("blur", this.onBlur);
        window.addEventListener("focus", this.onFocus);

        const vf = this.$refs.viewfinder as Element;

        const constraints: any = {
            facingMode: "environment",
            width: { min: vf.clientWidth },
            height: { min: vf.clientHeight }
        };

        if (navigator.mediaDevices && navigator.mediaDevices.getSupportedConstraints().aspectRatio)
            constraints.aspectRatio = 0.5;

        quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: vf,
                constraints
            },
            decoder: { readers: ["code_93_reader"] }
        },
            (err: any) => {
                if (err) {
                    console.error(err);
                    return;
                }

                quagga.onDetected(async (result: any) => {
                    if (result.codeResult) {
                        if (this.id === result.codeResult.code)
                            this.confidence++;
                        else
                            this.confidence = 0;

                        this.id = result.codeResult.code;
                    }

                    if (this.confidence > 10) {
                        this.prompt = `Detected: ${this.id}`;
                        quagga.stop();

                        this.book = await Api.Books.byId(this.id as string);

                        if (!this.book) {
                            quagga.start();
                            this.confidence = 0;
                            this.prompt = "The book could not be found. Try again.";
                        }
                        else {
                            setTimeout(() => {
                                if (this.id)
                                    this.$router.push(`/library/book/${this.id.toLowerCase()}`);
                            }, 1000);
                        }
                    }
                    else if (this.confidence > 0) {
                        this.prompt = "Stay still.";
                    }
                    else {
                        this.prompt = "Scan an ID barcode.";
                    }
                });

                quagga.start();

                this.prompt = "Scan an ID barcode.";
            });
    }

    @vue.Lifecycle
    public destroyed() {
        quagga.stop();
        console.log("Quagga stopped");
    }
}
</script>

<style src="@page/page.scss" lang="scss">

</style>

<style src="./scanner.scss" lang="scss" scoped>

</style>

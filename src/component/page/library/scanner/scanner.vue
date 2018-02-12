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

<script lang="ts" src="./scanner.ts">

</script>

<style src="@page/page.scss" lang="scss">

</style>

<style lang="scss" scoped>
@import "~@page/page.scss";

.page-content
{
    width: 100%;
    height: 100%;
    padding: 0;
}

#actions
{
    margin-top: 0;
}

.viewfinder
{
    position: relative;

    overflow: hidden;

    width: 100%;
    height: 100%;

    &::after
    {
        display: block;

        width: 100%;
        padding-bottom: 100%;

        content: " ";
    }

    & /deep/ video, & /deep/ canvas
    {
        position: absolute;

        max-width: 100%;

        object-fit: fill;
    }

    & /deep/ br
    {
        display: none;
    }
}

.viewfinder-overlay
{
    font: $font-action;
    font-size: 2em;

    position: absolute;

    display: flex;
    align-items: center;
    flex-flow: column nowrap;
    justify-content: center;

    width: 100%;
    height: 100%;

    transition-duration: 0.15s;
    text-align: center;
    text-transform: uppercase;

    color: $text-light;
    background-color: $accent-secondary;

    img
    {
        width: 4em;
        height: 4em;
    }
}

.viewfinder-prompt
{
    font-family: $font-action;

    position: absolute;
    bottom: 0;

    width: 100%;
    padding: 1em;

    text-align: center;

    color: $text-light;
    background: $bg-dark;
}

</style>

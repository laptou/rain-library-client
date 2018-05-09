<template>
    <section id="actions">
        <button @click="$router.back()" class="btn-auxilary btn-back">
            Back
        </button>
        <template v-for="(button, index) in buttons">
            <button @click="action(button, $event)" :key="index" :disabled="!('enabled' in button ? button.enabled() : true)" :class="[`btn-${button.type}`, `btn-${button.status}`]">{{ button.name }}</button>
        </template>
    </section>
</template>

<script lang="ts">
import Vue from 'vue';
import * as vue from "av-ts";
import { Button } from '@component/page/page';

@vue.Component
export default class PageActions extends Vue {
    @vue.Prop public buttons?: Button[] = vue.p<Button[]>({ type: Array });
}
</script>

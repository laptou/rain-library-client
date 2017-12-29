declare module "acrylic.vue"
{
    import Vue from "vue";
    
    export default class Acrylic extends Vue
    {
        background: string;
        mode: Mode;
    }
    
    export enum Mode
    {
        Image = "image",
        Color = "color"
    }
}
declare module "resize-listener"
{
    type ResizeEventCallback = (this: HTMLElement, event: Event) => void;
    export const addResizeListener: (elem: HTMLElement, callback: ResizeEventCallback) => void;
    export const removeResizeListener: (elem: HTMLElement, callback: ResizeEventCallback) => void;
}
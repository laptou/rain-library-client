import debounce from "lodash";

var attachEvent = document.attachEvent;
let isIE = navigator.userAgent.match(/Trident/);
let requestFrame = (function ()
{
    let raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function (fn) { return window.setTimeout(fn, 20); };
    return function (fn) { return raf(fn); };
})();

let cancelFrame = (function ()
{
    let cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
        window.clearTimeout;
    return function (id) { return cancel(id); };
})();

function resizeListener(e)
{
    let win = e.target || e.srcElement;
    if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
    win.__resizeRAF__ = requestFrame(function ()
    {
        let trigger = win.__resizeTrigger__;
        trigger.__resizeListeners__.forEach((fn) => fn());
    });
}

function objectLoad(e)
{
    this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
    this.contentDocument.defaultView.addEventListener('resize', resizeListener);
}

export const addResizeListener = function (element, fn)
{
    if (!element.__resizeListeners__)
    {
        element.__resizeListeners__ = [];
        if (attachEvent)
        {
            element.__resizeTrigger__ = element;
            element.attachEvent("onresize", resizeListener);
        }
        else
        {
            if (getComputedStyle(element).position === "static") element.style.position = "relative";
            const obj = element.__resizeTrigger__ = document.createElement("object");

            Object.assign(obj.style, {
                display: "block",
                visibility: "hidden",
                position: "absolute",
                top: "0",
                left: "0",
                height: "100%",
                width: "100%",
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: -1
            });

            obj.__resizeElement__ = element;
            obj.onload = objectLoad;
            obj.type = "text/html";
            if (!isIE) obj.data = "about:blank";
            element.appendChild(obj);
        }
    }
    element.__resizeListeners__.push(fn);
};

export const removeResizeListener = function (element, fn)
{
    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
    if (!element.__resizeListeners__.length)
    {
        if (attachEvent) element.detachEvent("onresize", resizeListener);
        else
        {
            element.__resizeTrigger__.contentDocument.defaultView.removeEventListener("resize", resizeListener);
            element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
        }
    }
};

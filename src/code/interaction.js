let loaded = false;

function loadScripts() {
    if (loaded) return;
    loaded = true;

    import("../code/code.js");
}

const events = [
    "mousedown",
    "mousemove",
    "keydown",
    "scroll",
    "touchstart",
    "wheel",
];

events.forEach((event) => {
    window.addEventListener(event, loadScripts, {
        passive: true,
        once: true,
    });
});

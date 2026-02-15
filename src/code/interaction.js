let loaded = false;

async function loadHeavyScripts() {
    if (loaded) return;
    loaded = true;
    ["scroll", "mousemove", "mousedown", "touchstart", "keydown"].forEach(
        (event) => window.removeEventListener(event, loadHeavyScripts),
    );

    try {
        const module = await import("./code.js");
        if (module.init) {
            module.init();
        }
    } catch (err) {
        console.error("Failed to load scripts:", err);
    }
}

const events = ["scroll", "mousemove", "mousedown", "touchstart", "keydown"];
events.forEach((event) => {
    window.addEventListener(event, loadHeavyScripts, {
        once: true,
        passive: true,
    });
});

setTimeout(loadHeavyScripts, 4000);

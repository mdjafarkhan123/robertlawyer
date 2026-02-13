// interaction.js

let loaded = false;

async function loadHeavyScripts() {
    if (loaded) return;
    loaded = true;

    // Remove event listeners so they don't fire again
    ["scroll", "mousemove", "mousedown", "touchstart", "keydown"].forEach(
        (event) => window.removeEventListener(event, loadHeavyScripts),
    );

    try {
        // PRO MOVE: Dynamic Import
        // This tells Vite/Astro: "Split code.js into a separate chunk
        // and only download it (and its dependencies like GSAP) now."
        const module = await import("./code.js");

        // Initialize the app manually after it loads
        if (module.init) {
            module.init();
        }

        console.log("Scripts hydrated on interaction");
    } catch (err) {
        console.error("Failed to load scripts:", err);
    }
}

// Add interaction listeners
// Note: We pass 'loadHeavyScripts', NOT 'loadScript'
const events = ["scroll", "mousemove", "mousedown", "touchstart", "keydown"];
events.forEach((event) => {
    window.addEventListener(event, loadHeavyScripts, {
        once: true,
        passive: true,
    });
});

// Fallback: Load automatically after 4 seconds if user doesn't move
// (Good for SEO bots that don't scroll)
setTimeout(loadHeavyScripts, 4000);

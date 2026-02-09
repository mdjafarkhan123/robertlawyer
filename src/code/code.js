import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Splide from "@splidejs/splide";

// Configuration
const CONFIG = {
    BREAKPOINTS: {
        MOBILE: 640,
        MOBILE_LG: 768,
        TABLET: 991,
    },
    LENIS: {
        wheelMultiplier: 1.6,
        smoothWheel: true,
    },
    LAZY_LOAD: {
        rootMargin: "100px", // Start loading 100px before element is visible
    },
    SPLIDE: {
        type: "loop",
        perPage: 3,
        gap: "2rem",
        arrows: false,
        pagination: true,
    },
    SPLIDE_CASE: {
        type: "loop",
        perPage: 1,
        gap: "2rem",
        arrows: false,
        pagination: false,
    },
    SPLIDE_TESTIMONIALS: {
        type: "loop",
        perPage: 1,
        gap: "2rem",
        arrows: false,
        pagination: false,
    },
};

function throttle(func, delay) {
    let timeoutId = null;
    let lastCall = 0;

    return function (...args) {
        const now = Date.now();
        const timeSinceLastCall = now - lastCall;

        if (timeSinceLastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                func.apply(this, args);
            }, delay - timeSinceLastCall);
        }
    };
}

function initSmoothScroll() {
    const lenis = new Lenis(CONFIG.LENIS);

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

function initMobileMenu() {
    const menuIcon = document.querySelector(".header__menu-toggler");
    const menu = document.getElementById("main-navigation");

    if (!menuIcon || !menu) return;

    const menuItems = menu.querySelectorAll(".header__menu-item");
    let isOpen = menuIcon.getAttribute("aria-expanded") === "true";

    function toggleMenu() {
        isOpen = !isOpen;
        menuIcon.setAttribute("aria-expanded", String(isOpen));
        menu.style.transform = isOpen ? "translateX(0%)" : "translateX(100%)";
    }

    function closeMenu() {
        if (isOpen) {
            isOpen = false;
            menuIcon.setAttribute("aria-expanded", "false");
            menu.style.transform = "translateX(100%)";
        }
    }

    menuIcon.addEventListener("click", toggleMenu);
    menuItems.forEach((item) => item.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
    });
}

function initButtonEffect() {
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach((button) => {
        const bg = button.querySelector(".btn__bg");
        if (!bg) return;

        let rect = null;

        button.addEventListener("mouseenter", (e) => {
            rect = button.getBoundingClientRect();
            bg.style.left = `${e.clientX - rect.left}px`;
            bg.style.top = `${e.clientY - rect.top}px`;
            void bg.offsetWidth;
            bg.style.transition = "transform 0.5s ease-out, opacity 0.3s";
        });

        button.addEventListener("mouseleave", (e) => {
            if (!rect) return;
            bg.style.transition = "all 0.5s ease-out";
            bg.style.left = `${e.clientX - rect.left}px`;
            bg.style.top = `${e.clientY - rect.top}px`;
            rect = null;
        });

        button.addEventListener(
            "mousemove",
            throttle((e) => {
                if (!rect) return;
                bg.style.left = `${e.clientX - rect.left}px`;
                bg.style.top = `${e.clientY - rect.top}px`;
            }, 16),
        );
    });
}

// COMBINED: Lazy loading for background images AND SVG sprites
function initLazyLoad() {
    // Track which sprites have been preloaded
    const loadedSprites = new Set();

    // 1. Handle background images
    const lazyBGs = document.querySelectorAll(".lazy-bg");

    // 2. Handle SVG sprites
    const lazySVGs = document.querySelectorAll("svg[data-sprite]");

    // Create single observer for both
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;

                    // Handle background images
                    if (el.classList.contains("lazy-bg")) {
                        const bgUrl = el.dataset.bg;
                        if (bgUrl) {
                            el.style.backgroundImage = `url(${bgUrl})`;
                            el.classList.add("loaded");
                            observer.unobserve(el);
                        }
                    }

                    // Handle SVG sprites
                    if (el.tagName === "svg" && el.dataset.sprite) {
                        const spritePath = el.dataset.sprite;
                        const iconId = el.dataset.icon;

                        // Preload sprite file if not already loaded
                        if (!loadedSprites.has(spritePath)) {
                            const link = document.createElement("link");
                            link.rel = "preload";
                            link.as = "image";
                            link.type = "image/svg+xml";
                            link.href = spritePath;
                            document.head.appendChild(link);
                            loadedSprites.add(spritePath);
                        }

                        // Add <use> element to SVG
                        const use = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "use",
                        );
                        use.setAttributeNS(
                            "http://www.w3.org/1999/xlink",
                            "xlink:href",
                            `${spritePath}#${iconId}`,
                        );
                        el.appendChild(use);
                        el.classList.add("loaded");

                        observer.unobserve(el);
                    }
                }
            });
        },
        { rootMargin: CONFIG.LAZY_LOAD.rootMargin },
    );

    // Observe all lazy elements
    lazyBGs.forEach((el) => observer.observe(el));
    lazySVGs.forEach((el) => observer.observe(el));
}

// Slide up animation

function initSlideUpAnimation() {
    const elements = document.querySelectorAll(".slide-up");
    if (!elements.length) return;

    elements.forEach((element) => {
        gsap.from(element, {
            opacity: 0,
            y: 120,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
            },
        });
    });
}

// Accordion
function faq() {
    const items = document.querySelectorAll(".accordion-item__button");
    console.log(items);

    function toggleAction(e) {
        const state = this.getAttribute("aria-expanded");
        if (state == "false") {
            this.setAttribute("aria-expanded", "true");
        } else {
            this.setAttribute("aria-expanded", "false");
        }
    }

    items.forEach((item) => {
        item.addEventListener("click", toggleAction);
    });
}

//Service Slider
function initServiceSlider() {
    const splideEl = document.querySelector(".services .splide");
    if (!splideEl) return;

    const splide = new Splide(splideEl, {
        ...CONFIG.SPLIDE,
        breakpoints: {
            [CONFIG.BREAKPOINTS.DESKTOP]: { perPage: 2 },
            640: { perPage: 1 },
        },
    }).mount();

    const prevBtns = document.querySelectorAll(".slider-controls__btn--prev");
    const nextBtns = document.querySelectorAll(".slider-controls__btn--next");

    prevBtns.forEach((btn) =>
        btn.addEventListener("click", () => splide.go("<")),
    );
    nextBtns.forEach((btn) =>
        btn.addEventListener("click", () => splide.go(">")),
    );
    console.log(splideEl);
}

//Case study Slider
function initialCaseSlider() {
    const splideEl = document.querySelector(".case-study .splide");
    if (!splideEl) return;

    const splide = new Splide(splideEl, {
        ...CONFIG.SPLIDE_CASE,
    }).mount();

    const prevBtns = document.querySelectorAll(".slider-controls__btn--prev");
    const nextBtns = document.querySelectorAll(".slider-controls__btn--next");

    prevBtns.forEach((btn) =>
        btn.addEventListener("click", () => splide.go("<")),
    );
    nextBtns.forEach((btn) =>
        btn.addEventListener("click", () => splide.go(">")),
    );
    console.log(splideEl);
}

//Testimonial Slider
function initTestimonialSlider() {
    const splideEl = document.querySelector(".testimonials .splide");
    if (!splideEl) return;

    const splide = new Splide(splideEl, {
        ...CONFIG.SPLIDE_TESTIMONIALS,
        breakpoints: {
            [CONFIG.BREAKPOINTS.MOBILE]: { perPage: 1 },
            [CONFIG.BREAKPOINTS.TABLET]: { perPage: 2 },
        },
    }).mount();

    const prevBtns = document.querySelectorAll(".slider-controls__btn--prev");
    const nextBtns = document.querySelectorAll(".slider-controls__btn--next");

    prevBtns.forEach((btn) =>
        btn.addEventListener("click", () => splide.go("<")),
    );
    nextBtns.forEach((btn) =>
        btn.addEventListener("click", () => splide.go(">")),
    );
    console.log(splideEl);
}

// Main initialization
function init() {
    let mm = gsap.matchMedia();

    // Universal initializations
    initSmoothScroll();
    initLazyLoad(); // Now handles both BG images and SVGs
    faq();
    initTestimonialSlider();
    initServiceSlider();
    initialCaseSlider();

    // Responsive logic using matchMedia
    mm.add(
        {
            // Conditions
            isDesktop: `(min-width: ${CONFIG.BREAKPOINTS.MOBILE}px)`,
            isTablet: `(min-width: ${CONFIG.BREAKPOINTS.TABLET}px)`,
            isMobile: `(max-width: ${CONFIG.BREAKPOINTS.TABLET - 1}px)`,
        },
        (context) => {
            let { isDesktop, isTablet, isMobile } = context.conditions;

            if (isDesktop) {
                initButtonEffect();
                initSlideUpAnimation();
            }

            if (isTablet) {
                console.log("Nothing found");
            }

            if (isMobile) {
                initMobileMenu();
            }

            return () => {};
        },
    );

    window.addEventListener(
        "resize",
        throttle(() => {
            ScrollTrigger.refresh();
        }, 300),
    );
}

document.addEventListener("DOMContentLoaded", init);

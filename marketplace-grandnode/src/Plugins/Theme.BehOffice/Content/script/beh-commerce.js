(() => {
    "use strict";

    const storageKey = "behRecentlyViewed";
    const productPage = document.querySelector(".product-details-page[data-beh-product]");
    const fallbackImage = "/assets/images/no-image.png";

    const readHistory = () => {
        try {
            const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const writeHistory = (items) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(items.slice(0, 6)));
        } catch {
            // Storage can be unavailable in strict privacy modes.
        }
    };

    const rememberProduct = () => {
        if (!productPage) return;
        const productPath = `${window.location.pathname}${window.location.search || ""}`;
        const item = {
            name: (productPage.dataset.behName || "Producto BEH").trim(),
            url: productPath,
            image: (productPage.dataset.behImage || "").trim() || fallbackImage,
            price: productPage.dataset.behPrice
        };
        if (!item.url) return;
        const items = readHistory().filter((entry) => entry.url !== item.url);
        writeHistory([item, ...items]);
    };

    const renderHistory = () => {
        const container = document.querySelector("[data-beh-recently-viewed]");
        if (!container) return;
        const currentPath = window.location.pathname;
        const items = readHistory()
            .filter((item) => item && typeof item.url === "string" && item.url)
            .filter((item) => item.url !== currentPath)
            .slice(0, 4);
        if (!items.length) {
            container.closest(".beh-recently-viewed")?.remove();
            return;
        }
        const fragment = document.createDocumentFragment();
        items.forEach((item) => {
            const link = document.createElement("a");
            const image = document.createElement("img");
            const copy = document.createElement("span");
            const name = document.createElement("strong");
            const price = document.createElement("small");

            link.className = "beh-recent-product";
            link.href = item.url;
            image.src = item.image || fallbackImage;
            image.alt = item.name || "Producto BEH";
            image.loading = "lazy";
            image.decoding = "async";
            name.textContent = item.name;
            price.textContent = item.price || "Ver producto";
            copy.append(name, price);
            link.append(image, copy);
            fragment.append(link);
        });
        container.replaceChildren(fragment);
    };

    const setupStickyPurchase = () => {
        const sticky = document.querySelector("[data-beh-sticky-purchase]");
        const source = document.querySelector(".product-add-to-cart .add-to-cart-button");
        if (!sticky || !source) return;

        sticky.querySelector("button")?.addEventListener("click", () => source.click());
        const observer = new IntersectionObserver(([entry]) => {
            sticky.classList.toggle("is-visible", !entry.isIntersecting);
        }, { threshold: 0.15 });
        observer.observe(source);
    };

    const setupReveal = () => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        document.body.classList.add("beh-motion-ready");
        const selector = "[data-beh-reveal], .beh-buying-guide li, .beh-space, .beh-product-card, .beh-category-index a, .beh-catalog-assist, .product-box";
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-revealed");
                entry.target.classList.remove("beh-reveal-pending");
                observer.unobserve(entry.target);
            });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
        const watch = (element) => {
            if (!element || element.dataset.behRevealBound === "true") return;
            element.dataset.behRevealBound = "true";
            element.classList.add("beh-reveal-pending");
            observer.observe(element);
        };
        document.querySelectorAll(selector).forEach(watch);
        new MutationObserver((mutations) => {
            mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;
                if (node.matches?.(selector)) watch(node);
                node.querySelectorAll?.(selector).forEach(watch);
            }));
        }).observe(document.body, { childList: true, subtree: true });
    };

    const setupBlueprintHero = () => {
        const canvas = document.querySelector("[data-beh-blueprint]");
        if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const context = canvas.getContext("2d", { alpha: true });
        if (!context) return;

        let width = 0;
        let height = 0;
        let frame = 0;
        let animationId = 0;
        const points = Array.from({ length: 16 }, (_, index) => ({
            x: (index % 4) / 3,
            y: Math.floor(index / 4) / 3,
            drift: 0.2 + (index % 5) * 0.04
        }));

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const ratio = Math.min(window.devicePixelRatio || 1, 1.7);
            width = Math.max(1, Math.floor(rect.width));
            height = Math.max(1, Math.floor(rect.height));
            canvas.width = Math.floor(width * ratio);
            canvas.height = Math.floor(height * ratio);
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        };

        const drawGrid = () => {
            context.clearRect(0, 0, width, height);
            context.lineWidth = 1;
            context.strokeStyle = "rgba(255,255,255,.085)";
            for (let x = 0; x <= width; x += 56) {
                context.beginPath();
                context.moveTo(x, 0);
                context.lineTo(x, height);
                context.stroke();
            }
            for (let y = 0; y <= height; y += 56) {
                context.beginPath();
                context.moveTo(0, y);
                context.lineTo(width, y);
                context.stroke();
            }
        };

        const drawBlueprint = () => {
            frame += 0.008;
            drawGrid();

            const left = width * 0.52;
            const top = height * 0.16;
            const areaWidth = width * 0.38;
            const areaHeight = height * 0.58;
            const progress = (Math.sin(frame) + 1) / 2;

            context.lineCap = "round";
            points.forEach((point, index) => {
                const x = left + point.x * areaWidth + Math.sin(frame * 2 + index) * 8 * point.drift;
                const y = top + point.y * areaHeight + Math.cos(frame * 1.7 + index) * 8 * point.drift;
                context.fillStyle = index % 3 === 0 ? "rgba(143,184,63,.75)" : "rgba(24,168,194,.7)";
                context.beginPath();
                context.arc(x, y, 2.4, 0, Math.PI * 2);
                context.fill();

                if (index % 4 !== 3) {
                    const next = points[index + 1];
                    const nx = left + next.x * areaWidth;
                    const ny = top + next.y * areaHeight;
                    context.strokeStyle = "rgba(24,168,194,.26)";
                    context.lineWidth = 1.2;
                    context.beginPath();
                    context.moveTo(x, y);
                    context.lineTo(x + (nx - x) * progress, y + (ny - y) * progress);
                    context.stroke();
                }
                if (index < 12) {
                    const next = points[index + 4];
                    const nx = left + next.x * areaWidth;
                    const ny = top + next.y * areaHeight;
                    context.strokeStyle = "rgba(255,255,255,.18)";
                    context.lineWidth = 1;
                    context.beginPath();
                    context.moveTo(x, y);
                    context.lineTo(x + (nx - x) * (1 - progress * .55), y + (ny - y) * (1 - progress * .55));
                    context.stroke();
                }
            });

            context.strokeStyle = "rgba(168,93,34,.68)";
            context.lineWidth = 2;
            context.strokeRect(left + 18, top + 16, areaWidth - 36, areaHeight - 32);
            animationId = window.requestAnimationFrame(drawBlueprint);
        };

        resize();
        drawBlueprint();
        window.addEventListener("resize", resize, { passive: true });
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                window.cancelAnimationFrame(animationId);
            } else {
                drawBlueprint();
            }
        });
    };

    const fixProductNavigation = () => {
        document.querySelectorAll("a").forEach((link) => {
            const text = (link.textContent || "").trim().toLowerCase();
            const href = link.getAttribute("href") || "";
            const path = href.startsWith("http") ? new URL(href, window.location.origin).pathname : href;
            if ((text === "productos" || text === "products" || text === "buscar productos") && path.toLowerCase().includes("search")) {
                link.setAttribute("href", "/sillas-de-oficina");
                if (text !== "productos") link.textContent = "Productos";
            }
        });
    };

    const removeLegacyCatalogLinks = () => {
        const legacyPaths = new Set([
            "/computers",
            "/tablets",
            "/notebooks",
            "/smartwatches",
            "/electronics",
            "/display",
            "/smartphones",
            "/others",
            "/sport",
            "/shoes",
            "/apparel",
            "/balls",
            "/digital-downloads",
            "/lego",
            "/gift-vouchers"
        ]);

        document.querySelectorAll("#mainMenu a, .Menu a").forEach((link) => {
            const path = new URL(link.href, window.location.origin).pathname.toLowerCase();
            if (!legacyPaths.has(path)) return;
            const item = link.closest("li");
            if (item) item.remove();
        });
    };

    const setupSpaceTilt = () => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (window.matchMedia("(hover: none)").matches) return;
        const maxTilt = 7;
        document.querySelectorAll(".beh-space").forEach((card) => {
            card.addEventListener("mousemove", (event) => {
                const rect = card.getBoundingClientRect();
                const px = (event.clientX - rect.left) / rect.width;
                const py = (event.clientY - rect.top) / rect.height;
                card.style.setProperty("--beh-tilt-x", ((px - 0.5) * maxTilt * 2).toFixed(2) + "deg");
                card.style.setProperty("--beh-tilt-y", ((0.5 - py) * maxTilt * 2).toFixed(2) + "deg");
            });
            card.addEventListener("mouseleave", () => {
                card.style.setProperty("--beh-tilt-x", "0deg");
                card.style.setProperty("--beh-tilt-y", "0deg");
            });
        });
    };

    const setupHeroParallax = () => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const hero = document.querySelector(".beh-market-hero");
        const media = document.querySelector(".beh-market-hero__media");
        if (!hero || !media) return;
        let ticking = false;
        const update = () => {
            ticking = false;
            const rect = hero.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
            const progress = -rect.top / (rect.height || 1);
            const offset = Math.max(-1, Math.min(1, progress)) * 70;
            media.style.setProperty("--beh-parallax-y", offset.toFixed(1) + "px");
        };
        window.addEventListener("scroll", () => {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
        update();
    };

    removeLegacyCatalogLinks();
    fixProductNavigation();
    rememberProduct();
    renderHistory();
    setupStickyPurchase();
    setupReveal();
    setupBlueprintHero();
    setupSpaceTilt();
    setupHeroParallax();
})();

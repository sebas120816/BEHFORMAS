(() => {
  const localStoreUrl = "http://127.0.0.1:5080/";
  const productionStoreUrl = "https://tienda.behformas.com/";
  const isLocalHost = ["localhost", "127.0.0.1", ""].includes(window.location.hostname);

  document.querySelectorAll("[data-store-link]").forEach((link) => {
    link.href = isLocalHost ? localStoreUrl : productionStoreUrl;
  });

  document.body.classList.add("is-loading");

  const preloader = document.querySelector("[data-preloader]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const links = document.querySelector("[data-nav-links]");
  const scrollProgress = document.querySelector("[data-scroll-progress]");
  const cursor = document.querySelector("[data-cursor]");
  const backTop = document.querySelector("[data-back-top]");
  const heroWord = document.querySelector("[data-hero-word]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const performanceToggle = document.querySelector("[data-performance-toggle]");
  const processLine = document.querySelector("[data-process-line]");
  const navIndicator = document.querySelector("[data-nav-indicator]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const getSavedPerformanceMode = () => {
    try {
      return window.localStorage ? localStorage.getItem("beh-performance-mode") : "";
    } catch (error) {
      return "";
    }
  };
  const setSavedPerformanceMode = (value) => {
    try {
      if (window.localStorage) localStorage.setItem("beh-performance-mode", value);
    } catch (error) {
      // Storage can be unavailable in some private browsing contexts.
    }
  };

  const prefersEfficientMode = window.matchMedia("(max-width: 760px)").matches
    || Boolean(navigator.connection && navigator.connection.saveData)
    || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  if (getSavedPerformanceMode() === "on" || (getSavedPerformanceMode() === "" && prefersEfficientMode)) {
    document.body.classList.add("performance-mode");
  }

  let parallaxContext = null;
  let parallaxRefreshTimer = 0;

  const destroyGsapParallax = () => {
    if (parallaxContext) {
      parallaxContext.revert();
      parallaxContext = null;
    }
    document.querySelectorAll(".gsap-parallax-media").forEach((image) => {
      image.classList.remove("gsap-parallax-media");
      image.style.removeProperty("will-change");
    });
    document.body.classList.remove("gsap-parallax-ready");
  };

  const setupGsapParallax = () => {
    destroyGsapParallax();
    if (
      reduceMotion ||
      document.body.classList.contains("performance-mode") ||
      !window.gsap ||
      !window.ScrollTrigger
    ) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const compactSource = (image) => decodeURIComponent(image.currentSrc || image.src || "").includes("/beh/fotos BEH /");
    const cinematicImages = gsap.utils.toArray([
      "[data-system-image]",
      ".service-card img",
      ".office-gallery img",
      ".project-card img",
      ".cinematic-rail img",
      ".beh-showcase-card img",
      ".motion-card img",
      ".material-photo img",
      ".exhibits-media img",
      ".market-card img"
    ].join(",")).filter((image) => !compactSource(image));
    const archiveImages = gsap.utils.toArray(".beh-archive-grid img");
    const mobile = window.matchMedia("(max-width: 760px)").matches;

    parallaxContext = gsap.context(() => {
      cinematicImages.forEach((image, index) => {
        image.classList.add("gsap-parallax-media");
        const direction = index % 2 === 0 ? 1 : -1;
        gsap.fromTo(image, {
          scale: mobile ? 1.025 : 1.015,
          yPercent: mobile ? -1.5 * direction : -3.5 * direction
        }, {
          scale: mobile ? 1.075 : 1.13,
          yPercent: mobile ? 1.5 * direction : 3.5 * direction,
          ease: "none",
          scrollTrigger: {
            trigger: image,
            start: "top 96%",
            end: "bottom 4%",
            scrub: mobile ? 0.65 : 1.15,
            invalidateOnRefresh: true
          }
        });
      });

      archiveImages.forEach((image) => image.classList.add("resolution-compact"));
      ScrollTrigger.batch(archiveImages, {
        start: "top 94%",
        once: true,
        batchMax: mobile ? 4 : 8,
        interval: 0.08,
        onEnter: (batch) => gsap.fromTo(batch, {
          scale: 1,
          opacity: 0.72
        }, {
          scale: 1,
          opacity: 0.9,
          duration: 0.9,
          stagger: 0.055,
          ease: "power3.out",
          clearProps: "opacity"
        })
      });
    });

    document.body.classList.add("gsap-parallax-ready");
    window.setTimeout(() => ScrollTrigger.refresh(), 100);
  };

  window.addEventListener("load", setupGsapParallax, { once: true });
  document.querySelectorAll("img[loading='lazy']").forEach((image) => {
    image.addEventListener("load", () => {
      if (!window.ScrollTrigger || document.body.classList.contains("performance-mode")) return;
      window.clearTimeout(parallaxRefreshTimer);
      parallaxRefreshTimer = window.setTimeout(() => window.ScrollTrigger.refresh(), 120);
    }, { once: true });
  });

  const hidePreloader = () => {
    if (!preloader) return;
    preloader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
  };

  if (document.body.classList.contains("focused-home")) hidePreloader();

  window.addEventListener("load", () => {
    window.setTimeout(hidePreloader, 80);
  });

  window.setTimeout(hidePreloader, 900);

  const updateScrollProgress = () => {
    if (!scrollProgress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
    if (backTop) backTop.classList.toggle("is-visible", window.scrollY > 720);

    if (processLine) {
      const rect = processLine.getBoundingClientRect();
      const windowProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const lineProgress = Math.min(Math.max(windowProgress, 0), 1) * 100;
      processLine.style.setProperty("--line-progress", `${lineProgress}%`);
    }
  };

  let scrollFrame = 0;
  const requestScrollProgress = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      updateScrollProgress();
    });
  };

  window.addEventListener("scroll", requestScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();

  const setupBlueprintCanvas = (canvas, variant) => {
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let raf = 0;
    let last = 0;
    let isVisible = false;

    const palette = variant === "hero"
      ? { line: "rgba(240, 200, 142, 0.28)", node: "rgba(240, 200, 142, 0.82)", accent: "rgba(94, 167, 212, 0.42)" }
      : { line: "rgba(94, 167, 212, 0.34)", node: "rgba(240, 200, 142, 0.92)", accent: "rgba(255, 255, 255, 0.28)" };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const isPerformance = document.body.classList.contains("performance-mode");
      const count = variant === "hero"
        ? Math.min(isPerformance ? 36 : 76, Math.max(22, Math.round(width / (isPerformance ? 34 : 18))))
        : isPerformance ? 14 : 34;
      particles = Array.from({ length: count }, (_, index) => ({
        x: (index * 97) % width,
        y: (index * 53) % height,
        speed: 0.18 + ((index % 7) * 0.045),
        size: 0.8 + ((index % 5) * 0.28),
        phase: index * 0.34
      }));
    };

    const drawGrid = (time) => {
      const grid = variant === "hero" ? 84 : 32;
      ctx.lineWidth = 1;
      ctx.strokeStyle = palette.line;
      ctx.beginPath();
      const drift = (time * 0.012) % grid;
      for (let x = -grid + drift; x < width + grid; x += grid) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x + (variant === "hero" ? 38 : 0), height);
      }
      for (let y = -grid + drift * 0.6; y < height + grid; y += grid) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y + (variant === "hero" ? 18 : 0));
      }
      ctx.stroke();
    };

    const drawBlueprintForm = (time) => {
      if (variant === "hero") {
        const cycle = (time * 0.00018) % 1;
        const progress = cycle < 0.78 ? cycle / 0.78 : 1;
        const ease = 1 - Math.pow(1 - progress, 3);
        const originX = width * 0.58;
        const originY = height * 0.2;
        const moduleW = Math.min(width * 0.32, 520);
        const moduleH = Math.min(height * 0.36, 330);
        const shelfGap = moduleH / 4;
        const revealX = originX + moduleW * ease;

        const drawProgressLine = (x1, y1, x2, y2, localProgress = ease) => {
          const x = x1 + (x2 - x1) * localProgress;
          const y = y1 + (y2 - y1) * localProgress;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x, y);
          ctx.stroke();
        };

        ctx.save();
        ctx.lineWidth = 1.35;
        ctx.strokeStyle = "rgba(240, 200, 142, 0.72)";
        ctx.shadowColor = "rgba(240, 200, 142, 0.22)";
        ctx.shadowBlur = 16;

        drawProgressLine(originX, originY, originX + moduleW, originY);
        drawProgressLine(originX, originY, originX, originY + moduleH);
        drawProgressLine(originX + moduleW, originY, originX + moduleW, originY + moduleH);
        drawProgressLine(originX, originY + moduleH, originX + moduleW, originY + moduleH);

        ctx.strokeStyle = "rgba(94, 167, 212, 0.62)";
        for (let i = 1; i < 4; i += 1) {
          const y = originY + shelfGap * i;
          drawProgressLine(originX, y, originX + moduleW, y, Math.max(0, Math.min(1, ease * 1.2 - i * 0.08)));
        }

        for (let i = 1; i < 5; i += 1) {
          const x = originX + (moduleW / 5) * i;
          drawProgressLine(x, originY, x, originY + moduleH, Math.max(0, Math.min(1, ease * 1.22 - i * 0.07)));
        }

        ctx.setLineDash([8, 10]);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
        drawProgressLine(originX - 42, originY - 28, originX + moduleW + 42, originY - 28, ease);
        drawProgressLine(originX + moduleW + 34, originY - 20, originX + moduleW + 34, originY + moduleH + 26, ease);
        ctx.setLineDash([]);

        ctx.fillStyle = "rgba(94, 167, 212, 0.82)";
        ctx.font = "700 11px Instrument Sans, sans-serif";
        ctx.letterSpacing = "2px";
        if (ease > 0.72) {
          ctx.fillText("PLANO EN CONSTRUCCION", originX, originY - 44);
          ctx.fillText("160 CM", originX + moduleW * 0.42, originY - 34);
          ctx.save();
          ctx.translate(originX + moduleW + 48, originY + moduleH * 0.46);
          ctx.rotate(Math.PI / 2);
          ctx.fillText("55 CM", 0, 0);
          ctx.restore();
        }

        ctx.globalAlpha = 0.22 + Math.sin(time * 0.003) * 0.08;
        ctx.fillStyle = "rgba(240, 200, 142, 0.76)";
        ctx.fillRect(revealX - 2, originY - 26, 2, moduleH + 52);
        ctx.globalAlpha = 1;

        ctx.strokeStyle = "rgba(240, 200, 142, 0.38)";
        ctx.lineWidth = 1;
        const floorY = height * 0.72;
        drawProgressLine(width * 0.08, floorY, width * 0.92, floorY, ease);
        drawProgressLine(width * 0.18, floorY + 56, width * 0.82, floorY + 56, Math.max(0, ease - 0.12));
        drawProgressLine(width * 0.26, floorY - 44, width * 0.26, floorY + 82, Math.max(0, ease - 0.22));
        drawProgressLine(width * 0.74, floorY - 44, width * 0.74, floorY + 82, Math.max(0, ease - 0.28));

        ctx.restore();
        return;
      }

      if (variant !== "build") return;
      const cx = width * 0.5;
      const cy = height * 0.42;
      const w = width * 0.58;
      const h = height * 0.34;
      const pulse = Math.sin(time * 0.002) * 8;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = "rgba(240, 200, 142, 0.72)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-w / 2 - pulse * 0.2, -h / 2, w + pulse * 0.4, h);
      ctx.strokeStyle = "rgba(94, 167, 212, 0.52)";
      for (let i = 1; i < 5; i += 1) {
        const x = -w / 2 + (w / 5) * i;
        ctx.beginPath();
        ctx.moveTo(x, -h / 2);
        ctx.lineTo(x, h / 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(-w / 2, 0);
      ctx.lineTo(w / 2, 0);
      ctx.stroke();
      ctx.restore();
    };

    const drawParticles = (time, delta) => {
      particles.forEach((particle, index) => {
        particle.x += particle.speed * delta * 0.06;
        particle.y += Math.sin(time * 0.001 + particle.phase) * 0.06 * delta;
        if (particle.x > width + 20) particle.x = -20;

        ctx.fillStyle = index % 3 === 0 ? palette.node : palette.accent;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = palette.line;
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);
          const limit = variant === "hero" ? 128 : 92;
          if (distance < limit) {
            ctx.globalAlpha = (1 - distance / limit) * 0.42;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const render = (time) => {
      if (!isVisible || document.hidden || document.body.classList.contains("performance-mode")) {
        raf = 0;
        return;
      }
      const delta = last ? Math.min(time - last, 42) : 16;
      last = time;
      ctx.clearRect(0, 0, width, height);
      drawGrid(time);
      drawBlueprintForm(time);
      if (!document.body.classList.contains("performance-mode")) drawParticles(time, delta);
      raf = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (raf || !isVisible || document.hidden || document.body.classList.contains("performance-mode")) return;
      last = 0;
      raf = window.requestAnimationFrame(render);
    };

    const stop = () => {
      if (!raf) return;
      window.cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const canvasObserver = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) start();
          else stop();
        });
      }, { threshold: 0.02 })
      : null;

    if (canvasObserver) canvasObserver.observe(canvas);
    else {
      isVisible = true;
      start();
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    document.addEventListener("beh-performance-change", () => {
      if (document.body.classList.contains("performance-mode")) stop();
      else start();
    });
  };

  setupBlueprintCanvas(document.querySelector("[data-hero-canvas]"), "hero");
  setupBlueprintCanvas(document.querySelector("[data-build-canvas]"), "build");

  const setupSectionBlueprints = () => {
    if (reduceMotion) return;

    const targets = [
      { selector: "#servicios", tone: "light", density: 26 },
      { selector: "#sistema-beh", tone: "dark", density: 30 },
      { selector: "#acabados", tone: "light", density: 24 },
      { selector: "#proyectos", tone: "dark", density: 34 },
      { selector: "#market-route", tone: "light", density: 28 },
      { selector: "#cotizador", tone: "light", density: 24 }
    ];

    targets.forEach((config) => {
      const section = document.querySelector(config.selector);
      if (!section) return;

      section.classList.add("has-animated-blueprint");
      if (config.selector === "#servicios") section.classList.add("services-blueprint");

      const canvas = document.createElement("canvas");
      canvas.className = "section-canvas";
      canvas.setAttribute("aria-hidden", "true");
      section.prepend(canvas);

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      let width = 0;
      let height = 0;
      let dpr = 1;
      let raf = 0;
      let nodes = [];
      let isVisible = false;

      const palette = config.tone === "dark"
        ? {
          grid: "rgba(255, 255, 255, 0.055)",
          line: "rgba(94, 167, 212, 0.26)",
          build: "rgba(240, 200, 142, 0.48)",
          node: "rgba(240, 200, 142, 0.78)"
        }
        : {
          grid: "rgba(40, 33, 27, 0.055)",
          line: "rgba(94, 167, 212, 0.22)",
          build: "rgba(139, 84, 44, 0.28)",
          node: "rgba(139, 84, 44, 0.52)"
        };

      const resize = () => {
        const rect = section.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        nodes = Array.from({ length: config.density }, (_, index) => ({
          x: ((index * 137) % Math.max(width, 1)) + Math.sin(index) * 20,
          y: ((index * 83) % Math.max(height, 1)) + Math.cos(index) * 20,
          phase: index * 0.48,
          speed: 0.11 + (index % 5) * 0.025
        }));
      };

      const draw = (time) => {
        if (document.body.classList.contains("performance-mode")) {
          raf = 0;
          return;
        }

        ctx.clearRect(0, 0, width, height);

        const grid = config.tone === "dark" ? 58 : 64;
        const drift = (time * 0.01) % grid;
        ctx.strokeStyle = palette.grid;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = -grid + drift; x < width + grid; x += grid) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = -grid + drift * 0.7; y < height + grid; y += grid) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();

        const progress = ((time * 0.00012) % 1);
        const eased = 1 - Math.pow(1 - Math.min(progress / 0.72, 1), 3);
        const moduleCount = config.selector === "#proyectos" ? 4 : 3;
        ctx.strokeStyle = palette.build;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([]);

        for (let i = 0; i < moduleCount; i += 1) {
          const baseX = width * (0.12 + i * 0.22);
          const baseY = height * (0.16 + (i % 2) * 0.18);
          const w = Math.min(width * 0.18, 230);
          const h = Math.min(height * 0.22, 190);
          const local = Math.max(0, Math.min(1, eased * 1.35 - i * 0.18));
          ctx.globalAlpha = 0.15 + local * 0.75;
          ctx.strokeRect(baseX, baseY, w * local, h);
          ctx.beginPath();
          ctx.moveTo(baseX, baseY + h * 0.5);
          ctx.lineTo(baseX + w * local, baseY + h * 0.5);
          ctx.moveTo(baseX + w * 0.5 * local, baseY);
          ctx.lineTo(baseX + w * 0.5 * local, baseY + h);
          ctx.stroke();
        }

        ctx.globalAlpha = 1;
        ctx.strokeStyle = palette.line;
        ctx.lineWidth = 1;
        nodes.forEach((node, index) => {
          node.x += node.speed;
          node.y += Math.sin(time * 0.001 + node.phase) * 0.08;
          if (node.x > width + 30) node.x = -30;

          ctx.fillStyle = palette.node;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 1.25 + (index % 3) * 0.35, 0, Math.PI * 2);
          ctx.fill();

          const next = nodes[(index + 3) % nodes.length];
          const distance = Math.hypot(node.x - next.x, node.y - next.y);
          if (distance < 190) {
            ctx.globalAlpha = 0.18 * (1 - distance / 190);
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(next.x, next.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });

        const scanX = (width + 160) * progress - 80;
        ctx.globalAlpha = 0.42;
        ctx.fillStyle = config.tone === "dark" ? "rgba(94, 167, 212, 0.22)" : "rgba(139, 84, 44, 0.12)";
        ctx.fillRect(scanX, 0, 2, height);
        ctx.globalAlpha = 1;

        raf = window.requestAnimationFrame(draw);
      };

      resize();
      window.addEventListener("resize", resize, { passive: true });

      const start = () => {
        if (!isVisible || raf || document.body.classList.contains("performance-mode")) return;
        raf = window.requestAnimationFrame(draw);
      };

      const stop = () => {
        if (!raf) return;
        window.cancelAnimationFrame(raf);
        raf = 0;
      };

      document.addEventListener("beh-performance-change", () => {
        if (document.body.classList.contains("performance-mode")) stop();
        else start();
      });

      const sectionObserver = "IntersectionObserver" in window
        ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (isVisible) start();
            else stop();
          });
        }, { threshold: 0.04 })
        : null;

      if (sectionObserver) sectionObserver.observe(section);
      else {
        isVisible = true;
        start();
      }
    });
  };

  setupSectionBlueprints();

  document.body.classList.add("motion-ready");

  const revealItems = document.querySelectorAll(
    ".trust-strip, .metric, .impact-cell, .production-board, .production-feed article, .service-card, .project-card, .capabilities-grid article, .system-frame, .blueprint-motion, .motion-card, .build-timeline article, .market-route-panel, .market-route-steps article, .compare-card, .compare-copy, .process-step, .studio-step, .studio-result, .material-photo, .material-item, .contact-card, .market-toolbar, .market-card, .market-process article"
  );

  const animateCount = (item) => {
    if (item.dataset.counted === "true") return;
    const target = Number(item.dataset.count);
    if (!Number.isFinite(target)) return;

    item.dataset.counted = "true";

    if (reduceMotion) {
      item.textContent = `${String(target).padStart(2, "0")}${item.dataset.countSuffix || ""}`;
      return;
    }

    const duration = 850;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      item.textContent = `${String(Math.max(value, 1)).padStart(2, "0")}${item.dataset.countSuffix || ""}`;

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            entry.target.querySelectorAll("[data-count]").forEach(animateCount);
            if (entry.target.matches("[data-count]")) animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.04, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    document.querySelectorAll("[data-count]").forEach(animateCount);
  }

  if (toggle && links) {
    const closeNavigation = (returnFocus = false) => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (returnFocus) toggle.focus();
    };

    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeNavigation();
      });
    });

    document.addEventListener("click", (event) => {
      if (!links.classList.contains("is-open") || links.contains(event.target) || toggle.contains(event.target)) return;
      closeNavigation();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && links.classList.contains("is-open")) closeNavigation(true);
    });
  }

  if (backTop) {
    backTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  const archiveToggle = document.querySelector("[data-archive-toggle]");
  const archiveGrid = document.querySelector(".beh-archive-grid");

  if (archiveToggle && archiveGrid) {
    archiveToggle.addEventListener("click", () => {
      const isExpanded = archiveGrid.classList.toggle("is-expanded");
      archiveToggle.setAttribute("aria-expanded", String(isExpanded));
      archiveToggle.textContent = isExpanded ? "Mostrar selección" : "Ver archivo completo";
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isNight = document.body.classList.toggle("theme-night");
      themeToggle.textContent = isNight ? "Modo claro" : "Modo oscuro";
    });
  }

  if (performanceToggle) {
    if (document.body.classList.contains("performance-mode")) {
      performanceToggle.textContent = "Modo visual";
    }

    performanceToggle.addEventListener("click", () => {
      const isPerformance = document.body.classList.toggle("performance-mode");
      performanceToggle.textContent = isPerformance ? "Modo visual" : "Modo fluido";
      setSavedPerformanceMode(isPerformance ? "on" : "off");
      document.dispatchEvent(new CustomEvent("beh-performance-change"));
      if (isPerformance) destroyGsapParallax();
      else window.setTimeout(setupGsapParallax, 80);
    });
  }

  const marketCatalog = document.querySelector("[data-market-catalog]");
  const marketFilters = [...document.querySelectorAll("[data-market-filter]")];
  const marketSearch = document.querySelector("[data-market-search]");
  const marketJumps = [...document.querySelectorAll("[data-market-jump]")];

  if (marketCatalog) {
    const marketCards = [...marketCatalog.querySelectorAll("[data-market-category]")];
    const marketGrid = marketCatalog.querySelector(".market-grid");
    const marketEmpty = document.createElement("div");
    let activeMarketFilter = "all";

    marketEmpty.className = "market-empty";
    marketEmpty.setAttribute("role", "status");
    marketEmpty.setAttribute("aria-live", "polite");
    marketEmpty.innerHTML = "<strong>No encontramos coincidencias.</strong><span>Prueba otra categoría o escríbenos para cotizar una solución especial.</span>";
    marketEmpty.hidden = true;
    if (marketGrid) marketGrid.after(marketEmpty);

    const normalizeMarketText = (value) => value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

    const updateMarketCatalog = () => {
      const query = normalizeMarketText(marketSearch ? marketSearch.value : "");
      let visibleCards = 0;

      marketCards.forEach((card) => {
        const categoryMatches = activeMarketFilter === "all" || card.dataset.marketCategory === activeMarketFilter;
        const textMatches = !query || normalizeMarketText(card.textContent || "").includes(query);
        const isVisible = categoryMatches && textMatches;

        card.classList.toggle("is-hidden", !isVisible);
        card.setAttribute("aria-hidden", String(!isVisible));
        if (isVisible) visibleCards += 1;
      });

      marketEmpty.hidden = visibleCards > 0;
    };

    const selectMarketFilter = (filter) => {
      activeMarketFilter = filter;
      marketFilters.forEach((button) => {
        const isActive = button.dataset.marketFilter === filter;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
      updateMarketCatalog();
    };

    marketFilters.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
      button.addEventListener("click", () => selectMarketFilter(button.dataset.marketFilter || "all"));
    });

    if (marketSearch) marketSearch.addEventListener("input", updateMarketCatalog);

    marketJumps.forEach((jump) => {
      jump.addEventListener("click", () => {
        selectMarketFilter(jump.dataset.marketJump || "all");
      });
    });

    updateMarketCatalog();
  }

  const navAnchors = links ? [...links.querySelectorAll('a[href^="#"]')] : [];
  const navSections = navAnchors
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const updateNavIndicator = (activeLink) => {
    if (!links || !navIndicator || !activeLink || !links.contains(activeLink)) return;
    const navRect = links.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    links.style.setProperty("--nav-indicator-left", `${linkRect.left - navRect.left}px`);
    links.style.setProperty("--nav-indicator-width", `${linkRect.width}px`);
    links.style.setProperty("--nav-indicator-opacity", "1");
  };

  if (navAnchors.length && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navAnchors.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("is-active", isActive);
            if (isActive) updateNavIndicator(link);
          });
        });
      },
      { threshold: 0.28, rootMargin: "-18% 0px -58% 0px" }
    );

    navSections.forEach((section) => navObserver.observe(section));
  }

  window.addEventListener("resize", () => {
    const active = navAnchors.find((link) => link.classList.contains("is-active")) || navAnchors[0];
    updateNavIndicator(active);
  });

  if (heroWord && !reduceMotion) {
    const words = [
      "trabajan mejor",
      "se organizan mejor",
      "se reúnen mejor",
      "crecen con orden",
      "proyectan confianza"
    ];
    let index = 0;

    window.setInterval(() => {
      heroWord.classList.add("is-changing");
      window.setTimeout(() => {
        index = (index + 1) % words.length;
        heroWord.textContent = words[index];
        heroWord.classList.remove("is-changing");
      }, 540);
    }, 4200);
  }

  document.querySelectorAll("[data-compare]").forEach((compare) => {
    const range = compare.querySelector("[data-compare-range]");

    if (!range) return;

    const updateCompare = () => {
      compare.style.setProperty("--position", `${range.value}%`);
    };

    range.addEventListener("input", updateCompare);
    updateCompare();
  });

  if (!reduceMotion && finePointer && !document.body.classList.contains("performance-mode")) {
    if (cursor) {
      window.addEventListener("pointermove", (event) => {
        cursor.classList.add("is-visible");
        cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      });

      document.querySelectorAll("a, button, input, select, textarea, summary, .project-card img, .office-photo").forEach((item) => {
        item.addEventListener("pointerenter", () => cursor.classList.add("is-active"));
        item.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));
      });
    }

    document.querySelectorAll(".hero-premium, .system-frame").forEach((area) => {
      area.addEventListener("pointermove", (event) => {
        if (document.body.classList.contains("performance-mode")) return;
        const rect = area.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        area.style.setProperty("--mx", `${x}%`);
        area.style.setProperty("--my", `${y}%`);
      });
    });

    document.querySelectorAll(".service-card, .project-card, .capabilities-grid article, .production-feed article, .motion-card, .build-timeline article, .market-route-steps article, .studio-step, .estimate-grid article, .market-card, .market-process article").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        if (document.body.classList.contains("performance-mode")) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-4px)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });

    document.querySelectorAll(".btn").forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        if (document.body.classList.contains("performance-mode")) return;
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
      });

      button.addEventListener("pointerleave", () => {
        button.style.transform = "";
      });
    });
  }

  const lightboxImages = document.querySelectorAll(".project-card img, .motion-card img, .office-photo, .material-photo img, .cinematic-rail img, .beh-showcase-card img, .beh-archive-grid img, .market-card img");

  if (lightboxImages.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = '<button type="button" aria-label="Cerrar imagen">×</button><img alt="">';
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Vista ampliada del proyecto");
    document.body.appendChild(lightbox);

    const image = lightbox.querySelector("img");
    const close = lightbox.querySelector("button");
    let lightboxTrigger = null;

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      document.body.classList.remove("has-lightbox");
      if (lightboxTrigger) lightboxTrigger.focus();
    };

    lightboxImages.forEach((item) => {
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", `${item.alt || "Proyecto BEH"}. Abrir imagen ampliada`);

      const openLightbox = () => {
        if (!image) return;
        lightboxTrigger = item;
        image.src = item.currentSrc || item.src;
        image.alt = item.alt || "Proyecto BEH ampliado";
        lightbox.classList.add("is-open");
        document.body.classList.add("has-lightbox");
        if (close) close.focus();
      };

      item.addEventListener("click", openLightbox);
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox();
        }
      });
    });

    if (close) close.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "Tab" && lightbox.classList.contains("is-open") && close) {
        event.preventDefault();
        close.focus();
      }
    });
  }

  const statefulButtons = document.querySelectorAll("[data-finish-option], [data-material], [data-market-audience], [data-system-tab], .studio-options button");
  const syncPressedStates = () => {
    statefulButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.classList.contains("is-active") || button.classList.contains("is-selected")));
    });
  };

  syncPressedStates();
  statefulButtons.forEach((button) => button.addEventListener("click", syncPressedStates));

  const finish = document.querySelector("[data-finish]");

  if (finish) {
    const preview = finish.querySelector("[data-finish-preview]");
    const chip = finish.querySelector("[data-finish-chip]");
    const title = finish.querySelector("[data-finish-title]");
    const copy = finish.querySelector("[data-finish-copy]");
    const options = {
      wood: {
        className: "",
        chip: "Madera cálida",
        title: "Acabado cálido para espacios cercanos y elegantes.",
        copy: "Ideal para oficinas privadas, recepciones, salas de juntas y zonas directivas donde el mobiliario debe aportar calidez sin perder presencia profesional."
      },
      black: {
        className: "finish-black",
        chip: "Negro corporativo",
        title: "Presencia sobria para marcas, oficinas y puntos premium.",
        copy: "Funciona muy bien en recepciones, vitrinas y mobiliario comercial donde se busca contraste, elegancia y una imagen más ejecutiva."
      },
      white: {
        className: "finish-white",
        chip: "Blanco minimalista",
        title: "Limpieza visual para espacios modernos y luminosos.",
        copy: "Recomendado para oficinas compactas, muebles funcionales y proyectos donde el espacio debe sentirse amplio, ordenado y fácil de mantener."
      },
      eco: {
        className: "finish-eco",
        chip: "Natural eco",
        title: "Texturas naturales para proyectos con lenguaje responsable.",
        copy: "Pensado para oficinas, recepciones y espacios corporativos que quieren comunicar cercanía, producto colombiano y un criterio material más consciente."
      }
    };

    finish.querySelectorAll("[data-finish-option]").forEach((button) => {
      button.addEventListener("click", () => {
        const selected = options[button.dataset.finishOption] || options.wood;
        finish.querySelectorAll("[data-finish-option]").forEach((item) => item.classList.remove("is-selected"));
        button.classList.add("is-selected");
        if (preview) preview.className = `finish-preview ${selected.className}`.trim();
        if (chip) chip.textContent = selected.chip;
        if (title) title.textContent = selected.title;
        if (copy) copy.textContent = selected.copy;
      });
    });
  }

  const materialAdvisor = document.querySelector("[data-material-advisor]");

  if (materialAdvisor) {
    const result = materialAdvisor.querySelector("[data-material-result]");
    materialAdvisor.querySelectorAll("[data-material]").forEach((button) => {
      button.addEventListener("click", () => {
        materialAdvisor.querySelectorAll("[data-material]").forEach((item) => item.classList.remove("is-selected"));
        button.classList.add("is-selected");
        if (result) result.innerHTML = `<strong>${button.dataset.material}:</strong> ${button.dataset.use}`;
      });
    });
  }

  const captureRecord = async (type, payload) => {
    if (window.location.protocol === "file:") return null;
    try {
      const response = await fetch(new URL("beh_capture.php", window.location.href).href, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload })
      });
      return response.ok ? response.json() : null;
    } catch (error) {
      return null;
    }
  };

  const diagnosisForm = document.querySelector("[data-diagnosis-form]");

  if (diagnosisForm) {
    diagnosisForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(diagnosisForm);
      const message = [
        "Hola BEH, quiero enviar un diagnóstico rápido.",
        "",
        `Tipo de espacio: ${data.get("space")}`,
        `Necesidad: ${data.get("need")}`,
        `Información disponible: ${data.get("assets")}`
      ].join("\n");
      window.open(`https://wa.me/573103200976?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    });
  }

  const woodAi = document.querySelector("[data-wood-ai]");

  if (woodAi) {
    const prompt = woodAi.querySelector("[data-wood-prompt]");
    const generate = woodAi.querySelector("[data-wood-generate]");
    const example = woodAi.querySelector("[data-wood-example]");
    const model = woodAi.querySelector("[data-wood-model]");
    const renderSvg = woodAi.querySelector("[data-wood-render]");
    const rotate = woodAi.querySelector("[data-wood-rotate]");
    const historyWrap = woodAi.querySelector("[data-wood-history]");
    const title = woodAi.querySelector("[data-wood-title]");
    const dimensions = woodAi.querySelector("[data-wood-dimensions]");
    const material = woodAi.querySelector("[data-wood-material]");
    const modules = woodAi.querySelector("[data-wood-modules]");
    const price = woodAi.querySelector("[data-wood-price]");
    const pieces = woodAi.querySelector("[data-wood-pieces]");
    const materials = woodAi.querySelector("[data-wood-materials]");
    const layout = woodAi.querySelector("[data-wood-layout]");
    const costs = woodAi.querySelector("[data-wood-costs]");
    const alerts = woodAi.querySelector("[data-wood-alerts]");
    const description = woodAi.querySelector("[data-wood-description]");
    const suggestions = woodAi.querySelector("[data-wood-suggestions]");
    const brain = woodAi.querySelector("[data-wood-brain]");
    const provider = woodAi.querySelector("[data-wood-provider]");
    const source = woodAi.querySelector("[data-wood-source]");
    const renderMaterial = woodAi.querySelector("[data-wood-render-material]");
    const renderMode = woodAi.querySelector("[data-wood-render-mode]");
    const blueprint = woodAi.querySelector("[data-wood-blueprint]");
    const scale = woodAi.querySelector("[data-wood-scale]");
    const confidence = woodAi.querySelector("[data-wood-confidence]");
    const boardCount = woodAi.querySelector("[data-wood-board-count]");
    const waste = woodAi.querySelector("[data-wood-waste]");
    const days = woodAi.querySelector("[data-wood-days]");
    const json = woodAi.querySelector("[data-wood-json]");
    const whatsapp = woodAi.querySelector("[data-wood-whatsapp]");
    const pdf = woodAi.querySelector("[data-wood-pdf]");
    let currentDesign = null;

    const money = (value) => `$${Math.round(value).toLocaleString("es-CO")} COP`;
    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[char]);

    const parseDesign = (text) => {
      const clean = text.toLowerCase();
      const dimensionMatch = clean.match(/(\d{2,3})\s*[x×]\s*(\d{2,3})(?:\s*[x×]\s*(\d{2,3}))?/);
      const tipo = clean.includes("closet") || clean.includes("armario") ? "closet" : clean.includes("biblioteca") ? "biblioteca" : clean.includes("tv") || clean.includes("televisor") ? "mueble de TV" : clean.includes("cocina") ? "mueble de cocina" : clean.includes("repisa") ? "biblioteca" : "escritorio";
      const ancho = dimensionMatch ? Number(dimensionMatch[1]) : tipo === "closet" ? 180 : 140;
      const profundidad = dimensionMatch ? Number(dimensionMatch[2]) : tipo === "biblioteca" ? 35 : 60;
      const alto = dimensionMatch && dimensionMatch[3] ? Number(dimensionMatch[3]) : tipo === "closet" ? 220 : tipo === "biblioteca" ? 180 : 75;
      const cajonesMatches = [...clean.matchAll(/(\d+)\s*caj/g)];
      const cajonesMatch = cajonesMatches[0] || null;
      const repisasMatch = clean.match(/(\d+)\s*rep/);
      const puertasMatch = clean.match(/(\d+)\s*puert/);
      const extractZoneAmount = (word, zonePattern) => {
        const direct = clean.match(new RegExp(`(\\d+)\\s*${word}\\w*[^.,;]{0,34}${zonePattern}`));
        const reverse = clean.match(new RegExp(`${zonePattern}[^.,;]{0,34}(\\d+)\\s*${word}\\w*`));
        return Number((direct && direct[1]) || (reverse && reverse[1]) || 0);
      };
      const cajonesIzquierda = extractZoneAmount("caj", "(izquierda|izquierdo|izq)");
      const cajonesCentro = extractZoneAmount("caj", "(centro|medio|central)");
      const cajonesDerecha = extractZoneAmount("caj", "(derecha|derecho|der)");
      const repisasIzquierda = extractZoneAmount("rep", "(izquierda|izquierdo|izq)");
      const repisasCentro = extractZoneAmount("rep", "(centro|medio|central)");
      const repisasDerecha = extractZoneAmount("rep", "(derecha|derecho|der)");
      const totalCajonesPorTexto = cajonesMatches.reduce((total, match) => total + Number(match[1]), 0);
      const totalCajonesPorZona = cajonesIzquierda + cajonesCentro + cajonesDerecha;
      const totalRepisasPorZona = repisasIzquierda + repisasCentro + repisasDerecha;
      const color = clean.includes("negra") || clean.includes("negro") ? "negra" : clean.includes("roble") ? "roble" : clean.includes("nogal") ? "nogal" : clean.includes("gris") ? "gris" : clean.includes("blanca") || clean.includes("blanco") ? "blanca" : "blanca";
      const estilo = clean.includes("premium") && clean.includes("moderno") ? "premium moderno" : clean.includes("premium") ? "premium" : clean.includes("moderno") ? "moderno" : clean.includes("minimalista") ? "minimalista" : "funcional";
      const canto = clean.includes("grueso") || clean.includes("premium") ? "PVC 2 mm" : "PVC 0.45 mm";
      const sistema = clean.includes("push") ? "push open" : clean.includes("riel") ? "rieles telescópicos" : "herrajes estándar";
      const confidenceScore = 62 + (dimensionMatch ? 18 : 0) + (cajonesMatch || repisasMatch || puertasMatch ? 12 : 0) + (clean.includes("melamina") ? 8 : 0);
      const cajones = totalCajonesPorZona || totalCajonesPorTexto || (cajonesMatch ? Number(cajonesMatch[1]) : tipo === "escritorio" ? 3 : 0);
      const repisas = totalRepisasPorZona || (repisasMatch ? Number(repisasMatch[1]) : tipo === "biblioteca" ? 5 : 2);

      return {
        tipo,
        ancho,
        profundidad,
        alto,
        material: `melamina ${color}`,
        color,
        cajones,
        cajones_izquierda: cajonesIzquierda,
        cajones_centro: cajonesCentro,
        cajones_derecha: cajonesDerecha,
        repisas,
        repisas_izquierda: repisasIzquierda,
        repisas_centro: repisasCentro,
        repisas_derecha: repisasDerecha,
        puertas: puertasMatch ? Number(puertasMatch[1]) : tipo === "closet" ? 4 : 0,
        estilo,
        instalacion: clean.includes("flotante") || clean.includes("colgado") || clean.includes("suspendido") ? "flotante" : "piso",
        canto,
        sistema,
        confianza: Math.min(confidenceScore, 98),
        descripcion: "",
        sugerencias: []
      };
    };

    const normalizeDesign = (design) => {
      const normalized = {
        ...design,
        cajones_izquierda: Number(design.cajones_izquierda || design.cajonesIzquierda || 0),
        cajones_centro: Number(design.cajones_centro || design.cajonesCentro || 0),
        cajones_derecha: Number(design.cajones_derecha || design.cajonesDerecha || 0),
        repisas_izquierda: Number(design.repisas_izquierda || design.repisasIzquierda || 0),
        repisas_centro: Number(design.repisas_centro || design.repisasCentro || 0),
        repisas_derecha: Number(design.repisas_derecha || design.repisasDerecha || 0),
        instalacion: design.instalacion || "piso",
        descripcion: String(design.descripcion || "").trim(),
        sugerencias: Array.isArray(design.sugerencias) ? design.sugerencias.filter(Boolean).slice(0, 5) : []
      };

      if (Array.isArray(design.modulos)) {
        design.modulos.forEach((modulo) => {
          const zona = String(modulo.zona || "").toLowerCase();
          const tipo = String(modulo.tipo || "").toLowerCase();
          const cantidad = Number(modulo.cantidad || 0);
          const keyZone = zona.includes("izq") ? "izquierda" : zona.includes("der") ? "derecha" : zona.includes("cent") || zona.includes("medio") ? "centro" : "";
          if (!keyZone || !cantidad) return;
          if (tipo.includes("caj")) normalized[`cajones_${keyZone}`] = cantidad;
          if (tipo.includes("rep")) normalized[`repisas_${keyZone}`] = cantidad;
        });
      }

      const zoneDrawers = normalized.cajones_izquierda + normalized.cajones_centro + normalized.cajones_derecha;
      const zoneShelves = normalized.repisas_izquierda + normalized.repisas_centro + normalized.repisas_derecha;
      normalized.cajones = Math.max(Number(normalized.cajones || 0), zoneDrawers);
      normalized.repisas = Math.max(Number(normalized.repisas || 0), zoneShelves);
      return normalized;
    };

    const buildDesignDescription = (design) => {
      if (design.descripcion) return design.descripcion;
      const installCopy = design.instalacion === "flotante" ? "apariencia liviana y anclaje oculto" : "presencia estable y uso diario";
      const moduleCopy = [
        design.cajones ? `${design.cajones} cajones integrados` : "",
        design.repisas ? `${design.repisas} repisas funcionales` : "",
        design.puertas ? `${design.puertas} puertas` : ""
      ].filter(Boolean).join(", ");
      return `Propuesta ${design.estilo} de ${design.tipo} en ${design.material}, pensada para ${installCopy}${moduleCopy ? `, con ${moduleCopy}` : ""} y proporciones listas para revisión técnica.`;
    };

    const buildSmartSuggestions = (design) => {
      const suggestionsList = Array.isArray(design.sugerencias) ? design.sugerencias.filter(Boolean) : [];
      const lowerType = String(design.tipo || "").toLowerCase();

      if (design.canto !== "PVC 2 mm" && (design.estilo.includes("premium") || design.color === "negra")) {
        suggestionsList.push("Subir a canto PVC 2 mm en frentes visibles para una lectura mas premium y resistente.");
      }

      if (lowerType.includes("tv")) {
        suggestionsList.push("Agregar pasacables posterior y ventilacion para equipos electronicos.");
        suggestionsList.push("Considerar luz LED calida indirecta en repisas centrales para efecto showroom.");
      }

      if (design.instalacion === "flotante") {
        suggestionsList.push("Validar tipo de muro y usar anclaje reforzado oculto antes de fabricar.");
      } else {
        suggestionsList.push("Incluir niveladores ocultos para ajustar el mueble en pisos irregulares.");
      }

      if (design.cajones > 0 && !design.sistema.toLowerCase().includes("push")) {
        suggestionsList.push("Usar riel telescopico de cierre suave o sistema push open para un acabado mas silencioso.");
      }

      if (lowerType.includes("closet")) {
        suggestionsList.push("Separar zonas de colgado, doblado y cajoneria para mejorar ergonomia diaria.");
      }

      return [...new Set(suggestionsList)].slice(0, 5);
    };

    const buildPieces = (design) => {
      const espesor = 1.5;
      const piecesList = [
        `Tapa superior: ${design.ancho}x${design.profundidad} cm`,
        `Lateral izquierdo: ${design.alto}x${design.profundidad} cm`,
        `Lateral derecho: ${design.alto}x${design.profundidad} cm`,
        `Fondo/base estructural: ${design.ancho}x${Math.max(8, design.profundidad - 4)} cm`
      ];

      for (let i = 1; i <= design.cajones; i += 1) {
        piecesList.push(`Frente cajón ${i}: ${Math.round(design.ancho * 0.28)}x15 cm`);
      }

      for (let i = 1; i <= design.repisas; i += 1) {
        piecesList.push(`Repisa ${i}: ${Math.round(design.ancho * 0.42)}x${Math.max(24, design.profundidad - 8)} cm`);
      }

      if (design.puertas) {
        for (let i = 1; i <= design.puertas; i += 1) {
          piecesList.push(`Puerta ${i}: ${Math.round(design.ancho / design.puertas)}x${Math.round(design.alto * 0.78)} cm`);
        }
      }

      const areaM2 = ((design.ancho * design.profundidad) + (2 * design.alto * design.profundidad) + (design.repisas * design.ancho * 0.42 * design.profundidad) + (design.cajones * design.ancho * 0.28 * 15) + (design.puertas * (design.ancho / Math.max(design.puertas, 1)) * design.alto * 0.78)) / 10000;
      const tableros = Math.max(1, Math.ceil(areaM2 / 4.2));
      const canto = Math.ceil((design.ancho * 2 + design.profundidad * 4 + design.alto * 4 + design.repisas * design.ancho) / 100);
      const herrajes = design.cajones * 2 + design.puertas * 2;
      const costoTablero = tableros * 260000;
      const costoCanto = canto * (design.canto.includes("2") ? 18000 : 12000);
      const costoHerrajes = Math.max(2, herrajes) * (design.sistema.includes("push") ? 48000 : 35000);
      const manoObra = 280000 + (design.cajones * 45000) + (design.puertas * 32000) + (design.repisas * 18000);
      const estimate = costoTablero + costoCanto + costoHerrajes + manoObra;
      const merma = Math.min(Math.max(Math.round(((tableros * 4.2 - areaM2) / (tableros * 4.2)) * 100), 8), 38);
      const tiempos = design.tipo === "closet" || design.ancho > 170 ? "10-15" : design.cajones > 3 ? "8-12" : "6-9";
      const zonas = [
        design.cajones_izquierda || design.repisas_izquierda ? `Izquierda: ${design.cajones_izquierda || 0} cajones · ${design.repisas_izquierda || 0} repisas` : "",
        design.cajones_centro || design.repisas_centro ? `Centro: ${design.cajones_centro || 0} cajones · ${design.repisas_centro || 0} repisas` : "",
        design.cajones_derecha || design.repisas_derecha ? `Derecha: ${design.cajones_derecha || 0} cajones · ${design.repisas_derecha || 0} repisas` : ""
      ].filter(Boolean);
      const layoutList = [
        `Zona principal: ${design.tipo}`,
        zonas.length ? `Distribución: ${zonas.join(" / ")}` : design.cajones ? `Bloque lateral con ${design.cajones} cajones` : "Sin bloque de cajones",
        design.repisas ? `Módulo abierto con ${design.repisas} repisas` : "Sin repisas abiertas",
        design.puertas ? `Frentes abatibles: ${design.puertas} puertas` : "Frente abierto o libre"
      ];
      if (design.instalacion === "flotante") {
        layoutList.push("Instalación flotante: prever anclaje reforzado a muro.");
      }
      const costList = [
        `Tableros: ${money(costoTablero)}`,
        `Cantos ${design.canto}: ${money(costoCanto)}`,
        `Herrajes (${design.sistema}): ${money(costoHerrajes)}`,
        `Fabricación e instalación preliminar: ${money(manoObra)}`
      ];
      const descriptionText = buildDesignDescription(design);
      const suggestionsList = buildSmartSuggestions(design);
      const alertList = [];
      if (design.ancho > 180) alertList.push("Ancho alto: validar transporte, uniones o fabricación por módulos.");
      if (design.profundidad < 35 && design.cajones > 0) alertList.push("Profundidad baja para cajones: revisar correderas y uso real.");
      if (design.alto > 210) alertList.push("Altura superior a 210 cm: validar nivelación y fijación a muro.");
      if (design.aiError) alertList.push(`Planeador en modo respaldo: ${design.aiError}.`);
      if (!alertList.length) alertList.push("Diseño preliminar viable para revisión técnica.");

      return {
        piecesList,
        materialList: [
          `${tableros} tablero(s) de ${design.material}`,
          `${canto} m aproximados de canto`,
          `${Math.max(2, herrajes)} juego(s) de herrajes`,
          "Tornillería, niveladores e instalación preliminar"
        ],
        layoutList,
        costList,
        descriptionText,
        suggestionsList,
        alertList,
        estimate,
        areaM2,
        tableros,
        merma,
        tiempos
      };
    };

    const renderBlueprint = (design, built) => {
      if (!blueprint) return;
      const viewW = 620;
      const viewH = 330;
      const maxW = 365;
      const maxH = 145;
      const w = Math.min(maxW, Math.max(205, design.ancho * 2.05));
      const h = Math.min(maxH, Math.max(82, design.alto * 1.06));
      const x = 54;
      const y = 54;
      const planH = Math.min(72, Math.max(34, design.profundidad * 1.05));
      const sideW = Math.min(110, Math.max(46, design.profundidad * 1.18));
      const sideX = x + w + 78;
      const planY = y + h + 78;
      const zoneDrawers = {
        izquierda: Number(design.cajones_izquierda || 0),
        centro: Number(design.cajones_centro || 0),
        derecha: Number(design.cajones_derecha || 0)
      };
      const zoneShelves = {
        izquierda: Number(design.repisas_izquierda || 0),
        centro: Number(design.repisas_centro || 0),
        derecha: Number(design.repisas_derecha || 0)
      };
      const usesZones = Object.values(zoneDrawers).some(Boolean) || Object.values(zoneShelves).some(Boolean);
      const moduleW = w / 3;
      const drawDrawerFront = (count, startX, startY, moduleWidth, moduleHeight) => {
        if (!count) return "";
        const gap = 5;
        const drawerH = Math.max(14, Math.min(28, (moduleHeight - 24 - gap * (count - 1)) / count));
        return Array.from({ length: Math.min(count, 5) }, (_, i) => {
          const top = startY + 14 + i * (drawerH + gap);
          return `<rect x="${startX + 7}" y="${top}" width="${moduleWidth - 14}" height="${drawerH}" class="bp-module"/><line x1="${startX + moduleWidth * 0.34}" y1="${top + drawerH / 2}" x2="${startX + moduleWidth * 0.66}" y2="${top + drawerH / 2}" class="bp-handle"/>`;
        }).join("");
      };
      const drawShelfFront = (count, startX, startY, moduleWidth, moduleHeight) => {
        if (!count) return "";
        const gap = (moduleHeight - 22) / (count + 1);
        return Array.from({ length: Math.min(count, 7) }, (_, i) => {
          const shelfY = startY + 12 + gap * (i + 1);
          return `<line x1="${startX + 9}" y1="${shelfY}" x2="${startX + moduleWidth - 9}" y2="${shelfY}" class="bp-module-line"/>`;
        }).join("");
      };
      const zoneModules = usesZones
        ? ["izquierda", "centro", "derecha"].map((zone, i) => {
          const startX = x + i * moduleW;
          return `
            <line x1="${startX}" y1="${y}" x2="${startX}" y2="${y + h}" class="bp-module-line"/>
            ${drawDrawerFront(zoneDrawers[zone], startX, y, moduleW, h)}
            ${drawShelfFront(zoneShelves[zone], startX, y, moduleW, h)}
          `;
        }).join("")
        : "";
      const shelfGap = design.repisas ? h / (design.repisas + 1) : 0;
      const drawerH = Math.min(22, h / Math.max(design.cajones + 2, 4));
      const drawerX = x + w * 0.63;
      const drawers = !usesZones ? Array.from({ length: Math.min(design.cajones, 5) }, (_, i) => `<rect x="${drawerX}" y="${y + 16 + i * (drawerH + 5)}" width="${w * 0.27}" height="${drawerH}" class="bp-module" />`).join("") : "";
      const shelves = !usesZones ? Array.from({ length: Math.min(design.repisas, 6) }, (_, i) => `<line x1="${x + 18}" y1="${y + shelfGap * (i + 1)}" x2="${x + w * 0.56}" y2="${y + shelfGap * (i + 1)}" class="bp-module-line" />`).join("") : "";
      const doors = design.puertas ? Array.from({ length: Math.min(design.puertas, 5) }, (_, i) => `<line x1="${x + ((i + 1) * w) / Math.min(design.puertas, 5)}" y1="${y}" x2="${x + ((i + 1) * w) / Math.min(design.puertas, 5)}" y2="${y + h}" class="bp-module-line" />`).join("") : "";
      blueprint.innerHTML = `
        <defs><pattern id="grid" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M14 0H0V14" fill="none"/></pattern></defs>
        <rect width="${viewW}" height="${viewH}" class="bp-bg"/>
        <rect width="${viewW}" height="${viewH}" fill="url(#grid)" class="bp-grid"/>
        <text x="${x}" y="30" class="bp-title">Plano preliminar · ${escapeHtml(design.tipo)} · ${escapeHtml(design.material)}</text>
        <text x="${viewW - 44}" y="30" text-anchor="end" class="bp-code">BEH-OF-01</text>
        <text x="${x}" y="${y - 12}" class="bp-view-label">Vista frontal</text>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" class="bp-main"/>
        ${zoneModules}
        ${shelves}
        ${drawers}
        ${doors}
        <text x="${sideX}" y="${y - 12}" class="bp-view-label">Vista lateral</text>
        <rect x="${sideX}" y="${y}" width="${sideW}" height="${h}" class="bp-plan"/>
        <line x1="${sideX + sideW * 0.28}" y1="${y + 10}" x2="${sideX + sideW * 0.28}" y2="${y + h - 10}" class="bp-module-line"/>
        <text x="${x}" y="${planY - 14}" class="bp-view-label">Vista superior</text>
        <rect x="${x}" y="${planY}" width="${w}" height="${planH}" class="bp-plan"/>
        <line x1="${x}" y1="${y + h + 22}" x2="${x + w}" y2="${y + h + 22}" class="bp-dim"/>
        <line x1="${x}" y1="${y + h + 12}" x2="${x}" y2="${y + h + 31}" class="bp-dim-tick"/>
        <line x1="${x + w}" y1="${y + h + 12}" x2="${x + w}" y2="${y + h + 31}" class="bp-dim-tick"/>
        <text x="${x + w / 2}" y="${y + h + 42}" text-anchor="middle">${design.ancho} cm</text>
        <line x1="${x + w + 22}" y1="${y}" x2="${x + w + 22}" y2="${y + h}" class="bp-dim"/>
        <line x1="${x + w + 12}" y1="${y}" x2="${x + w + 31}" y2="${y}" class="bp-dim-tick"/>
        <line x1="${x + w + 12}" y1="${y + h}" x2="${x + w + 31}" y2="${y + h}" class="bp-dim-tick"/>
        <text x="${x + w + 40}" y="${y + h / 2}" transform="rotate(90 ${x + w + 40} ${y + h / 2})">${design.alto} cm</text>
        <line x1="${x + w + 22}" y1="${planY}" x2="${x + w + 22}" y2="${planY + planH}" class="bp-dim"/>
        <text x="${x + w + 42}" y="${planY + planH / 2}" transform="rotate(90 ${x + w + 42} ${planY + planH / 2})">Fondo ${design.profundidad} cm</text>
        <text x="${x}" y="${viewH - 30}" class="bp-note">Tableros: ${built.tableros} · Merma: ${built.merma}% · Canto: ${escapeHtml(design.canto)} · Sistema: ${escapeHtml(design.sistema)}</text>
        <text x="${viewW - 44}" y="${viewH - 30}" text-anchor="end" class="bp-note">Revisión técnica requerida</text>
      `;
      if (scale) scale.textContent = `Frente ${design.ancho}x${design.alto} cm · Fondo ${design.profundidad} cm`;
    };

    const renderIsoSvg = (design) => {
      if (!renderSvg) return;
      const paletteMap = {
        blanca: ["#fbfaf7", "#e9e3da", "#d2c8ba", "#8b735f", "#ffffff"],
        roble: ["#d9a560", "#bb793a", "#8f5429", "#5d371e", "#efc17b"],
        natural: ["#e6bd7a", "#c88f4b", "#98602f", "#6e4323", "#f3d196"],
        nogal: ["#8a5a38", "#60371f", "#3a2116", "#c99764", "#b88355"],
        negra: ["#35312d", "#201d1a", "#0f0e0d", "#d7b98d", "#4a4640"],
        gris: ["#deded9", "#b8b6ae", "#8c8982", "#6b6258", "#f3f2ed"]
      };
      const palette = paletteMap[design.color] || paletteMap.blanca;
      renderSvg.dataset.color = design.color;
      renderSvg.style.setProperty("--iso-rotate", `${rotate ? rotate.value : -18}deg`);
      const isTv = String(design.tipo || "").toLowerCase().includes("tv");
      const width = Math.min(isTv ? 430 : 370, Math.max(isTv ? 330 : 215, design.ancho * (isTv ? 2.45 : 1.58)));
      const height = Math.min(isTv ? 190 : 275, Math.max(isTv ? 126 : 136, design.alto * (isTv ? 2.08 : 1.18)));
      const depth = Math.min(112, Math.max(56, design.profundidad * 1.28));
      const x = Math.max(38, (560 - width - depth * 0.56) / 2);
      const y = isTv ? 142 : 88 + (250 - height) / 2;
      const dx = depth * 0.78;
      const dy = depth * 0.42;
      const shelfCount = Math.min(design.repisas, 6);
      const drawerCount = Math.min(design.cajones, 5);
      const doorCount = Math.min(design.puertas, 5);
      const zoneDrawers = {
        izquierda: Math.min(Number(design.cajones_izquierda || 0), 6),
        centro: Math.min(Number(design.cajones_centro || 0), 6),
        derecha: Math.min(Number(design.cajones_derecha || 0), 6)
      };
      const zoneShelves = {
        izquierda: Math.min(Number(design.repisas_izquierda || 0), 6),
        centro: Math.min(Number(design.repisas_centro || 0), 6),
        derecha: Math.min(Number(design.repisas_derecha || 0), 6)
      };
      const usesZones = Object.values(zoneDrawers).some(Boolean) || Object.values(zoneShelves).some(Boolean);
      const moduleGap = 10;
      const innerLeft = x + 14;
      const innerWidth = width - 28;
      const moduleWidth = (innerWidth - moduleGap * 2) / 3;
      const moduleHeight = height - 34;
      const moduleTop = y + 18;
      const moduleMap = {
        izquierda: innerLeft,
        centro: innerLeft + moduleWidth + moduleGap,
        derecha: innerLeft + (moduleWidth + moduleGap) * 2
      };
      const drawerCol = drawerCount ? Math.min(width * 0.34, 86) : 0;
      const openWidth = width - drawerCol - 22;
      const drawerX = x + width - drawerCol - 11;
      const drawerH = drawerCount ? Math.min(30, (height - 42) / Math.max(drawerCount, 3)) : 0;
      const shelfGap = shelfCount ? (height - 44) / (shelfCount + 1) : 0;
      const drawDrawerStack = (count, startX, startY, stackWidth, stackHeight) => {
        if (!count) return "";
        const gap = 7;
        const itemHeight = Math.min(isTv ? 44 : 30, Math.max(18, (stackHeight - gap * (count - 1)) / count));
        return Array.from({ length: count }, (_, i) => {
          const top = startY + i * (itemHeight + gap);
          return `
            <rect x="${startX - 1}" y="${top - 1}" width="${stackWidth + 2}" height="${itemHeight + 2}" rx="5" class="iso-drawer-gap"/>
            <rect x="${startX}" y="${top}" width="${stackWidth}" height="${itemHeight}" rx="4" class="iso-drawer"/>
            <rect x="${startX + 6}" y="${top + 5}" width="${stackWidth - 12}" height="${itemHeight - 10}" rx="2" class="iso-panel-highlight"/>
            <path d="M${startX + 7} ${top + 5} H${startX + stackWidth - 7}" class="iso-drawer-bevel"/>
            <rect x="${startX + stackWidth * 0.32}" y="${top + itemHeight / 2 - 2}" width="${stackWidth * 0.36}" height="4" rx="2" class="iso-handle"/>
            <circle cx="${startX + stackWidth - 10}" cy="${top + itemHeight / 2}" r="1.8" class="iso-handle-glint"/>
          `;
        }).join("");
      };
      const drawShelfStack = (count, startX, startY, stackWidth, stackHeight) => {
        if (!count) return "";
        const gap = stackHeight / (count + 1);
        return Array.from({ length: count }, (_, i) => {
          const shelfY = startY + gap * (i + 1);
          return `
            <rect x="${startX - 2}" y="${shelfY - 2}" width="${stackWidth + 4}" height="10" rx="2" class="iso-shelf"/>
            <line x1="${startX + 4}" y1="${shelfY + 10}" x2="${startX + stackWidth - 4}" y2="${shelfY + 10}" class="iso-shelf-shadow"/>
          `;
        }).join("");
      };
      const doors = doorCount ? Array.from({ length: doorCount }, (_, i) => {
        const segment = width / doorCount;
        const doorX = x + i * segment;
        return `
          <rect x="${doorX + 4}" y="${y + 14}" width="${segment - 8}" height="${height - 28}" rx="5" class="iso-door"/>
          <line x1="${doorX + segment}" y1="${y + 17}" x2="${doorX + segment}" y2="${y + height - 17}" class="iso-joint"/>
        `;
      }).join("") : "";
      const drawers = usesZones
        ? ["izquierda", "centro", "derecha"].map((zone) => drawDrawerStack(zoneDrawers[zone], moduleMap[zone], moduleTop + 6, moduleWidth - 4, moduleHeight - 16)).join("")
        : drawDrawerStack(drawerCount, drawerX, y + 26, drawerCol, height - 52);
      const shelves = usesZones
        ? ["izquierda", "centro", "derecha"].map((zone) => drawShelfStack(zoneShelves[zone], moduleMap[zone], moduleTop + 2, moduleWidth - 4, moduleHeight - 18)).join("")
        : drawShelfStack(shelfCount, x + 13, y + 24, Math.max(48, openWidth), height - 44);
      const drawCavity = (startX, startY, cavityWidth, cavityHeight) => `
        <rect x="${startX}" y="${startY}" width="${cavityWidth}" height="${cavityHeight}" rx="3" class="iso-cavity"/>
        <rect x="${startX + 8}" y="${startY + 9}" width="${cavityWidth - 16}" height="${cavityHeight - 18}" rx="2" class="iso-cavity-back"/>
        <path d="M${startX} ${startY} L${startX + 10} ${startY + 9} V${startY + cavityHeight - 9} L${startX} ${startY + cavityHeight} Z" class="iso-cavity-side"/>
        <path d="M${startX + cavityWidth} ${startY} L${startX + cavityWidth - 10} ${startY + 9} V${startY + cavityHeight - 9} L${startX + cavityWidth} ${startY + cavityHeight} Z" class="iso-cavity-side iso-cavity-side-right"/>
      `;
      const verticalDivider = usesZones
        ? `
          <rect x="${x + width / 3}" y="${y + 13}" width="7" height="${height - 26}" rx="3" class="iso-divider"/>
          <rect x="${x + (width * 2) / 3}" y="${y + 13}" width="7" height="${height - 26}" rx="3" class="iso-divider"/>
        `
        : drawerCount && shelfCount
          ? `<rect x="${drawerX - 13}" y="${y + 13}" width="8" height="${height - 26}" rx="3" class="iso-divider"/>`
          : "";
      const floatingMount = design.instalacion === "flotante"
        ? `
          <rect x="${x + 24}" y="${y + height + 12}" width="${width - 48}" height="8" rx="4" class="iso-floating-rail"/>
          <text x="${x + width / 2}" y="${y + height + 38}" text-anchor="middle" class="iso-note">Instalación flotante con anclaje reforzado</text>
        `
        : "";
      const drawLeg = (factor, lean, offsetY, length, className = "") => {
        const topX = x + width * factor;
        const topY = y + height + offsetY;
        const bottomX = topX + lean;
        const bottomY = topY + length;
        const side = lean < 0 ? -1 : 1;
        const legWidth = className.includes("back") ? 8 : 11;
        return `
          <g class="iso-leg-group ${className}">
            <ellipse cx="${bottomX}" cy="${bottomY + 6}" rx="${legWidth + 7}" ry="5" class="iso-leg-shadow"/>
            <ellipse cx="${topX}" cy="${topY}" rx="${legWidth + 2}" ry="4.5" class="iso-leg-socket"/>
            <path d="M${topX - legWidth * 0.5} ${topY + 1} L${topX + legWidth * 0.56} ${topY + 1} L${bottomX + legWidth * 0.42} ${bottomY} L${bottomX - legWidth * 0.58} ${bottomY} Z" class="iso-leg-side"/>
            <path d="M${topX} ${topY + 2} L${bottomX} ${bottomY - 2}" class="iso-leg-body"/>
            <path d="M${topX + side * 2.5} ${topY + 9} L${bottomX + side * 1.8} ${bottomY - 10}" class="iso-leg-highlight"/>
            <ellipse cx="${bottomX}" cy="${bottomY}" rx="${legWidth + 2}" ry="4.8" class="iso-leg-foot"/>
          </g>
        `;
      };
      const rearLegs = design.instalacion === "flotante" ? "" : [
        drawLeg(0.16, 8, -dy * 0.38, 45, "iso-back-leg"),
        drawLeg(0.84, 8, -dy * 0.38, 45, "iso-back-leg")
      ].join("");
      const legs = design.instalacion === "flotante" ? "" : [
        drawLeg(0.12, -12, -2, 62),
        drawLeg(0.38, -7, -1, 56),
        drawLeg(0.62, 7, -1, 56),
        drawLeg(0.88, 12, -2, 62)
      ].join("");
      const grainLines = Array.from({ length: 14 }, (_, i) => {
        const gy = y + 15 + i * ((height - 30) / 13);
        return `<path d="M${x + 12} ${gy} C ${x + width * 0.26} ${gy - 7}, ${x + width * 0.58} ${gy + 7}, ${x + width - 12} ${gy - 2}" class="iso-grain"/>`;
      }).join("");
      const centerCavity = usesZones && (zoneShelves.centro || zoneDrawers.centro === 0)
        ? drawCavity(moduleMap.centro - 4, moduleTop, moduleWidth + 4, moduleHeight - 8)
        : "";
      const zoneCavities = usesZones
        ? ["izquierda", "centro", "derecha"].map((zone) => {
          if (!zoneShelves[zone] || zone === "centro") return "";
          return drawCavity(moduleMap[zone] - 3, moduleTop + 2, moduleWidth + 2, moduleHeight - 12);
        }).join("")
        : "";
      const dimensionTop = y - dy - 35;
      const dimensionRight = x + width + dx + 34;
      const dimensionDepthY = y - dy - 8;
      const captionY = y + height + (design.instalacion === "flotante" ? 64 : 46);
      const premiumEdges = `
        <rect x="${x + 8}" y="${y + 8}" width="${width - 16}" height="4.5" rx="2.25" class="iso-premium-edge"/>
        <rect x="${x + 8}" y="${y + height - 17}" width="${width - 16}" height="4.5" rx="2.25" class="iso-premium-edge iso-premium-edge-low"/>
        <path d="M${x + 4} ${y + height - 2} H${x + width - 4} L${x + width + dx - 8} ${y + height - dy + 1}" class="iso-contact-line"/>
        <path d="M${x + 18} ${y + 5} C ${x + width * 0.3} ${y - 4}, ${x + width * 0.76} ${y + 1}, ${x + width - 18} ${y - 8}" class="iso-top-grain"/>
      `;

      renderSvg.innerHTML = `
        <defs>
          <marker id="isoArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10Z" class="iso-arrow"/>
          </marker>
          <linearGradient id="isoFront" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stop-color="${palette[0]}"/>
            <stop offset="100%" stop-color="${palette[1]}"/>
          </linearGradient>
          <linearGradient id="isoTop" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="${palette[0]}"/>
          </linearGradient>
          <linearGradient id="isoSide" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stop-color="${palette[1]}"/>
            <stop offset="100%" stop-color="${palette[2]}"/>
          </linearGradient>
          <filter id="isoSoftShadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#24170f" flood-opacity="0.18"/>
          </filter>
        </defs>
        <ellipse cx="${x + width / 2 + dx * 0.35}" cy="${y + height + dy + 36}" rx="${width * 0.56}" ry="35" class="iso-floor"/>
        <g filter="url(#isoSoftShadow)" class="iso-cabinet">
          <rect x="${x - 18}" y="${y - 18}" width="${width + 48}" height="${height + 52}" rx="18" class="iso-wall-shadow"/>
          <polygon points="${x},${y} ${x + dx},${y - dy} ${x + width + dx},${y - dy} ${x + width},${y}" class="iso-top"/>
          ${premiumEdges}
          <polygon points="${x},${y} ${x + dx},${y - dy} ${x + dx},${y + height - dy} ${x},${y + height}" class="iso-left-side"/>
          <polygon points="${x + width},${y} ${x + width + dx},${y - dy} ${x + width + dx},${y + height - dy} ${x + width},${y + height}" class="iso-side"/>
          <polygon points="${x},${y + height} ${x + width},${y + height} ${x + width + dx},${y + height - dy} ${x + dx},${y + height - dy}" class="iso-bottom"/>
          ${rearLegs}
          <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="8" class="iso-front"/>
          <rect x="${x + 10}" y="${y + 12}" width="${width - 20}" height="${height - 24}" rx="6" class="iso-inner"/>
          ${zoneCavities}
          ${centerCavity}
          ${grainLines}
          ${shelves}
          ${verticalDivider}
          ${doors}
          ${drawers}
          <rect x="${x + 10}" y="${y + height - 13}" width="${width - 20}" height="10" rx="4" class="iso-plinth"/>
          ${floatingMount}
          ${legs}
          <path d="M${x + 7} ${y + 7} L${x + dx + 7} ${y - dy + 7} H${x + width + dx - 8}" class="iso-edge"/>
          <line x1="${x}" y1="${dimensionTop}" x2="${x + width}" y2="${dimensionTop}" class="iso-dim"/>
          <line x1="${x}" y1="${dimensionTop - 14}" x2="${x}" y2="${dimensionTop + 14}" class="iso-dim-tick"/>
          <line x1="${x + width}" y1="${dimensionTop - 14}" x2="${x + width}" y2="${dimensionTop + 14}" class="iso-dim-tick"/>
          <text x="${x + width / 2}" y="${dimensionTop - 10}" text-anchor="middle" class="iso-dim-text">${design.ancho} cm</text>
          <line x1="${x + width + dx}" y1="${dimensionDepthY}" x2="${x + width}" y2="${y}" class="iso-dim"/>
          <text x="${x + width + dx * 0.6}" y="${dimensionDepthY - 7}" text-anchor="middle" class="iso-dim-text">${design.profundidad} cm</text>
          <line x1="${dimensionRight}" y1="${y}" x2="${dimensionRight}" y2="${y + height}" class="iso-dim"/>
          <line x1="${dimensionRight - 12}" y1="${y}" x2="${dimensionRight + 12}" y2="${y}" class="iso-dim-tick"/>
          <line x1="${dimensionRight - 12}" y1="${y + height}" x2="${dimensionRight + 12}" y2="${y + height}" class="iso-dim-tick"/>
          <text x="${dimensionRight + 22}" y="${y + height / 2}" transform="rotate(90 ${dimensionRight + 22} ${y + height / 2})" text-anchor="middle" class="iso-dim-text">${design.alto} cm</text>
          <text x="${x + width / 2}" y="${captionY}" text-anchor="middle" class="iso-caption">${design.ancho} x ${design.profundidad} x ${design.alto} cm · ${escapeHtml(design.material)}</text>
        </g>
      `;
    };

    const renderModel = (design) => {
      if (!model) return;
      model.innerHTML = "";
      model.dataset.color = design.color;
      const modelWidth = Math.min(Math.max(design.ancho * 2, 260), 440);
      const modelHeight = Math.min(Math.max(design.alto * 2.05, 230), 390);
      model.style.width = `${modelWidth}px`;
      model.style.height = `${modelHeight}px`;
      const moduleTop = 27;
      const bodyLeft = 10;
      const bodyTop = 14;
      const bodyWidth = 80;
      const bodyHeight = 74;
      const drawerColumn = design.cajones ? 30 : 0;
      const openWidth = drawerColumn ? 44 : 62;
      const doorCount = Math.min(design.puertas, 4);

      const addPart = (className, style = {}) => {
        const part = document.createElement("span");
        part.className = `wood-part ${className}`;
        Object.entries(style).forEach(([key, value]) => part.style.setProperty(key, value));
        model.appendChild(part);
      };

      addPart("wood-shadow");
      addPart("wood-shell");
      addPart("wood-face wood-face-back");
      addPart("wood-face wood-face-left");
      addPart("wood-face wood-face-right");
      addPart("wood-face wood-face-top");
      addPart("wood-face wood-face-bottom");
      addPart("wood-interior", {
        left: `${bodyLeft + 7}%`,
        top: `${bodyTop + 14}%`,
        width: `${bodyWidth - 14}%`,
        height: `${bodyHeight - 20}%`
      });

      for (let i = 0; i < Math.min(design.cajones, 5); i += 1) {
        addPart("wood-drawer", {
          top: `${moduleTop + i * 10.5}%`,
          right: "13%",
          width: `${drawerColumn}%`,
          height: `${Math.min(9, 43 / Math.max(design.cajones, 4))}%`
        });
      }

      for (let i = 0; i < Math.min(design.repisas, 6); i += 1) {
        addPart("wood-shelf", {
          top: `${moduleTop + 4 + i * (46 / Math.max(design.repisas + 1, 2))}%`,
          left: "18%",
          width: `${openWidth}%`
        });
      }

      for (let i = 0; i < doorCount; i += 1) {
        addPart("wood-door", {
          left: `${16 + i * (62 / doorCount)}%`,
          width: `${Math.max(12, 58 / doorCount)}%`
        });
      }

      addPart("wood-plinth");
      renderIsoSvg(design);
    };

    const renderDesign = (design, save = true) => {
      design = normalizeDesign(design);
      const descriptionText = design.descripcion || buildDesignDescription(design);
      const publicEstimate = Math.max(680000, Math.round((design.ancho * design.alto * Math.max(design.profundidad, 30) * 0.14 + 480000) / 50000) * 50000);
      currentDesign = { ...design, descriptionText, publicEstimate };
      if (title) title.textContent = `${design.tipo} ${design.estilo}`;
      if (dimensions) dimensions.textContent = `${design.ancho} x ${design.profundidad} x ${design.alto} cm`;
      if (material) material.textContent = design.material;
      if (modules) modules.textContent = `${design.cajones} cajones · ${design.repisas} repisas · ${design.puertas} puertas`;
      if (price) price.textContent = `Desde ${money(publicEstimate)} · sujeto a revisión`;
      if (confidence) confidence.textContent = "Guía preliminar";
      if (description) description.textContent = descriptionText;
      if (brain) {
        brain.innerHTML = [
          `<span>Tipo: ${escapeHtml(design.tipo)}</span>`,
          `<span>Medidas: ${escapeHtml(`${design.ancho}x${design.profundidad}x${design.alto}`)}</span>`,
          `<span>Material: ${escapeHtml(design.material)}</span>`,
          `<span>Módulos: ${escapeHtml(design.cajones + design.repisas + design.puertas)}</span>`,
          `<span>Origen: ${escapeHtml(design.fuente === "OpenAI" ? "Planeador avanzado" : "Planeador local")}</span>`
        ].join("");
      }
      if (provider) provider.textContent = design.fuente === "OpenAI" ? "Planeador avanzado activo" : "Planeador local";
      if (source) source.textContent = design.fuente === "OpenAI" ? "Planeador avanzado" : "Planeador local";
      if (renderMaterial) renderMaterial.textContent = design.material;
      if (renderMode) renderMode.textContent = design.instalacion === "flotante" ? "Vista comercial flotante" : "Vista comercial";
      if (json) json.textContent = JSON.stringify(design, null, 2);
      renderModel(design);

      if (whatsapp) {
        const message = [
          "Hola BEH, quiero solicitar la revisión de esta propuesta.",
          "",
          `${design.tipo} ${design.estilo}`,
          `Medidas: ${design.ancho}x${design.profundidad}x${design.alto} cm`,
          `Material: ${design.material}`,
          `Descripcion: ${descriptionText}`,
          `Módulos: ${design.cajones} cajones, ${design.repisas} repisas, ${design.puertas} puertas`,
          design.record_id ? `Referencia: ${design.record_id}` : ""
        ].filter(Boolean).join("\n");
        whatsapp.href = `https://wa.me/573103200976?text=${encodeURIComponent(message)}`;
      }

      if (save) {
        const history = JSON.parse(localStorage.getItem("seebWoodHistory") || "[]");
        history.unshift(design);
        localStorage.setItem("seebWoodHistory", JSON.stringify(history.slice(0, 5)));
        renderHistory();
        if (!design._stored) {
          captureRecord("simulacion", {
            prompt: prompt ? prompt.value : "",
            tipo: design.tipo,
            ancho: design.ancho,
            profundidad: design.profundidad,
            alto: design.alto,
            material: design.material,
            estilo: design.estilo,
            descripcion: descriptionText,
            origen: "planeador_local"
          });
        }
      }
    };

    const renderHistory = () => {
      if (!historyWrap) return;
      const history = JSON.parse(localStorage.getItem("seebWoodHistory") || "[]");
      historyWrap.innerHTML = "";
      history.forEach((item, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = `${item.tipo} ${item.ancho}x${item.profundidad} · ${item.material}`;
        button.addEventListener("click", () => renderDesign(history[index], false));
        historyWrap.appendChild(button);
      });
    };

    const requestOpenAiDesign = async (text) => {
      if (window.location.protocol === "file:") {
        throw new Error("abre la pagina desde el hosting o un servidor PHP para activar el planeador avanzado");
      }

      const endpoint = new URL("seeb_wood_ai.php", window.location.href);
      const response = await fetch(endpoint.href, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text })
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch (error) {
        throw new Error("el servidor no devolvio una respuesta JSON valida");
      }

      if (!response.ok) throw new Error(payload.error || "Planeador avanzado no disponible");
      if (!payload.ok || !payload.design) throw new Error(payload.error || "Respuesta invalida");
      return { ...payload.design, record_id: payload.record_id, _stored: true };
    };

    const generateDesign = async () => {
      if (!prompt) return;
      const text = prompt.value || prompt.placeholder;
      woodAi.classList.add("is-thinking");

      try {
        const design = await requestOpenAiDesign(text);
        renderDesign({ ...parseDesign(text), ...design, fuente: "OpenAI" });
      } catch (error) {
        renderDesign({
          ...parseDesign(text),
          fuente: "Motor local",
          aiError: error.message || "Planeador avanzado no disponible"
        });
      } finally {
        woodAi.classList.remove("is-thinking");
      }
    };

    if (generate) generate.addEventListener("click", generateDesign);
    if (example) example.addEventListener("click", () => {
      if (prompt) prompt.value = "Recepción corporativa en madera con mostrador, almacenamiento interno, acabado roble y espacio de atención para dos personas.";
      generateDesign();
    });

    woodAi.querySelectorAll("[data-wood-template]").forEach((button) => {
      button.addEventListener("click", () => {
        if (prompt) prompt.value = button.dataset.woodTemplate || "";
        generateDesign();
      });
    });

    if (rotate && model) {
      rotate.addEventListener("input", () => {
        model.style.setProperty("--wood-rotate", `${rotate.value}deg`);
        if (renderSvg) renderSvg.style.setProperty("--iso-rotate", `${rotate.value}deg`);
      });
    }

    renderHistory();
    renderDesign(parseDesign(prompt ? prompt.value : ""), false);
  }

  const marketRoute = document.querySelector("[data-market-route]");

  if (marketRoute) {
    const input = marketRoute.querySelector("[data-market-input]");
    const stepOne = marketRoute.querySelector("[data-market-step-one]");
    const stepTwo = marketRoute.querySelector("[data-market-step-two]");
    const stepThree = marketRoute.querySelector("[data-market-step-three]");
    const copyOne = marketRoute.querySelector("[data-market-route-copy-one]");
    const copyTwo = marketRoute.querySelector("[data-market-route-copy-two]");
    const copyThree = marketRoute.querySelector("[data-market-route-copy-three]");

    const routes = {
      cliente: {
        input: "Necesito equipar una oficina con puestos de trabajo, sillas, archivo y una sala de juntas.",
        steps: [
          ["Elegir categorías", "Selecciona escritorios, sillas, divisiones, almacenamiento, recepción o sala de juntas."],
          ["Enviar medidas o plano", "Con medidas, fotos o plano podemos revisar cantidades, circulación, instalación y acabados."],
          ["Recibir propuesta", "El equipo BEH organiza productos, instalación, tiempos y rango de inversión para avanzar."]
        ]
      },
      arquitecto: {
        input: "Tengo un proyecto de oficina con plano, especificaciones y necesito apoyo para suministro e instalación.",
        steps: [
          ["Revisar planos", "Validamos distribución, cantidades, circulaciones, puntos eléctricos y zonas de instalación."],
          ["Aterrizar especificaciones", "Conectamos acabados, perfilería, vidrio, sillas, escritorios y almacenamiento disponible."],
          ["Coordinar obra", "La solicitud queda lista para agenda, suministro, montaje y entrega por fases."]
        ]
      },
      marca: {
        input: "Necesito comparar opciones para compras: escritorios, sillas, divisiones y salas de juntas.",
        steps: [
          ["Agrupar productos", "Organizamos la compra por categorías, cantidades, acabados y prioridad de entrega."],
          ["Comparar alcances", "Se separa suministro, instalación, fabricación a medida y productos de catálogo."],
          ["Cotizar por etapas", "El brief permite estimar inversión, tiempos, logística y montaje por zonas."]
        ]
      }
    };

    marketRoute.querySelectorAll("[data-market-audience]").forEach((button) => {
      button.addEventListener("click", () => {
        const route = routes[button.dataset.marketAudience] || routes.cliente;
        marketRoute.querySelectorAll("[data-market-audience]").forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        if (input) input.textContent = route.input;
        if (stepOne) stepOne.textContent = route.steps[0][0];
        if (copyOne) copyOne.textContent = route.steps[0][1];
        if (stepTwo) stepTwo.textContent = route.steps[1][0];
        if (copyTwo) copyTwo.textContent = route.steps[1][1];
        if (stepThree) stepThree.textContent = route.steps[2][0];
        if (copyThree) copyThree.textContent = route.steps[2][1];
      });
    });
  }

  const system = document.querySelector("[data-system]");

  if (system) {
    const visual = system.querySelector(".system-visual");
    const image = system.querySelector("[data-system-image]");
    const code = system.querySelector("[data-system-code]");
    const title = system.querySelector("[data-system-title]");
    const copy = system.querySelector("[data-system-copy]");
    const specOne = system.querySelector("[data-system-spec-one]");
    const specTwo = system.querySelector("[data-system-spec-two]");
    const specThree = system.querySelector("[data-system-spec-three]");

    const stages = {
      diagnostico: {
        code: "BEH-01",
        title: "Diagnóstico del espacio",
        copy: "Revisamos medidas, uso, tráfico, restricciones del lugar y objetivos de imagen para definir un alcance claro antes de diseñar.",
        image: "fotos%20de%20la%20empresa/imagenes%20ya%20editadas/82718273_2897090223669231_5075282013808754688_n.jpg",
        specs: ["Medidas reales", "Uso diario", "Presupuesto guía"]
      },
      diseno: {
        code: "BEH-02",
        title: "Diseño técnico y materialidad",
        copy: "Traducimos la necesidad en distribución, proporciones, materiales, acabados y detalles constructivos que puedan fabricarse con precisión.",
        image: "fotos%20de%20la%20empresa/imagenes%20ya%20editadas/33894880_1876033692441561_4952752244735868928_n.jpg",
        specs: ["Distribución", "Acabados", "Ergonomía"]
      },
      fabricacion: {
        code: "BEH-03",
        title: "Fabricación controlada",
        copy: "Producimos piezas a medida en taller, cuidando ensamble, resistencia, cantos, pintura, herrajes y consistencia visual.",
        image: "fotos%20de%20la%20empresa/imagenes%20ya%20editadas/88197200_3018442901533962_6565512395664392192_n.jpg",
        specs: ["Ensamble", "Herrajes", "Control de calidad"]
      },
      montaje: {
        code: "BEH-04",
        title: "Instalación y entrega",
        copy: "Coordinamos transporte, montaje, ajustes en sitio y entrega final para que el mobiliario quede listo para operar.",
        image: "fotos%20de%20la%20empresa/imagenes%20ya%20editadas/90038110_3050155125029406_6725258872400904192_n.jpg",
        specs: ["Montaje", "Ajustes", "Entrega final"]
      }
    };

    const updateSystem = (key) => {
      const stage = stages[key] || stages.diagnostico;

      system.querySelectorAll("[data-system-tab]").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.systemTab === key);
      });

      if (visual) visual.classList.add("is-changing");

      window.setTimeout(() => {
        if (image) image.src = stage.image;
        if (code) code.textContent = stage.code;
        if (title) title.textContent = stage.title;
        if (copy) copy.textContent = stage.copy;
        if (specOne) specOne.textContent = stage.specs[0];
        if (specTwo) specTwo.textContent = stage.specs[1];
        if (specThree) specThree.textContent = stage.specs[2];
        if (visual) visual.classList.remove("is-changing");
      }, 120);
    };

    system.querySelectorAll("[data-system-tab]").forEach((button) => {
      button.addEventListener("click", () => updateSystem(button.dataset.systemTab));
    });
  }

  const studio = document.querySelector("[data-studio]");

  if (studio) {
    const state = {
      space: "oficina",
      style: "moderno y corporativo",
      need: "almacenamiento funcional"
    };

    const title = studio.querySelector("[data-studio-title]");
    const copy = studio.querySelector("[data-studio-copy]");
    const materials = studio.querySelector("[data-studio-materials]");
    const whatsapp = studio.querySelector("[data-studio-whatsapp]");

    const spaceRecommendations = {
      oficina: {
        label: "Oficina",
        copy: "mobiliario de oficina a medida, superficies resistentes de fácil mantenimiento y módulos que mantengan el espacio ordenado sin perder diseño",
        materials: ["Melamina RH", "Herrajes de alto tráfico", "Acabados cálidos"]
      },
      "sala de juntas": {
        label: "Sala de juntas",
        copy: "mesa central, sillas interlocutoras, credenza, conexiones y una distribución cómoda para reuniones",
        materials: ["Mesa de juntas", "Sillas interlocutoras", "Credenza o apoyo"]
      },
      "oficina gerencial": {
        label: "Gerencia",
        copy: "escritorio ejecutivo, silla gerencial, almacenamiento, mesa auxiliar y divisiones para privacidad",
        materials: ["Escritorio ejecutivo", "Silla gerencial", "División en vidrio"]
      },
      "zona operativa": {
        label: "Zona operativa",
        copy: "puestos modulares, sillas operativas, archivo bajo y circulación clara para equipos de trabajo",
        materials: ["Puestos modulares", "Sillas operativas", "Archivo bajo"]
      }
    };

    const updateStudio = () => {
      const recommendation = spaceRecommendations[state.space] || spaceRecommendations.oficina;
      const headline = `${recommendation.label} ${state.style} con ${state.need}`;
      const resultCopy = `Para este proyecto recomendamos ${recommendation.copy}. La propuesta puede desarrollarse con un lenguaje ${state.style} y foco en ${state.need}.`;

      if (title) title.textContent = headline;
      if (copy) copy.textContent = resultCopy;

      if (materials) {
        materials.innerHTML = recommendation.materials.map((item) => `<span>${item}</span>`).join("");
      }

      if (whatsapp) {
        const message = [
          "Hola BEH, quiero asesoría para diseñar mi espacio.",
          "",
          `Tipo de espacio: ${recommendation.label}`,
          `Estilo: ${state.style}`,
          `Prioridad: ${state.need}`,
          "",
          `Recomendación vista en la web: ${headline}`
        ].join("\n");

        whatsapp.href = `https://wa.me/573103200976?text=${encodeURIComponent(message)}`;
      }
    };

    studio.querySelectorAll("[data-studio-group]").forEach((group) => {
      const key = group.dataset.studioGroup;

      group.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          state[key] = button.dataset.value || state[key];
          group.querySelectorAll("button").forEach((item) => item.classList.remove("is-selected"));
          button.classList.add("is-selected");
          updateStudio();
        });
      });
    });

    updateStudio();
  }

  const quoteForm = document.querySelector("[data-quote-form]");

  if (quoteForm) {
    quoteForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(quoteForm);
      const name = data.get("name") || "Por confirmar";
      const phone = data.get("phone") || "Por confirmar";
      const projectType = data.get("projectType") || "Proyecto BEH";
      const city = data.get("city") || "Por confirmar";
      const size = data.get("size") || "Por confirmar";
      const budget = data.get("budget") || "Por definir";
      const details = data.get("details") || "Quiero recibir orientación para cotizar.";
      captureRecord("cotizacion", { name, phone, projectType, city, size, budget, details });

      const message = [
        "Hola BEH, quiero cotizar un proyecto.",
        "",
        `Nombre: ${name}`,
        `WhatsApp: ${phone}`,
        `Tipo de proyecto: ${projectType}`,
        `Ciudad o zona: ${city}`,
        `Medidas aproximadas: ${size}`,
        `Presupuesto estimado: ${budget}`,
        "",
        `Detalles: ${details}`
      ].join("\n");

      const url = `https://wa.me/573103200976?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener");
    });
  }

  document.querySelectorAll("[data-character-input]").forEach((input) => {
    const form = input.closest("form");
    const counter = input.parentElement ? input.parentElement.querySelector("[data-character-count]") : null;
    const updateCounter = () => {
      if (counter) counter.textContent = `${input.value.length} / ${input.maxLength}`;
      input.classList.toggle("has-value", input.value.trim().length > 0);
    };
    input.addEventListener("input", updateCounter);
    updateCounter();
    if (form) {
      form.addEventListener("submit", () => form.classList.add("is-submitting"));
    }
  });

  const spaceAi = document.querySelector("[data-space-ai]");
  if (spaceAi) {
    const workbench = spaceAi.querySelector(".space-ai-workbench");
    const form = spaceAi.querySelector("[data-space-form]");
    const fileInput = spaceAi.querySelector("[data-space-file]");
    const drop = spaceAi.querySelector("[data-space-drop]");
    const before = spaceAi.querySelector("[data-space-before]");
    const empty = spaceAi.querySelector("[data-space-empty]");
    const compare = spaceAi.querySelector("[data-space-compare]");
    const slider = spaceAi.querySelector("[data-space-slider]");
    const afterWrap = spaceAi.querySelector("[data-space-after-wrap]");
    const after = spaceAi.querySelector("[data-space-after]");
    const proposals = spaceAi.querySelector("[data-space-proposals]");
    const proposalList = spaceAi.querySelector("[data-space-proposal-list]");
    const status = spaceAi.querySelector("[data-space-status]");
    const version = spaceAi.querySelector("[data-space-version]");
    const id = spaceAi.querySelector("[data-space-id]");
    const prompt = spaceAi.querySelector("[data-space-prompt]");
    const objective = spaceAi.querySelector("[data-space-objective]");
    const whatsapp = spaceAi.querySelector("[data-space-whatsapp]");
    const layers = spaceAi.querySelector("[data-space-layers]");
    const explode = spaceAi.querySelector("[data-space-explode]");
    let previewUrl = "";

    const setCompare = (value) => {
      if (!compare) return;
      compare.style.setProperty("--compare", `${value}%`);
    };

    const showPreview = (file) => {
      if (!file || !before) return;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = URL.createObjectURL(file);
      before.src = previewUrl;
      if (empty) empty.hidden = true;
      if (drop) {
        drop.classList.add("has-file");
        const strong = drop.querySelector("strong");
        const small = drop.querySelector("small");
        if (strong) strong.textContent = "Fotografía protegida y lista";
        if (small) small.textContent = file.name;
      }
      if (status) status.textContent = "Evidencia cargada";
      if (proposals) proposals.classList.remove("has-results");
    };

    const selectProposal = (url, index, button) => {
      if (after) after.src = url;
      if (proposalList) {
        proposalList.querySelectorAll(".space-proposal").forEach((item) => item.classList.toggle("is-selected", item === button));
      }
      if (version) version.textContent = `Propuesta personalizada 0${index + 1} · pendiente de validación`;
      setCompare(52);
    };

    const renderProposals = (items) => {
      if (!proposalList || !proposals) return;
      proposalList.innerHTML = "";
      items.forEach((url, index) => {
        const button = document.createElement("button");
        const image = document.createElement("img");
        const label = document.createElement("span");
        button.type = "button";
        button.className = `space-proposal${index === 0 ? " is-selected" : ""}`;
        image.src = url;
        image.alt = `Propuesta espacial ${index + 1} generada para el proyecto`;
        label.textContent = `Propuesta 0${index + 1}`;
        button.append(image, label);
        button.addEventListener("click", () => selectProposal(url, index, button));
        proposalList.appendChild(button);
      });
      proposals.classList.add("has-results");
      if (items[0]) selectProposal(items[0], 0, proposalList.firstElementChild);
    };

    if (fileInput) fileInput.addEventListener("change", () => showPreview(fileInput.files && fileInput.files[0]));
    if (slider) slider.addEventListener("input", () => setCompare(slider.value));

    spaceAi.querySelectorAll("[data-space-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        spaceAi.querySelectorAll("[data-space-mode]").forEach((item) => item.classList.toggle("is-active", item === button));
        const mode = button.dataset.spaceMode;
        if (mode === "before") setCompare(100);
        if (mode === "compare") setCompare(slider ? slider.value : 52);
        if (mode === "after") setCompare(0);
      });
    });

    spaceAi.querySelectorAll(".space-ai-locks button").forEach((button) => {
      button.addEventListener("click", () => button.classList.toggle("is-locked"));
    });

    if (explode && layers) {
      explode.addEventListener("click", () => {
        layers.classList.remove("is-playing");
        window.requestAnimationFrame(() => layers.classList.add("is-playing"));
        window.setTimeout(() => layers.classList.remove("is-playing"), 2600);
      });
    }

    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        if (workbench) workbench.classList.add("is-generating");
        if (status) status.textContent = "Analizando espacio";

        try {
          const response = await fetch(new URL("space_ai.php", window.location.href).href, {
            method: "POST",
            body: new FormData(form)
          });
          const payload = await response.json();
          if (!response.ok || !payload.ok) throw new Error(payload.error || "No fue posible preparar el estudio.");

          if (!Array.isArray(payload.proposals) || !payload.proposals.length) throw new Error("El generador no entregó propuestas.");
          renderProposals(payload.proposals);
          if (status) status.textContent = `${payload.proposals.length} propuestas listas`;
          if (id) id.textContent = payload.record_id;
          if (objective) objective.textContent = form.elements.space_type.value;
          if (afterWrap) afterWrap.classList.add("is-ready");
          if (layers) {
            layers.classList.remove("is-playing");
            window.requestAnimationFrame(() => layers.classList.add("is-playing"));
          }
          setCompare(52);
          if (whatsapp) {
            const message = `Hola BEH, quiero validar el estudio ${payload.record_id}. Brief: ${prompt ? prompt.value : ""}`;
            whatsapp.href = `https://wa.me/573103200976?text=${encodeURIComponent(message)}`;
          }
        } catch (error) {
          if (status) status.textContent = error.message || "Revisa la información";
        } finally {
          window.setTimeout(() => {
            if (workbench) workbench.classList.remove("is-generating");
          }, 900);
        }
      });
    }
  }
})();

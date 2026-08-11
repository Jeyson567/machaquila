(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = document.getElementById("header");
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const hero = document.querySelector(".hero");

  const onScroll = () => {
    header.classList.toggle("is-solid", window.scrollY > 40);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  requestAnimationFrame(() => {
    hero.classList.add("is-ready");
  });

  if (!reduceMotion) {
    const reveals = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => {
      if (!el.closest(".hero")) io.observe(el);
    });

    const layers = document.querySelectorAll("[data-parallax]");
    const updateParallax = () => {
      const vh = window.innerHeight;
      layers.forEach((layer) => {
        const section = layer.closest("section") || layer;
        const rect = section.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh;
        const img = layer.querySelector("img");
        if (img) img.style.transform = `scale(1.08) translate3d(0, ${progress * 36}px, 0)`;
      });
    };
    window.addEventListener("scroll", updateParallax, { passive: true });
    updateParallax();
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  const galleryItems = [...document.querySelectorAll(".gallery-item")];
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  let current = 0;

  const sources = galleryItems.map((item) => {
    const img = item.querySelector("img");
    return { src: img.currentSrc || img.src, alt: img.alt };
  });

  const show = (index) => {
    current = (index + sources.length) % sources.length;
    lightboxImg.src = sources[current].src;
    lightboxImg.alt = sources[current].alt;
  };

  const openLightbox = (index) => {
    show(index);
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => {
      if (!lightbox.classList.contains("is-open")) lightbox.hidden = true;
    }, 350);
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => show(current - 1));
  lightboxNext.addEventListener("click", () => show(current + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
})();

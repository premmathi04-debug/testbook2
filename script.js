document.addEventListener("DOMContentLoaded", () => {
  // Set the footer year dynamically.
  const yearTarget = document.getElementById("year");
  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }

  // Mobile navigation toggle.
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Highlight active nav link based on page location.
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("active");
    }
  });

  // GSAP entrance animations.
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".reveal-up").forEach((element, index) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: index * 0.06,
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
        }
      );
    });

    gsap.fromTo(
      ".page-shell",
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    gsap.utils.toArray("[data-parallax]").forEach((element) => {
      gsap.to(element, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  } else {
    document.querySelectorAll(".reveal-up").forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    });
  }

  // Search and filter logic for exa m categories.
  function setupFilters(searchSelector, cardsSelector, filterSelector) {
    const searchInput = document.querySelector(searchSelector);
    if (!searchInput) return;

    const cards = Array.from(document.querySelectorAll(cardsSelector));
    const filterButtons = document.querySelectorAll(filterSelector);
    let activeFilter = "all";

    function applyFilters() {
      const query = searchInput.value.trim().toLowerCase();
      let visible = 0;

      cards.forEach((card) => {
        const cardText = (card.dataset.search || card.dataset.name || card.textContent || "").toLowerCase();
        const category = card.dataset.category || "";
        const matchesFilter = activeFilter === "all" || category === activeFilter;
        const matchesSearch = !query || cardText.includes(query);
        const show = matchesFilter && matchesSearch;

        card.style.display = show ? "" : "none";
        if (show) visible += 1;
      });

      const existingMessage = searchInput.closest(".controls-wrap")?.parentElement?.querySelector(".no-results");
      if (existingMessage) existingMessage.remove();

      if (visible === 0) {
        const container = searchInput.closest(".controls-wrap")?.parentElement;
        if (container && !container.querySelector(".no-results")) {
          const message = document.createElement("div");
          message.className = "no-results";
          message.textContent = "No matches found. Try another keyword or category.";
          container.appendChild(message);
        }
      }
    }

    searchInput.addEventListener("input", applyFilters);

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter || "all";
        filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
        applyFilters();
      });
    });

    applyFilters();
  }

  setupFilters("#examSearch", ".exam-card", ".filter-btn");
  setupFilters("#bookSearch", ".book-card", ".filter-btn");
});

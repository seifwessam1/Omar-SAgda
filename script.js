
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  // LOADER
  const loader = $("#loader");
  const loaderPercent = $("#loaderPercent");
  const loaderLine = $("#loaderLine");

  let progress = 0;
  let loaderFinished = false;

  const loaderTimer = setInterval(() => {
    if (loaderFinished) return;

    progress = Math.min(progress + 5, 95);

    if (loaderPercent) {
      loaderPercent.textContent = `${progress}%`;
    }

    if (loaderLine) {
      loaderLine.style.width = `${progress}%`;
    }
  }, 120);

  function hideLoader() {
    if (loaderFinished) return;

    loaderFinished = true;
    clearInterval(loaderTimer);

    if (loaderPercent) loaderPercent.textContent = "100%";
    if (loaderLine) loaderLine.style.width = "100%";

    if (loader) {
      loader.classList.add("hidden");
      setTimeout(() => loader.remove(), 850);
    }
  }

  window.addEventListener("load", hideLoader, { once: true });
  setTimeout(hideLoader, 2600);

  if (document.readyState === "complete") {
    hideLoader();
  }

  // SCROLL PROGRESS
  const progressBar = $("#progressBar");
  const navbar = $(".navbar");

  function onScroll() {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage = maxScroll > 0
      ? (window.scrollY / maxScroll) * 100
      : 0;

    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }

    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 20);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // MOBILE MENU
  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "×" : "☰";
    });

    $$("a", navLinks).forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });
  }

  // SCROLL REVEAL
  const revealItems = $$(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // RELATIONSHIP COUNTER: 1 JUNE 2026
  const startDate = new Date(2026, 5, 1, 0, 0, 0);

  const counterIds = [
    "counterYears",
    "counterMonths",
    "counterDays",
    "counterHours",
    "counterMinutes",
    "counterSeconds"
  ];

  function updateCounter() {
    const now = new Date();
    const current = now < startDate ? startDate : now;

    let years = current.getFullYear() - startDate.getFullYear();
    let months = current.getMonth() - startDate.getMonth();
    let days = current.getDate() - startDate.getDate();
    let hours = current.getHours() - startDate.getHours();
    let minutes = current.getMinutes() - startDate.getMinutes();
    let seconds = current.getSeconds() - startDate.getSeconds();

    if (seconds < 0) {
      seconds += 60;
      minutes--;
    }

    if (minutes < 0) {
      minutes += 60;
      hours--;
    }

    if (hours < 0) {
      hours += 24;
      days--;
    }

    if (days < 0) {
      const previousMonth = new Date(
        current.getFullYear(),
        current.getMonth(),
        0
      );

      days += previousMonth.getDate();
      months--;
    }

    if (months < 0) {
      months += 12;
      years--;
    }

    const values = [
      Math.max(0, years),
      Math.max(0, months),
      Math.max(0, days),
      Math.max(0, hours),
      Math.max(0, minutes),
      Math.max(0, seconds)
    ];

    counterIds.forEach((id, index) => {
      const element = document.getElementById(id);

      if (element) {
        element.textContent = String(values[index]).padStart(2, "0");
      }
    });
  }

  updateCounter();
  setInterval(updateCounter, 1000);

  // TOAST MESSAGE
  let toastTimer;

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  // ENVELOPE
  const envelopeArea = $("#envelopeArea");
  const openEnvelope = $("#openEnvelope");

  if (envelopeArea && openEnvelope) {
    openEnvelope.addEventListener("click", () => {
      const isOpen = envelopeArea.classList.toggle("open");

      openEnvelope.setAttribute("aria-expanded", String(isOpen));
      openEnvelope.textContent = isOpen
        ? "اقفلي الظرف 💌"
        : "افتحي الظرف 💌";

      if (isOpen) {
        showToast("رسالة صغيرة مخصوص ليكي ❤️");
      }
    });
  }

  // GALLERY LIGHTBOX
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const closeLightbox = $("#closeLightbox");

  let lastFocusedElement = null;

  function openLightbox(src, alt = "صورة مكبرة") {
    if (!lightbox || !lightboxImage || !src) return;

    lastFocusedElement = document.activeElement;

    lightboxImage.src = src;
    lightboxImage.alt = alt;

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (closeLightbox) closeLightbox.focus();
  }

  function closeLightboxNow() {
    if (!lightbox) return;

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lightboxImage) {
      lightboxImage.src = "";
    }

    if (lastFocusedElement && lastFocusedElement.focus) {
      lastFocusedElement.focus();
    }
  }

  $$(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      const image = $("img", item);

      openLightbox(
        item.dataset.image || (image && image.src),
        image ? image.alt : "صورة مكبرة"
      );
    });
  });

  if (closeLightbox) {
    closeLightbox.addEventListener("click", closeLightboxNow);
  }

  if (lightbox) {
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) {
        closeLightboxNow();
      }
    });
  }

  // ESCAPE KEY
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeLightboxNow();

      if (navLinks && menuToggle) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      }
    }
  });

  // LOVE CALCULATOR
  const name1 = $("#name1");
  const name2 = $("#name2");
  const calculateLove = $("#calculateLove");
  const loveResult = $("#loveResult");
  const lovePercentage = $("#lovePercentage");

  function calculateScore(first, second) {
    const names = [
      first.trim().toLocaleLowerCase(),
      second.trim().toLocaleLowerCase()
    ].sort();

    const combined = names.join("|");
    let hash = 0;

    for (let i = 0; i < combined.length; i++) {
      hash = (hash * 31 + combined.charCodeAt(i)) >>> 0;
    }

    return 55 + (hash % 46);
  }

  if (calculateLove) {
    calculateLove.addEventListener("click", () => {
      const first = name1 ? name1.value.trim() : "";
      const second = name2 ? name2.value.trim() : "";

      if (!first || !second) {
        if (loveResult) {
          loveResult.textContent = "اكتب الاسمين الأول ❤️";
        }

        showToast("اكتب الاسمين عشان نحسب النتيجة ✨");
        return;
      }

      const score = calculateScore(first, second);

      if (lovePercentage) {
        lovePercentage.textContent = `${score}%`;
      }

      if (loveResult) {
        loveResult.textContent =
          `نتيجة ${first} ♥ ${second} هي ${score}% — للتسلية بس ❤️`;
      }
    });
  }

  // SECRET SURPRISE
  // كلمة السر الحالية: Sagda
  const secretForm = $("#secretForm");
  const secretPassword = $("#secretPassword");
  const secretSurprise = $("#secretSurprise");
  const passwordMessage = $("#passwordMessage");
  const lockIcon = $("#lockIcon");

  if (secretForm) {
    secretForm.addEventListener("submit", event => {
      event.preventDefault();

      const entered = secretPassword
        ? secretPassword.value.trim().toLocaleLowerCase()
        : "";

      if (entered === "sagda") {
        if (secretSurprise) {
          secretSurprise.hidden = false;
        }

        if (passwordMessage) {
          passwordMessage.textContent = "صح! المفاجأة اتفتحت ❤️";
        }

        if (lockIcon) {
          lockIcon.textContent = "🔓";
        }

        if (secretPassword) {
          secretPassword.value = "";
        }

        showToast("المفاجأة اتفتحت ❤️");

        if (secretSurprise) {
          secretSurprise.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
          });
        }
      } else {
        if (passwordMessage) {
          passwordMessage.textContent =
            "كلمة السر مش صحيحة، جرّبي تاني ❤️";
        }

        if (lockIcon) {
          lockIcon.textContent = "🔐";
        }

        if (secretPassword) {
          secretPassword.focus();
          secretPassword.select();
        }
      }
    });
  }

  // FINAL HEART BUTTON
  const finalHeartButton = $("#finalHeartButton");

  function createHeartBurst(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
      const heart = document.createElement("span");

      heart.className = "heart-particle";
      heart.textContent = Math.random() > 0.35 ? "♥" : "✦";
      heart.style.left = `${x + (Math.random() - 0.5) * 90}px`;
      heart.style.top = `${y + (Math.random() - 0.5) * 35}px`;
      heart.style.fontSize = `${12 + Math.random() * 17}px`;
      heart.style.animationDuration = `${0.8 + Math.random() * 0.8}s`;

      document.body.appendChild(heart);

      setTimeout(() => heart.remove(), 1800);
    }
  }

  if (finalHeartButton) {
    finalHeartButton.addEventListener("click", () => {
      createHeartBurst(
        window.innerWidth / 2,
        window.innerHeight / 2,
        22
      );

      showToast("خلي الذكريات الحلوة دايمًا قريبة من قلبك ❤️");
    });
  }

  // SMALL HEART EFFECT ON BACKGROUND CLICKS
  document.addEventListener("click", event => {
    if (
      event.target.closest(
        "button, a, input, .lightbox, .envelope, .gallery-item"
      )
    ) {
      return;
    }

    if (Math.random() > 0.45) {
      createHeartBurst(event.clientX, event.clientY, 2);
    }
  });

  // IMAGE FALLBACK
  $$("img").forEach(img => {
    img.addEventListener("error", () => {
      img.style.background = "linear-gradient(135deg, #4a1937, #251020)";
      img.style.minHeight = "120px";
      img.alt = img.alt || "الصورة غير متاحة حاليًا";
    }, { once: true });
  });
});

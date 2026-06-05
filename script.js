const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
  },
);

revealElements.forEach((element) => revealObserver.observe(element));

const switcherButtons = document.querySelectorAll(".page-switcher button");

const pageMap = {
  "coding": "index.html",
  "design": "graphic-design.html",
  "system": "coding.html"
};

switcherButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.view;
    if (pageMap[view]) {
      window.location.href = pageMap[view];
    }
  });
});

const iconDock = document.querySelector(".icon-dock");
const introSection = document.querySelector("#intro");
const footer = document.querySelector(".site-footer");

const updateDockVisibility = () => {
  if (!iconDock || !introSection || !footer) return;

  const start = introSection.offsetTop - window.innerHeight * 0.45;
  const end = footer.offsetTop - window.innerHeight * 0.62;
  const shouldShow = window.scrollY >= start && window.scrollY < end;

  iconDock.classList.toggle("is-visible", shouldShow);
};

window.addEventListener("scroll", updateDockVisibility, { passive: true });
window.addEventListener("resize", updateDockVisibility);
updateDockVisibility();

const languageToggle = document.querySelector(".language-toggle");
const translatableElements = document.querySelectorAll("[data-id][data-en]");
let currentLanguage = "id";

const setLanguage = (language) => {
  currentLanguage = language;
  document.documentElement.lang = language;

  translatableElements.forEach((element) => {
    element.textContent = element.dataset[language];
  });

  if (languageToggle) {
    languageToggle.textContent = language.toUpperCase();
    languageToggle.setAttribute(
      "aria-label",
      language === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia",
    );
  }
};

languageToggle?.addEventListener("click", () => {
  setLanguage(currentLanguage === "id" ? "en" : "id");
});

setLanguage(currentLanguage);

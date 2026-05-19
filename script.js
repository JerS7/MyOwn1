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

switcherButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switcherButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
  });
});

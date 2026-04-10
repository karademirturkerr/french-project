const sliders = document.querySelectorAll("[data-slider]");

sliders.forEach((slider) => {
  const track = slider.querySelector(".slider-track");
  const prev = slider.querySelector("[data-slider-prev]");
  const next = slider.querySelector("[data-slider-next]");

  if (!track || !prev || !next) return;

  const scrollAmount = () => {
    const firstCard = track.querySelector(".slide-card");
    return firstCard ? firstCard.getBoundingClientRect().width + 20 : 320;
  };

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });
});

const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}

const menuToggles = document.querySelectorAll("[data-menu-toggle]");

menuToggles.forEach((button) => {
  const targetId = button.getAttribute("aria-controls");
  const menu = targetId ? document.getElementById(targetId) : null;

  if (!menu) return;

  button.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    button.classList.toggle("is-active", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

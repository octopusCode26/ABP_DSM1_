document.addEventListener("DOMContentLoaded", () => {
  const left = document.querySelector(".burningdown-left");
  const right = document.querySelector(".burningdown-right");
  const btn = document.querySelector(".btn-retomar");

  if (left && right) {
    left.style.opacity = 0;
    right.style.opacity = 0;
    left.style.transform = "translateY(10px)";
    right.style.transform = "translateY(10px)";

    setTimeout(() => {
      left.style.transition = "0.6s ease";
      right.style.transition = "0.6s ease";

      left.style.opacity = 1;
      right.style.opacity = 1;
      left.style.transform = "translateY(0)";
      right.style.transform = "translateY(0)";
    }, 150);
  }

  if (btn) {
    setInterval(() => {
      btn.style.boxShadow = "0 0 18px rgba(212, 160, 23, 0.35)";
      setTimeout(() => {
        btn.style.boxShadow = "none";
      }, 700);
    }, 1400);
  }
});
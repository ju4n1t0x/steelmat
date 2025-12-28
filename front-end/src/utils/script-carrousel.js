// script-carrousel.js
export function initCarouselSync({
  carouselId,
  totalItems,
  eventName,
}) {
  let currentIndex = 0;

  function notifyChange(index) {
    document.dispatchEvent(
      new CustomEvent(eventName, {
        detail: { index, carouselId }
      })
    );
  }

  document.addEventListener("DOMContentLoaded", () => {
    notifyChange(currentIndex);
  });

  document.addEventListener("click", (e) => {
    const target = e.target instanceof HTMLElement ? e.target : null;
    if (!target) return;

    if (!target.closest(`[data-carousel-id="${carouselId}"]`)) return;

    if (target.closest("[data-carousel-next]")) {
      currentIndex = (currentIndex + 1) % totalItems;
      notifyChange(currentIndex);
    }

    if (target.closest("[data-carousel-prev]")) {
      currentIndex = (currentIndex - 1 + totalItems) % totalItems;
      notifyChange(currentIndex);
    }
  });
}



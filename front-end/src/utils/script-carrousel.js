// script-carrousel.js

// Almacenar el estado de cada carrusel
const carouselStates = new Map();

export function initCarouselSync({
  carouselId,
  totalItems,
  eventName,
}) {
  // Resetear índice a 0 cada vez que se inicializa
  carouselStates.set(carouselId, { currentIndex: 0 });

  function notifyChange(index) {
    console.log(`[${carouselId}] Disparando evento ${eventName} con index ${index}`);
    document.dispatchEvent(
      new CustomEvent(eventName, {
        detail: { index, carouselId }
      })
    );
  }

  // Disparar evento inicial con índice 0
  notifyChange(0);

  // Remover listener anterior si existe para evitar duplicados
  const existingHandler = carouselStates.get(carouselId)?.clickHandler;
  if (existingHandler) {
    document.removeEventListener("click", existingHandler);
  }

  // Crear nuevo handler
  const clickHandler = (e) => {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    const carouselElement = target.closest(`[data-carousel-id="${carouselId}"]`);
    if (!carouselElement) return;

    const state = carouselStates.get(carouselId);
    if (!state) return;

    if (target.closest("[data-carousel-next]")) {
      state.currentIndex = (state.currentIndex + 1) % totalItems;
      console.log(`[${carouselId}] Click NEXT - nuevo index: ${state.currentIndex}`);
      notifyChange(state.currentIndex);
    }

    if (target.closest("[data-carousel-prev]")) {
      state.currentIndex = (state.currentIndex - 1 + totalItems) % totalItems;
      console.log(`[${carouselId}] Click PREV - nuevo index: ${state.currentIndex}`);
      notifyChange(state.currentIndex);
    }
  };

  // Guardar referencia al handler
  carouselStates.get(carouselId).clickHandler = clickHandler;

  document.addEventListener("click", clickHandler);
}

// Función para resetear un carrusel específico
export function resetCarousel(carouselId) {
  const state = carouselStates.get(carouselId);
  if (state) {
    state.currentIndex = 0;
  }
}



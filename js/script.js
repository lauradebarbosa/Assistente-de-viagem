// Load components
async function loadComponent({ id, file, callback }) {
  try {
    const response = await fetch(`components/${file}`);
    if (!response.ok) throw new Error(`Failed to load ${file}`);

    const data = await response.text();
    document.getElementById(id).innerHTML = data;
    if (callback) callback();
  } catch (error) {
    console.error(`Error loading ${file}:`, error);
  }
}

// Modals Hero
function initHeroModals() {
  const plusButton = document.querySelector(".travelers-actions .button-plus");
  const minusButton = document.querySelector(
    ".travelers-actions .button-minus"
  );
  const travelersCount = document.querySelector(".travelers-actions span");
  const applyButton = document.querySelector(
    ".modal-travelers .apply-travelers"
  );
  const travelersContainer = document.querySelector(".travelers-container");
  const travelersLabel = document.querySelector(".input-travelers label");

  if (
    !plusButton ||
    !minusButton ||
    !travelersCount ||
    !applyButton ||
    !travelersContainer ||
    !travelersLabel
  )
    return;

  let count = 1;

  function updateTravelersBox() {
    travelersContainer.innerHTML = "";
    for (let i = 1; i <= count; i++) {
      travelersContainer.innerHTML += `
        <div class="travelers-box flex-column">
          <label>Viajante ${i}</label>
          <div class="input-box">
            <img src="/assets/icons/user.svg" alt="User" />
            <input type="number" placeholder="Idade" min="0" />
          </div>
        </div>`;
    }
  }

  plusButton.addEventListener("click", () => {
    travelersCount.textContent = ++count;
    updateTravelersBox();
  });

  minusButton.addEventListener("click", () => {
    if (count > 1) {
      travelersCount.textContent = --count;
      updateTravelersBox();
    }
  });

  applyButton.addEventListener("click", (event) => {
    event.preventDefault();
    travelersLabel.textContent = `${count} viajante${count > 1 ? "s" : ""}`;
    document.querySelector(".hero-data").classList.remove("data-hidden");
  });
  updateTravelersBox();

  document
    .querySelector(".switch-input")
    .addEventListener("change", function () {
      const modalOverlay = document.querySelector(".modal-overlay");
      modalOverlay.style.display = this.checked ? "flex" : "none";
    });

  document
    .querySelector(".switch-input")
    .addEventListener("change", function () {
      const modalOverlay = document.querySelector(".modal-overlay");
      modalOverlay.style.display = this.checked ? "flex" : "none";
    });

  document
    .querySelector(".modal-overlay")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal(true);
      }
    });

  document
    .querySelector(".coupon-title .secundary-button")
    .addEventListener("click", function () {
      closeModal(false);
    });

  document
    .querySelector(".apply-coupon")
    .addEventListener("click", function () {
      closeModal(true);
    });

  function closeModal(keepSwitchOn) {
    const modalOverlay = document.querySelector(".modal-overlay");
    const switchInput = document.querySelector(".switch-input");

    modalOverlay.style.display = "none";

    if (!keepSwitchOn) {
      switchInput.checked = false;
    }
  }
}

// Review Carousel
function initReviewCarousel() {
  const reviewsContainer = document.getElementById("reviews-container");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const paginationContainer = document.getElementById("reviews-pagination");

  if (!reviewsContainer || !prevButton || !nextButton || !paginationContainer)
    return;

  const reviewCards = Array.from(reviewsContainer.children);
  let startIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function getVisibleCards() {
    return window.innerWidth < 768 ? 1 : 3;
  }

  function updateCarousel() {
    const visibleCards = getVisibleCards();
    reviewsContainer.innerHTML = "";

    for (let i = 0; i < visibleCards; i++) {
      const index = (startIndex + i) % reviewCards.length;
      reviewsContainer.appendChild(reviewCards[index].cloneNode(true));
    }

    updatePagination();
  }

  function updatePagination() {
    paginationContainer.innerHTML = "";
    reviewCards.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.classList.add("pagination-dot");
      if (i === startIndex) dot.classList.add("active");
      dot.addEventListener("click", () => {
        startIndex = i;
        updateCarousel();
      });
      paginationContainer.appendChild(dot);
    });
  }

  function nextSlide() {
    startIndex = (startIndex + 1) % reviewCards.length;
    updateCarousel();
  }

  function prevSlide() {
    startIndex = (startIndex - 1 + reviewCards.length) % reviewCards.length;
    updateCarousel();
  }

  prevButton.addEventListener("click", prevSlide);
  nextButton.addEventListener("click", nextSlide);

  reviewsContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  });

  reviewsContainer.addEventListener("touchmove", (e) => {
    touchEndX = e.touches[0].clientX;
  });

  reviewsContainer.addEventListener("touchend", () => {
    if (touchStartX - touchEndX > 50) {
      nextSlide();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
    }
  });

  window.addEventListener("resize", updateCarousel);
  updateCarousel();
}

// FAQ
function initFAQ() {
  const faqContainer = document.getElementById("faq");
  if (!faqContainer) return;

  new MutationObserver(() => {
    const faqs = document.querySelectorAll(".faq-item");
    faqs.forEach((faq) =>
      faq.addEventListener("click", () => faq.classList.toggle("active"))
    );
  }).observe(faqContainer, { childList: true, subtree: true });
}

// Information Slider
function initInformationSlider() {
  const slider = document.querySelector(".information-cards");
  const prevBtn = document.getElementById("prev-information");
  const nextBtn = document.getElementById("next-information");
  const dots = document.querySelectorAll(".dot-information");

  if (!slider || !prevBtn || !nextBtn || !dots.length) return;

  let currentIndex = 0;
  const cardWidth = slider.firstElementChild.offsetWidth + 20;
  let startX,
    isDragging = false,
    scrollLeftStart;

  function updatePaginationDots() {
    dots.forEach((dot, index) =>
      dot.classList.toggle("active", index === currentIndex)
    );
  }

  function updateButtons() {
    prevBtn.disabled = slider.scrollLeft <= 0;
    nextBtn.disabled =
      slider.scrollLeft + slider.clientWidth >= slider.scrollWidth;
  }

  prevBtn.addEventListener("click", () => moveSlider(-1));
  nextBtn.addEventListener("click", () => moveSlider(1));

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      slider.scrollLeft = index * cardWidth;
      currentIndex = index;
      updatePaginationDots();
    });
  });

  function moveSlider(direction) {
    currentIndex = Math.min(
      Math.max(currentIndex + direction, 0),
      dots.length - 1
    );
    slider.scrollLeft = currentIndex * cardWidth;
    updatePaginationDots();
    setTimeout(updateButtons, 300);
  }

  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener("touchmove", (e) => {
    const diff = startX - e.touches[0].clientX;
    if (Math.abs(diff) > 50) {
      moveSlider(diff > 0 ? 1 : -1);
      startX = e.touches[0].clientX;
    }
  });

  slider.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX;
    scrollLeftStart = slider.scrollLeft;
    slider.style.cursor = "grabbing";
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const diff = e.pageX - startX;
    slider.scrollLeft = scrollLeftStart - diff;
  });

  slider.addEventListener("mouseup", () => {
    isDragging = false;
    slider.style.cursor = "grab";
  });

  slider.addEventListener("mouseleave", () => {
    isDragging = false;
    slider.style.cursor = "grab";
  });

  slider.addEventListener("scroll", updateButtons);
  updateButtons();
  updatePaginationDots();
}

// Load page components
const components = [
  { id: "topbar", file: "topbar.html" },
  { id: "hero", file: "hero.html", callback: initHeroModals },
  { id: "benefits", file: "benefits.html" },
  { id: "steps", file: "steps.html" },
  { id: "reviews", file: "reviews.html", callback: initReviewCarousel },
  { id: "video", file: "video.html" },
  {
    id: "information",
    file: "information.html",
    callback: initInformationSlider,
  },
  { id: "faq", file: "faq.html", callback: initFAQ },
  { id: "media", file: "media.html" },
  { id: "footer", file: "footer.html" },
];

// Load all components
components.forEach(loadComponent);

// Initialize features
document.addEventListener("DOMContentLoaded", () => {
  initReviewCarousel();
  initFAQ();
  initHeroModals();
});

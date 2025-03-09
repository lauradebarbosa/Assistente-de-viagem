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

  if (
    !plusButton ||
    !minusButton ||
    !travelersCount ||
    !applyButton ||
    !travelersContainer
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
    document.querySelector(".hero-data").classList.remove("data-hidden");
  });

  updateTravelersBox();

  document
    .querySelector(".switch-input")
    .addEventListener("change", function () {
      const modalCoupon = document.querySelector(".modal-coupon");
      modalCoupon.style.display = this.checked ? "block" : "none";
    });
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
      dot.classList.add("pagination-dot", i === startIndex && "active");
      dot.addEventListener("click", () => {
        startIndex = i;
        updateCarousel();
      });
      paginationContainer.appendChild(dot);
    });
  }

  prevButton.addEventListener("click", () => {
    startIndex = (startIndex - 1 + reviewCards.length) % reviewCards.length;
    updateCarousel();
  });

  nextButton.addEventListener("click", () => {
    startIndex = (startIndex + 1) % reviewCards.length;
    updateCarousel();
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

  prevBtn.addEventListener("click", () => {
    slider.scrollLeft -= cardWidth;
    currentIndex = Math.max(currentIndex - 1, 0);
    updatePaginationDots();
    setTimeout(updateButtons, 300);
  });

  nextBtn.addEventListener("click", () => {
    slider.scrollLeft += cardWidth;
    currentIndex = Math.min(currentIndex + 1, dots.length - 1);
    updatePaginationDots();
    setTimeout(updateButtons, 300);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      slider.scrollLeft = index * cardWidth;
      currentIndex = index;
      updatePaginationDots();
    });
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

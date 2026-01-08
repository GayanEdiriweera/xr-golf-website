// Initialize AOS (Animate on Scroll)
document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS
  AOS.init({
    once: true,
    offset: 100,
    duration: 800,
    easing: "ease-out-cubic",
  });

  // Handle form submission
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", handleFormSubmit);
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Parallax effect on hero
  setupHeroParallax();

  // Hide scroll indicator on scroll
  setupScrollIndicator();
});

// Form submission handler
function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const emailInput = form.querySelector('input[type="email"]');
  const submitButton = form.querySelector(".submit-button");
  const email = emailInput.value.trim();

  if (!email) return;

  // Disable button and show loading state
  submitButton.disabled = true;
  const originalContent = submitButton.innerHTML;
  submitButton.innerHTML = `
        <span>Subscribing...</span>
        <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32">
                <animate attributeName="stroke-dashoffset" values="32;0" dur="1s" repeatCount="indefinite"/>
            </circle>
        </svg>
    `;

  // Simulate API call (replace with actual mailing list API)
  setTimeout(() => {
    // Show success state
    submitButton.innerHTML = `
            <span>Subscribed!</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
    submitButton.style.background = "#22c55e";
    emailInput.value = "";

    // Reset after 3 seconds
    setTimeout(() => {
      submitButton.innerHTML = originalContent;
      submitButton.style.background = "";
      submitButton.disabled = false;
    }, 3000);
  }, 1500);
}

// Subtle parallax effect on hero image
function setupHeroParallax() {
  const heroImage = document.querySelector(".hero-image");
  if (!heroImage) return;

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const heroHeight = window.innerHeight;

        if (scrolled < heroHeight) {
          const translateY = scrolled * 0.3;
          const scale = 1 + scrolled * 0.0002;
          heroImage.style.transform = `translateY(${translateY}px) scale(${scale})`;
        }

        ticking = false;
      });
      ticking = true;
    }
  });
}

// Hide scroll indicator when user scrolls
function setupScrollIndicator() {
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (!scrollIndicator) return;

  let hidden = false;

  window.addEventListener("scroll", () => {
    if (!hidden && window.pageYOffset > 100) {
      scrollIndicator.style.opacity = "0";
      scrollIndicator.style.transform = "translateX(-50%) translateY(20px)";
      hidden = true;
    } else if (hidden && window.pageYOffset <= 100) {
      scrollIndicator.style.opacity = "1";
      scrollIndicator.style.transform = "translateX(-50%) translateY(0)";
      hidden = false;
    }
  });
}

// Intersection Observer for additional animations
function setupIntersectionObserver() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".feature-section").forEach((section) => {
    observer.observe(section);
  });
}

// Scroll-based blend effect for Blended Realities section
function setupBlendEffect() {
  const blendContainer = document.getElementById("blend-container");
  const blendOverlay = document.getElementById("blend-overlay");

  if (!blendContainer || !blendOverlay) return;

  // Use Intersection Observer for performance
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.addEventListener("scroll", handleBlendScroll, {
            passive: true,
          });
          handleBlendScroll(); // Initial call
        } else {
          window.removeEventListener("scroll", handleBlendScroll);
        }
      });
    },
    { threshold: 0, rootMargin: "100px" }
  );

  observer.observe(blendContainer);

  let ticking = false;

  function handleBlendScroll() {
    if (ticking) return;

    ticking = true;
    requestAnimationFrame(() => {
      const rect = blendContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress: 0 when container enters viewport, 1 when it reaches top quarter
      // This creates a nice transition as you scroll through the section
      const containerCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;

      // Start transition when container is in lower half of viewport
      // Complete when container center is at viewport center
      const startPoint = windowHeight * 0.8;
      const endPoint = windowHeight * 0.3;

      let progress = 0;

      if (containerCenter <= startPoint && containerCenter >= endPoint) {
        progress = 1 - (containerCenter - endPoint) / (startPoint - endPoint);
      } else if (containerCenter < endPoint) {
        progress = 1;
      }

      // Apply easing for smoother feel
      const easedProgress = easeInOutCubic(progress);

      blendOverlay.style.opacity = easedProgress;

      ticking = false;
    });
  }

  // Easing function for smoother animation
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}

// Initialize intersection observer
document.addEventListener("DOMContentLoaded", setupIntersectionObserver);

// Initialize blend effect
document.addEventListener("DOMContentLoaded", setupBlendEffect);


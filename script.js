

class AtomicTheoryApp {
  constructor() {
    this.elements = {
      menuToggle: document.getElementById("menu-toggle"),
      nav: document.querySelector("nav"),
      backToTop: document.getElementById("back-to-top"),
      cards: document.querySelectorAll(".card"),
      subCards: document.querySelectorAll(".sub-card")
    };

    this.isScrolling = false;
    this.scrollTimeout = null;
    
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupBackToTop();
    this.setupScrollAnimations();
    this.setupIntersectionObserver();
    this.setupSmoothScrolling();
  }


  setupMobileMenu() {
    if (!this.elements.menuToggle || !this.elements.nav) return;

    this.elements.menuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggleMobileMenu();
    });


    document.addEventListener("click", (e) => {
      if (!e.target.closest("header") && this.elements.nav.classList.contains("active")) {
        this.closeMobileMenu();
      }
    });

    
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.elements.nav.classList.contains("active")) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.elements.nav.classList.toggle("active");
    this.elements.menuToggle.setAttribute(
      "aria-expanded",
      this.elements.nav.classList.contains("active")
    );
  }

  closeMobileMenu() {
    this.elements.nav.classList.remove("active");
    this.elements.menuToggle.setAttribute("aria-expanded", "false");
  }


  setupBackToTop() {
    if (!this.elements.backToTop) return;


    window.addEventListener("scroll", this.throttle(() => {
      this.handleBackToTopVisibility();
    }, 16)); // ~60fps

    this.elements.backToTop.addEventListener("click", (e) => {
      e.preventDefault();
      this.scrollToTop();
    });
  }

  handleBackToTopVisibility() {
    const shouldShow = window.pageYOffset > 300;
    const isVisible = this.elements.backToTop.style.display === "block";

    if (shouldShow && !isVisible) {
      this.elements.backToTop.style.display = "block";
      this.elements.backToTop.style.opacity = "0";
      this.elements.backToTop.style.transform = "translateY(20px)";
      

      this.elements.backToTop.offsetHeight;
      
      this.elements.backToTop.style.opacity = "1";
      this.elements.backToTop.style.transform = "translateY(0)";
    } else if (!shouldShow && isVisible) {
      this.elements.backToTop.style.opacity = "0";
      this.elements.backToTop.style.transform = "translateY(20px)";
      
      setTimeout(() => {
        this.elements.backToTop.style.display = "none";
      }, 300);
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);


    [...this.elements.cards, ...this.elements.subCards].forEach((element) => {
      observer.observe(element);
    });
  }


  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector("header").offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });

          
          this.closeMobileMenu();
        }
      });
    });
  }


  setupScrollAnimations() {
    
    const style = document.createElement("style");
    style.textContent = `
      .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      
      .card, .sub-card {
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .back-to-top-enter {
        animation: backToTopEnter 0.3s ease-out forwards;
      }
      
      @keyframes backToTopEnter {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.8);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;
    document.head.appendChild(style);
  }


  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }


  handleError(error, context) {
    console.warn(`AtomicTheoryApp Error in ${context}:`, error);
  }
}


function initializeApp() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      new AtomicTheoryApp();
    });
  } else {
    new AtomicTheoryApp();
  }
}


initializeApp();


if (window.performance && window.performance.mark) {
  window.performance.mark("atomic-theory-app-loaded");
}

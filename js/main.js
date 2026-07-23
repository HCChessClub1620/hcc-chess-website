document.addEventListener("DOMContentLoaded", () => {
  const getIncludeBasePath = () => {
    const path = window.location.pathname;
    return path.includes("/pages/") ? "../includes/" : "includes/";
  };

  const fixInjectedNavLinks = (target) => {
    if (!target) return;
    const isInPagesFolder = window.location.pathname.includes("/pages/");
    const normalizedPath = window.location.pathname.toLowerCase().replace(/\/+$/, "") || "/";
    const isHomePage = normalizedPath === "/" || normalizedPath.endsWith("/index.html");

    target.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute("href");
      if (href === "../index.html") {
        link.setAttribute("href", isInPagesFolder ? "../index.html" : "index.html");
      } else if (href === "about.html") {
        link.setAttribute("href", isInPagesFolder ? "about.html" : "pages/about.html");
      } else if (href === "founders.html") {
        link.setAttribute("href", isInPagesFolder ? "founders.html" : "pages/founders.html");
      } else if (href === "coaches.html") {
        link.setAttribute("href", isInPagesFolder ? "coaches.html" : "pages/coaches.html");
      } else if (href === "programs.html") {
        link.setAttribute("href", isInPagesFolder ? "programs.html" : "pages/programs.html");
      } else if (href === "why-us.html") {
        link.setAttribute("href", isInPagesFolder ? "why-us.html" : "pages/why-us.html");
      } else if (href === "register.html") {
        link.setAttribute("href", isInPagesFolder ? "register.html" : "pages/register.html");
      } else if (href === "fees.html") {
        link.setAttribute("href", isInPagesFolder ? "fees.html" : "pages/fees.html");
      } else if (href === "gallery.html") {
        link.setAttribute("href", isInPagesFolder ? "gallery.html" : "pages/gallery.html");
      } else if (href === "students.html") {
        link.setAttribute("href", isInPagesFolder ? "students.html" : "pages/students.html");
      } else if (href === "reviews.html") {
        link.setAttribute("href", isInPagesFolder ? "reviews.html" : "pages/reviews.html");
      } else if (href === "sponsors.html") {
        link.setAttribute("href", isInPagesFolder ? "sponsors.html" : "pages/sponsors.html");
      } else if (href === "contact.html") {
        link.setAttribute("href", isInPagesFolder ? "contact.html" : "pages/contact.html");
      }
    });

    const navList = target.querySelector("#mainNav ul");
    const existingHomeItem = navList?.querySelector('a[data-home-link="true"]')?.closest("li");

    if (isHomePage) {
      existingHomeItem?.remove();
      return;
    }

    if (!navList || existingHomeItem) return;

    const homeItem = document.createElement("li");
    const homeLink = document.createElement("a");
    homeLink.setAttribute("href", isInPagesFolder ? "../index.html" : "index.html");
    homeLink.setAttribute("data-home-link", "true");
    homeLink.setAttribute("aria-label", "Home");
    homeLink.setAttribute("title", "Home");
    homeLink.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" focusable="false"><path fill="currentColor" d="M12 3l9 8h-3v10h-5v-6H11v6H6V11H3l9-8z"></path></svg>';
    homeItem.appendChild(homeLink);

    const aboutItem = navList.querySelector('a[href="about.html"], a[href="pages/about.html"]')?.closest("li");
    if (aboutItem) {
      navList.insertBefore(homeItem, aboutItem);
    } else {
      navList.prepend(homeItem);
    }
  };

  const initNavDropdowns = (target) => {
    if (!target) return;
    const toggles = target.querySelectorAll('.drop-toggle');

    toggles.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const li = btn.closest('.has-dropdown');
        if (!li) return;
        const isOpen = li.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

        // close other dropdowns in this header
        target.querySelectorAll('.has-dropdown').forEach((other) => {
          if (other !== li) {
            other.classList.remove('open');
            other.querySelector('.drop-toggle')?.setAttribute('aria-expanded', 'false');
          }
        });
      });
    });

    // Close dropdowns when clicking outside (only attach once)
    if (!window.__navDropdownInit) {
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.has-dropdown')) {
          document.querySelectorAll('.has-dropdown').forEach((el) => {
            el.classList.remove('open');
            el.querySelector('.drop-toggle')?.setAttribute('aria-expanded', 'false');
          });
        }
      });
      window.__navDropdownInit = true;
    }
  };

  const initMobileNav = (target) => {
    if (!target) return;
    const menuToggle = target.querySelector("#menuToggle");
    const mainNav = target.querySelector("#mainNav");
    if (!menuToggle || !mainNav) return;

    const closeMenu = () => {
      mainNav.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = mainNav.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    if (!window.__mobileNavOutsideClickInit) {
      document.addEventListener("click", (e) => {
        const clickedInsideNav = e.target.closest("#mainNav") || e.target.closest("#menuToggle");
        if (!clickedInsideNav) {
          document.querySelectorAll("#mainNav.active").forEach((nav) => nav.classList.remove("active"));
          document.querySelectorAll("#menuToggle[aria-expanded='true']").forEach((btn) => {
            btn.setAttribute("aria-expanded", "false");
          });
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        document.querySelectorAll("#mainNav.active").forEach((nav) => nav.classList.remove("active"));
        document.querySelectorAll("#menuToggle[aria-expanded='true']").forEach((btn) => {
          btn.setAttribute("aria-expanded", "false");
        });
      });

      window.__mobileNavOutsideClickInit = true;
    }
  };

  const loadSharedIncludes = () => {
    const headerTarget = document.getElementById("site-header");
    const footerTarget = document.getElementById("site-footer");
    const includeBase = getIncludeBasePath();

    const loadInclude = (target, fileName) => {
      if (!target) return;

      const candidates = [
        `${includeBase}${fileName}`,
        fileName === "header.html" ? "./includes/header.html" : "./includes/footer.html",
        fileName === "header.html" ? "../includes/header.html" : "../includes/footer.html"
      ];

      const tryFetch = (index) => {
        if (index >= candidates.length) {
          console.error(`Failed to load ${fileName}`);
          return;
        }

        fetch(candidates[index])
          .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
          })
          .then((html) => {
            target.innerHTML = html;
            if (fileName === "header.html") {
              fixInjectedNavLinks(target);
              try {
                initNavDropdowns(target);
                initMobileNav(target);
              } catch (err) {
                console.error('initNavDropdowns error', err);
              }
            }
          })
          .catch(() => tryFetch(index + 1));
      };

      tryFetch(0);
    };

    loadInclude(headerTarget, "header.html");
    loadInclude(footerTarget, "footer.html");
  };

  loadSharedIncludes();

  const paymentMethod = document.getElementById("paymentMethod");
  const paymentSection = document.getElementById("paymentSection");

  if (paymentMethod && paymentSection) {
    const renderPaymentSection = (method) => {
      if (method === "Venmo") {
        paymentSection.innerHTML = `
          <div class="payment-display">
            <h3>Pay Using Venmo</h3>
            <img src="https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1782076247/VenmoPayment_jsrtv4.jpg" loading="lazy" alt="Venmo payment">
            <br>
            <a href="https://venmo.com/" target="_blank" rel="noopener" class="btn">Open Venmo</a>
          </div>
        `;
      } else if (method === "Zelle") {
        paymentSection.innerHTML = `
          <div class="payment-display">
            <h3>Pay Using Zelle</h3>
            <img src="https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1782076247/ZellePayment_ehbzko.jpg" loading="lazy" alt="Zelle payment">
            <p>
              Send payment to:<br>
              hamiltonsdchess@gmail.com
            </p>
          </div>
        `;
      } else {
        paymentSection.innerHTML = "<p>Select a payment method to view payment instructions.</p>";
      }
    };

    paymentMethod.addEventListener("change", function () {
      renderPaymentSection(this.value);
    });

    const urlMethod = new URLSearchParams(window.location.search).get("method");
    if (urlMethod === "Venmo" || urlMethod === "Zelle") {
      paymentMethod.value = urlMethod;
      renderPaymentSection(urlMethod);
      setTimeout(() => {
        document.getElementById("paymentSection")?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }

  const registrationForm = document.getElementById("registrationForm");
  const successPopup = document.getElementById("successPopup");

  if (registrationForm) {
    registrationForm.addEventListener("submit", function () {
      const submitButton = registrationForm.querySelector("button");
      if (submitButton) {
        submitButton.disabled = true;
      }

      setTimeout(() => {
        if (successPopup) {
          successPopup.style.display = "flex";
        }
      }, 1200);
    });
  }

  window.closePopup = function () {
    if (successPopup) {
      successPopup.style.display = "none";
    }

    if (registrationForm) {
      registrationForm.reset();
      registrationForm.querySelectorAll("input").forEach((field) => {
        field.value = "";
      });
      registrationForm.querySelectorAll("select").forEach((select) => {
        select.selectedIndex = 0;
      });
    }

    const paymentContainer = document.getElementById("paymentSection");
    if (paymentContainer) {
      paymentContainer.innerHTML = "<p>Select a payment method to view payment instructions.</p>";
    }

    const submitButton = document.querySelector(".register-submit");
    if (submitButton) {
      submitButton.disabled = false;
    }
  };

  window.sendReceiptEmail = function () {
    const student = document.querySelector('[name="entry.623997903"]')?.value || "";
    const parent = document.querySelector('[name="entry.60020519"]')?.value || "";
    const email = document.querySelector('[name="entry.2057450137"]')?.value || "";
    const payment = document.getElementById("paymentMethod")?.value || "";

    const subject = encodeURIComponent(`Hamilton Chess Club Payment Receipt - ${student} (${parent})`);
    const body = encodeURIComponent(`Hello Hamilton Chess Club,

I have completed payment for ${student}.

Student Name: ${student}
Parent Name: ${parent}
Parent Email: ${email}
Payment Method: ${payment}

I have attached payment screenshot for your reference.

Thank you.
`);

    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=hamiltonsdchess@gmail.com&su=${subject}&body=${body}`,
      "_blank"
    );
  };

  const reviewForm = document.getElementById("reviewForm");
  const reviewSuccessPopup = document.getElementById("reviewSuccessPopup");

  if (reviewForm) {
    reviewForm.addEventListener("submit", function () {
      const button = reviewForm.querySelector("button");
      if (button) {
        button.disabled = true;
      }

      setTimeout(() => {
        if (reviewSuccessPopup) {
          reviewSuccessPopup.style.display = "flex";
        }
      }, 1500);
    });
  }

  window.closeReviewPopup = function () {
    if (reviewSuccessPopup) {
      reviewSuccessPopup.style.display = "none";
    }

    if (reviewForm) {
      reviewForm.reset();
      const button = reviewForm.querySelector("button");
      if (button) {
        button.disabled = false;
      }
    }
  };

  const reviewContainer = document.getElementById("dynamicReviews");
  if (reviewContainer) {
    fetch(
      "https://script.google.com/macros/s/AKfycbzu7Wj2UGI6EDhpb6F0vl25BfyzG8K8eMyb5x0UG-iBiIbbKNVdaRGeDrH4r4jiPXvk7w/exec"
    )
      .then((response) => response.json())
      .then((data) => {
        reviewContainer.innerHTML = "";
        data.forEach((review) => {
          reviewContainer.innerHTML += `
            <div class="testimonial-card">
              <div class="stars">${"★".repeat(review.rating)}</div>
              <p>${review.review}</p>
              <h4>${review.parent}</h4>
              <span>Parent of ${review.student} • ${review.program}</span>
            </div>
          `;
        });
      })
      .catch((error) => {
        console.error("Review Load Error:", error);
      });
  }

  const studentPages = document.querySelectorAll("#student-spotlight .spotlight-page");
  const studentPrevBtn = document.querySelector("#student-spotlight .spotlight-btn.prev");
  const studentNextBtn = document.querySelector("#student-spotlight .spotlight-btn.next");

  if (studentPages.length > 0 && studentPrevBtn && studentNextBtn) {
    let currentStudentPage = 0;

    const totalStudents = document.querySelectorAll("#student-spotlight .spotlight-card").length;
    const spotlightTotal = document.getElementById("spotlightTotalInfo");
    if (spotlightTotal) spotlightTotal.textContent = `${totalStudents} Students Featured`;

    const updateStudentSpotlight = () => {
      studentPages.forEach((page) => page.classList.remove("active"));
      studentPages[currentStudentPage].classList.add("active");
      studentPrevBtn.style.display = currentStudentPage === 0 ? "none" : "flex";
      studentNextBtn.style.display = currentStudentPage === studentPages.length - 1 ? "none" : "flex";
      const pageInfo = document.getElementById("spotlightPageInfo");
      if (pageInfo) pageInfo.textContent = `Page ${currentStudentPage + 1} / ${studentPages.length}`;
    };

    window.changeSpotlight = function (dir) {
      currentStudentPage += dir;
      if (currentStudentPage < 0) currentStudentPage = 0;
      if (currentStudentPage > studentPages.length - 1) currentStudentPage = studentPages.length - 1;
      updateStudentSpotlight();
    };

    updateStudentSpotlight();
  }

  let currentPage = 1;
  const albumsPerPage = 3;

  const showTournamentPage = (page) => {
    const cards = document.querySelectorAll(".tournament-card");
    if (!cards.length) return;

    const totalPages = Math.ceil(cards.length / albumsPerPage);
    currentPage = Math.max(1, Math.min(page, totalPages));

    cards.forEach((card, index) => {
      const start = (currentPage - 1) * albumsPerPage;
      const end = start + albumsPerPage;
      card.style.display = index >= start && index < end ? "" : "none";
    });

    const pageInfo = document.getElementById("galleryPageInfo");
    if (pageInfo) {
      pageInfo.textContent = `${currentPage} / ${totalPages}`;
    }

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    if (prevBtn) prevBtn.style.display = currentPage === 1 ? "none" : "inline-flex";
    if (nextBtn) nextBtn.style.display = currentPage === totalPages ? "none" : "inline-flex";
  };

  window.prevTournamentPage = function () {
    showTournamentPage(currentPage - 1);
  };

  window.nextTournamentPage = function () {
    showTournamentPage(currentPage + 1);
  };

  window.addEventListener("load", () => {
    showTournamentPage(1);
  });

  let currentTournament = null;
  let currentIndex = 0;
  let currentImages = [];

  const tournaments = {
    "wscf-Feb-2026": [
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1782000237/1_owjwt7.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1782000239/3_s7nyq5.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1782000238/2_y4xqyp.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1782000242/5_x6qb93.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1782000241/4_brkdaz.jpg"
    ]
  };

  const updateImage = () => {
    const img = document.getElementById("lightbox-img");
    const prevBtn = document.querySelector(".lightbox-prev");
    const nextBtn = document.querySelector(".lightbox-next");
    if (!img || !currentImages.length) return;

    img.src = currentImages[currentIndex];
    if (prevBtn) prevBtn.style.display = currentIndex === 0 ? "none" : "flex";
    if (nextBtn) nextBtn.style.display = currentIndex === currentImages.length - 1 ? "none" : "flex";
  };

  window.openTournament = function (name) {
    currentTournament = name;
    currentImages = tournaments[name] || [];
    currentIndex = 0;
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
      lightbox.style.display = "flex";
    }
    updateImage();
  };

  window.nextImage = function () {
    if (!currentImages.length) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateImage();
  };

  window.prevImage = function () {
    if (!currentImages.length) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateImage();
  };

  window.closeLightbox = function () {
    const lightbox = document.getElementById("lightbox");
    if (lightbox) lightbox.style.display = "none";
  };

  window.changeImage = function (dir) {
    if (!currentImages.length) return;
    currentIndex += dir;
    if (currentIndex < 0) currentIndex = currentImages.length - 1;
    if (currentIndex >= currentImages.length) currentIndex = 0;
    updateImage();
  };

  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        window.closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    const lb = document.getElementById("lightbox");
    if (lb && lb.style.display === "flex") {
      if (e.key === "ArrowRight") window.nextImage();
      if (e.key === "ArrowLeft") window.prevImage();
      if (e.key === "Escape") window.closeLightbox();
    }
  });

  window.openSpotlightLightbox = function (src) {
    const box = document.getElementById("spotlightLightbox");
    const img = document.getElementById("spotlightLightboxImg");
    if (box && img) {
      img.src = src;
      box.style.display = "flex";
    }
  };

  window.closeSpotlightLightbox = function () {
    const box = document.getElementById("spotlightLightbox");
    if (box) box.style.display = "none";
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;

      e.preventDefault();
      const yOffset = -120;
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  document.querySelectorAll("img").forEach((img) => {
    img.loading = "eager";
  });
});

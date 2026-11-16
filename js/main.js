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
      } else if (href === "events.html") {
        link.setAttribute("href", isInPagesFolder ? "events.html" : "pages/events.html");
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

  const fixInjectedFooterLinks = (target) => {
    if (!target) return;
    const isInPagesFolder = window.location.pathname.includes("/pages/");

    target.querySelectorAll('a[data-page-link], a[href$="privacy-policy.html"]').forEach((link) => {
      const page = link.getAttribute("data-page-link") || "privacy-policy.html";
      if (!page) return;
      link.setAttribute("href", isInPagesFolder ? page : `pages/${page}`);
    });
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
            } else if (fileName === "footer.html") {
              fixInjectedFooterLinks(target);
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

  // ============================================
  // TOURNAMENT FEE DATE CONFIGURATION
  // ============================================
  // Set to true ONLY when testing.
  // Set back to false before going live.
  const USE_TEST_DATE = false;

  // Test dates:
  // Jan 23, 2027 = Early Bird ($30)
  // Jan 24, 2027 = Standard ($35)
  //
  // Change this value to test different scenarios.
  const TEST_DATE = new Date(2027, 0, 24, 12, 0, 0);

  // Actual Early Bird deadline: Jan 23, 2027 11:59:59 PM
  // $30 applies through all of Jan 23
  // $35 applies from Jan 24 onwards
  const earlyBirdCutoff = new Date(2027, 0, 23, 23, 59, 59);

  // ============================================
  // CLASS PROGRAM FEE DATE CONFIGURATION
  // ============================================
  // Set to true while testing register.html, then set back to false before going live.
  const USE_CLASS_PROGRAM_TEST_DATE = false;

  // Sep 29, 2026 = Early Bird pricing.
  // Change to Oct 1, 2026 to test regular pricing after the Sep 30 cutoff.
  const CLASS_PROGRAM_TEST_DATE = new Date(2026, 9, 01, 12, 0, 0);

  // Early Bird pricing applies through Sep 30, 2026.
  const classProgramEarlyBirdCutoff = new Date(2026, 8, 30, 23, 59, 59);

  // Use test date or actual current date
  const currentDate = USE_TEST_DATE ? TEST_DATE : new Date();
  const classProgramCurrentDate = USE_CLASS_PROGRAM_TEST_DATE
    ? CLASS_PROGRAM_TEST_DATE
    : new Date();

  const paymentMethod = document.getElementById("paymentMethod");
  const paymentSection = document.getElementById("paymentSection");
    const paymentScreenshotNote = document.getElementById("paymentScreenshotNote");
  const fallKickoffAttendance = document.getElementById("fallKickoffAttendance");
  const feeMessage = document.getElementById("feeMessage");
  const paymentGroup = document.getElementById("paymentGroup");
  const paymentFeeNotice = document.getElementById("paymentFeeNotice");
  const chessLevel = document.getElementById("chessLevel");
  const familyDiscount = document.getElementById("familyDiscount");
  const squarePaymentUrl = "https://square.link/u/uTetALxk";
  const squarePaymentMethod = "Credit/Debit Card(Square)";

  // Returns null when sponsored (no fee) or attendance not yet selected
  const getTournamentFee = () => {
    if (!fallKickoffAttendance || fallKickoffAttendance.value !== "No") return null;
    return currentDate <= earlyBirdCutoff ? 20 : 25;
  };

  const getClassProgramFee = () => {
    if (!chessLevel || !chessLevel.value) return null;

    const earlyBird = classProgramCurrentDate <= classProgramEarlyBirdCutoff;
    const fees = {
      Beginner: earlyBird ? 100 : 115,
      Intermediate: earlyBird ? 125 : 140,
      Advanced: earlyBird ? 125 : 140
    };
    const baseFee = fees[chessLevel.value];
    if (!baseFee) return null;

    return familyDiscount?.value === "Yes" ? baseFee - 10 : baseFee;
  };

  const calculateSquareTotal = (registrationFee) => {
    const squareRate = 0.033;
    const squareFlatFee = 0.3;
    const total = (registrationFee + squareFlatFee) / (1 - squareRate);

    return Math.ceil(total * 100) / 100;
  };

  if (paymentMethod && paymentSection) {
    const renderPaymentSection = (method) => {
        if (paymentScreenshotNote) {
          paymentScreenshotNote.hidden = method === squarePaymentMethod;
        }

      const isClassProgram = Boolean(chessLevel);
      const fee = isClassProgram ? getClassProgramFee() : getTournamentFee();
      const programName = chessLevel?.value || "";
      const feeLine = fee
        ? isClassProgram
          ? `${programName} Program Registration Fee: $${fee.toFixed(2)}`
          : `Tournament Registration Fee: $${fee.toFixed(2)}`
        : "";
      const squareTotalAmount = fee ? calculateSquareTotal(fee) : 0;
      const squareProcessingFee = (squareTotalAmount * 0.033 + 0.3).toFixed(3);
      const squareTotal = squareTotalAmount.toFixed(2);

      if (method === "Venmo") {
        paymentSection.innerHTML = `
          <div class="payment-display">
            <h3>Pay Using Venmo</h3>
            <img src="https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1782076247/VenmoPayment_jsrtv4.jpg" loading="lazy" alt="Venmo payment">
            <p>
              ${feeLine ? `<strong>${feeLine}</strong><br>` : ""}
              Please send${fee ? ` $${fee}` : ""} to Venmo Account:<br>
              @Bala-Narayanan
            </p>
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
              ${feeLine ? `<strong>${feeLine}</strong><br>` : ""}
              Please send${fee ? ` $${fee}` : ""} to Zelle Account:<br>
              hamiltonsdchess
            </p>
          </div>
        `;
      } else if (method === squarePaymentMethod || method === "Square") {
        paymentSection.innerHTML = `
          <div class="payment-display">
            <h3>Pay with Credit/Debit Card using Square</h3>
            ${feeLine ? `
              <p><strong>${feeLine}</strong></p>
              <p>Square Processing Fee: <strong>$${squareProcessingFee}</strong><br>
              Total Amount Due: <strong>$${squareTotal}</strong></p>
            ` : ""}
            <p>Complete your payment securely with a credit or debit card.</p>
            <a href="${squarePaymentUrl}" target="_blank" rel="noopener" class="btn btn-payment">Pay with Credit/Debit Card</a>
          </div>
        `;
      } else {
        paymentSection.innerHTML = feeLine
          ? `<p><strong>${feeLine}</strong></p><p>Select a payment method to view payment instructions.</p>`
          : "<p>Select a payment method to view payment instructions.</p>";
      }
    };

    paymentMethod.addEventListener("change", function () {
      renderPaymentSection(this.value);
    });

    const urlMethod = new URLSearchParams(window.location.search).get("method");
    if (urlMethod === "Venmo" || urlMethod === "Zelle" || urlMethod === "Square") {
      const selectedMethod = urlMethod === "Square" ? squarePaymentMethod : urlMethod;
      paymentMethod.value = selectedMethod;
      renderPaymentSection(selectedMethod);
      setTimeout(() => {
        document.getElementById("paymentSection")?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }

    if (fallKickoffAttendance) {
      fallKickoffAttendance.addEventListener("change", () => {
        renderPaymentSection(paymentMethod.value);
      });
    }

    [chessLevel, familyDiscount].forEach((field) => {
      field?.addEventListener("change", () => {
        renderPaymentSection(paymentMethod.value);
      });
    });
  }

  if (fallKickoffAttendance && feeMessage) {
    const renderFeeMessage = (value) => {
      if (value === "Yes") {
        feeMessage.textContent = "Your tournament registration fee is 100% sponsored by Hamilton Chess Club and your fees is waived. You pay $0.";
      } else if (value === "No") {
        if (currentDate <= earlyBirdCutoff) {
          feeMessage.textContent = "Thank you for the information. You have received the Early Bird registration discount. Your tournament registration fee is $30.";
        } else {
          feeMessage.textContent = "Thank you for the information. Your tournament registration fee is $35.";
        }
      } else {
        feeMessage.textContent = "";
      }
      feeMessage.hidden = value !== "Yes" && value !== "No";

      if (paymentGroup && paymentMethod) {
        const sponsored = value === "Yes";
        paymentGroup.hidden = sponsored;
        if (paymentFeeNotice) {
          paymentFeeNotice.hidden = sponsored;
        }
        paymentMethod.required = !sponsored;
        if (sponsored) {
          // Google Form still requires a valid Payment Via choice, so default to Venmo since no payment is actually due
          paymentMethod.value = "Venmo";
          paymentSection.innerHTML = "<p>No payment is required.</p>";
        }
      }
    };

    renderFeeMessage(fallKickoffAttendance.value);
    fallKickoffAttendance.addEventListener("change", function () {
      renderFeeMessage(this.value);
    });
  }

  const medicalConditionSelect = document.getElementById("medicalConditionSelect");
  const medicalDetailsGroup = document.getElementById("medicalDetailsGroup");
  const medicalDetailsTextarea = document.getElementById("medicalDetailsTextarea");

  if (medicalConditionSelect && medicalDetailsGroup && medicalDetailsTextarea) {
    const toggleMedicalDetails = (value) => {
      const shouldShow = value === "Yes";
      medicalDetailsGroup.hidden = !shouldShow;
      medicalDetailsTextarea.required = shouldShow;
      if (shouldShow && medicalDetailsTextarea.value.trim().toUpperCase() === "N/A") {
        medicalDetailsTextarea.value = "";
      }

      if (value === "No") {
        medicalDetailsTextarea.value = "N/A";
      } else if (!shouldShow) {
        medicalDetailsTextarea.value = "";
      }
    };

    toggleMedicalDetails(medicalConditionSelect.value);
    medicalConditionSelect.addEventListener("change", function () {
      toggleMedicalDetails(this.value);
    });
  }

  const registrationForm = document.getElementById("registrationForm");
  const successPopup = document.getElementById("successPopup");
  const paymentReceiptSteps = document.getElementById("paymentReceiptSteps");
  const emailReceiptBtn = document.getElementById("emailReceiptBtn");
  const submissionFrame = document.getElementById("hidden_iframe");
  let awaitingRegistrationResponse = false;

  submissionFrame?.addEventListener("load", () => {
    if (!awaitingRegistrationResponse) return;

    awaitingRegistrationResponse = false;
    if (successPopup) {
      successPopup.style.display = "flex";
    }
  });

  if (registrationForm) {
    registrationForm.addEventListener("submit", function () {
      if (medicalConditionSelect?.value === "No" && medicalDetailsTextarea) {
        medicalDetailsTextarea.value = "N/A";
      }

      const submitButton = registrationForm.querySelector("button");
      if (submitButton) {
        submitButton.disabled = true;
      }

      const sponsored = fallKickoffAttendance?.value === "Yes";
      if (paymentReceiptSteps) {
        paymentReceiptSteps.hidden = sponsored;
      }
      if (emailReceiptBtn) {
        emailReceiptBtn.hidden = sponsored;
      }

      awaitingRegistrationResponse = true;
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

    const feeMessageContainer = document.getElementById("feeMessage");
    if (feeMessageContainer) {
      feeMessageContainer.hidden = true;
      feeMessageContainer.textContent = "";
    }

    const paymentGroupContainer = document.getElementById("paymentGroup");
    const paymentMethodField = document.getElementById("paymentMethod");
    if (paymentGroupContainer) {
      paymentGroupContainer.hidden = false;
    }
    const paymentFeeNotice = document.getElementById("paymentFeeNotice");
    if (paymentFeeNotice) {
      paymentFeeNotice.hidden = false;
    }
    if (paymentMethodField) {
      paymentMethodField.required = true;
    }

    if (paymentReceiptSteps) {
      paymentReceiptSteps.hidden = false;
    }
    if (emailReceiptBtn) {
      emailReceiptBtn.hidden = false;
    }

    const submitButton = document.querySelector(".register-submit");
    if (submitButton) {
      submitButton.disabled = false;
    }
  };

  window.sendReceiptEmail = function () {
    const student = document.querySelector('[name="entry.1757382853"]')?.value || "";
    const parent = document.querySelector('[name="entry.318366699"]')?.value || "";
    const email = document.querySelector('[name="entry.1713739749"]')?.value || "";
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

  const createAlbumScroll = (entries, categoryName, featuredLabel) => {
    const container = document.createElement("div");
    container.className = "gallery-album-row";
    const viewport = document.createElement("div");
    viewport.className = "gallery-scroll";
    viewport.setAttribute("aria-label", categoryName);
    const track = document.createElement("div");
    track.className = "gallery-scroll-track album-track";
    const total = document.createElement("span");
    total.className = "gallery-featured-count";
    total.textContent = `${entries.length} ${featuredLabel}`;
    track.append(...entries);
    viewport.appendChild(track);
    container.append(viewport, total);
    return container;
  };

  const startGalleryScroll = (viewport) => {
    const track = viewport.querySelector(".gallery-scroll-track");
    const cards = Array.from(track.children);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 768px)");
    const pageSize = track.classList.contains("spotlight-track") ? 4 : 3;
    const totalPages = Math.ceil(cards.length / pageSize);
    const count = viewport.nextElementSibling;
    const status = document.createElement("div");
    status.className = "gallery-row-status";
    const pagination = document.createElement("div");
    pagination.className = "gallery-mobile-pagination";
    const previous = document.createElement("button");
    previous.type = "button";
    previous.setAttribute("aria-label", `Previous ${viewport.getAttribute("aria-label")} page`);
    previous.textContent = "❮";
    const pageInfo = document.createElement("span");
    pageInfo.setAttribute("aria-live", "polite");
    const next = document.createElement("button");
    next.type = "button";
    next.setAttribute("aria-label", `Next ${viewport.getAttribute("aria-label")} page`);
    next.textContent = "❯";
    pagination.append(previous, pageInfo, next);
    count.before(status);
    status.append(pagination, count);
    let currentPage = 0;
    let offset = 0;
    let lastTime = 0;
    let hovered = false;
    let motionEnabled = !reducedMotion.matches && !mobile.matches;
    let mobileEnabled = mobile.matches;

    const updatePage = () => {
      cards.forEach((card, index) => {
        card.hidden = mobile.matches && Math.floor(index / pageSize) !== currentPage;
      });
      pageInfo.textContent = `Page ${currentPage + 1} / ${totalPages}`;
      previous.hidden = currentPage === 0;
      next.hidden = currentPage === totalPages - 1;
    };
    previous.addEventListener("click", () => {
      currentPage = Math.max(0, currentPage - 1);
      updatePage();
    });
    next.addEventListener("click", () => {
      currentPage = Math.min(totalPages - 1, currentPage + 1);
      updatePage();
    });

    const dimensions = () => {
      const width = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return { width, step: width + gap, total: (width + gap) * cards.length };
    };
    const draw = () => {
      const { width, step, total } = dimensions();
      if (!total) return;
      cards.forEach((card, index) => {
        const position = ((index * step + offset + width) % total + total) % total - width;
        card.style.transform = `translateX(${position - index * step}px)`;
      });
    };
    const showFocusedCard = () => {
      const card = cards.find((item) => item.contains(document.activeElement));
      if (!card) return;
      viewport.scrollLeft = 0;
      const { width, step, total } = dimensions();
      if (!total) return;
      const index = cards.indexOf(card);
      const position = ((index * step + offset + width) % total + total) % total - width;
      if (position < -1 || position + width > viewport.getBoundingClientRect().width + 1) {
        offset -= position;
      }
    };
    const tick = (time) => {
      if (motionEnabled !== (!reducedMotion.matches && !mobile.matches) || mobileEnabled !== mobile.matches) updateMotion();
      if (motionEnabled) {
        if (viewport.contains(document.activeElement)) showFocusedCard();
        else if (!hovered && lastTime) offset += Math.min(time - lastTime, 50) * 0.025;
        draw();
      }
      lastTime = time;
      requestAnimationFrame(tick);
    };
    const updateMotion = () => {
      cards.forEach((card) => { card.style.transform = ""; });
      offset = 0;
      viewport.scrollLeft = 0;
      mobileEnabled = mobile.matches;
      motionEnabled = !reducedMotion.matches && !mobileEnabled;
      pagination.hidden = !mobileEnabled;
      updatePage();
      viewport.classList.toggle("is-animated", motionEnabled);
      if (!motionEnabled && !mobileEnabled) viewport.tabIndex = 0;
      else viewport.removeAttribute("tabindex");
      if (motionEnabled) draw();
    };
    viewport.addEventListener("mouseenter", () => { hovered = true; });
    viewport.addEventListener("mouseleave", () => { hovered = false; });
    viewport.addEventListener("focusin", () => {
      if (!motionEnabled) return;
      showFocusedCard();
      draw();
    });
    const showLinkedAlbum = () => {
      const index = cards.findIndex((card) => card.querySelector(".tournament-card")?.dataset.tournament === window.location.hash.slice(1));
      if (index < 0) return;
      if (mobile.matches) {
        currentPage = Math.floor(index / pageSize);
        updatePage();
      } else if (reducedMotion.matches) {
        viewport.scrollLeft = cards[index].offsetLeft - track.offsetLeft;
      } else {
        offset = -index * dimensions().step;
        draw();
      }
    };
    reducedMotion.addEventListener("change", updateMotion);
    mobile.addEventListener("change", () => {
      updateMotion();
      showLinkedAlbum();
    });
    window.addEventListener("hashchange", showLinkedAlbum);
    updateMotion();
    showLinkedAlbum();
    requestAnimationFrame(tick);
  };

  const organizeTournamentCategories = () => {
    const grid = document.getElementById("tournamentGrid");
    if (!grid) return;

    const categories = [
      { key: "learn", title: "Learn & Grow", description: "From classroom learning and exciting chess activities to the thrill of tournament day — a collection of special moments and memories at Hamilton Chess Club." },
      { key: "compete", title: "Tournaments & Championships", description: "Celebrating our students' achievements, tournament champions, winners, and outstanding performances across our in-house class tournaments and scholastic tournaments hosted by Hamilton Chess Club." },
      { key: "trail", title: "Hall of Fame", description: "Celebrating our students who proudly represent Hamilton Chess Club at WSCF, USCF, and other scholastic tournaments. Every game, every achievement, and every milestone adds to our club's legacy!" },
      { key: "spotlight", title: "Our Rising Champions", description: "Student achievements and inspiring chess journeys." }
    ];
    const entries = Array.from(grid.querySelectorAll(".tournament-entry"));
    const studentSpotlight = grid.querySelector("#student-spotlight");
    if (studentSpotlight) studentSpotlight.remove();
    const fragment = document.createDocumentFragment();

    categories.forEach(({ key, title, description }) => {
      const heading = document.createElement("div");
      heading.className = `gallery-category gallery-category-${key}`;
      heading.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
      fragment.appendChild(heading);

      if (key === "spotlight" && studentSpotlight) {
        fragment.appendChild(studentSpotlight);
      }

      const categoryEntries = entries.filter((entry) => entry.dataset.category === key);
      const labels = { trail: "Fames Featured", compete: "Champion-Tour Featured", learn: "Growth Featured" };
      if (categoryEntries.length) fragment.appendChild(createAlbumScroll(categoryEntries, title, labels[key]));
    });

    grid.replaceChildren(fragment);
    const spotlightCount = studentSpotlight?.querySelector(".gallery-featured-count");
    if (spotlightCount) spotlightCount.textContent = `${studentSpotlight.querySelectorAll(".spotlight-card").length} Champion Featured`;
    grid.querySelectorAll(".gallery-scroll").forEach(startGalleryScroll);
  };

  const showAllTournamentEntries = () => {
    const cards = document.querySelectorAll(".tournament-entry");
    cards.forEach((card) => {
      card.style.display = "";
    });
  };

  const tournamentTitles = {
    "salaam-school-nov-2026": "Salaam School Chess Tournament WSCF Tournament Winners",
    "gca-tournament-nov-2026": "Grace Christian Academy (GCA) Tournament USCF Tournament Winner",
    "nicolette-high-school-oct-2026": "Nicolette High School Tournament WSCF Tournament Moments",
    "all-catholic-st-augustine-oct-2026": "All Catholic Chess - St Augustine WSCF Tournament Winners",
    "g60-state-championship-oct-2026": "G/60 State Championship WSCF Tournament Winners",
    "daniel-perelman-oct-2026": "5th Annual Daniel Perelman Memorial USCF Tournament Winners",
    "wscf-Feb-2026": "19th Annual WSCF Grade Level Championship Tournament Winners",
    "summer-june-2026": "Hamilton Chess Club Program Summer Session",
    "summer-july-2026": "Hamilton Chess Club Program Summer Tournament Winners",
    "fall-kickoff-aug-2026": "Hamilton Chess Club Program Fall Kick-off Program Session",
    "fall-kickoff-sep-2026": "Hamilton Chess Club Program Fall Kick-off Tournament Winners",
    "hamilton-scholastic-program-oct-2026": "Hamilton Chess Club - Program Scholastic Tournament Moments",
    "hamilton-scholastic-winners-oct-2026": "Hamilton Chess Club - Program Scholastic Tournament Winners"
  };

  const likedTournaments = JSON.parse(localStorage.getItem("likedTournaments") || "[]");
  const tournamentLikeCounts = JSON.parse(localStorage.getItem("tournamentLikeCounts") || "{}");

  const updateTournamentLikeButton = (button, isLiked) => {
    button.classList.toggle("is-liked", isLiked);
    button.querySelector(".like-icon").textContent = isLiked ? "\u2665" : "\u2661";
    button.setAttribute("aria-label", isLiked ? "Unlike this tournament" : "Like this tournament");
    button.setAttribute("title", isLiked ? "Unlike this tournament" : "Like this tournament");
  };

  window.toggleTournamentLike = function (event, button) {
    event.stopPropagation();
    const tournamentKey = button.dataset.tournament;
    const likedIndex = likedTournaments.indexOf(tournamentKey);
    if (likedIndex === -1) {
      likedTournaments.push(tournamentKey);
      tournamentLikeCounts[tournamentKey] = (tournamentLikeCounts[tournamentKey] || 0) + 1;
    } else {
      likedTournaments.splice(likedIndex, 1);
      tournamentLikeCounts[tournamentKey] = Math.max((tournamentLikeCounts[tournamentKey] || 1) - 1, 0);
    }
    localStorage.setItem("likedTournaments", JSON.stringify(likedTournaments));
    localStorage.setItem("tournamentLikeCounts", JSON.stringify(tournamentLikeCounts));
    updateTournamentLikeButton(button, likedIndex === -1);
  };

  window.shareTournament = async function (event, tournamentKey) {
    event.stopPropagation();
    const shareData = {
      title: tournamentTitles[tournamentKey] || "Hamilton Chess Club tournament",
      text: "View this Hamilton Chess Club tournament gallery.",
      url: window.location.href.split("#")[0] + `#${tournamentKey}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        window.alert("Tournament link copied to clipboard.");
      }
    } catch (error) {
      if (error.name !== "AbortError") console.error("Unable to share tournament", error);
    }
  };

  document.querySelectorAll(".like-button[data-tournament]").forEach((button) => {
    updateTournamentLikeButton(button, likedTournaments.includes(button.dataset.tournament));
  });

  organizeTournamentCategories();
  showAllTournamentEntries();

  let currentTournament = null;
  let currentIndex = 0;
  let currentImages = [];

  const tournaments = {
    "salaam-school-nov-2026": [
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1794793534/Aliya_Zain_3rdPlace_K-5_TeamTrophy_bs3vp0.jpg"
    ],
    "gca-tournament-nov-2026": [
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1794790509/HCC_Team_Champions_ulvsuj.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1794790504/HCC_K-8_TeamTrophy_1stPlace_uxhiuf.jpg",
"https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1794790522/KianBatra_K-5_1stPlace_upgro6.jpg",
"https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1794790518/KarthikRamesh_K-8_3rdPlace_fxc1ct.jpg",
"https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1794790500/Gautham_K-8_6thPlace_ikc41d.jpg",
"https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1794790527/RiyaGupta_K-8_8thPlace_qoykde.jpg",
"https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1794790513/Isaac_K-12_NonRated_2ndPlace_wqxy5z.jpg"
    ],
    "nicolette-high-school-oct-2026": [
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1794787980/HCC_Team_Champions_Aaditya_Hayan_Aathvik_Karthik_cubxpa.jpg"
    ],
    "all-catholic-st-augustine-oct-2026": [
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1794785277/HCC_Team_Champion_vf0aem.jpg"
    ],
    "g60-state-championship-oct-2026": [
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1794702892/HCC_Team_aabvfy.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1794702896/Karthik_Kian_vuncke.jpg", 
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1794780434/Neil_vmadlf.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1794780435/Shravan_sim3r1.jpg"
    ],
    "daniel-perelman-oct-2026": [
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1794702147/Kian_4thPlace_Naksh_9thPlace_USCF_c7q83n.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1794702137/HCC_Team_Champions_Brookfield_hl0zba.jpg"
    ],
    "wscf-Feb-2026": [
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1782000237/1_owjwt7.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1782000239/3_s7nyq5.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1782000238/2_y4xqyp.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1782000242/5_x6qb93.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1782000241/4_brkdaz.jpg"
    ],
    "summer-june-2026": [
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1785793096/1_r5hqhs.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1785793096/2_ucrpz9.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1785793097/3_zpekfx.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1785793097/4_lipvwp.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1785793097/5_gjm7q3.jpg"
    ],
    "summer-july-2026": [
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1786204605/Anay_Jadhav_mweqhi.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1786204605/Hayan_Nissar_tznk0a.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1786204605/Nayonika_Arun_bxorne.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1786204605/Karthik_Ramesh_jcbrbr.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1786204606/Vibha_Iyer_unieha.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1786204604/Aathvik_Ananth_uyglcf.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1786204605/Aayushi_Jadhav_cbgdor.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1786204605/Ronit_Ekshinge_x7cgv9.jpg"
    ],
     "fall-kickoff-aug-2026": [
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1789792029/Fall_Kick_Off_Session_-2_ur3xv3.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1789788508/Fall_Kick-Off_Session_b8xxps.jpg",
    ],
     "fall-kickoff-sep-2026": [
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1789788567/Laila_-_1st_-_Beginner_lcycqh.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1789788558/Aliya-_2nd_-_Beginner_qapozz.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1789788563/Athreyan_-_3rd_-_Beginner_ilaevs.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1789788567/Shrivas_-_1st_-Intermediate_fzr2b2.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1789788561/Arjay-_2nd_-_Intermediate_kf932q.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1789788567/Hayan_-_3rd_-Intermediate_yoabus.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1789788570/Suhas_-_1st_-_Advanced_mfixkp.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1789788562/Anika_Vibha_Aathvik_-_2nd_-_Advanced_o7g8hr.jpg"
    ],
    "hamilton-scholastic-program-oct-2026": [
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/v1791570931/HamiltonChessClub_Team_ikf5qz.jpg", 
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/v1791570940/Tournament_Pics2_rjntgv.jpg",   
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/v1791570944/TournamentPics1_hiflpj.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/v1791570950/MindMoversChess_Team_flvss9.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/v1791570958/Concessions_Team_okptno.jpg"
    ],
    "hamilton-scholastic-winners-oct-2026": [
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1791570619/Winn_Vignesh_Beginner_1st_o7fnwj.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1791570610/Amogh_Yelkana_Beginner_2nd_j7exa2.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1791570611/Anagha_Vullaganti_Beginner_3rd_gv5zml.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1791570619/Yasha_Chithic_Beginner_4th_gsxgge.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1791570611/Amrutha_Siva_Beginner_5th_dtjqmv.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1791577701/Madhav_Mankad_Mishra_Intermediate_1st_n8ql7m.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1791570864/Theo_Vignesh_Intermediate_2nd_oxksg4.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1791570858/Minal_Manral_Intermediate_3rd_tgfohp.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1791570635/Aathvik_Ananth_Intermediate_4th_ns8hgp.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1791577671/Brihad_Mishra_Intermediate_5th_gs1oxf.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1791570882/Arovon_Mukhopadhyay_Advanced_1st_v1x5sz.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1791570898/Kian_Batra_Advanced_2nd_ehhbuy.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1791570894/Karthik_Ramesh_Advanced_3rd_v5u9y5.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1791570889/Ashwadh_Dudipala_Advanced_4th_qkmv7d.jpg",
      "https://res.cloudinary.com/dtwkmx7ih/image/upload/f_auto,q_auto,w_600/v1791570904/Suhas_Vemparala_Advanced_5th_bpdsju.jpg"
    ]
  };

  const tournamentCoachNames = {
    "summer-july-2026": "Coach Edgar"
  };

  const tournamentStudentNames = {
    "salaam-school-nov-2026": {
      0: "Zain and Aliya - Hamilton Chess Club - 3rd Place - Team Trophy Winners"
    },
    "gca-tournament-nov-2026": {
      1: "Hamilton Chess Club - 1st place (K-8 Section) - Team Trophy",
      2: "Kian Batra - 1st Place in K-5 Section",
      3: "Karthik - 3rd Place in K-8 Section",
      4: "Gautham - 6th Place in K-8 Section",
      5: "Riya Gupta - 8th Place in K-8 Section",
      6: "Isaac - 2nd Place in K-12 Non-Rated Section"
    },
    "all-catholic-st-augustine-oct-2026": {
      0: "Kian B- 1st Place in K-8 Section"
    },
    "g60-state-championship-oct-2026": {
      1: "Karthik R - 2nd Place in Novice (U1000) Section",
      2: "Neil - 1st Place in Reserve Section (1000-1501)",
      3: "Shravan S - 3rd place in Premier Section (1500+)"
    },
    "daniel-perelman-oct-2026": {
      0: "Kian Batra - 4th Place"
    },
    "fall-kickoff-sep-2026": {
      0: "Leila Sajan- 1st (Beginner)",
      1: "Aliya Sajan- 2nd (Beginner)",
      2: "Athreyan Uthamraj - 3rd (Beginner)",
      3: "Shrivas Polineni - 1st (Intermediate)",
      4: "Arjay Vijay - 2nd (Intermediate)",
      5: "Hayan Nissar - 3rd (Intermediate)",
      6: "Suhas Vemparala - 1st (Advanced)",
      7: "Anika Gupta, Vibha Iyer, Aathvik Ananth - 2nd (Advanced)"
    },
    "hamilton-scholastic-winners-oct-2026": {
      0: "Winn Vignesh - 1st (Beginner)",
      1: "Amogh Yelkana - 2nd (Beginner)",
      2: "Anagha Vullaganti - 3rd (Beginner)",
      3: "Yasha Chithic - 4th (Beginner)",
      4: "Amrutha Siva - 5th (Beginner)",
      5: "Madhav Mankad - 1st (Intermediate)",
      6: "Theo Vignesh - 2nd (Intermediate)",
      7: "Minal Manral - 3rd (Intermediate)",
      8: "Aathvik Ananth - 4th (Intermediate)",
      9: "Brihad Mishra - 5th (Intermediate)",
      10: "Arovon Mukhopadhyay - 1st (Advanced)",
      11: "Kian Batra - 2nd (Advanced)",
      12: "Karthik Ramesh - 3rd (Advanced)",
      13: "Ashwadh Dudipala - 4th (Advanced)",
      14: "Suhas Vemparala - 5th (Advanced)"
    }
  };

  const tournamentSecondStudentNames = {
    "all-catholic-st-augustine-oct-2026": {
      0: "Hayan N - 1st Place in K-5 Section"
    },
    "g60-state-championship-oct-2026": {
      1: "Kian B - 3rd Place in Novice (U1000) Section"
    },
    "daniel-perelman-oct-2026": {
      0: "Naksh Mathur - 9th Place"
    }
  };

  const tournamentCenterStudentNames = {
    "all-catholic-st-augustine-oct-2026": {
      0: "Aathvik A"
    }
  };

  const tournamentGroupStudentNames = {
    "nicolette-high-school-oct-2026": {
      0: ["Aditya", "Hayan", "Aathvik", "Karthik"]
    }
  };

  const sideSwapNames = new Set([
    "anay jadhav",
    "hayan nissar",
    "hayaan nissar",
    "nayonika arun",
    "vibha iyer",
    "aayushi jadhav",
    "ronit ekshinge"
  ]);

  const studentNameOverrides = {
    "Hayan_Nissar": "Hayaan Nissar",
    "Laila_-_1st_-_Beginner": "Leila Sajan"
  };

  const shouldSwapSides = (name) => {
    const normalized = (name || "")
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return sideSwapNames.has(normalized);
  };

  const isRonit = (name) => {
    const normalized = (name || "")
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return normalized === "ronit ekshinge";
  };

  const getDisplayNameFromUrl = (url) => {
    const fileName = url.split("/").pop() || "Tournament photo";
    const publicId = fileName.split(".")[0];
    const baseName = publicId.replace(/_[^_]+$/, "");
    if (studentNameOverrides[baseName]) {
      return studentNameOverrides[baseName];
    }
    return baseName.replace(/_/g, " ");
  };

  const getStudentLabel = (tournamentKey, imageIndex, imageUrl) =>
    tournamentStudentNames[tournamentKey]?.[imageIndex] || getDisplayNameFromUrl(imageUrl);

  const shouldDisplayStudentLabels = (tournamentKey, imageIndex) =>
    Boolean(tournamentCoachNames[tournamentKey] || tournamentStudentNames[tournamentKey]?.[imageIndex]);

  const buildTournamentCollages = () => {
    const collageBlocks = document.querySelectorAll(".tournament-collage[data-tournament]");
    if (!collageBlocks.length) return;

    collageBlocks.forEach((block) => {
      const tournamentKey = block.getAttribute("data-tournament");
      const images = tournaments[tournamentKey] || [];
      block.innerHTML = "";

      images.slice(0, 8).forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = getDisplayNameFromUrl(src);
        img.loading = "lazy";
        img.decoding = "async";
        block.appendChild(img);
      });
    });
  };

  const buildTournamentReels = () => {
    const reelBlocks = document.querySelectorAll(".tournament-reel[data-tournament]");
    if (!reelBlocks.length) return;

    reelBlocks.forEach((block) => {
      const tournamentKey = block.getAttribute("data-tournament");
      const images = tournaments[tournamentKey] || [];
      if (!images.length) return;

      block.innerHTML = "";

      const preview = document.createElement("img");
      preview.src = images[0];
      preview.alt = getDisplayNameFromUrl(images[0]);
      preview.loading = "lazy";
      preview.decoding = "async";

      const progress = document.createElement("div");
      progress.className = "reel-progress";
      const progressBars = images.map(() => {
        const bar = document.createElement("span");
        progress.appendChild(bar);
        return bar;
      });

      const reelCounter = document.createElement("div");
      reelCounter.className = "reel-image-counter";

      block.appendChild(preview);
      block.appendChild(progress);
      block.appendChild(reelCounter);

      const studentTag = document.createElement("div");
      studentTag.className = "reel-name-tag";
      const coachTag = document.createElement("div");
      coachTag.className = "reel-coach-tag";
      block.appendChild(studentTag);
      block.appendChild(coachTag);

      let index = 0;
      const draw = () => {
        const currentImage = images[index];
        preview.src = currentImage;
        preview.alt = getDisplayNameFromUrl(currentImage);
        reelCounter.textContent = `${index + 1}/${images.length}`;
        const studentName = getDisplayNameFromUrl(currentImage);
        const coachName = tournamentCoachNames[tournamentKey];
        const isSwap = shouldSwapSides(studentName);
        const studentOnLeft = isSwap ? index % 2 !== 0 : index % 2 === 0;
        studentTag.textContent = getStudentLabel(tournamentKey, index, currentImage);
        coachTag.textContent = coachName || "";
        studentTag.classList.toggle("lowered", isRonit(studentName));
        studentTag.classList.toggle("left", studentOnLeft);
        studentTag.classList.toggle("right", !studentOnLeft);
        coachTag.classList.toggle("left", !studentOnLeft);
        coachTag.classList.toggle("right", studentOnLeft);
        studentTag.style.display = shouldDisplayStudentLabels(tournamentKey, index) ? "block" : "none";
        coachTag.style.display = coachName ? "block" : "none";
        progressBars.forEach((bar, barIndex) => {
          bar.classList.toggle("active", barIndex <= index);
        });
      };

      draw();

      let timer = setInterval(() => {
        index = (index + 1) % images.length;
        draw();
      }, 1400);

      block.addEventListener("mouseenter", () => {
        clearInterval(timer);
      });

      block.addEventListener("mouseleave", () => {
        timer = setInterval(() => {
          index = (index + 1) % images.length;
          draw();
        }, 1400);
      });
    });
  };

  const buildTournamentCardTotalBadges = () => {
    const cards = document.querySelectorAll(".tournament-card[data-tournament]");
    if (!cards.length) return;

    cards.forEach((card) => {
      if (card.querySelector(".tournament-reel")) return;

      const tournamentKey = card.getAttribute("data-tournament") || "";
      const images = tournaments[tournamentKey] || [];
      if (!images.length) return;

      const existingBadge = card.querySelector(".tournament-total-badge");
      if (existingBadge) existingBadge.remove();

      const badge = document.createElement("div");
      badge.className = "tournament-total-badge";
      badge.textContent = `${images.length} photos`;
      card.appendChild(badge);
    });
  };

  buildTournamentCollages();
  buildTournamentReels();
  buildTournamentCardTotalBadges();

  const updateImage = () => {
    const img = document.getElementById("lightbox-img");
    const prevBtn = document.querySelector(".lightbox-prev");
    const nextBtn = document.querySelector(".lightbox-next");
    const imageCounter = document.getElementById("lightbox-image-counter");
    const studentTag = document.getElementById("lightbox-student-tag");
    const secondStudentTag = document.getElementById("lightbox-second-student-tag");
    const centerStudentTag = document.getElementById("lightbox-center-student-tag");
    const groupStudentTags = document.getElementById("lightbox-group-student-tags");
    const coachTag = document.getElementById("lightbox-coach-tag");
    const lightboxLikeButton = document.getElementById("lightbox-like-button");
    const lightboxShareButton = document.getElementById("lightbox-share-button");
    if (!img || !currentImages.length) return;

    if (lightboxLikeButton) {
      lightboxLikeButton.dataset.tournament = currentTournament;
      updateTournamentLikeButton(lightboxLikeButton, likedTournaments.includes(currentTournament));
    }
    if (lightboxShareButton) lightboxShareButton.dataset.tournament = currentTournament;

    img.src = currentImages[currentIndex];
    img.alt = getDisplayNameFromUrl(currentImages[currentIndex]);
    if (groupStudentTags) {
      const names = tournamentGroupStudentNames[currentTournament]?.[currentIndex] || [];
      groupStudentTags.replaceChildren(...names.map((name) => {
        const label = document.createElement("span");
        label.textContent = name;
        return label;
      }));
      groupStudentTags.hidden = names.length === 0;
    }
    if (prevBtn) prevBtn.style.display = currentImages.length > 1 ? "flex" : "none";
    if (nextBtn) nextBtn.style.display = currentImages.length > 1 ? "flex" : "none";
    if (imageCounter) {
      imageCounter.textContent = `${currentIndex + 1}/${currentImages.length}`;
      imageCounter.style.display = "block";
    }

    if (studentTag && coachTag) {
      const coachName = tournamentCoachNames[currentTournament];
      const showStudentLabel = shouldDisplayStudentLabels(currentTournament, currentIndex);
      const secondStudentName = tournamentSecondStudentNames[currentTournament]?.[currentIndex];
      studentTag.classList.toggle("paired", Boolean(secondStudentName));
      if (secondStudentTag) {
        secondStudentTag.textContent = secondStudentName || "";
        secondStudentTag.style.display = secondStudentName ? "block" : "none";
      }
      if (centerStudentTag) {
        const centerStudentName = tournamentCenterStudentNames[currentTournament]?.[currentIndex];
        centerStudentTag.textContent = centerStudentName || "";
        centerStudentTag.style.display = centerStudentName ? "block" : "none";
        centerStudentTag.parentElement.classList.toggle("has-center-student", Boolean(centerStudentName));
      }
      if (!coachName) {
        const studentName = getDisplayNameFromUrl(currentImages[currentIndex]);
        const isSwap = shouldSwapSides(studentName);
        const studentOnLeft = Boolean(secondStudentName) || (isSwap ? currentIndex % 2 !== 0 : currentIndex % 2 === 0);

        studentTag.textContent = getStudentLabel(currentTournament, currentIndex, currentImages[currentIndex]);
        studentTag.style.display = showStudentLabel ? "block" : "none";
        coachTag.style.display = "none";
        studentTag.classList.toggle("lowered", isRonit(studentName));
        studentTag.classList.toggle("left", studentOnLeft);
        studentTag.classList.toggle("right", !studentOnLeft);
        return;
      }

      const studentName = getDisplayNameFromUrl(currentImages[currentIndex]);
      const isSwap = shouldSwapSides(studentName);
      const studentOnLeft = isSwap ? currentIndex % 2 !== 0 : currentIndex % 2 === 0;

      studentTag.textContent = getStudentLabel(currentTournament, currentIndex, currentImages[currentIndex]);
      coachTag.textContent = coachName;
      studentTag.style.display = showStudentLabel ? "block" : "none";
      coachTag.style.display = "block";
      studentTag.classList.toggle("lowered", isRonit(studentName));
      studentTag.classList.toggle("left", studentOnLeft);
      studentTag.classList.toggle("right", !studentOnLeft);
      coachTag.classList.toggle("left", !studentOnLeft);
      coachTag.classList.toggle("right", studentOnLeft);
    }
  };

  window.openTournament = function (name) {
    currentTournament = name;
    currentImages = tournaments[name] || [];
    if (!currentImages.length) return;
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

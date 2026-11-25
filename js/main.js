document.addEventListener("DOMContentLoaded", () => {
  const fixInjectedNavLinks = (target) => {
    if (!target) return;
    const normalizedPath = window.location.pathname.toLowerCase().replace(/\/+$/, "") || "/";
    const isHomePage = normalizedPath === "/" || normalizedPath === "/index.html";

    const navList = target.querySelector("#mainNav ul");
    const existingHomeItem = navList?.querySelector('a[data-home-link="true"]')?.closest("li");

    if (isHomePage) {
      existingHomeItem?.remove();
      return;
    }

    if (!navList || existingHomeItem) return;

    const homeItem = document.createElement("li");
    const homeLink = document.createElement("a");
    homeLink.setAttribute("href", "/");
    homeLink.setAttribute("data-home-link", "true");
    homeLink.setAttribute("aria-label", "Home");
    homeLink.setAttribute("title", "Home");
    homeLink.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" focusable="false"><path fill="currentColor" d="M12 3l9 8h-3v10h-5v-6H11v6H6V11H3l9-8z"></path></svg>';
    homeItem.appendChild(homeLink);

    const aboutItem = navList.querySelector('a[href="/pages/about/"]')?.closest("li");
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
    const loadInclude = (target, fileName) => {
      if (!target) return;

      fetch(`/includes/${fileName}?v=20261116`)
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
        .catch((error) => console.error(`Failed to load ${fileName}`, error));
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

  const tshirtPurchase = document.getElementById("tshirtPurchase");
  const tshirtSizeGroup = document.getElementById("tshirtSizeGroup");
  const tshirtSize = document.getElementById("tshirtSize");

  if (tshirtPurchase && tshirtSizeGroup && tshirtSize) {
    const toggleTshirtSize = (value) => {
      const shouldShow = value === "Yes";
      tshirtSizeGroup.hidden = !shouldShow;
      tshirtSize.required = shouldShow;
      if (!shouldShow) {
        tshirtSize.value = "";
      }
    };

    toggleTshirtSize(tshirtPurchase.value);
    tshirtPurchase.addEventListener("change", function () {
      toggleTshirtSize(this.value);
    });
  }

  const stepBookPurchase = document.getElementById("stepBookPurchase");
  const recommendedBooksSection = document.getElementById("recommendedBooksSection");
  const recommendedBooksCheckboxes = document.querySelectorAll('#recommendedBooksGroup input[type="checkbox"]');

  if (stepBookPurchase && recommendedBooksSection) {
    const toggleRecommendedBooks = (value) => {
      const shouldShow = value === "Yes";
      recommendedBooksSection.hidden = !shouldShow;
      recommendedBooksCheckboxes.forEach((checkbox) => {
        checkbox.required = shouldShow;
      });
      if (!shouldShow) {
        recommendedBooksCheckboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
      }
    };

    toggleRecommendedBooks(stepBookPurchase.value);
    stepBookPurchase.addEventListener("change", function () {
      toggleRecommendedBooks(this.value);
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
      registrationForm.querySelectorAll("input[type='text'], input[type='email'], input[type='tel']").forEach((field) => {
        field.value = "";
      });
      registrationForm.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
        checkbox.checked = false;
      });
      registrationForm.querySelectorAll("select").forEach((select) => {
        select.selectedIndex = 0;
      });
    }

    const tshirtSizeGroup = document.getElementById("tshirtSizeGroup");
    if (tshirtSizeGroup) {
      tshirtSizeGroup.hidden = true;
    }
    const tshirtSize = document.getElementById("tshirtSize");
    if (tshirtSize) {
      tshirtSize.required = false;
      tshirtSize.value = "";
    }

    const medicalDetailsGroup = document.getElementById("medicalDetailsGroup");
    if (medicalDetailsGroup) {
      medicalDetailsGroup.hidden = true;
    }
    const medicalDetailsTextarea = document.getElementById("medicalDetailsTextarea");
    if (medicalDetailsTextarea) {
      medicalDetailsTextarea.required = false;
      medicalDetailsTextarea.value = "";
    }

    const recommendedBooksSection = document.getElementById("recommendedBooksSection");
    if (recommendedBooksSection) {
      recommendedBooksSection.hidden = true;
    }
    document.querySelectorAll('#recommendedBooksGroup input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false;
      checkbox.required = false;
    });

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

  const galleryData = window.hccGallery || {};
  const galleryAlbums = Object.values(galleryData).flatMap((category) => category.albums || []);
  const albumProperty = (property) => Object.fromEntries(
    galleryAlbums.filter((album) => album[property] !== undefined).map((album) => [album.id, album[property]])
  );
  const tournamentTitles = albumProperty("shareTitle");
  const tournaments = albumProperty("images");
  const tournamentCoachNames = albumProperty("coachName");
  const tournamentStudentNames = albumProperty("studentNames");
  const tournamentSecondStudentNames = albumProperty("secondStudentNames");
  const tournamentCenterStudentNames = albumProperty("centerStudentNames");
  const tournamentGroupStudentNames = albumProperty("groupStudentNames");
  const sideSwapNames = new Set(galleryData.compete?.sideSwapNames || []);
  const studentNameOverrides = galleryData.compete?.nameOverrides || {};
  const albumPath = (id) => `/pages/gallery/${id.toLowerCase()}/`;

  const createAlbumActions = (album, subject) => {
    const actions = document.createElement("div");
    actions.className = "tournament-actions";
    actions.setAttribute("aria-label", subject === "this tournament" ? "Tournament actions" : "Rising Champions actions");
    const like = document.createElement("button");
    like.className = "tournament-action like-button";
    like.type = "button";
    like.dataset.tournament = album.id;
    like.setAttribute("aria-label", `Like ${subject}`);
    like.title = `Like ${subject}`;
    like.innerHTML = '<span class="like-icon" aria-hidden="true">&#9825;</span><span class="like-label">Like</span>';
    like.addEventListener("click", (event) => window.toggleTournamentLike(event, like));
    const share = document.createElement("button");
    share.className = "tournament-action share-button";
    share.type = "button";
    share.setAttribute("aria-label", `Share ${subject}`);
    share.title = `Share ${subject}`;
    share.innerHTML = '<span class="share-icon" aria-hidden="true">&#8599;</span><span class="share-label">Share</span>';
    share.addEventListener("click", (event) => window.shareTournament(event, album.id));
    actions.append(like, share);
    return actions;
  };

  const createGalleryAlbum = (album, category) => {
    const entry = document.createElement("div");
    entry.className = "tournament-entry";
    entry.dataset.category = category;
    entry.dataset.tournament = album.id;
    const card = document.createElement("a");
    card.className = "tournament-card";
    card.dataset.tournament = album.id;
    card.href = albumPath(album.id);
    const media = document.createElement("div");
    media.className = "tournament-media";
    const image = document.createElement("img");
    image.src = album.cover || album.images[0];
    image.alt = album.coverAlt;
    image.loading = "lazy";
    media.appendChild(image);
    card.appendChild(media);
    album.headings.forEach((text) => {
      const heading = document.createElement("h4");
      heading.textContent = text;
      card.appendChild(heading);
    });
    entry.append(card, createAlbumActions(album, "this tournament"));
    return entry;
  };

  const createStudentSpotlight = (students) => {
    const section = document.createElement("div");
    section.id = "student-spotlight";
    section.className = "student-spotlight gallery-spotlight";
    const container = document.createElement("div");
    container.className = "container";
    const viewport = document.createElement("div");
    viewport.className = "gallery-scroll";
    viewport.setAttribute("aria-label", "Our Rising Champions");
    const track = document.createElement("div");
    track.className = "gallery-scroll-track spotlight-track";
    students.forEach((student) => {
      const card = document.createElement("div");
      card.className = "spotlight-card";
      const image = document.createElement("img");
      image.src = student.image;
      image.alt = student.name;
      image.loading = "lazy";
      image.addEventListener("click", () => window.openSpotlightLightbox(image.src));
      const name = document.createElement("h4");
      name.textContent = student.name;
      const description = document.createElement("p");
      description.textContent = student.description;
      card.append(image, name, description);
      track.appendChild(card);
    });
    const count = document.createElement("div");
    count.className = "gallery-featured-count";
    count.textContent = `${students.length} Champions Featured`;
    viewport.appendChild(track);
    container.append(viewport, count);
    section.appendChild(container);
    return section;
  };

  const createAlbumScroll = (entries, categoryName, featuredLabel) => {
    const container = document.createElement("div");
    container.className = "gallery-album-row";
    const viewport = document.createElement("div");
    viewport.className = "gallery-scroll";
    viewport.setAttribute("aria-label", categoryName);
    viewport.dataset.category = entries[0].dataset.category;
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
    const frame = document.createElement("div");
    frame.className = "gallery-scroll-frame";
    const first = document.createElement("button");
    first.type = "button";
    first.className = "gallery-jump gallery-jump-first";
    first.setAttribute("aria-label", `Show first item in ${viewport.getAttribute("aria-label")}`);
    first.title = "Show first item";
    first.textContent = "❮";
    const last = document.createElement("button");
    last.type = "button";
    last.className = "gallery-jump gallery-jump-last";
    last.setAttribute("aria-label", `Show last item in ${viewport.getAttribute("aria-label")}`);
    last.title = "Show last item";
    last.textContent = "❯";
    viewport.before(frame);
    frame.append(viewport, first, last);
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
    if (track.classList.contains("spotlight-track")) {
      status.append(createAlbumActions(galleryData.spotlight.albums[0], "Our Rising Champions"));
    }
    let currentPage = 0;
    let offset = 0;
    let direction = -1;
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
      viewport.scrollLeft = 0;
    });
    next.addEventListener("click", () => {
      currentPage = Math.min(totalPages - 1, currentPage + 1);
      updatePage();
      viewport.scrollLeft = 0;
    });

    const cardPosition = (card) => card.offsetLeft - cards[0].offsetLeft;
    const minOffset = () => {
      const lastCard = cards[cards.length - 1];
      return Math.min(0, viewport.clientWidth - (cardPosition(lastCard) + lastCard.offsetWidth));
    };
    const draw = () => {
      offset = Math.max(minOffset(), Math.min(0, offset));
      cards.forEach((card) => {
        card.style.transform = `translateX(${offset}px)`;
      });
    };
    const jumpToEnd = (end) => {
      if (motionEnabled) {
        offset = end ? minOffset() : 0;
        direction = end ? 1 : -1;
        draw();
      } else {
        viewport.scrollLeft = end ? viewport.scrollWidth - viewport.clientWidth : 0;
      }
    };
    first.addEventListener("click", () => jumpToEnd(false));
    last.addEventListener("click", () => jumpToEnd(true));
    const showFocusedCard = () => {
      const card = cards.find((item) => item.contains(document.activeElement));
      if (!card) return;
      viewport.scrollLeft = 0;
      const width = card.getBoundingClientRect().width;
      const position = cardPosition(card) + offset;
      if (position < 0) offset -= position;
      else if (position + width > viewport.clientWidth) offset -= position + width - viewport.clientWidth;
    };
    const tick = (time) => {
      if (motionEnabled !== (!reducedMotion.matches && !mobile.matches) || mobileEnabled !== mobile.matches) updateMotion();
      if (motionEnabled) {
        if (viewport.contains(document.activeElement)) showFocusedCard();
        else if (!frame.contains(document.activeElement) && !hovered && lastTime) {
          const end = minOffset();
          offset += direction * Math.min(time - lastTime, 50) * 0.05;
          if (offset <= end) {
            offset = end;
            direction = 1;
          } else if (offset >= 0) {
            offset = 0;
            direction = -1;
          }
        }
        draw();
      }
      lastTime = time;
      requestAnimationFrame(tick);
    };
    const updateMotion = () => {
      cards.forEach((card) => { card.style.transform = ""; });
      offset = 0;
      direction = -1;
      viewport.scrollLeft = 0;
      mobileEnabled = mobile.matches;
      motionEnabled = !reducedMotion.matches && !mobileEnabled;
      pagination.hidden = !mobileEnabled;
      first.hidden = mobileEnabled;
      last.hidden = mobileEnabled;
      updatePage();
      viewport.classList.toggle("is-animated", motionEnabled);
      if (!motionEnabled && !mobileEnabled) viewport.tabIndex = 0;
      else viewport.removeAttribute("tabindex");
      if (motionEnabled) draw();
    };
    frame.addEventListener("mouseenter", () => { hovered = true; });
    frame.addEventListener("mouseleave", () => { hovered = false; });
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
        offset = -cardPosition(cards[index]);
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
    if (!["learn", "compete", "trail", "spotlight"].every((key) => galleryData[key])) {
      console.error("Gallery category data could not be loaded.");
      grid.textContent = "Gallery content could not be loaded.";
      return;
    }

    const categories = [
      { key: "learn", title: "HCC - The Experience", description: "From classroom learning and exciting chess activities to the thrill of tournament day — a collection of special moments and memories at Hamilton Chess Club." },
      { key: "compete", title: "HCC - Hosted Tournaments", description: "Celebrating our students' achievements, tournament champions, winners, and outstanding performances across our in-house class tournaments and scholastic tournaments hosted by Hamilton Chess Club." },
      { key: "trail", title: "Our Champions - Hall of Fame", description: "Celebrating our students who proudly represent Hamilton Chess Club at WSCF, USCF, and other scholastic tournaments. Every game, every achievement, and every milestone adds to our club's legacy!" },
      { key: "spotlight", title: "Our Rising Champions", description: "Student achievements and inspiring chess journeys." }
    ];
    const fragment = document.createDocumentFragment();

    categories.forEach(({ key, title, description }) => {
      const heading = document.createElement("div");
      heading.className = `gallery-category gallery-category-${key}`;
      heading.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
      fragment.appendChild(heading);

      if (key === "spotlight") {
        fragment.appendChild(createStudentSpotlight(galleryData.spotlight.students));
        return;
      }

      const categoryEntries = galleryData[key].albums.map((album) => createGalleryAlbum(album, key));
      const labels = { trail: "Tours Featured", compete: "Host Featured", learn: "Exp Featured" };
      if (categoryEntries.length) fragment.appendChild(createAlbumScroll(categoryEntries, title, labels[key]));
    });

    grid.replaceChildren(fragment);
    grid.querySelectorAll(".gallery-scroll").forEach(startGalleryScroll);
  };

  const showAllTournamentEntries = () => {
    const cards = document.querySelectorAll(".tournament-entry");
    cards.forEach((card) => {
      card.style.display = "";
    });
  };


  const likedTournaments = JSON.parse(localStorage.getItem("likedTournaments") || "[]");
  const tournamentLikeCounts = JSON.parse(localStorage.getItem("tournamentLikeCounts") || "{}");

  const updateTournamentLikeButton = (button, isLiked) => {
    button.classList.toggle("is-liked", isLiked);
    button.querySelector(".like-icon").textContent = isLiked ? "\u2665" : "\u2661";
    const subject = button.dataset.tournament === "student-spotlight" ? "Our Rising Champions" : "this tournament";
    const label = `${isLiked ? "Unlike" : "Like"} ${subject}`;
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
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
    document.querySelectorAll(".like-button[data-tournament]").forEach((likeButton) => {
      if (likeButton.dataset.tournament === tournamentKey) {
        updateTournamentLikeButton(likeButton, likedIndex === -1);
      }
    });
  };

  window.shareTournament = async function (event, tournamentKey) {
    event.stopPropagation();
    const isSpotlight = tournamentKey === "student-spotlight";
    const shareData = {
      title: tournamentTitles[tournamentKey] || "Hamilton Chess Club tournament",
      text: isSpotlight ? "Meet the Hamilton Chess Club Rising Champions." : "View this Hamilton Chess Club tournament gallery.",
      url: window.location.origin + albumPath(tournamentKey)
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        window.alert(isSpotlight ? "Rising Champions link copied to clipboard." : "Tournament link copied to clipboard.");
      }
    } catch (error) {
      if (error.name !== "AbortError") console.error("Unable to share tournament", error);
    }
  };

  organizeTournamentCategories();
  showAllTournamentEntries();

  document.querySelectorAll(".like-button[data-tournament]").forEach((button) => {
    updateTournamentLikeButton(button, likedTournaments.includes(button.dataset.tournament));
  });

  let currentTournament = null;
  let currentIndex = 0;
  let currentImages = [];









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

  const buildTournamentCardTotalBadges = () => {
    const cards = document.querySelectorAll(".tournament-card[data-tournament]");
    if (!cards.length) return;

    cards.forEach((card) => {
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
    const album = galleryAlbums.find((item) => item.id === currentTournament);
    const photoNames = [
      tournamentStudentNames[currentTournament]?.[currentIndex],
      tournamentSecondStudentNames[currentTournament]?.[currentIndex],
      tournamentCenterStudentNames[currentTournament]?.[currentIndex],
      ...(tournamentGroupStudentNames[currentTournament]?.[currentIndex] || [])
    ].filter(Boolean);
    img.alt = photoNames.join(", ") || `${album?.headings[0] || "Gallery"} - photo ${currentIndex + 1}`;
    img.parentElement.classList.toggle(
      "lightbox-media-large",
      currentTournament === "wisconsin-junior-open-nov-2026" && [0, 3, 5].includes(currentIndex)
    );
    if (groupStudentTags) {
      const names = tournamentGroupStudentNames[currentTournament]?.[currentIndex] || [];
      groupStudentTags.classList.toggle(
        "university-school-group",
        currentTournament === "university-school-of-milwaukee-nov-2026" && currentIndex === 0
      );
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

  window.openTournament = function (name, imageIndex = 0) {
    currentTournament = name;
    currentImages = tournaments[name] || [];
    if (!currentImages.length) return;
    currentIndex = Math.max(0, Math.min(imageIndex, currentImages.length - 1));
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

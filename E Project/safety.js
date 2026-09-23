const quizQuestions = [
  {
    question: "What should you check before starting a mountain trip?",
    options: ["Weather conditions", "Social media", "Music playlist", "Camera storage"],
    correct: 0
  },
  {
    question: "What should you always carry with you on a mountain trail?",
    options: ["Loud speaker", "Water and a first aid kit", "Extra shoes only", "Nothing at all"],
    correct: 1
  },
  {
    question: "What should you do if the weather suddenly turns bad?",
    options: ["Keep going faster", "Ignore it and continue", "Turn back to a safe place", "Take more photos"],
    correct: 2
  },
  {
    question: "Why is it important to tell someone your travel plan?",
    options: ["It is not important", "So they can help if something goes wrong", "To impress friends", "It has no purpose"],
    correct: 1
  },
  {
    question: "What should you do with your trash while hiking?",
    options: ["Leave it on the trail", "Bury it in the ground", "Carry it back with you", "Throw it in a river"],
    correct: 2
  }
];

let currentQuestionIndex = 0;
let quizScore = 0;

document.addEventListener("DOMContentLoaded", function () {

  const navbar = document.getElementById("mainNavbar");

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  handleNavbarScroll();
  window.addEventListener("scroll", handleNavbarScroll);


  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const mobileMenu = document.getElementById("navMenu");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.forEach(function (l) {
        l.classList.remove("active");
      });
      link.classList.add("active");

      if (mobileMenu.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(mobileMenu);
        bsCollapse.hide();
      }
    });
  });


  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initParallaxSection(sectionSelector, layerClassName) {
    const section = document.querySelector(sectionSelector);
    if (!section || prefersReducedMotion) {
      return;
    }

    const MAX_OFFSET = 200;

    const bgLayer = document.createElement("div");
    bgLayer.className = layerClassName;
    section.insertBefore(bgLayer, section.firstChild);

    function sizeBgLayer() {
      const sectionHeight = section.offsetHeight;
      bgLayer.style.height = sectionHeight + MAX_OFFSET * 2 + "px";
      bgLayer.style.top = -MAX_OFFSET + "px";
    }

    let ticking = false;

    function updateParallax() {
      const rect = section.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const distanceFromCenter = rect.top + rect.height / 2 - viewportCenter;
      const offset = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, distanceFromCenter * 0.7));
      bgLayer.style.transform = "translateY(" + offset + "px)";
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });

    window.addEventListener("resize", function () {
      sizeBgLayer();
      updateParallax();
    });

    window.addEventListener("load", function () {
      sizeBgLayer();
      updateParallax();
    });

    sizeBgLayer();
    updateParallax();
  }


  const seasonChecklists = {
    summer: [
      "Water bottle",
      "Sunscreen",
      "Sunglasses",
      "Lightweight breathable clothing",
      "Comfortable hiking shoes",
      "Insect repellent",
      "Hat or cap",
      "Map or GPS",
      "First aid kit",
      "Snacks"
    ],
    autumn: [
      "Warm layered clothing",
      "Water bottle",
      "Flashlight",
      "First aid kit",
      "Comfortable hiking shoes",
      "Map or GPS",
      "Power bank",
      "Light rain jacket",
      "Snacks",
      "Emergency contacts"
    ],
    winter: [
      "Warm thermal clothing",
      "Gloves",
      "Woolen cap",
      "Snow boots",
      "Sunglasses for snow glare",
      "Sunscreen",
      "Flashlight",
      "Power bank",
      "Hot flask or thermos",
      "Emergency contacts"
    ],
    spring: [
      "Water bottle",
      "Light rain jacket",
      "Comfortable hiking shoes",
      "Sunglasses",
      "Sunscreen",
      "First aid kit",
      "Map or GPS",
      "Snacks",
      "Power bank",
      "Light warm layer for evenings"
    ]
  };

  let currentSeason = "summer";
  const checklistItemsList = document.getElementById("checklistItems");
  const checklistProgressFill = document.getElementById("checklistProgressFill");
  const checklistProgressText = document.getElementById("checklistProgressText");
  const resetChecklistBtn = document.getElementById("resetChecklist");
  const seasonButtons = document.querySelectorAll("#seasonButtons .filter-btn");

  function updateChecklistProgress() {
    const checklistInputs = checklistItemsList.querySelectorAll("[data-checklist]");
    const total = checklistInputs.length;
    let checkedCount = 0;

    checklistInputs.forEach(function (input) {
      if (input.checked) {
        checkedCount++;
      }
    });

    const percent = total === 0 ? 0 : (checkedCount / total) * 100;
    checklistProgressFill.style.width = percent + "%";
    checklistProgressText.textContent = checkedCount + " of " + total + " items completed";
  }

  function attachChecklistListeners() {
    const checklistInputs = checklistItemsList.querySelectorAll("[data-checklist]");
    checklistInputs.forEach(function (input) {
      input.addEventListener("change", function () {
        const listItem = input.closest(".checklist-item");
        if (input.checked) {
          listItem.classList.add("completed");
        } else {
          listItem.classList.remove("completed");
        }
        updateChecklistProgress();
      });
    });
  }

  function renderChecklist(season) {
    const items = seasonChecklists[season] || seasonChecklists.summer;
    checklistItemsList.innerHTML = "";

    items.forEach(function (itemText) {
      const li = document.createElement("li");
      li.className = "checklist-item";
      li.innerHTML =
        '<label>' +
        '<input type="checkbox" data-checklist>' +
        '<span class="checklist-box"><i class="bi bi-check-lg"></i></span>' +
        itemText +
        '</label>';
      checklistItemsList.appendChild(li);
    });

    attachChecklistListeners();
    updateChecklistProgress();
  }

  seasonButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      seasonButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });
      button.classList.add("active");
      currentSeason = button.getAttribute("data-season");
      renderChecklist(currentSeason);
    });
  });

  resetChecklistBtn.addEventListener("click", function () {
    const checklistInputs = checklistItemsList.querySelectorAll("[data-checklist]");
    checklistInputs.forEach(function (input) {
      input.checked = false;
      input.closest(".checklist-item").classList.remove("completed");
    });
    updateChecklistProgress();
  });

  renderChecklist(currentSeason);

  initParallaxSection(".safety-parallax-wrapper-1", "safety-parallax-bg-1");
  initParallaxSection(".safety-parallax-wrapper-2", "safety-parallax-bg-2");


  const quizQuestionText = document.getElementById("quizQuestion");
  const quizOptionsWrap = document.getElementById("quizOptions");
  const quizProgress = document.getElementById("quizProgress");
  const quizQuestionWrap = document.getElementById("quizQuestionWrap");
  const quizResultWrap = document.getElementById("quizResultWrap");
  const quizScoreText = document.getElementById("quizScore");
  const quizFeedback = document.getElementById("quizFeedback");
  const quizRetryBtn = document.getElementById("quizRetry");

  function loadQuestion() {
    const questionData = quizQuestions[currentQuestionIndex];
    quizProgress.textContent = "Question " + (currentQuestionIndex + 1) + " of " + quizQuestions.length;
    quizQuestionText.textContent = questionData.question;
    quizOptionsWrap.innerHTML = "";

    questionData.options.forEach(function (optionText, index) {
      const optionButton = document.createElement("button");
      optionButton.type = "button";
      optionButton.className = "quiz-option";
      optionButton.textContent = optionText;
      optionButton.addEventListener("click", function () {
        handleAnswer(index, optionButton);
      });
      quizOptionsWrap.appendChild(optionButton);
    });
  }

  function handleAnswer(selectedIndex, selectedButton) {
    const questionData = quizQuestions[currentQuestionIndex];
    const allOptionButtons = quizOptionsWrap.querySelectorAll(".quiz-option");

    allOptionButtons.forEach(function (btn) {
      btn.disabled = true;
    });

    if (selectedIndex === questionData.correct) {
      quizScore++;
      selectedButton.classList.add("correct");
    } else {
      selectedButton.classList.add("incorrect");
      allOptionButtons[questionData.correct].classList.add("correct");
    }

    setTimeout(function () {
      currentQuestionIndex++;
      if (currentQuestionIndex < quizQuestions.length) {
        loadQuestion();
      } else {
        showQuizResult();
      }
    }, 900);
  }

  function showQuizResult() {
    quizQuestionWrap.classList.add("d-none");
    quizResultWrap.classList.remove("d-none");
    quizScoreText.textContent = quizScore;

    if (quizScore === quizQuestions.length) {
      quizFeedback.textContent = "Excellent work. You know your mountain safety basics well.";
    } else if (quizScore >= 3) {
      quizFeedback.textContent = "Good job. A little more preparation and you will be fully trail ready.";
    } else {
      quizFeedback.textContent = "Take a look at the safety tips above before your next mountain trip.";
    }
  }

  quizRetryBtn.addEventListener("click", function () {
    currentQuestionIndex = 0;
    quizScore = 0;
    quizResultWrap.classList.add("d-none");
    quizQuestionWrap.classList.remove("d-none");
    loadQuestion();
  });

  loadQuestion();
  const compassFace = document.getElementById("compassFace");
  const compassNeedle = document.getElementById("compassNeedle");
  const compassHint = document.getElementById("compassHint");
  const enableDeviceCompassBtn = document.getElementById("enableDeviceCompass");
  const compassDestinationSelect = document.getElementById("compassDestinationSelect");

  if (compassFace && compassNeedle) {
    let deviceCompassActive = false;
    let lastDeviceHeading = null;
    let userCoords = null;

    const compassDestinations = {
      himalayas: { name: "the Himalayas", lat: 27.98, lon: 86.92 },
      karakoram: { name: "the Karakoram", lat: 35.88, lon: 76.51 },
      alps: { name: "the Alps", lat: 45.83, lon: 6.87 },
      rockies: { name: "the Rockies", lat: 39.0, lon: -105.5 },
      andes: { name: "the Andes", lat: -16.5, lon: -68.15 },
      atlas: { name: "the Atlas Mountains", lat: 31.06, lon: -7.92 },
      hunza: { name: "Hunza Valley", lat: 36.32, lon: 74.65 },
      skardu: { name: "Skardu and Deosai", lat: 35.3, lon: 75.63 },
      fairymeadows: { name: "Fairy Meadows", lat: 35.38, lon: 74.58 },
      swat: { name: "Swat Valley", lat: 35.2, lon: 72.42 },
      naran: { name: "Naran Kaghan", lat: 34.91, lon: 73.65 },
      chitral: { name: "Chitral and Kalash", lat: 35.85, lon: 71.79 },
      annapurna: { name: "Annapurna", lat: 28.53, lon: 83.82 },
      fuji: { name: "Mount Fuji", lat: 35.36, lon: 138.73 },
      dolomites: { name: "the Dolomites", lat: 46.54, lon: 12.14 },
      pyrenees: { name: "the Pyrenees", lat: 42.77, lon: -0.14 },
      sierranevada: { name: "Sierra Nevada", lat: 37.75, lon: -119.5 },
      banff: { name: "the Canadian Rockies", lat: 51.18, lon: -115.57 },
      patagonia: { name: "Patagonia", lat: -49.33, lon: -72.88 },
      aconcagua: { name: "Aconcagua", lat: -32.65, lon: -70.01 }
    };

    let selectedDestinationKey = compassDestinationSelect
      ? compassDestinationSelect.value
      : "himalayas";

    function toRad(deg) {
      return (deg * Math.PI) / 180;
    }

    function toDeg(rad) {
      return (rad * 180) / Math.PI;
    }

    function setNeedleRotation(angleDegrees) {
      compassNeedle.style.transform = "rotate(" + angleDegrees + "deg)";
    }

    function computeBearing(lat1, lon1, lat2, lon2) {
      const phi1 = toRad(lat1);
      const phi2 = toRad(lat2);
      const deltaLambda = toRad(lon2 - lon1);

      const y = Math.sin(deltaLambda) * Math.cos(phi2);
      const x =
        Math.cos(phi1) * Math.sin(phi2) -
        Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

      const theta = Math.atan2(y, x);
      return (toDeg(theta) + 360) % 360;
    }

    function updateCompassToDestination() {
      if (!userCoords) {
        return;
      }

      const dest = compassDestinations[selectedDestinationKey];
      if (!dest) {
        return;
      }

      const bearing = computeBearing(userCoords.lat, userCoords.lon, dest.lat, dest.lon);
      let displayAngle = bearing;

      if (deviceCompassActive && typeof lastDeviceHeading === "number") {
        displayAngle = bearing - lastDeviceHeading;
        compassHint.textContent = "Pointing toward " + dest.name;
      } else {
        compassHint.textContent = "Pointing toward " + dest.name + " (screen up = north)";
      }

      setNeedleRotation(displayAngle);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          userCoords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          updateCompassToDestination();
        },
        function () {
          compassHint.textContent = "Enable location access to point toward a destination";
        },
        { enableHighAccuracy: false, timeout: 8000 }
      );
    } else {
      compassHint.textContent = "Location is not supported on this browser";
    }

    if (compassDestinationSelect) {
      compassDestinationSelect.addEventListener("change", function () {
        selectedDestinationKey = compassDestinationSelect.value;
        updateCompassToDestination();
      });
    }

    function handleOrientation(event) {
      let heading = null;

      if (typeof event.webkitCompassHeading === "number") {
        heading = event.webkitCompassHeading;
      } else if (typeof event.alpha === "number") {
        heading = 360 - event.alpha;
      }

      if (heading === null) {
        return;
      }

      lastDeviceHeading = heading;
      updateCompassToDestination();
    }

    function tryAutoStartDeviceCompass() {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission !== "function" &&
        window.DeviceOrientationEvent
      ) {
        deviceCompassActive = true;
        window.addEventListener("deviceorientationabsolute", handleOrientation);
        window.addEventListener("deviceorientation", handleOrientation);
        if (enableDeviceCompassBtn) {
          enableDeviceCompassBtn.style.display = "none";
        }
      }
    }

    tryAutoStartDeviceCompass();

    if (enableDeviceCompassBtn) {
      enableDeviceCompassBtn.addEventListener("click", function () {
        if (
          typeof DeviceOrientationEvent !== "undefined" &&
          typeof DeviceOrientationEvent.requestPermission === "function"
        ) {
          DeviceOrientationEvent.requestPermission()
            .then(function (response) {
              if (response === "granted") {
                deviceCompassActive = true;
                window.addEventListener("deviceorientation", handleOrientation);
                enableDeviceCompassBtn.style.display = "none";
              } else {
                compassHint.textContent = "Device access was not granted";
              }
            })
            .catch(function () {
              compassHint.textContent = "Device compass unavailable";
            });
        } else if (window.DeviceOrientationEvent) {
          deviceCompassActive = true;
          window.addEventListener("deviceorientationabsolute", handleOrientation);
          window.addEventListener("deviceorientation", handleOrientation);
          enableDeviceCompassBtn.style.display = "none";
        } else {
          compassHint.textContent = "Not supported on this browser";
        }
      });
    }
  }

  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });


  const allButtons = document.querySelectorAll(".btn");

  allButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      btn.classList.add("btn-pressed");
      setTimeout(function () {
        btn.classList.remove("btn-pressed");
      }, 150);
    });
  });


  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterMsg = document.getElementById("newsletterMsg");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailValue = newsletterEmail.value.trim();

    if (emailValue === "") {
      showNewsletterMessage("Please enter your email address.", "error");
    } else if (!emailPattern.test(emailValue)) {
      showNewsletterMessage("Please enter a valid email address.", "error");
    } else {
      showNewsletterMessage("Thank you for subscribing!", "success");
      newsletterForm.reset();
    }
  });

  function showNewsletterMessage(text, type) {
    newsletterMsg.textContent = text;
    newsletterMsg.classList.remove("text-success-msg", "text-error-msg");
    newsletterMsg.classList.add(type === "success" ? "text-success-msg" : "text-error-msg");
  }


  const yearSpan = document.getElementById("currentYear");
  yearSpan.textContent = new Date().getFullYear();

});
const activityData = {
  hiking: {
    name: "Hiking",
    description: "Explore peaceful mountain trails and enjoy breathtaking views as you walk through forests, meadows and rocky paths at your own pace.",
    difficulty: "Easy to Moderate",
    equipment: "Comfortable shoes, water, backpack",
    season: "Spring and Autumn",
    safety: "Stay on marked trails and check the weather before starting.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop"
  },
  climbing: {
    name: "Mountain Climbing",
    description: "Challenge yourself and experience the excitement of reaching new heights on steep rock faces and demanding mountain routes.",
    difficulty: "Challenging",
    equipment: "Climbing rope, harness, helmet, proper boots",
    season: "Summer",
    safety: "Always climb with a trained guide and check your equipment before every climb.",
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop"
  },
  camping: {
    name: "Camping",
    description: "Spend peaceful nights surrounded by mountains and nature, waking up to fresh air and quiet, open landscapes.",
    difficulty: "Easy",
    equipment: "Tent, sleeping bag, portable stove, warm clothing",
    season: "Spring, Summer and Autumn",
    safety: "Set up camp away from cliffs and rivers, and store food safely from wildlife.",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop"
  },
  skiing: {
    name: "Skiing",
    description: "Enjoy the thrill of snow-covered slopes and winter landscapes as you glide down groomed trails with the mountains around you.",
    difficulty: "Moderate to Challenging",
    equipment: "Skis, poles, helmet, winter jacket",
    season: "Winter",
    safety: "Warm up before skiing and stay within marked ski zones.",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop"
  },
  trekking: {
    name: "Trekking",
    description: "Travel through valleys, trails and beautiful mountain regions over multiple days, covering greater distances and changing terrain.",
    difficulty: "Moderate",
    equipment: "Trekking poles, sturdy boots, backpack, first aid kit",
    season: "Spring and Autumn",
    safety: "Plan your route in advance and inform someone of your trekking schedule.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop"
  },
  photography: {
    name: "Mountain Photography",
    description: "Capture stunning landscapes, wildlife and unforgettable moments while exploring the changing light across the mountains.",
    difficulty: "Easy",
    equipment: "Camera, tripod, extra batteries, weatherproof bag",
    season: "All Year",
    safety: "Watch your footing near edges and avoid disturbing wildlife for a shot.",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=800&auto=format&fit=crop"
  }
};

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


  const filterButtons = document.querySelectorAll(".filter-btn");
  const activityItems = document.querySelectorAll(".activity-item");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      activityItems.forEach(function (item) {
        const categories = item.getAttribute("data-category");
        if (filterValue === "all" || categories.indexOf(filterValue) !== -1) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });


  const modalEl = document.getElementById("activityModal");
  const activityModal = new bootstrap.Modal(modalEl);
  const exploreButtons = document.querySelectorAll(".btn-explore-activity");

  exploreButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const key = button.getAttribute("data-activity");
      const data = activityData[key];

      if (!data) {
        return;
      }

      document.getElementById("modalImage").src = data.image;
      document.getElementById("modalImage").alt = data.name;
      document.getElementById("modalTitle").textContent = data.name;
      document.getElementById("modalDescription").textContent = data.description;
      document.getElementById("modalDifficulty").textContent = data.difficulty;
      document.getElementById("modalEquipment").textContent = data.equipment;
      document.getElementById("modalSeason").textContent = data.season;
      document.getElementById("modalSafety").textContent = data.safety;

      activityModal.show();
    });
  });
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
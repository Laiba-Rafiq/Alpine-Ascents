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


  const timelineItems = document.querySelectorAll(".timeline-item");

  timelineItems.forEach(function (item, index) {
    item.style.transitionDelay = (index * 0.15) + "s";
  });


  const destinationData = {
    alps: {
      name: "The Alps",
      location: "Europe",
      image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1200&auto=format&fit=crop",
      description: "The Alps have shaped European history for centuries, from ancient trade routes crossing high mountain passes to the birth of modern alpinism in the 18th century.",
      activities: "Regarded as the birthplace of mountaineering, following the first ascent of Mont Blanc in 1786.",
      bestTime: "Marked the start of organized alpine climbing and the growth of mountain tourism across Europe.",
      link: "destination.html#alps"
    },
    himalayas: {
      name: "Himalayas",
      location: "Asia",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop",
      description: "Home to the world's highest peaks, the Himalayas have long held deep cultural and spiritual meaning while drawing explorers determined to reach their summits.",
      activities: "Site of the first successful ascent of Mount Everest, the world's highest peak.",
      bestTime: "Everest was first summited in 1953 by Edmund Hillary and Tenzing Norgay.",
      link: "destination.html#himalayas"
    },
    karakoram: {
      name: "Karakoram",
      location: "Pakistan / Asia",
      image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=1200&auto=format&fit=crop",
      description: "Known for some of the most demanding terrain on Earth, the Karakoram range became a defining testing ground for the boldest mountaineers of the 20th century.",
      activities: "Home to K2, the second highest and among the most dangerous peaks to climb.",
      bestTime: "K2 was first successfully summited in 1954 by an Italian expedition.",
      link: "destination.html#karakoram"
    },
    rockies: {
      name: "Rockies",
      location: "North America",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
      description: "The Rockies played a vital role in westward exploration across North America, shaping trade routes, indigenous life and the growth of the modern national park movement.",
      activities: "Central route for early explorers and fur traders navigating the North American frontier.",
      bestTime: "Formed the backbone of the historic Lewis and Clark expedition in the early 1800s.",
      link: "destination.html#rockies"
    },
    hunza: {
      name: "Hunza Valley",
      location: "Gilgit-Baltistan, Pakistan",
      image: "https://images.unsplash.com/photo-1514558427911-8e293bebf18c?q=80&w=1200&auto=format&fit=crop",
      description: "Once an independent princely state controlling a key Silk Road trade corridor, Hunza has shaped the movement of goods, cultures and travelers through the Karakoram for centuries.",
      activities: "Served as a strategic crossing point on the ancient Silk Road linking Central and South Asia.",
      bestTime: "Formally acceded to Pakistan in 1974, ending centuries of autonomous princely rule.",
      link: "destination.html#hunza"
    },
    skardu: {
      name: "Skardu and Deosai",
      location: "Gilgit-Baltistan, Pakistan",
      image: "https://images.unsplash.com/photo-1679951124125-50cc4029d727?q=80&w=1200&auto=format&fit=crop",
      description: "Skardu has served as the traditional staging ground for expeditions into the Karakoram since the early twentieth century, launching some of mountaineering's most famous attempts on K2.",
      activities: "Base camp town for major Karakoram mountaineering expeditions for over a century.",
      bestTime: "Served as the launch point for the 1954 Italian expedition that achieved the first ascent of K2.",
      link: "destination.html#skardu"
    },
    fairymeadows: {
      name: "Fairy Meadows",
      location: "Gilgit-Baltistan, Pakistan",
      image: "https://images.unsplash.com/photo-1664872759149-b7605ca5a3a7?q=80&w=1200&auto=format&fit=crop",
      description: "Sitting at the base of Nanga Parbat, Fairy Meadows became known to early European expeditions for the extreme difficulty and tragedy surrounding attempts on the Killer Mountain.",
      activities: "Serves as the base camp approach for Nanga Parbat, the ninth highest mountain on Earth.",
      bestTime: "Nanga Parbat was first summited in 1953 by Hermann Buhl in a daring solo push to the peak.",
      link: "destination.html#fairymeadows"
    },
    swat: {
      name: "Swat Valley",
      location: "Khyber Pakhtunkhwa, Pakistan",
      image: "https://images.unsplash.com/photo-1624087267589-41ea77e28b1a?q=80&w=1200&auto=format&fit=crop",
      description: "Once the heartland of the ancient Gandhara civilization, Swat blended Buddhist and Greco-Roman artistic traditions and flourished as a center of learning and trade for centuries.",
      activities: "Formed the core of the Gandhara civilization, a crossroads of Buddhist and classical culture.",
      bestTime: "Home to thousands of Buddhist archaeological sites dating back over two thousand years.",
      link: "destination.html#swat"
    },
    naran: {
      name: "Naran Kaghan",
      location: "Khyber Pakhtunkhwa, Pakistan",
      image: "https://images.unsplash.com/photo-1626685516371-a0ee93a0f370?q=80&w=1200&auto=format&fit=crop",
      description: "The Kaghan Valley has long been woven into regional folklore, with the glacial Saif ul Malook Lake at its center inspiring centuries of legend and storytelling.",
      activities: "Central setting of the folk legend of Prince Saif ul Malook and the fairy Badar Jamal.",
      bestTime: "Became a popular summer retreat in the early twentieth century as regional travel expanded.",
      link: "destination.html#naran"
    },
    chitral: {
      name: "Chitral and Kalash",
      location: "Khyber Pakhtunkhwa, Pakistan",
      image: "https://images.unsplash.com/photo-1667922210719-566cbfec2b11?q=80&w=1200&auto=format&fit=crop",
      description: "Nestled in the Hindu Kush near the Afghan border, the Kalash Valleys preserve one of the last pre-Islamic indigenous cultures in the region, with a history stretching back centuries.",
      activities: "Home to the Kalash people, whose language, religion and traditions remain distinct from surrounding regions.",
      bestTime: "First documented by European explorers and anthropologists in the late nineteenth century.",
      link: "destination.html#chitral"
    }
  };

  const destinationCards = document.querySelectorAll(".destination-card");
  const destinationModalEl = document.getElementById("destinationModal");

  if (destinationModalEl) {
    const destinationModal = new bootstrap.Modal(destinationModalEl);
    const modalDestinationImage = document.getElementById("modalDestinationImage");
    const modalDestinationName = document.getElementById("modalDestinationName");
    const modalDestinationLocation = document.getElementById("modalDestinationLocation");
    const modalDestinationDesc = document.getElementById("modalDestinationDesc");
    const modalDestinationActivities = document.getElementById("modalDestinationActivities");
    const modalDestinationBestTime = document.getElementById("modalDestinationBestTime");
    const modalExploreBtn = document.getElementById("modalExploreBtn");

    destinationCards.forEach(function (card) {
      card.addEventListener("click", function () {
        const key = card.getAttribute("data-destination");
        const data = destinationData[key];

        if (!data) {
          return;
        }

        modalDestinationImage.src = data.image;
        modalDestinationImage.alt = data.name;
        modalDestinationName.textContent = data.name;
        modalDestinationLocation.textContent = data.location;
        modalDestinationDesc.textContent = data.description;
        modalDestinationActivities.textContent = data.activities;
        modalDestinationBestTime.textContent = data.bestTime;
        modalExploreBtn.setAttribute("href", data.link);

        destinationModal.show();
      });
    });
  }


  const climberData = {
    balmat: {
      name: "Balmat & Paccard",
      year: "1786",
      image: "assets/Jacques-Balmat-and-Paccard.jpg",
      achievement: "First ascent of Mont Blanc",
      story: "On August 8, 1786, Jacques Balmat, a local crystal and chamois hunter, and Michel-Gabriel Paccard, a doctor from Chamonix, became the first people to reach the summit of Mont Blanc at 4,807 meters, the highest peak in the Alps. Their climb was driven partly by a reward offered 26 years earlier by Swiss naturalist Horace-Benedict de Saussure to whoever could find a route to the top. The unlikely pairing of a hunter and a physician set out with only basic equipment, homespun jackets, wooden alpenstocks and a single shared blanket. Their success is widely regarded as the birth of modern mountaineering and sparked the growth of alpine tourism across Europe.",
      facts: [
        "Reached the summit at 6:23 in the evening after a grueling ascent",
        "Balmat later received the honorary title du Mont Blanc from the King of Sardinia",
        "Their achievement inspired de Saussure's own scientific expedition to the summit the following year"
      ]
    },
    hillary: {
      name: "Hillary & Norgay",
      year: "1953",
      image: "assets/Hillary%20%26%20Norgay.jpg",
      achievement: "First confirmed ascent of Mount Everest",
      story: "On May 29, 1953, New Zealand beekeeper Edmund Hillary and Nepalese Sherpa Tenzing Norgay became the first climbers confirmed to reach the 8,849 meter summit of Mount Everest, the highest point on Earth. They were part of the ninth British expedition to Everest, led by John Hunt. Norgay had already attempted Everest six times before this final successful push. The pair spent only about fifteen minutes at the summit before beginning their descent, limited by their remaining oxygen supply.",
      facts: [
        "Hillary was knighted by Queen Elizabeth II shortly after the expedition",
        "Norgay received the George Medal for his role in the historic climb",
        "Lukla Airport in Nepal was renamed Tenzing-Hillary Airport in 2008 in their honor"
      ]
    },
    compagnoni: {
      name: "Compagnoni & Lacedelli",
      year: "1954",
      image: "assets/Compagnoni_and_Lacedelli_1954.jpg",
      achievement: "First ascent of K2",
      story: "On July 31, 1954, Italian climbers Achille Compagnoni and Lino Lacedelli became the first to reach the 8,611 meter summit of K2, widely regarded as more difficult and dangerous to climb than Everest. Their expedition, led by Ardito Desio, depended heavily on teammates Walter Bonatti and porter Amir Mahdi, who carried oxygen supplies to a high camp under extremely difficult conditions. The climb remains one of the most debated achievements in mountaineering history.",
      facts: [
        "K2 would not be summited again for another 23 years, until 1977",
        "The expedition later became the subject of decades of controversy over the roles played by different team members",
        "K2 sits directly on the border between Pakistan and China"
      ]
    },
    tabei: {
      name: "Junko Tabei",
      year: "1975",
      image: "assets/Junko%20Tabei.jpg",
      achievement: "First woman to summit Mount Everest",
      story: "On May 16, 1975, Japanese mountaineer Junko Tabei became the first woman to reach the summit of Mount Everest. Just twelve days before her historic climb, she survived an avalanche that buried her expedition's camp. She went on to become the first woman to complete the Seven Summits, climbing the highest peak on every continent, and spent much of her later life advocating for environmental protection in mountain regions.",
      facts: [
        "She organized Japan's first women only Himalayan climbing expedition",
        "Later led environmental campaigns to clean up debris left behind on Everest",
        "A mountain range on the dwarf planet Pluto was named Tabei Montes in her honor"
      ]
    },
    messner: {
      name: "Reinhold Messner",
      year: "1978",
      image: "assets/Reinhold%20Messner.jpg",
      achievement: "First to summit Everest without supplemental oxygen",
      story: "In 1978, Italian climber Reinhold Messner and his partner Peter Habeler became the first to summit Mount Everest without the use of supplemental oxygen, a feat many experts had believed was physically impossible. Two years later, Messner returned to complete the first solo ascent of Everest, also without oxygen. He went on to become the first person in history to climb all fourteen of the world's eight thousand meter peaks.",
      facts: [
        "Widely considered the greatest high altitude mountaineer of all time",
        "Completed the first crossing of Antarctica without snowmobiles or dog sleds",
        "Has published more than eighty books about his climbing and exploration experiences"
      ]
    },
    purja: {
      name: "Nirmal Purja",
      year: "2019",
      image: "assets/Nirmal%20Purja.jpg",
      achievement: "All fourteen eight-thousanders in under seven months",
      story: "In 2019, former British special forces soldier Nirmal Purja completed Project Possible, climbing all fourteen of the world's eight thousand meter peaks in just six months and six days, shattering the previous record of nearly eight years. Purja, who grew up in Nepal's Myagdi District near Dhaulagiri, became one of the most celebrated mountaineers of his generation before his death in July 2026 in an avalanche on Broad Peak in Pakistan.",
      facts: [
        "Became the first Gurkha soldier to join the United Kingdom's Special Boat Service",
        "His record breaking climbs were documented in the Netflix film 14 Peaks: Nothing Is Impossible",
        "Known affectionately to fans and fellow climbers as Nims Dai"
      ]
    }
  };

  const climberCards = document.querySelectorAll(".climber-card[data-climber]");
  const climberModalEl = document.getElementById("climberModal");

  if (climberModalEl) {
    const climberModal = new bootstrap.Modal(climberModalEl);
    const modalClimberImage = document.getElementById("modalClimberImage");
    const modalClimberYear = document.getElementById("modalClimberYear");
    const modalClimberName = document.getElementById("modalClimberName");
    const modalClimberAchievement = document.getElementById("modalClimberAchievement");
    const modalClimberStory = document.getElementById("modalClimberStory");
    const modalClimberFacts = document.getElementById("modalClimberFacts");

    function fillFactsList(items) {
      modalClimberFacts.innerHTML = "";
      items.forEach(function (item) {
        const li = document.createElement("li");
        li.textContent = item;
        modalClimberFacts.appendChild(li);
      });
    }

    climberCards.forEach(function (card) {
      card.addEventListener("click", function () {
        const key = card.getAttribute("data-climber");
        const data = climberData[key];

        if (!data) {
          return;
        }

        modalClimberImage.src = data.image;
        modalClimberImage.alt = data.name;
        modalClimberYear.textContent = data.year;
        modalClimberName.textContent = data.name;
        modalClimberAchievement.textContent = data.achievement;
        modalClimberStory.textContent = data.story;
        fillFactsList(data.facts);

        climberModal.show();
      });
    });
  }
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
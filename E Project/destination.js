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

  const searchInput = document.getElementById("searchInput");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const destCards = document.querySelectorAll(".dest-card-col");
  const noResults = document.getElementById("noResults");
  let currentFilter = "all";

  function applyFilters() {
    const searchValue = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    destCards.forEach(function (card) {
      const name = card.getAttribute("data-name").toLowerCase();
      const region = card.getAttribute("data-region");
      const matchesFilter = currentFilter === "all" || region === currentFilter;
      const matchesSearch = name.includes(searchValue) || region.toLowerCase().includes(searchValue);

      if (matchesFilter && matchesSearch) {
        card.classList.remove("d-none");
        visibleCount++;
      } else {
        card.classList.add("d-none");
      }
    });

    if (visibleCount === 0) {
      noResults.classList.remove("d-none");
    } else {
      noResults.classList.add("d-none");
    }
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      applyFilters();
    });
  });

  searchInput.addEventListener("input", applyFilters);

  const urlParams = new URLSearchParams(window.location.search);
  const regionParam = urlParams.get("region");

  if (regionParam) {
    const matchingBtn = Array.from(filterButtons).find(function (btn) {
      return btn.getAttribute("data-filter").toLowerCase() === regionParam.toLowerCase();
    });

    if (matchingBtn) {
      filterButtons.forEach(function (b) {
        b.classList.remove("active");
      });
      matchingBtn.classList.add("active");
      currentFilter = matchingBtn.getAttribute("data-filter");
      applyFilters();
    }
  }

  const destinationData = {
    himalayas: {
      name: "Himalayas",
      location: "Asia",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop",
      history: "The Himalayas have shaped the culture and history of South Asia for thousands of years, home to sacred sites, ancient trade routes and legendary mountaineering expeditions.",
      features: ["The highest peak on Earth, Mount Everest", "Deep valleys and glacial rivers", "Rich Buddhist and Hindu culture"],
      activities: ["Trekking", "Mountaineering", "Cultural tours"],
      bestTime: "March to May and September to November"
    },
    karakoram: {
      name: "Karakoram",
      location: "Pakistan, Asia",
      image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=1200&auto=format&fit=crop",
      history: "The Karakoram range has long attracted explorers and climbers, known for hosting some of the tallest and most difficult peaks in the world, including K2.",
      features: ["Home to K2, the second highest peak", "Massive glaciers", "Remote and dramatic scenery"],
      activities: ["Mountaineering", "Trekking", "Glacier exploration"],
      bestTime: "June to September"
    },
    alps: {
      name: "Alps",
      location: "Europe",
      image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1200&auto=format&fit=crop",
      history: "The Alps have been a center of European mountain tourism since the 1800s, giving rise to modern skiing, alpine climbing and mountain hospitality.",
      features: ["Charming alpine villages", "Well developed ski resorts", "Scenic hiking trails"],
      activities: ["Skiing", "Hiking", "Sightseeing"],
      bestTime: "December to March for skiing, June to September for hiking"
    },
    rockies: {
      name: "Rocky Mountains",
      location: "North America",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
      history: "The Rocky Mountains have played a major role in North American exploration and settlement, later becoming a symbol of wilderness and outdoor adventure.",
      features: ["Vast national parks", "Diverse wildlife", "Clear alpine lakes"],
      activities: ["Hiking", "Wildlife watching", "Camping"],
      bestTime: "June to September"
    },
    andes: {
      name: "Andes",
      location: "South America",
      image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1200&auto=format&fit=crop",
      history: "The Andes shaped ancient civilizations such as the Inca, whose roads and cities still remain across the range today.",
      features: ["The longest continental mountain range", "Ancient Inca trails", "Varied climates and landscapes"],
      activities: ["Trekking", "Cultural tours", "Climbing"],
      bestTime: "May to September"
    },
    atlas: {
      name: "Atlas Mountains",
      location: "Africa",
      image: "https://images.unsplash.com/photo-1597662786834-8eea85ad4841?q=80&w=1200&auto=format&fit=crop",
      history: "The Atlas Mountains have been home to Berber communities for centuries, with villages and trade routes built into the mountainside.",
      features: ["Traditional Berber villages", "Scenic valleys", "Mix of desert and mountain landscapes"],
      activities: ["Hiking", "Village tours", "Photography"],
      bestTime: "April to June and September to November"
    },
    hunza: {
      name: "Hunza Valley",
      location: "Gilgit-Baltistan, Pakistan",
      image: "https://images.unsplash.com/photo-1514558427911-8e293bebf18c?q=80&w=1200&auto=format&fit=crop",
      history: "Once an ancient princely state along the Silk Road, Hunza has long been a crossroads of trade and culture beneath the peaks of Rakaposhi and the Karakoram.",
      features: ["Views of Rakaposhi and Karakoram peaks", "Historic Baltit and Altit Forts", "Terraced orchards famous for apricots"],
      activities: ["Hiking", "Sightseeing", "Photography"],
      bestTime: "April to October"
    },
    skardu: {
      name: "Skardu and Deosai",
      location: "Gilgit-Baltistan, Pakistan",
      image: "https://images.unsplash.com/photo-1679951124125-50cc4029d727?q=80&w=1200&auto=format&fit=crop",
      history: "Skardu has served as the traditional gateway for expeditions into the Karakoram, including routes toward K2, while the neighboring Deosai Plains remain one of the highest plateaus in the world.",
      features: ["Gateway to K2 and the Karakoram", "Deosai National Park plateau", "Turquoise lakes such as Sheosar"],
      activities: ["Trekking", "Jeep safaris", "Wildlife watching"],
      bestTime: "May to September"
    },
    fairymeadows: {
      name: "Fairy Meadows",
      location: "Gilgit-Baltistan, Pakistan",
      image: "https://images.unsplash.com/photo-1664872759149-b7605ca5a3a7?q=80&w=1200&auto=format&fit=crop",
      history: "Long used by local shepherds as a summer grazing meadow, Fairy Meadows became known internationally as one of the closest accessible viewpoints of Nanga Parbat, the ninth highest mountain on Earth.",
      features: ["Close up views of Nanga Parbat", "Alpine meadows and pine forests", "Base camp trekking routes"],
      activities: ["Trekking", "Camping", "Photography"],
      bestTime: "June to September"
    },
    swat: {
      name: "Swat Valley",
      location: "Khyber Pakhtunkhwa, Pakistan",
      image: "https://images.unsplash.com/photo-1624087267589-41ea77e28b1a?q=80&w=1200&auto=format&fit=crop",
      history: "Once a center of ancient Buddhist civilization along the old trade routes, Swat later earned the nickname the Switzerland of Pakistan for its green valleys and rivers.",
      features: ["Lush green valleys and rivers", "Ancient Buddhist archaeological sites", "Hill stations such as Malam Jabba"],
      activities: ["Hiking", "Skiing", "Sightseeing"],
      bestTime: "April to October"
    },
    naran: {
      name: "Naran Kaghan",
      location: "Khyber Pakhtunkhwa, Pakistan",
      image: "https://images.unsplash.com/photo-1626685516371-a0ee93a0f370?q=80&w=1200&auto=format&fit=crop",
      history: "The Kaghan Valley has long been a popular summer retreat, with the glacial Saif ul Malook Lake at its heart inspiring generations of folklore and travelers.",
      features: ["Saif ul Malook glacial lake", "Pine forested slopes", "Access to Babusar Pass"],
      activities: ["Hiking", "Boating", "Camping"],
      bestTime: "June to September"
    },
    chitral: {
      name: "Chitral and Kalash",
      location: "Khyber Pakhtunkhwa, Pakistan",
      image: "https://images.unsplash.com/photo-1667922210719-566cbfec2b11?q=80&w=1200&auto=format&fit=crop",
      history: "Nestled in the Hindu Kush near the Afghan border, the Kalash Valleys are home to the Kalash people, a small indigenous community with a distinct language, religion and centuries old traditions.",
      features: ["Home to the Kalash people and culture", "Surrounded by the Hindu Kush range", "Remote valleys of Bumburet, Rumbur and Birir"],
      activities: ["Cultural tours", "Hiking", "Photography"],
      bestTime: "May to September"
    },
    annapurna: {
      name: "Annapurna",
      location: "Nepal",
      image: "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?q=80&w=1200&auto=format&fit=crop",
      history: "The Annapurna massif has drawn climbers and trekkers since the first ascent of Annapurna I in 1950, the first eight thousand meter peak ever summited, and remains one of the most popular trekking regions in the world.",
      features: ["Annapurna Circuit and Base Camp trails", "Poon Hill sunrise viewpoint", "Diverse landscapes from subtropical forest to high alpine"],
      activities: ["Trekking", "Mountaineering", "Cultural tours"],
      bestTime: "March to May and September to November"
    },
    fuji: {
      name: "Mount Fuji",
      location: "Japan",
      image: "https://images.unsplash.com/photo-1528884089-4582fe06c516?q=80&w=1200&auto=format&fit=crop",
      history: "An active volcano considered sacred in Japanese culture, Mount Fuji has inspired centuries of art, poetry and pilgrimage and is recognized as a UNESCO World Heritage Site.",
      features: ["Japan's tallest peak at 3,776 meters", "Iconic symmetrical volcanic cone", "Views from Fuji Five Lakes and Chureito Pagoda"],
      activities: ["Hiking", "Sightseeing", "Photography"],
      bestTime: "July to September for climbing"
    },
    dolomites: {
      name: "Dolomites",
      location: "Italy",
      image: "https://images.unsplash.com/photo-1694630515448-344264b30507?q=80&w=1200&auto=format&fit=crop",
      history: "Formed from ancient coral reefs and shaped by glaciers, the Dolomites became a UNESCO World Heritage Site in 2009 and have long been a center for alpine climbing and skiing in Italy.",
      features: ["Dramatic pale limestone peaks", "UNESCO World Heritage status", "Charming villages such as Cortina d'Ampezzo"],
      activities: ["Hiking", "Skiing", "Via ferrata climbing"],
      bestTime: "June to September for hiking, December to March for skiing"
    },
    pyrenees: {
      name: "Pyrenees",
      location: "France / Spain",
      image: "https://images.unsplash.com/photo-1667743071531-9ff3ccf4fe38?q=80&w=1200&auto=format&fit=crop",
      history: "Forming a natural border between France and Spain, the Pyrenees have shaped centuries of regional culture, pilgrimage routes and mountain traditions on both sides of the range.",
      features: ["Natural border range with glacial lakes", "Ordesa and Monte Perdido National Park", "Traditional Basque and Catalan mountain villages"],
      activities: ["Hiking", "Skiing", "Wildlife watching"],
      bestTime: "June to September for hiking, December to March for skiing"
    },
    sierranevada: {
      name: "Sierra Nevada",
      location: "California, USA",
      image: "https://images.unsplash.com/photo-1576517606342-c4122f8de199?q=80&w=1200&auto=format&fit=crop",
      history: "Home to Yosemite and Sequoia National Parks, the Sierra Nevada has long been celebrated by conservationists such as John Muir for its granite peaks and ancient forests.",
      features: ["Yosemite Valley and Half Dome", "Giant sequoia groves", "Lake Tahoe's alpine waters"],
      activities: ["Hiking", "Rock climbing", "Skiing"],
      bestTime: "June to September for hiking, December to March for skiing"
    },
    banff: {
      name: "Canadian Rockies",
      location: "Alberta, Canada",
      image: "https://images.unsplash.com/photo-1539667547529-84c607280d20?q=80&w=1200&auto=format&fit=crop",
      history: "Banff, established in 1885, was Canada's first national park and helped launch mountain tourism across the Canadian Rockies, now recognized as a UNESCO World Heritage Site.",
      features: ["Moraine Lake and Lake Louise", "Banff National Park, Canada's first national park", "Icefields Parkway scenic route"],
      activities: ["Hiking", "Canoeing", "Wildlife watching"],
      bestTime: "June to September"
    },
    patagonia: {
      name: "Patagonia",
      location: "Argentina / Chile",
      image: "https://images.unsplash.com/photo-1547483238-2cbf881a559f?q=80&w=1200&auto=format&fit=crop",
      history: "Named by early European explorers, Patagonia remains one of the most remote and sparsely populated regions on Earth, celebrated for its glaciers, granite towers and windswept wilderness.",
      features: ["Mount Fitz Roy and Cerro Torre", "Torres del Paine National Park", "Perito Moreno Glacier"],
      activities: ["Trekking", "Glacier tours", "Wildlife watching"],
      bestTime: "October to April"
    },
    aconcagua: {
      name: "Aconcagua",
      location: "Mendoza, Argentina",
      image: "https://images.unsplash.com/photo-1662239090914-1da951eaeda4?q=80&w=1200&auto=format&fit=crop",
      history: "First summited in 1897 by Matthias Zurbriggen, Aconcagua is the highest peak in the Americas and one of the Seven Summits, attracting mountaineers from around the world.",
      features: ["Highest peak in the Americas at 6,961 meters", "One of the Seven Summits", "Located within Aconcagua Provincial Park"],
      activities: ["Mountaineering", "Trekking", "Photography"],
      bestTime: "December to February"
    }
  };

  const exploreButtons = document.querySelectorAll(".btn-explore[data-id]");
  const modalDestName = document.getElementById("modalDestName");
  const modalDestImage = document.getElementById("modalDestImage");
  const modalDestLocation = document.getElementById("modalDestLocation");
  const modalDestHistory = document.getElementById("modalDestHistory");
  const modalDestFeatures = document.getElementById("modalDestFeatures");
  const modalDestActivities = document.getElementById("modalDestActivities");
  const modalDestBestTime = document.getElementById("modalDestBestTime");
  const destinationModalEl = document.getElementById("destinationModal");
  const destinationModal = new bootstrap.Modal(destinationModalEl);

  function fillList(listElement, items) {
    listElement.innerHTML = "";
    items.forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item;
      listElement.appendChild(li);
    });
  }

  exploreButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = btn.getAttribute("data-id");
      const data = destinationData[id];

      if (!data) {
        return;
      }

      modalDestName.textContent = data.name;
      modalDestImage.src = data.image;
      modalDestImage.alt = data.name;
      modalDestLocation.textContent = data.location;
      modalDestHistory.textContent = data.history;
      modalDestBestTime.textContent = data.bestTime;
      fillList(modalDestFeatures, data.features);
      fillList(modalDestActivities, data.activities);

      destinationModal.show();
    });
  });

  const mapPointData = {
    himalayas: {
      name: "Himalayas",
      video: "OlIFXpCQH6w",
      region: "asia",
      lat: 27.98,
      lng: 86.92,
      safety: [
        "Watch for altitude sickness above 3000 meters",
        "Carry a first aid kit and emergency contacts",
        "Check weather and avalanche warnings before trekking",
        "Travel with a licensed local guide"
      ],
      essentials: [
        "Warm layered clothing and thermal wear",
        "Trekking poles and sturdy boots",
        "Water purification tablets",
        "Altitude sickness medication"
      ]
    },
    karakoram: {
      name: "Karakoram",
      video: "KuX7OWx1g4I",
      region: "asia",
      lat: 35.88,
      lng: 76.51,
      safety: [
        "Extreme altitude and unpredictable weather require experienced guides",
        "Register with local authorities before remote treks",
        "Carry satellite communication for emergencies",
        "Be prepared for sudden temperature drops"
      ],
      essentials: [
        "High altitude mountaineering gear",
        "Crampons and ice axe for glacier travel",
        "High calorie food supplies",
        "Satellite phone or GPS locator beacon"
      ]
    },
    alps: {
      name: "The Alps",
      video: "ESB51nx_yIY",
      region: "europe",
      lat: 45.83,
      lng: 6.87,
      safety: [
        "Check avalanche and weather reports before skiing or hiking",
        "Stay on marked trails in unfamiliar areas",
        "Carry a charged phone for emergencies",
        "Be cautious of sudden fog on higher trails"
      ],
      essentials: [
        "Weatherproof jacket and layered clothing",
        "Sturdy hiking or ski boots",
        "Sunglasses and sunscreen for high altitude sun",
        "Basic first aid kit"
      ]
    },
    rockies: {
      name: "Rocky Mountains",
      video: "ZvzZmI-1gb8",
      region: "northamerica",
      lat: 39.0,
      lng: -105.5,
      safety: [
        "Watch for sudden weather changes at high elevation",
        "Carry bear spray in wildlife areas",
        "Inform someone of your hiking route and return time",
        "Stay hydrated due to dry mountain air"
      ],
      essentials: [
        "Layered clothing for changing temperatures",
        "Sturdy hiking boots and backpack",
        "Bear spray and food storage container",
        "Map, compass or GPS device"
      ]
    },
    andes: {
      name: "Andes",
      video: "xe7KDrSpeDo",
      region: "southamerica",
      lat: -16.5,
      lng: -68.15,
      safety: [
        "Acclimatize slowly to avoid altitude sickness",
        "Travel with a local guide in remote regions",
        "Check weather and road advisories before travel",
        "Carry enough water, as sources can be limited"
      ],
      essentials: [
        "Warm clothing for cold nights at altitude",
        "Altitude sickness medication",
        "Reliable hiking boots",
        "Portable water filter"
      ]
    },
    atlas: {
      name: "Atlas Mountains",
      video: "vzJ4I-G7soE",
      region: "africa",
      lat: 31.06,
      lng: -7.92,
      safety: [
        "Carry enough water in dry, sun exposed areas",
        "Hire a local guide for mountain village routes",
        "Protect against strong sun and heat during the day",
        "Carry warm layers for cold mountain nights"
      ],
      essentials: [
        "Sun protection such as a hat, sunglasses and sunscreen",
        "Comfortable walking shoes",
        "Reusable water bottles",
        "Light warm layer for evenings"
      ]
    },
    hunza: {
      name: "Hunza Valley",
      video: "uo-RNmxWza8",
      region: "asia",
      lat: 36.32,
      lng: 74.65,
      safety: [
        "Roads can be affected by landslides, check conditions before travel",
        "Carry warm clothing even in summer due to altitude",
        "Respect local customs in this traditional community",
        "Keep emergency contacts and cash on hand as ATMs are limited"
      ],
      essentials: [
        "Warm layered clothing",
        "Comfortable walking shoes",
        "Cash, as card payments are limited",
        "Camera for scenic viewpoints"
      ]
    },
    skardu: {
      name: "Skardu and Deosai",
      video: "ZPJUgRjBLE8",
      region: "asia",
      lat: 35.30,
      lng: 75.63,
      safety: [
        "High altitude areas nearby require acclimatization",
        "Roads to Deosai can be rough, use experienced drivers",
        "Carry sufficient fuel and supplies for remote stretches",
        "Check weather before heading to higher plateaus"
      ],
      essentials: [
        "Warm clothing for cold nights",
        "Sturdy footwear for uneven terrain",
        "Extra fuel and water for jeep trips",
        "Basic first aid kit"
      ]
    },
    fairymeadows: {
      name: "Fairy Meadows",
      video: "u1fMX1C9jwk",
      region: "asia",
      lat: 35.38,
      lng: 74.58,
      safety: [
        "Jeep track to Fairy Meadows is steep and rough, use trusted drivers",
        "Weather changes quickly at this altitude",
        "Carry a flashlight as electricity is limited",
        "Book accommodation in advance during peak season"
      ],
      essentials: [
        "Warm sleeping bag or extra blankets",
        "Trekking shoes for the walk up",
        "Portable charger, as power is limited",
        "Rain jacket for sudden weather shifts"
      ]
    },
    swat: {
      name: "Swat Valley",
      video: "8dl4xo4yHUM",
      region: "asia",
      lat: 35.20,
      lng: 72.42,
      safety: [
        "Check road conditions before traveling to higher valleys",
        "Carry warm clothing for cooler evenings",
        "Stay updated on local travel advisories",
        "Keep valuables secure in crowded tourist areas"
      ],
      essentials: [
        "Comfortable walking shoes",
        "Light jacket for evenings",
        "Sunscreen and sunglasses",
        "Reusable water bottle"
      ]
    },
    naran: {
      name: "Naran Kaghan",
      video: "O0vp4sZsmis",
      region: "asia",
      lat: 34.91,
      lng: 73.65,
      safety: [
        "Babusar Pass can close due to snow, check before travel",
        "Boating on Saif ul Malook requires life jackets",
        "Carry warm clothes even in summer months",
        "Roads can be congested during peak tourist season"
      ],
      essentials: [
        "Warm jacket for high altitude evenings",
        "Sturdy hiking shoes",
        "Sunscreen for high altitude sun",
        "Basic motion sickness medication for mountain roads"
      ]
    },
    chitral: {
      name: "Chitral and Kalash",
      video: "nQN7I9Ufb-Q",
      region: "asia",
      lat: 35.85,
      lng: 71.79,
      safety: [
        "Remote region, carry extra supplies and fuel",
        "Respect the customs of the Kalash community",
        "Mobile network can be limited in valleys",
        "Check local travel advisories before visiting"
      ],
      essentials: [
        "Warm layered clothing",
        "Cash for local purchases",
        "Camera for cultural photography",
        "Basic first aid kit"
      ]
    },
    annapurna: {
      name: "Annapurna",
      video: "Q1BumhbfL9k",
      region: "asia",
      lat: 28.53,
      lng: 83.82,
      safety: [
        "Acclimatize gradually to avoid altitude sickness",
        "Hire a licensed guide or porter for longer treks",
        "Carry a first aid kit and altitude medication",
        "Check weather and trail conditions before departure"
      ],
      essentials: [
        "Trekking poles and sturdy hiking boots",
        "Warm layered clothing",
        "Water purification tablets",
        "Required trekking permits"
      ]
    },
    fuji: {
      name: "Mount Fuji",
      video: "YkSMAkNJ_F8",
      region: "asia",
      lat: 35.36,
      lng: 138.73,
      safety: [
        "Climb only during the official climbing season for safety",
        "Carry enough water as facilities are limited on the trail",
        "Watch for altitude related symptoms near the summit",
        "Check weather conditions before starting the ascent"
      ],
      essentials: [
        "Warm layered clothing, even in summer",
        "Sturdy hiking boots",
        "Headlamp for early morning summit hikes",
        "Trekking poles for the descent"
      ]
    },
    dolomites: {
      name: "Dolomites",
      video: "sGjcO4GozTg",
      region: "europe",
      lat: 46.54,
      lng: 12.14,
      safety: [
        "Check weather forecasts, conditions change quickly in the mountains",
        "Use marked via ferrata routes with proper safety gear",
        "Carry a map or GPS, some trails are remote",
        "Be cautious of loose rock on limestone terrain"
      ],
      essentials: [
        "Sturdy hiking boots",
        "Via ferrata safety kit if climbing",
        "Layered clothing for changing weather",
        "Trail map or offline GPS app"
      ]
    },
    pyrenees: {
      name: "Pyrenees",
      video: "LXL1cXKBqVM",
      region: "europe",
      lat: 42.77,
      lng: -0.14,
      safety: [
        "Weather can shift quickly at higher elevations",
        "Stay on marked trails, especially near border areas",
        "Carry enough water on longer hikes",
        "Check avalanche warnings during winter months"
      ],
      essentials: [
        "Waterproof jacket and hiking boots",
        "Warm layers for higher altitudes",
        "Reusable water bottle",
        "Trail map or navigation app"
      ]
    },
    sierranevada: {
      name: "Sierra Nevada",
      video: "5rnQFFA6Nfg",
      region: "northamerica",
      lat: 37.75,
      lng: -119.5,
      safety: [
        "Watch for sudden weather changes at high elevations",
        "Carry bear canisters for food storage in wilderness areas",
        "Check trail permits for popular areas like Yosemite",
        "Stay hydrated in dry mountain air"
      ],
      essentials: [
        "Sturdy hiking boots and backpack",
        "Bear canister for overnight trips",
        "Sun protection and plenty of water",
        "Layered clothing for temperature swings"
      ]
    },
    banff: {
      name: "Canadian Rockies",
      video: "qBF5k5P2qLM",
      region: "northamerica",
      lat: 51.18,
      lng: -115.57,
      safety: [
        "Carry bear spray and know wildlife safety practices",
        "Check trail conditions, some areas close seasonally",
        "Weather can change quickly, pack layers",
        "Stay on marked trails to protect fragile ecosystems"
      ],
      essentials: [
        "Bear spray and food storage container",
        "Layered clothing and rain jacket",
        "Sturdy hiking boots",
        "Map or GPS device for trail navigation"
      ]
    },
    patagonia: {
      name: "Patagonia",
      video: "1eN3XTqVZq8",
      region: "southamerica",
      lat: -49.33,
      lng: -72.88,
      safety: [
        "Strong winds are common, secure loose gear",
        "Weather can change rapidly, pack for all conditions",
        "Carry sufficient food and water for remote trails",
        "Check park regulations and trail permits in advance"
      ],
      essentials: [
        "Windproof and waterproof jacket",
        "Sturdy hiking boots",
        "Warm layered clothing",
        "Reusable water bottle and trail snacks"
      ]
    },
    aconcagua: {
      name: "Aconcagua",
      video: "dTrkx728dNg",
      region: "southamerica",
      lat: -32.65,
      lng: -70.01,
      safety: [
        "Altitude sickness is a serious risk, acclimatize properly",
        "Climb with an experienced guide or organized expedition",
        "Carry appropriate high altitude gear and medication",
        "Check weather windows before summit attempts"
      ],
      essentials: [
        "High altitude mountaineering gear",
        "Four season tent and sleeping bag",
        "High calorie food supplies",
        "Satellite communication device"
      ]
    }
  };

  const mapInfoModalEl = document.getElementById("mapInfoModal");
  const destinationsMapEl = document.getElementById("destinationsMap");

  let mapInfoModal = null;
  let mapModalTitle, mapModalDistance, mapSafetyList, mapEssentialsList, mapModalVideo;

  function toRad(value) {
    return (value * Math.PI) / 180;
  }

  function getDistanceKm(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  function fillMapList(listElement, items) {
    listElement.innerHTML = "";
    items.forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item;
      listElement.appendChild(li);
    });
  }

  if (mapInfoModalEl) {
    mapInfoModal = new bootstrap.Modal(mapInfoModalEl);
    mapModalTitle = document.getElementById("mapModalTitle");
    mapModalDistance = document.getElementById("mapModalDistance");
    mapSafetyList = document.getElementById("mapSafetyList");
    mapEssentialsList = document.getElementById("mapEssentialsList");
    mapModalVideo = document.getElementById("mapModalVideo");

    mapInfoModalEl.addEventListener("hidden.bs.modal", function () {
      if (mapModalVideo) {
        mapModalVideo.src = "";
      }
    });
  }

  window.openDestinationDetails = function (key) {
    const data = mapPointData[key];
    if (!data || !mapInfoModal) {
      return;
    }

    mapModalTitle.textContent = data.name;
    fillMapList(mapSafetyList, data.safety);
    fillMapList(mapEssentialsList, data.essentials);
    mapModalDistance.textContent = "Calculating distance from your location...";

    if (mapModalVideo) {
      mapModalVideo.src = data.video
        ? "https://www.youtube.com/embed/" + data.video
        : "";
    }

    mapInfoModal.show();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const distance = getDistanceKm(
            position.coords.latitude,
            position.coords.longitude,
            data.lat,
            data.lng
          );
          mapModalDistance.textContent = Math.round(distance).toLocaleString() + " km from your current location";
        },
        function () {
          mapModalDistance.textContent = "Enable location access in your browser to see the distance";
        }
      );
    } else {
      mapModalDistance.textContent = "Location services are not supported on this device";
    }
  };

  if (destinationsMapEl && typeof L !== "undefined") {
    const initialCenter = [25, 35];
    const initialZoom = 2;

    const leafletMap = L.map("destinationsMap", {
      scrollWheelZoom: false,
      worldCopyJump: true,
      zoomControl: false
    }).setView(initialCenter, initialZoom);

    L.control.zoom({ position: "topleft" }).addTo(leafletMap);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(leafletMap);

    const goldIcon = L.divIcon({
      className: "custom-marker-wrapper",
      html: '<div class="custom-gold-marker"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -10]
    });

    const markerClusterGroup = L.markerClusterGroup({
      iconCreateFunction: function (cluster) {
        return L.divIcon({
          html: "<div>" + cluster.getChildCount() + "</div>",
          className: "marker-cluster-alpine",
          iconSize: L.point(40, 40)
        });
      },
      maxClusterRadius: 50
    });

    const allMarkers = [];

    Object.keys(mapPointData).forEach(function (key) {
      const data = mapPointData[key];
      const marker = L.marker([data.lat, data.lng], { icon: goldIcon });

      marker.bindTooltip(data.name, {
        direction: "top",
        className: "alpine-tooltip",
        offset: [0, -6]
      });

      marker.bindPopup(
        '<span class="alpine-popup-title">' + data.name + '</span>' +
        '<button type="button" class="alpine-popup-btn" onclick="openDestinationDetails(\'' + key + '\')">View Details</button>'
      );

      allMarkers.push({ key: key, region: data.region, marker: marker });
      markerClusterGroup.addLayer(marker);
    });

    leafletMap.addLayer(markerClusterGroup);

    const ResetViewControl = L.Control.extend({
      options: { position: "topleft" },
      onAdd: function () {
        const container = L.DomUtil.create("div", "leaflet-bar alpine-reset-control");
        const button = L.DomUtil.create("a", "", container);
        button.href = "#";
        button.title = "Reset View";
        button.innerHTML = '<i class="bi bi-house-door-fill"></i>';

        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.on(button, "click", function (e) {
          L.DomEvent.preventDefault(e);
          leafletMap.setView(initialCenter, initialZoom);
        });

        return container;
      }
    });

    leafletMap.addControl(new ResetViewControl());

    const RegionFilterControl = L.Control.extend({
      options: { position: "topright" },
      onAdd: function () {
        const container = L.DomUtil.create("div", "alpine-region-filter");
        container.innerHTML =
          '<select id="regionFilterSelect" aria-label="Filter destinations by region">' +
          '<option value="all">All Destinations</option>' +
          '<option value="northamerica">North America</option>' +
          '<option value="southamerica">South America</option>' +
          '<option value="europe">Europe</option>' +
          '<option value="africa">Africa</option>' +
          '<option value="asia">Asia</option>' +
          "</select>";

        L.DomEvent.disableClickPropagation(container);
        return container;
      }
    });

    leafletMap.addControl(new RegionFilterControl());

    const regionFilterSelect = document.getElementById("regionFilterSelect");
    if (regionFilterSelect) {
      regionFilterSelect.addEventListener("change", function () {
        const selectedRegion = regionFilterSelect.value;

        markerClusterGroup.clearLayers();

        allMarkers.forEach(function (item) {
          if (selectedRegion === "all" || item.region === selectedRegion) {
            markerClusterGroup.addLayer(item.marker);
          }
        });
      });
    }

    setTimeout(function () {
      leafletMap.invalidateSize();
    }, 300);
  }

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
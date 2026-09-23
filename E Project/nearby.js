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
    window.scrollTo({ top: 0, behavior: "smooth" });
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


  /* ==========================================================
     EXPLORE NEARBY FEATURE
     Uses free, real data sources only:
     - OpenStreetMap + Leaflet for the map
     - Nominatim for location search (geocoding)
     - Overpass API for real nearby places (no API key required)
     ========================================================== */

  const categoryTagQueries = {
    resorts: ['["tourism"="resort"]'],
    hotels: ['["tourism"="hotel"]'],
    staycations: ['["tourism"="guest_house"]', '["tourism"="chalet"]', '["tourism"="apartment"]'],
    restaurants: ['["amenity"="restaurant"]'],
    cafes: ['["amenity"="cafe"]'],
    attractions: ['["tourism"="attraction"]', '["tourism"="viewpoint"]'],
    adventure: ['["tourism"="camp_site"]', '["sport"="climbing"]', '["leisure"="sports_centre"]'],
    petrolpumps: ['["amenity"="fuel"]']
  };

  const categoryIcons = {
    resorts: "bi-building",
    hotels: "bi-building-fill",
    staycations: "bi-house-heart",
    restaurants: "bi-cup-hot",
    cafes: "bi-cup-straw",
    attractions: "bi-camera",
    adventure: "bi-compass",
    petrolpumps: "bi-fuel-pump"
  };

  const categoryLabels = {
    resorts: "Resorts",
    hotels: "Hotels",
    staycations: "Staycations",
    restaurants: "Restaurants",
    cafes: "Caf\u00e9s",
    attractions: "Attractions",
    adventure: "Adventure Activities",
    petrolpumps: "Petrol Pumps"
  };

  let currentLocation = { lat: 35.30, lon: 75.63, label: "Skardu, Pakistan" };
  let currentCategory = "resorts";
  let currentRadius = 10000;
  let currentRequestToken = 0;

  let nearbyMap = null;
  let selectedLocationMarker = null;
  let placeMarkers = [];

  const locationSearchInput = document.getElementById("locationSearchInput");
  const locationSuggestions = document.getElementById("locationSuggestions");
  const useMyLocationBtn = document.getElementById("useMyLocationBtn");
  const currentLocationName = document.getElementById("currentLocationName");
  const categoryTabs = document.getElementById("categoryTabs");
  const radiusButtons = document.getElementById("radiusButtons");
  const resultsList = document.getElementById("resultsList");
  const resultsLoading = document.getElementById("resultsLoading");
  const resultsEmpty = document.getElementById("resultsEmpty");
  const resultsError = document.getElementById("resultsError");
  const resultsCount = document.getElementById("resultsCount");
  const resultsCategoryTitle = document.getElementById("resultsCategoryTitle");

  function initMap() {
    nearbyMap = L.map("nearbyMap", { scrollWheelZoom: false }).setView(
      [currentLocation.lat, currentLocation.lon],
      12
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(nearbyMap);

    placeSelectedLocationMarker();
  }

  function placeSelectedLocationMarker() {
    if (selectedLocationMarker) {
      nearbyMap.removeLayer(selectedLocationMarker);
    }

    const icon = L.divIcon({
      className: "",
      html: '<div class="custom-place-marker selected-location-marker"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    selectedLocationMarker = L.marker([currentLocation.lat, currentLocation.lon], { icon: icon })
      .addTo(nearbyMap)
      .bindPopup("<b>" + currentLocation.label + "</b><br>Your selected location");
  }

  function clearPlaceMarkers() {
    placeMarkers.forEach(function (m) {
      nearbyMap.removeLayer(m.marker);
    });
    placeMarkers = [];
  }

  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const resultsEmptyText = document.getElementById("resultsEmptyText");

  function setResultsState(state) {
    resultsLoading.classList.add("d-none");
    resultsEmpty.classList.add("d-none");
    resultsError.classList.add("d-none");
    resultsList.classList.remove("d-none");

    if (state === "loading") {
      resultsLoading.classList.remove("d-none");
      resultsList.classList.add("d-none");
    } else if (state === "empty") {
      const radiusKm = currentRadius / 1000;
      resultsEmptyText.textContent =
        "No " + categoryLabels[currentCategory].toLowerCase() + " found within " + radiusKm + " km.";
      resultsEmpty.classList.remove("d-none");
      resultsList.classList.add("d-none");
    } else if (state === "error") {
      resultsError.classList.remove("d-none");
      resultsList.classList.add("d-none");
    }
  }

  function buildOverpassQuery() {
    const tagFilters = categoryTagQueries[currentCategory] || categoryTagQueries.resorts;
    const around = "(around:" + currentRadius + "," + currentLocation.lat + "," + currentLocation.lon + ")";

    let statements = "";
    tagFilters.forEach(function (tag) {
      statements += "node" + around + tag + ";";
      statements += "way" + around + tag + ";";
    });

    return "[out:json][timeout:25];(" + statements + ");out center 40;";
  }

  function extractPlaceData(element) {
    const tags = element.tags || {};
    const lat = element.type === "node" ? element.lat : (element.center ? element.center.lat : null);
    const lon = element.type === "node" ? element.lon : (element.center ? element.center.lon : null);

    if (lat === null || lon === null) {
      return null;
    }

    const addressParts = [
      tags["addr:street"],
      tags["addr:city"] || tags["addr:town"] || tags["addr:village"]
    ].filter(Boolean);

    return {
      id: element.type + "/" + element.id,
      name: tags.name || categoryLabels[currentCategory].replace(/s$/, ""),
      lat: lat,
      lon: lon,
      address: addressParts.join(", "),
      phone: tags.phone || tags["contact:phone"] || null,
      openingHours: tags.opening_hours || null,
      stars: tags.stars || null,
      distanceKm: getDistanceKm(currentLocation.lat, currentLocation.lon, lat, lon)
    };
  }

  function renderResults(places) {
    resultsList.innerHTML = "";
    clearPlaceMarkers();

    resultsCount.textContent = places.length + (places.length === 1 ? " place" : " places");

    if (places.length === 0) {
      setResultsState("empty");
      return;
    }

    setResultsState("default");

    places.sort(function (a, b) {
      return a.distanceKm - b.distanceKm;
    });

    places.forEach(function (place) {
      const icon = L.divIcon({
        className: "",
        html: '<div class="custom-place-marker"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const marker = L.marker([place.lat, place.lon], { icon: icon }).addTo(nearbyMap);
      marker.bindPopup("<b>" + place.name + "</b><br>" + place.distanceKm.toFixed(1) + " km away");

      marker.on("click", function () {
        highlightCard(place.id);
      });

      placeMarkers.push({ id: place.id, marker: marker });

      const card = document.createElement("div");
      card.className = "place-card";
      card.setAttribute("data-place-id", place.id);

      const directionsUrl = "https://www.openstreetmap.org/directions?from=" +
        currentLocation.lat + "," + currentLocation.lon + "&to=" + place.lat + "," + place.lon;

      let metaHtml = '<span class="distance-badge"><i class="bi bi-signpost-2"></i> ' + place.distanceKm.toFixed(1) + " km</span>";
      if (place.stars) {
        metaHtml += '<span><i class="bi bi-star-fill"></i> ' + place.stars + " star</span>";
      }
      if (place.openingHours) {
        metaHtml += '<span><i class="bi bi-clock"></i> ' + place.openingHours + "</span>";
      }

      card.innerHTML =
        '<div class="place-card-icon"><i class="bi ' + categoryIcons[currentCategory] + '"></i></div>' +
        '<div class="place-card-body">' +
          "<h6>" + place.name + "</h6>" +
          '<div class="place-card-meta">' + metaHtml + "</div>" +
          (place.address ? '<p class="place-card-address"><i class="bi bi-geo-alt"></i> ' + place.address + "</p>" : "") +
          '<div class="place-card-actions">' +
            (place.phone ? '<a href="tel:' + place.phone + '"><i class="bi bi-telephone"></i> Call</a>' : "") +
            '<a href="' + directionsUrl + '" target="_blank" rel="noopener"><i class="bi bi-signpost"></i> Directions</a>' +
          "</div>" +
        "</div>";

      card.addEventListener("click", function () {
        nearbyMap.setView([place.lat, place.lon], 15);
        marker.openPopup();
        highlightCard(place.id);
      });

      resultsList.appendChild(card);
    });
  }

  function highlightCard(placeId) {
    document.querySelectorAll(".place-card").forEach(function (c) {
      c.classList.remove("active");
    });
    const card = document.querySelector('.place-card[data-place-id="' + placeId + '"]');
    if (card) {
      card.classList.add("active");
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function fetchNearbyPlaces() {
    const requestToken = ++currentRequestToken;
    setResultsState("loading");

    const query = buildOverpassQuery();

    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: "data=" + encodeURIComponent(query)
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Overpass request failed");
        }
        return response.json();
      })
      .then(function (data) {
        if (requestToken !== currentRequestToken) {
          return;
        }
        const places = (data.elements || [])
          .map(extractPlaceData)
          .filter(Boolean);
        renderResults(places);
      })
      .catch(function () {
        if (requestToken !== currentRequestToken) {
          return;
        }
        setResultsState("error");
      });
  }

  function updateLocationAndRefresh(lat, lon, label) {
    currentLocation = { lat: lat, lon: lon, label: label };
    currentLocationName.textContent = label;
    nearbyMap.setView([lat, lon], 12);
    placeSelectedLocationMarker();
    fetchNearbyPlaces();
  }

  let searchDebounceTimer = null;

  locationSearchInput.addEventListener("input", function () {
    const query = locationSearchInput.value.trim();

    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    if (query.length < 3) {
      locationSuggestions.classList.add("d-none");
      return;
    }

    searchDebounceTimer = setTimeout(function () {
      fetch(
        "https://nominatim.openstreetmap.org/search?format=json&q=" +
          encodeURIComponent(query) + "&limit=6"
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (results) {
          locationSuggestions.innerHTML = "";

          if (!results || results.length === 0) {
            locationSuggestions.classList.add("d-none");
            return;
          }

          results.forEach(function (result) {
            const item = document.createElement("div");
            item.className = "location-suggestion-item";
            item.textContent = result.display_name;
            item.addEventListener("click", function () {
              locationSearchInput.value = result.display_name;
              locationSuggestions.classList.add("d-none");
              updateLocationAndRefresh(parseFloat(result.lat), parseFloat(result.lon), result.display_name);
            });
            locationSuggestions.appendChild(item);
          });

          locationSuggestions.classList.remove("d-none");
        })
        .catch(function () {
          locationSuggestions.classList.add("d-none");
        });
    }, 500);
  });

  document.addEventListener("click", function (e) {
    if (!locationSuggestions.contains(e.target) && e.target !== locationSearchInput) {
      locationSuggestions.classList.add("d-none");
    }
  });

  useMyLocationBtn.addEventListener("click", function () {
    if (!navigator.geolocation) {
      alert("Location services are not supported on this browser.");
      return;
    }

    useMyLocationBtn.disabled = true;
    const originalHtml = useMyLocationBtn.innerHTML;
    useMyLocationBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Locating...';

    navigator.geolocation.getCurrentPosition(
      function (position) {
        useMyLocationBtn.disabled = false;
        useMyLocationBtn.innerHTML = originalHtml;
        updateLocationAndRefresh(position.coords.latitude, position.coords.longitude, "Your Current Location");
      },
      function () {
        useMyLocationBtn.disabled = false;
        useMyLocationBtn.innerHTML = originalHtml;
        alert("Location access was denied. Please search for a location instead.");
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  });

  categoryTabs.addEventListener("click", function (e) {
    const button = e.target.closest(".filter-btn");
    if (!button) {
      return;
    }

    categoryTabs.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    currentCategory = button.getAttribute("data-category");
    resultsCategoryTitle.textContent = "Nearby " + categoryLabels[currentCategory];
    fetchNearbyPlaces();
  });

  radiusButtons.addEventListener("click", function (e) {
    const button = e.target.closest(".radius-btn");
    if (!button) {
      return;
    }

    radiusButtons.querySelectorAll(".radius-btn").forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    currentRadius = parseInt(button.getAttribute("data-radius"), 10);
    fetchNearbyPlaces();
  });

  initMap();
  fetchNearbyPlaces();

  setTimeout(function () {
    if (nearbyMap) {
      nearbyMap.invalidateSize();
    }
  }, 300);

});
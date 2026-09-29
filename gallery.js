const galleryData = [
  { title: "The Alps", category: "europe", image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1200&auto=format&fit=crop" },
  { title: "Dolomites", category: "europe", image: "https://images.unsplash.com/photo-1694630515448-344264b30507?q=80&w=1200&auto=format&fit=crop" },
  { title: "Pyrenees", category: "europe", image: "https://images.unsplash.com/photo-1667743071531-9ff3ccf4fe38?q=80&w=1200&auto=format&fit=crop" },
  { title: "Himalayas", category: "asia", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop" },
  { title: "Annapurna", category: "asia", image: "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?q=80&w=1200&auto=format&fit=crop" },
  { title: "Mount Fuji", category: "asia", image: "https://images.unsplash.com/photo-1528884089-4582fe06c516?q=80&w=1200&auto=format&fit=crop" },
  { title: "Karakoram", category: "pakistan", image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=1200&auto=format&fit=crop" },
  { title: "Hunza Valley", category: "pakistan", image: "https://images.unsplash.com/photo-1514558427911-8e293bebf18c?q=80&w=1200&auto=format&fit=crop" },
  { title: "Skardu and Deosai", category: "pakistan", image: "https://images.unsplash.com/photo-1679951124125-50cc4029d727?q=80&w=1200&auto=format&fit=crop" },
  { title: "Fairy Meadows", category: "pakistan", image: "https://images.unsplash.com/photo-1664872759149-b7605ca5a3a7?q=80&w=1200&auto=format&fit=crop" },
  { title: "Swat Valley", category: "pakistan", image: "https://images.unsplash.com/photo-1624087267589-41ea77e28b1a?q=80&w=1200&auto=format&fit=crop" },
  { title: "Naran Kaghan", category: "pakistan", image: "https://images.unsplash.com/photo-1626685516371-a0ee93a0f370?q=80&w=1200&auto=format&fit=crop" },
  { title: "Chitral and Kalash", category: "pakistan", image: "https://images.unsplash.com/photo-1667922210719-566cbfec2b11?q=80&w=1200&auto=format&fit=crop" },
  { title: "Rocky Mountains", category: "northamerica", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop" },
  { title: "Sierra Nevada", category: "northamerica", image: "https://images.unsplash.com/photo-1576517606342-c4122f8de199?q=80&w=1200&auto=format&fit=crop" },
  { title: "Canadian Rockies", category: "northamerica", image: "https://images.unsplash.com/photo-1539667547529-84c607280d20?q=80&w=1200&auto=format&fit=crop" },
  { title: "Andes", category: "southamerica", image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1200&auto=format&fit=crop" },
  { title: "Patagonia", category: "southamerica", image: "https://images.unsplash.com/photo-1547483238-2cbf881a559f?q=80&w=1200&auto=format&fit=crop" },
  { title: "Aconcagua", category: "southamerica", image: "https://images.unsplash.com/photo-1662239090914-1da951eaeda4?q=80&w=1200&auto=format&fit=crop" },
  { title: "Atlas Mountains", category: "africa", image: "https://images.unsplash.com/photo-1597662786834-8eea85ad4841?q=80&w=1200&auto=format&fit=crop" }
];

const ITEMS_PER_PAGE = 9;
const AUTO_ROTATE_INTERVAL_MS = 4500;
let currentFilter = "all";
let viewingAll = false;
let rotationOffset = 0;
let autoRotateTimer = null;
let currentLightboxIndex = 0;
let visibleData = galleryData.slice();

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
  const galleryGrid = document.getElementById("galleryGrid");
  const galleryCount = document.getElementById("galleryCount");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const filterButtons = document.querySelectorAll(".filter-btn");

  const lightboxModalEl = document.getElementById("lightboxModal");
  const lightboxModal = new bootstrap.Modal(lightboxModalEl);
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCategory = document.getElementById("lightboxCategory");
  const lightboxPrevBtn = document.getElementById("lightboxPrev");
  const lightboxNextBtn = document.getElementById("lightboxNext");

  function getFilteredData() {
    if (currentFilter === "all") {
      return galleryData;
    }
    return galleryData.filter(function (item) {
      return item.category === currentFilter;
    });
  }

  function getPreviewItems() {
    const filtered = getFilteredData();
    if (filtered.length <= ITEMS_PER_PAGE) {
      return filtered;
    }
    const items = [];
    for (let i = 0; i < ITEMS_PER_PAGE; i++) {
      items.push(filtered[(rotationOffset + i) % filtered.length]);
    }
    return items;
  }

  function renderGallery() {
    const filtered = getFilteredData();
    visibleData = viewingAll ? filtered : getPreviewItems();
    const itemsToShow = visibleData;

    galleryGrid.innerHTML = "";

    itemsToShow.forEach(function (item, index) {
      const col = document.createElement("div");
      col.className = "gallery-item";
      col.setAttribute("data-category", item.category);

      col.innerHTML =
        '<div class="gallery-card" data-index="' + index + '">' +
          '<img src="' + item.image + '" alt="' + item.title + '">' +
          '<div class="gallery-view-icon"><i class="bi bi-zoom-in"></i></div>' +
          '<div class="gallery-overlay">' +
            '<h6>' + item.title + '</h6>' +
            '<span>' + formatCategory(item.category) + '</span>' +
          '</div>' +
        '</div>';

      galleryGrid.appendChild(col);
    });

    document.querySelectorAll(".gallery-card").forEach(function (card) {
      card.addEventListener("click", function () {
        const index = parseInt(card.getAttribute("data-index"), 10);
        loadLightboxImage(index);
        lightboxModal.show();
      });
    });

    if (viewingAll) {
      galleryCount.textContent = "Showing all " + itemsToShow.length + " photos";
      loadMoreBtn.style.display = "none";
    } else {
      galleryCount.textContent = "Showing " + itemsToShow.length + " of " + filtered.length + " photos";
      loadMoreBtn.style.display = filtered.length > ITEMS_PER_PAGE ? "inline-flex" : "none";
    }
  }

  function startAutoRotate() {
    stopAutoRotate();

    if (prefersReducedMotion) {
      return;
    }

    autoRotateTimer = setInterval(function () {
      if (viewingAll) {
        return;
      }
      const filtered = getFilteredData();
      if (filtered.length <= ITEMS_PER_PAGE) {
        return;
      }
      rotationOffset = (rotationOffset + ITEMS_PER_PAGE) % filtered.length;
      renderGallery();
    }, AUTO_ROTATE_INTERVAL_MS);
  }

  function stopAutoRotate() {
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  }

  function formatCategory(category) {
    const labels = {
      pakistan: "Pakistan",
      asia: "Asia",
      europe: "Europe",
      northamerica: "North America",
      southamerica: "South America",
      africa: "Africa"
    };
    return labels[category] || category;
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });
      button.classList.add("active");

      currentFilter = button.getAttribute("data-filter");
      viewingAll = false;
      rotationOffset = 0;
      renderGallery();
      startAutoRotate();
    });
  });

  loadMoreBtn.addEventListener("click", function () {
    viewingAll = true;
    stopAutoRotate();
    renderGallery();
  });

  function loadLightboxImage(index) {
    const data = visibleData[index];
    lightboxImage.src = data.image;
    lightboxImage.alt = data.title;
    lightboxTitle.textContent = data.title;
    lightboxCategory.textContent = formatCategory(data.category);
    currentLightboxIndex = index;
  }

  lightboxPrevBtn.addEventListener("click", function () {
    const newIndex = (currentLightboxIndex - 1 + visibleData.length) % visibleData.length;
    loadLightboxImage(newIndex);
  });

  lightboxNextBtn.addEventListener("click", function () {
    const newIndex = (currentLightboxIndex + 1) % visibleData.length;
    loadLightboxImage(newIndex);
  });

  renderGallery();
  startAutoRotate();

  galleryGrid.addEventListener("mouseenter", function () {
    stopAutoRotate();
  });

  galleryGrid.addEventListener("mouseleave", function () {
    if (!viewingAll) {
      startAutoRotate();
    }
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


  const shareForm = document.getElementById("shareForm");
  const shareName = document.getElementById("shareName");
  const shareEmail = document.getElementById("shareEmail");
  const shareMessage = document.getElementById("shareMessage");
  const shareFormMsg = document.getElementById("shareFormMsg");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  shareForm.addEventListener("submit", function (e) {
    e.preventDefault();

    shareFormMsg.textContent = "";
    shareFormMsg.classList.remove("text-success-msg", "text-error-msg");

    if (shareName.value.trim() === "") {
      shareFormMsg.textContent = "Please enter your name.";
      shareFormMsg.classList.add("text-error-msg");
      return;
    }

    if (shareEmail.value.trim() === "") {
      shareFormMsg.textContent = "Please enter your email.";
      shareFormMsg.classList.add("text-error-msg");
      return;
    }

    if (!emailPattern.test(shareEmail.value.trim())) {
      shareFormMsg.textContent = "Please enter a valid email address.";
      shareFormMsg.classList.add("text-error-msg");
      return;
    }

    if (shareMessage.value.trim() === "") {
      shareFormMsg.textContent = "Please share a short message.";
      shareFormMsg.classList.add("text-error-msg");
      return;
    }

    shareFormMsg.textContent = "Thank you for sharing your story with us.";
    shareFormMsg.classList.add("text-success-msg");
    shareForm.reset();
  });


  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterMsg = document.getElementById("newsletterMsg");

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
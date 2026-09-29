/* Alpine Astine - Site-wide Ambient Sound Widget
   Adds a floating speaker button to toggle a soft looping ambient
   sound track (via the YouTube IFrame API) on every page. The
   on/off preference is remembered across pages using localStorage. */

(function () {
  const VIDEO_ID = "SMKPKGW083c";
  const STORAGE_KEY = "alpineAstineSoundOn";

  let player = null;
  let apiReady = false;
  let pendingPlayIntent = null;

  function isSoundOn() {
    return localStorage.getItem(STORAGE_KEY) === "true";
  }

  function setSoundOn(value) {
    localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      #soundToggleBtn {
        position: fixed;
        left: 20px;
        bottom: 24px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background-color: var(--navy, #0b1d33);
        color: var(--gold-light, #f0c674);
        font-size: 1.15rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1040;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
        transition: background-color 0.3s ease, transform 0.3s ease;
      }
      #soundToggleBtn:hover {
        background-color: #102843;
        transform: translateY(-2px);
      }
      #soundToggleBtn .sound-bar {
        display: inline-block;
        width: 3px;
        height: 10px;
        margin: 0 1px;
        background-color: var(--gold, #d9a441);
        border-radius: 2px;
        animation: soundBarPulse 0.9s ease-in-out infinite;
      }
      #soundToggleBtn.is-muted .sound-bar {
        animation: none;
        height: 4px;
        opacity: 0.6;
      }
      #soundToggleBtn .sound-bar:nth-child(2) { animation-delay: 0.15s; }
      #soundToggleBtn .sound-bar:nth-child(3) { animation-delay: 0.3s; }
      @keyframes soundBarPulse {
        0%, 100% { height: 6px; }
        50% { height: 16px; }
      }
      @media (max-width: 575.98px) {
        #soundToggleBtn {
          left: 14px;
          bottom: 84px;
          width: 44px;
          height: 44px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createButton() {
    const btn = document.createElement("button");
    btn.id = "soundToggleBtn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Toggle background sound");
    btn.setAttribute("aria-pressed", isSoundOn() ? "true" : "false");
    btn.innerHTML =
      '<span class="sound-bar"></span><span class="sound-bar"></span><span class="sound-bar"></span>';
    if (!isSoundOn()) {
      btn.classList.add("is-muted");
    }
    document.body.appendChild(btn);

    btn.addEventListener("click", function () {
      const nextState = !isSoundOn();
      setSoundOn(nextState);
      btn.classList.toggle("is-muted", !nextState);
      btn.setAttribute("aria-pressed", nextState ? "true" : "false");
      applyPlayerState(nextState);
    });

    return btn;
  }

  function createPlayerContainer() {
    const wrap = document.createElement("div");
    wrap.id = "ambientSoundPlayer";
    wrap.style.position = "fixed";
    wrap.style.width = "1px";
    wrap.style.height = "1px";
    wrap.style.overflow = "hidden";
    wrap.style.opacity = "0";
    wrap.style.pointerEvents = "none";
    wrap.setAttribute("aria-hidden", "true");
    document.body.appendChild(wrap);
    return wrap;
  }

  function applyPlayerState(shouldPlay) {
    if (!apiReady || !player) {
      pendingPlayIntent = shouldPlay;
      return;
    }
    try {
      if (shouldPlay) {
        player.unMute();
        player.setVolume(35);
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    } catch (e) {
      /* player not ready yet; ignore */
    }
  }

  function onYouTubeIframeAPIReady() {
    player = new YT.Player("ambientSoundPlayer", {
      videoId: VIDEO_ID,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        loop: 1,
        playlist: VIDEO_ID,
        modestbranding: 1,
        rel: 0,
        playsinline: 1
      },
      events: {
        onReady: function () {
          apiReady = true;
          player.setVolume(35);
          const intent = pendingPlayIntent !== null ? pendingPlayIntent : isSoundOn();
          applyPlayerState(intent);
        }
      }
    });
  }

  function loadYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
      return;
    }
    const existingCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof existingCallback === "function") {
        existingCallback();
      }
      onYouTubeIframeAPIReady();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }

  function init() {
    injectStyles();
    createButton();
    createPlayerContainer();
    loadYouTubeAPI();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
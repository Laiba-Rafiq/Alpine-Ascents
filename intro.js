/* ==========================================================================
   Alpine Astine - 3D Mountain Entrance Screen
   Built with Three.js. Procedural terrain using ridged-multifractal
   simplex noise (the same class of technique real terrain generators use)
   so the mountain has genuine ridges, valleys and multiple peaks instead
   of a single smooth bump. No external heightmap/model files required.

   ADJUSTABLE SETTINGS
   ========================================================================== */
const SETTINGS = {
  START_DISTANCE: 85,
  ZOOM_THRESHOLD: 9,
  MAX_DISTANCE: 115,
  ZOOM_DAMPING: 0.08,
  WHEEL_ZOOM_SPEED: 0.05,
  PINCH_ZOOM_SPEED: 0.065,
  ROTATE_SPEED: 0.0035,
  AUTO_ROTATE_SPEED: 0.0006,
  TRANSITION_DELAY_MS: 900,
  REDIRECT_URL: "index.html",
  TERRAIN_SIZE: 90,
  TERRAIN_SEGMENTS: 220,  // higher = more detailed ridges, heavier on GPU

  // Real elevation data (AWS Open Data "Terrain Tiles", Terrarium PNG format).
  // Free, public, no API key. https://registry.opendata.aws/terrain-tiles/
  DEM_LAT: 27.9881,       // Mount Everest summit
  DEM_LON: 86.9250,
  DEM_ZOOM: 12,
  HEIGHT_EXAGGERATION: 1.3
};

(function () {
  "use strict";

  const canvas = document.getElementById("mountainCanvas");
  const transitionOverlay = document.getElementById("transitionOverlay");
  const zoomProgressFill = document.getElementById("zoomProgressFill");
  const zoomPromptText = document.getElementById("zoomPromptText");

  const isCoarsePointer =
    window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;

  if (isCoarsePointer && zoomPromptText) {
    zoomPromptText.textContent = "Pinch To Enter";
  }

  /* ------------------------------------------------------------------
     Compact 2D Simplex Noise (public-domain algorithm, Perlin/Gustavson
     permutation scheme). This produces natural, non-repeating terrain
     detail, unlike simple sine-wave combinations.
  ------------------------------------------------------------------ */
  const SimplexNoise = (function () {
    const grad3 = [
      [1, 1], [-1, 1], [1, -1], [-1, -1],
      [1, 0], [-1, 0], [1, 0], [-1, 0],
      [0, 1], [0, -1], [0, 1], [0, -1]
    ];

    let seed = 1337;
    function seededRandom() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    }

    const p = [];
    for (let i = 0; i < 256; i++) {
      p[i] = Math.floor(seededRandom() * 256);
    }
    const perm = new Array(512);
    const permMod12 = new Array(512);
    for (let i = 0; i < 512; i++) {
      perm[i] = p[i & 255];
      permMod12[i] = perm[i] % 12;
    }

    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;

    function dot(g, x, y) {
      return g[0] * x + g[1] * y;
    }

    return {
      noise2D: function (xin, yin) {
        let n0, n1, n2;
        const s = (xin + yin) * F2;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = xin - X0;
        const y0 = yin - Y0;

        let i1, j1;
        if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }

        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1 + 2 * G2;
        const y2 = y0 - 1 + 2 * G2;

        const ii = i & 255;
        const jj = j & 255;

        const gi0 = permMod12[ii + perm[jj]];
        const gi1 = permMod12[ii + i1 + perm[jj + j1]];
        const gi2 = permMod12[ii + 1 + perm[jj + 1]];

        let t0 = 0.5 - x0 * x0 - y0 * y0;
        n0 = t0 < 0 ? 0 : (t0 *= t0, t0 * t0 * dot(grad3[gi0], x0, y0));

        let t1 = 0.5 - x1 * x1 - y1 * y1;
        n1 = t1 < 0 ? 0 : (t1 *= t1, t1 * t1 * dot(grad3[gi1], x1, y1));

        let t2 = 0.5 - x2 * x2 - y2 * y2;
        n2 = t2 < 0 ? 0 : (t2 *= t2, t2 * t2 * dot(grad3[gi2], x2, y2));

        return 70 * (n0 + n1 + n2);
      }
    };
  })();

  function ridgedFbm(x, y, octaves, lacunarity, gain) {
    let sum = 0;
    let amplitude = 0.5;
    let frequency = 1;
    let prev = 1;

    for (let i = 0; i < octaves; i++) {
      let n = SimplexNoise.noise2D(x * frequency, y * frequency);
      n = 1 - Math.abs(n);
      n = n * n;
      sum += n * amplitude * prev;
      prev = n;
      frequency *= lacunarity;
      amplitude *= gain;
    }
    return sum;
  }

  function fbm(x, y, octaves, lacunarity, gain) {
    let sum = 0;
    let amplitude = 0.5;
    let frequency = 1;

    for (let i = 0; i < octaves; i++) {
      sum += SimplexNoise.noise2D(x * frequency, y * frequency) * amplitude;
      frequency *= lacunarity;
      amplitude *= gain;
    }
    return sum;
  }

  /* ------------------------------------------------------------------
     Real elevation data loader.
     Fetches free, public AWS "Terrain Tiles" (Terrarium PNG format,
     no API key required) covering the Everest massif, decodes the
     RGB-encoded elevation, and returns a sampleable heightmap.
     If this fails for any reason (offline, blocked, etc.), the caller
     falls back to the procedural ridged-noise terrain further below.
  ------------------------------------------------------------------ */
  function lonLatToTile(lon, lat, zoom) {
    const n = Math.pow(2, zoom);
    const x = Math.floor(((lon + 180) / 360) * n);
    const latRad = (lat * Math.PI) / 180;
    const y = Math.floor(
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
    );
    return { x: x, y: y };
  }

  function loadTileImage(z, x, y) {
    return new Promise(function (resolve, reject) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        resolve(img);
      };
      img.onerror = function () {
        reject(new Error("Failed to load elevation tile " + z + "/" + x + "/" + y));
      };
      img.src =
        "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/" +
        z + "/" + x + "/" + y + ".png";
    });
  }

  function loadRealElevationData() {
    const base = lonLatToTile(SETTINGS.DEM_LON, SETTINGS.DEM_LAT, SETTINGS.DEM_ZOOM);
    const offsets = [
      { dx: 0, dy: 0 }, { dx: 1, dy: 0 },
      { dx: 0, dy: 1 }, { dx: 1, dy: 1 }
    ];

    const tilePromises = offsets.map(function (offset) {
      return loadTileImage(SETTINGS.DEM_ZOOM, base.x + offset.dx, base.y + offset.dy)
        .then(function (img) {
          return { img: img, dx: offset.dx, dy: offset.dy };
        });
    });

    return Promise.all(tilePromises).then(function (tiles) {
      const gridSize = 512;
      const offCanvas = document.createElement("canvas");
      offCanvas.width = gridSize;
      offCanvas.height = gridSize;
      const ctx = offCanvas.getContext("2d");

      tiles.forEach(function (tile) {
        ctx.drawImage(tile.img, tile.dx * 256, tile.dy * 256, 256, 256);
      });

      const pixels = ctx.getImageData(0, 0, gridSize, gridSize).data;
      const heights = new Float32Array(gridSize * gridSize);

      for (let i = 0; i < gridSize * gridSize; i++) {
        const r = pixels[i * 4];
        const g = pixels[i * 4 + 1];
        const b = pixels[i * 4 + 2];
        // Terrarium decode formula (meters above sea level)
        heights[i] = r * 256 + g + b / 256 - 32768;
      }

      return { heights: heights, gridSize: gridSize };
    });
  }

  function sampleHeightmapBilinear(demData, u, v) {
    const gridSize = demData.gridSize;
    const px = Math.min(Math.max(u, 0), 1) * (gridSize - 1);
    const py = Math.min(Math.max(v, 0), 1) * (gridSize - 1);

    const x0 = Math.floor(px);
    const y0 = Math.floor(py);
    const x1 = Math.min(x0 + 1, gridSize - 1);
    const y1 = Math.min(y0 + 1, gridSize - 1);
    const fx = px - x0;
    const fy = py - y0;

    const h00 = demData.heights[y0 * gridSize + x0];
    const h10 = demData.heights[y0 * gridSize + x1];
    const h01 = demData.heights[y1 * gridSize + x0];
    const h11 = demData.heights[y1 * gridSize + x1];

    const top = h00 * (1 - fx) + h10 * fx;
    const bottom = h01 * (1 - fx) + h11 * fx;
    return top * (1 - fy) + bottom * fy;
  }

  let scene, camera, renderer;
  let mountainGroup;
  let width = window.innerWidth;
  let height = window.innerHeight;

  let azimuth = Math.PI * 0.14;
  let polar = 1.18;
  const minPolar = 0.55;
  const maxPolar = 1.5;

  let currentDistance = SETTINGS.START_DISTANCE;
  let targetDistance = SETTINGS.START_DISTANCE;

  let isDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let userIsInteracting = false;
  let transitionStarted = false;

  let lastPinchDistance = null;

  function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1d33);
    scene.fog = new THREE.Fog(0x0b1d33, 35, 130);

    camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 500);
    updateCameraPosition();

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    addLights();
    addStars();

    loadRealElevationData()
      .then(function (demData) {
        mountainGroup = buildMountain(demData);
        scene.add(mountainGroup);
      })
      .catch(function (err) {
        console.warn("Real elevation data unavailable, using procedural terrain:", err.message);
        mountainGroup = buildMountain(null);
        scene.add(mountainGroup);
      });

    bindInteractionEvents();
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("pageshow", onPageShow);
  }

  function addLights() {
    const ambient = new THREE.AmbientLight(0x2a3a52, 0.55);
    scene.add(ambient);

    // Low, raking key light - this is what makes ridges and valleys
    // read clearly as light/shadow, the way real mountain photography does.
    const keyLight = new THREE.DirectionalLight(0xfaf6ee, 1.5);
    keyLight.position.set(-45, 22, 30);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -60;
    keyLight.shadow.camera.right = 60;
    keyLight.shadow.camera.top = 60;
    keyLight.shadow.camera.bottom = -60;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 150;
    keyLight.shadow.bias = -0.0015;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x6f88b3, 0.45);
    rimLight.position.set(40, 18, -35);
    scene.add(rimLight);

    const fillLight = new THREE.HemisphereLight(0x8ea3c4, 0x0b1d33, 0.4);
    scene.add(fillLight);
  }

  function addStars() {
    const starCount = 700;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 160 + Math.random() * 160;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(radius * Math.cos(phi)) * 0.6 + 15;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const starMaterial = new THREE.PointsMaterial({
      color: 0xf0c674,
      size: 0.6,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.65
    });

    scene.add(new THREE.Points(starGeometry, starMaterial));
  }

  /* ---------------------------------------------------------
     Realistic terrain: several peak "seed" formations combined
     with ridged-multifractal noise, so the result reads as an
     actual mountain range with ridgelines and valleys rather
     than a single dome.
  --------------------------------------------------------- */
  const peakSeeds = [
    { x: 6, z: -4, height: 22, radius: 15 },
    { x: -14, z: 6, height: 15, radius: 13 },
    { x: 16, z: 12, height: 12, radius: 12 },
    { x: -6, z: -18, height: 10, radius: 11 },
    { x: 22, z: -14, height: 9, radius: 10 }
  ];

  function peakEnvelope(x, z) {
    let value = 0;
    for (let i = 0; i < peakSeeds.length; i++) {
      const seedPt = peakSeeds[i];
      const dx = x - seedPt.x;
      const dz = z - seedPt.z;
      const distSq = dx * dx + dz * dz;
      value += seedPt.height * Math.exp(-distSq / (seedPt.radius * seedPt.radius));
    }
    return value;
  }

  function buildMountain(demData) {
    const group = new THREE.Group();

    const size = SETTINGS.TERRAIN_SIZE;
    const segments = SETTINGS.TERRAIN_SEGMENTS;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    const positionAttr = geometry.attributes.position;
    const colors = [];

    // Desaturated, neutral natural-rock palette (not vividly painted
    // brown/white). Real mountain rock and snow read fairly muted from
    // a distance, especially in overcast/dawn-style lighting.
    const baseRock = new THREE.Color(0x332f2a);
    const midRock = new THREE.Color(0x5c554a);
    const upperRock = new THREE.Color(0x827c70);
    const snowShadow = new THREE.Color(0xa9b2ba);
    const snowBright = new THREE.Color(0xeeece4);

    function smoothstep(edge0, edge1, xVal) {
      const t = Math.max(0, Math.min(1, (xVal - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    }

    const rawHeights = new Float32Array(positionAttr.count);
    let minRaw = Infinity;
    let maxRaw = -Infinity;

    for (let i = 0; i < positionAttr.count; i++) {
      const x = positionAttr.getX(i);
      const z = positionAttr.getZ(i);
      let rawElevation;

      if (demData) {
        const u = (x + size / 2) / size;
        const v = (z + size / 2) / size;
        rawElevation = sampleHeightmapBilinear(demData, u, v);
        // A touch of fine procedural detail smooths over the DEM's
        // pixel grid so close-up terrain doesn't look blocky.
        rawElevation += fbm(x * 0.35, z * 0.35, 2, 2.2, 0.5) * 25;
      } else {
        const envelope = peakEnvelope(x, z);
        const ridgeDetail = ridgedFbm(x * 0.045, z * 0.045, 6, 2.05, 0.52) * 9;
        const fineDetail = fbm(x * 0.16, z * 0.16, 3, 2.2, 0.5) * 1.2;
        const ridgeInfluence = Math.min(1, envelope / 6);
        rawElevation = envelope + ridgeDetail * (0.35 + ridgeInfluence * 0.9) + fineDetail;
      }

      rawHeights[i] = rawElevation;
      if (rawElevation < minRaw) minRaw = rawElevation;
      if (rawElevation > maxRaw) maxRaw = rawElevation;
    }

    const range = Math.max(1, maxRaw - minRaw);
    const targetPeakHeight = demData ? 26 * SETTINGS.HEIGHT_EXAGGERATION : 1;
    const verticalScale = demData ? targetPeakHeight / range : 1;

    for (let i = 0; i < positionAttr.count; i++) {
      let elevation;

      if (demData) {
        elevation = (rawHeights[i] - minRaw) * verticalScale;
      } else {
        elevation = rawHeights[i];
        if (elevation < 0.3) {
          elevation *= 0.25;
        }
      }

      positionAttr.setY(i, elevation);
    }

    // Normals must be computed before we read slope, since snow only
    // realistically settles on gentler slopes - steep faces stay bare rock.
    geometry.computeVertexNormals();
    const normalAttr = geometry.attributes.normal;

    for (let i = 0; i < positionAttr.count; i++) {
      const x = positionAttr.getX(i);
      const z = positionAttr.getZ(i);
      const elevation = positionAttr.getY(i);

      const normMax = demData ? targetPeakHeight : Math.max(1, maxRaw);
      const normalizedHeight = Math.max(0, Math.min(1, elevation / normMax));

      const steepness = 1 - Math.max(0, Math.min(1, normalAttr.getY(i)));
      const snowCanCling = 1 - Math.min(1, Math.max(0, steepness - 0.55) * 1.6);

      // Large slow-moving patches, like the scree fields and snow
      // patches visible in real satellite photos, rather than a
      // uniform gradient or high-frequency static.
      const patch = fbm(x * 0.05, z * 0.05, 3, 2.0, 0.55);
      const grain = fbm(x * 0.7, z * 0.7, 2, 2.2, 0.5) * 0.5;
      const heightJitter = (patch * 0.06 + grain * 0.03);

      const sampleHeight = Math.max(0, Math.min(1, normalizedHeight + heightJitter));

      const rockMix = smoothstep(0.06, 0.32, sampleHeight);
      const upperMix = smoothstep(0.28, 0.52, sampleHeight);
      const snowMix = smoothstep(0.46, 0.66, sampleHeight) * (0.3 + snowCanCling * 0.7);

      const snowTone = snowShadow.clone().lerp(
        snowBright,
        smoothstep(0.5, 0.85, sampleHeight)
      );

      const vertexColor = baseRock.clone();
      vertexColor.lerp(midRock, rockMix);
      vertexColor.lerp(upperRock, upperMix);
      vertexColor.lerp(snowTone, snowMix);

      // Only genuinely near-vertical faces read as bare, slightly
      // darker rock (snow and even sediment cannot cling there).
      vertexColor.multiplyScalar(0.9 + snowCanCling * 0.1);

      // A whisper of fine grain keeps the surface from looking like a
      // flat colour ramp, without reading as noisy static.
      const fineGrain = (grain - 0.25) * 0.035;
      vertexColor.r = Math.min(1, Math.max(0, vertexColor.r + fineGrain));
      vertexColor.g = Math.min(1, Math.max(0, vertexColor.g + fineGrain));
      vertexColor.b = Math.min(1, Math.max(0, vertexColor.b + fineGrain));

      colors.push(vertexColor.r, vertexColor.g, vertexColor.b);
    }

    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.88,
      metalness: 0.02
    });

    const terrain = new THREE.Mesh(geometry, material);
    terrain.receiveShadow = true;
    terrain.castShadow = true;
    group.add(terrain);

    return group;
  }

  /* ---------------------------------------------------------
     Camera orbit + zoom-to-enter logic
  --------------------------------------------------------- */
  function updateCameraPosition() {
    const target = new THREE.Vector3(0, 14, 0);

    camera.position.x = target.x + currentDistance * Math.sin(polar) * Math.sin(azimuth);
    camera.position.y = target.y + currentDistance * Math.cos(polar);
    camera.position.z = target.z + currentDistance * Math.sin(polar) * Math.cos(azimuth);

    camera.lookAt(target);
  }

  function setTargetDistance(newDistance) {
    targetDistance = Math.min(
      SETTINGS.MAX_DISTANCE,
      Math.max(SETTINGS.ZOOM_THRESHOLD * 0.55, newDistance)
    );
  }

  function updateZoomProgressUI() {
    const total = SETTINGS.START_DISTANCE - SETTINGS.ZOOM_THRESHOLD;
    const progressed = SETTINGS.START_DISTANCE - currentDistance;
    const percent = Math.max(0, Math.min(100, (progressed / total) * 100));
    if (zoomProgressFill) {
      zoomProgressFill.style.width = percent + "%";
    }
  }

  function checkZoomThreshold() {
    if (transitionStarted) {
      return;
    }
    if (currentDistance <= SETTINGS.ZOOM_THRESHOLD) {
      triggerHomeTransition();
    }
  }

  function triggerHomeTransition() {
    transitionStarted = true;
    if (transitionOverlay) {
      transitionOverlay.classList.add("active");
    }
    window.setTimeout(function () {
      window.location.href = SETTINGS.REDIRECT_URL;
    }, SETTINGS.TRANSITION_DELAY_MS);
  }

  /* ---------------------------------------------------------
     Input handling: drag to rotate, wheel + pinch to zoom
  --------------------------------------------------------- */
  function bindInteractionEvents() {
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });

    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });
  }

  function onPointerDown(e) {
    isDragging = true;
    userIsInteracting = true;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
  }

  function onPointerMove(e) {
    if (!isDragging || transitionStarted) {
      return;
    }
    const deltaX = e.clientX - lastPointerX;
    const deltaY = e.clientY - lastPointerY;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;

    azimuth -= deltaX * SETTINGS.ROTATE_SPEED;
    polar = Math.min(maxPolar, Math.max(minPolar, polar - deltaY * SETTINGS.ROTATE_SPEED));
  }

  function onPointerUp() {
    isDragging = false;
  }

  function onWheel(e) {
    e.preventDefault();
    e.stopPropagation();

    if (transitionStarted) {
      return;
    }
    userIsInteracting = true;

    const direction = e.deltaY > 0 ? 1 : -1;
    setTargetDistance(targetDistance + direction * SETTINGS.WHEEL_ZOOM_SPEED * 40);
  }

  function onTouchStart(e) {
    userIsInteracting = true;
    if (e.touches.length === 1) {
      isDragging = true;
      lastPointerX = e.touches[0].clientX;
      lastPointerY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      isDragging = false;
      lastPinchDistance = getPinchDistance(e.touches);
    }
  }

  function onTouchMove(e) {
    if (transitionStarted) {
      return;
    }
    e.preventDefault();

    if (e.touches.length === 1 && isDragging) {
      const deltaX = e.touches[0].clientX - lastPointerX;
      const deltaY = e.touches[0].clientY - lastPointerY;
      lastPointerX = e.touches[0].clientX;
      lastPointerY = e.touches[0].clientY;

      azimuth -= deltaX * SETTINGS.ROTATE_SPEED;
      polar = Math.min(maxPolar, Math.max(minPolar, polar - deltaY * SETTINGS.ROTATE_SPEED));
    } else if (e.touches.length === 2) {
      const newDistance = getPinchDistance(e.touches);
      if (lastPinchDistance !== null) {
        const pinchDelta = newDistance - lastPinchDistance;
        setTargetDistance(targetDistance - pinchDelta * SETTINGS.PINCH_ZOOM_SPEED);
      }
      lastPinchDistance = newDistance;
    }
  }

  function onTouchEnd(e) {
    if (e.touches.length === 0) {
      isDragging = false;
      lastPinchDistance = null;
    }
  }

  function getPinchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function onPageShow(event) {
    if (event.persisted) {
      // The page was restored from the browser's back-forward cache.
      // WebGL contexts can be lost/corrupted when this happens, so the
      // safest fix is to force a genuine fresh reload rather than try
      // to reuse a potentially broken 3D context.
      window.location.reload();
    }
  }

  /* ---------------------------------------------------------
     Render loop
  --------------------------------------------------------- */
  function animate() {
    requestAnimationFrame(animate);

    if (!isDragging && !transitionStarted) {
      azimuth += SETTINGS.AUTO_ROTATE_SPEED;
    }

    currentDistance += (targetDistance - currentDistance) * SETTINGS.ZOOM_DAMPING;

    updateCameraPosition();
    updateZoomProgressUI();
    checkZoomThreshold();

    renderer.render(scene, camera);
  }

  init();
  animate();
})();
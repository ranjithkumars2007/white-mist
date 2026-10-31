/**
 * WHITE MIST - SIGNATURE 3D CLEANING EXPERIENCE ("SEE WHITE MIST IN ACTION")
 * Powered by Three.js WebGL & GSAP ScrollTrigger
 * 
 * Features:
 * 1. Clean Aqua Water Environment with Procedural Caustics
 * 2. Center 3D Floating Fabric (Dirty -> Drop Hit -> Bio-Action -> Spotless Bright)
 * 3. Viscous White Mist Detergent Droplet (Forms -> Stretches -> Falls -> Impact & Splashes)
 * 4. Concentric Liquid Ripple Waves
 * 5. Realistic 3D Instanced Bubbles (GPU Instancing: Front, Back & Fabric-Originating)
 * 6. Detaching & Dissolving Dirt Particles
 * 7. GSAP ScrollTrigger Scroll-Driven Cinematic Sequence + Manual Interactive Controls
 * 8. Adaptive Performance (Mobile Optimization, Offscreen Pause via IntersectionObserver)
 */

(function () {
  'use strict';

  function initSignatureCleaning() {
    const canvas = document.getElementById('signatureCleaningCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const frame = canvas.parentElement;
    const section = document.getElementById('cleaning-experience');
    let width = frame ? frame.clientWidth : window.innerWidth;
    let height = frame ? frame.clientHeight : 600;

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // -------------------------------------------------------------------------
    // 1. THREE.JS SCENE, CAMERA & RENDERER
    // -------------------------------------------------------------------------
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xe0f7fa, 0.03);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.6);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    // -------------------------------------------------------------------------
    // 2. FRESH WATER AQUA LIGHTING
    // -------------------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xe0f7fa, 2.0);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xffffff, 2.4);
    mainSun.position.set(3, 8, 6);
    scene.add(mainSun);

    const aquaFill = new THREE.PointLight(0x00b4d8, 2.8, 20);
    aquaFill.position.set(-3.5, -1, 3.5);
    scene.add(aquaFill);

    const freshGreenGlint = new THREE.PointLight(0x00e676, 1.8, 16);
    freshGreenGlint.position.set(3.5, 2, 3);
    scene.add(freshGreenGlint);

    // -------------------------------------------------------------------------
    // 3. PROCEDURAL WATER CAUSTICS BACKGROUND
    // -------------------------------------------------------------------------
    const causticGeo = new THREE.PlaneGeometry(24, 18);
    const causticMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;

        vec2 hash2(vec2 p) {
          return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
        }

        float voronoi(vec2 p) {
          vec2 g = floor(p);
          vec2 f = fract(p);
          float res = 1.0;
          for (int y = -1; y <= 1; y++) {
            for (int x = -1; x <= 1; x++) {
              vec2 lattice = vec2(float(x), float(y));
              vec2 offset = hash2(g + lattice);
              offset = 0.5 + 0.4 * sin(uTime * 0.7 + 6.2831 * offset);
              vec2 d = lattice + offset - f;
              res = min(res, dot(d, d));
            }
          }
          return sqrt(res);
        }

        void main() {
          vec2 uv = vUv * 4.2;
          float c1 = voronoi(uv + vec2(uTime * 0.1, uTime * 0.07));
          float c2 = voronoi(uv * 1.3 - vec2(uTime * 0.07, -uTime * 0.07));
          float caustic = pow(1.0 - (c1 * 0.6 + c2 * 0.4), 3.0) * 1.4;

          vec3 topWater = vec3(0.92, 0.98, 1.0);
          vec3 botWater = vec3(0.80, 0.94, 0.98);
          vec3 baseColor = mix(botWater, topWater, vUv.y);

          vec3 finalColor = baseColor + vec3(0.0, 0.42, 0.92) * caustic * 0.18 + vec3(0.0, 0.8, 0.45) * caustic * 0.08;
          gl_FragColor = vec4(finalColor, 0.88);
        }
      `,
      transparent: true,
      depthWrite: false
    });
    const causticPlane = new THREE.Mesh(causticGeo, causticMat);
    causticPlane.position.set(0, 0, -3.4);
    scene.add(causticPlane);

    // -------------------------------------------------------------------------
    // 4. CENTER 3D FLOATING FABRIC (STAINED -> DISSOLVE -> SPOTLESS)
    // -------------------------------------------------------------------------
    const clothWidth = 6.2;
    const clothHeight = 4.3;
    const clothSegments = isMobile ? 36 : 60;
    const clothGeometry = new THREE.PlaneGeometry(clothWidth, clothHeight, clothSegments, clothSegments);

    // Procedural Cotton Weave Texture
    const texSize = 512;
    const fabricCanvas = document.createElement('canvas');
    fabricCanvas.width = texSize;
    fabricCanvas.height = texSize;
    const fCtx = fabricCanvas.getContext('2d');
    fCtx.fillStyle = '#ffffff';
    fCtx.fillRect(0, 0, texSize, texSize);
    fCtx.fillStyle = 'rgba(224, 238, 250, 0.55)';
    for (let i = 0; i < texSize; i += 4) {
      fCtx.fillRect(i, 0, 2, texSize);
      fCtx.fillRect(0, i, texSize, 2);
    }

    const fabricTex = new THREE.CanvasTexture(fabricCanvas);
    fabricTex.wrapS = THREE.RepeatWrapping;
    fabricTex.wrapT = THREE.RepeatWrapping;
    fabricTex.repeat.set(6, 4.2);

    const clothUniforms = {
      uTime: { value: 0 },
      uCleanProgress: { value: 0.0 }, // 0.0 = dirty, 1.0 = spotless
      uImpactRipple: { value: 0.0 },
      uFabricTex: { value: fabricTex }
    };

    const clothMaterial = new THREE.ShaderMaterial({
      uniforms: clothUniforms,
      vertexShader: `
        uniform float uTime;
        uniform float uImpactRipple;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vec3 pos = position;

          // Underwater fluid cloth floating wave
          float wave1 = sin(pos.x * 1.3 + uTime * 1.4) * cos(pos.y * 1.1 + uTime * 1.2) * 0.16;
          float wave2 = sin(pos.x * 2.5 - uTime * 1.9) * 0.05;

          // Droplet impact concentric ripple on cloth
          float dist = length(uv - vec2(0.5, 0.5));
          float ripple = sin(dist * 30.0 - uTime * 6.5) * exp(-dist * 4.2) * uImpactRipple * 0.38;

          pos.z += wave1 + wave2 + ripple;

          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uCleanProgress;
        uniform sampler2D uFabricTex;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main() {
          vec4 texColor = texture2D(uFabricTex, vUv);

          // Realistic organic stain shape (tea, grease, dirt)
          vec2 center = vUv - vec2(0.5, 0.5);
          float dist = length(center * vec2(1.25, 0.95));
          float n = noise(vUv * 9.0) * 0.22 + noise(vUv * 18.0) * 0.08;
          float stainMask = smoothstep(0.44 + n, 0.04, dist);

          // Deep brown/amber collar grease & tea stain
          vec3 dirtyStain = vec3(0.52, 0.35, 0.20);
          vec3 cleanFabric = texColor.rgb;

          // As cleanProgress advances, stain dissolves from center outwards with foaming fringe
          float progressThreshold = smoothstep(0.0, 0.92, uCleanProgress);
          float currentStain = stainMask * max(0.0, 1.0 - (progressThreshold * 1.25));

          // Active bio-enzyme foaming active rim as stain breaks apart
          float foamingRim = smoothstep(0.0, 0.15, abs(currentStain - 0.4)) * (1.0 - uCleanProgress) * uCleanProgress * 1.8;
          vec3 foamingColor = vec3(0.85, 0.95, 1.0);

          // Optical whitening agent radiance boost
          vec3 whiteningBoost = vec3(0.98, 0.99, 1.0) * (uCleanProgress * 0.14);
          vec3 fabricColor = mix(cleanFabric, dirtyStain, currentStain) + foamingColor * foamingRim * 0.25 + whiteningBoost;

          // Directional Lighting + Fresnel Rim Glow
          vec3 lightDir = normalize(vec3(0.35, 0.85, 0.65));
          float diff = max(dot(vNormal, lightDir), 0.38);

          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
          rim = pow(rim, 3.2) * 0.28;

          vec3 finalColor = fabricColor * (diff + 0.35) + vec3(0.0, 0.45, 1.0) * rim;
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: THREE.DoubleSide
    });

    const clothMesh = new THREE.Mesh(clothGeometry, clothMaterial);
    scene.add(clothMesh);

    // -------------------------------------------------------------------------
    // 5. 3D VISCOUS DETERGENT DROPLET (POINT 7)
    // -------------------------------------------------------------------------
    const dropGeo = new THREE.SphereGeometry(0.25, 28, 28);
    const dropMat = new THREE.MeshPhysicalMaterial({
      color: 0x0077ff,
      transmission: 0.88,
      opacity: 0.95,
      transparent: true,
      roughness: 0.04,
      metalness: 0.08,
      ior: 1.38,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });
    const dropletMesh = new THREE.Mesh(dropGeo, dropMat);
    dropletMesh.position.set(0, 3.2, 0.25);
    dropletMesh.scale.set(0.001, 0.001, 0.001);
    scene.add(dropletMesh);

    // -------------------------------------------------------------------------
    // 6. CONCENTRIC 3D IMPACT WATER RIPPLE RINGS
    // -------------------------------------------------------------------------
    const rippleGeo = new THREE.RingGeometry(0.06, 0.26, 36);
    const rippleMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const rippleRing = new THREE.Mesh(rippleGeo, rippleMat);
    rippleRing.position.set(0, 0, 0.08);
    scene.add(rippleRing);

    // -------------------------------------------------------------------------
    // 7. REALISTIC 3D INSTANCED BUBBLES (GPU INSTANCING - POINT 8)
    // Bubbles behind cloth, in front of cloth, and originating from fabric
    // -------------------------------------------------------------------------
    const BUBBLE_COUNT = isMobile ? 36 : 72;
    const bubbleGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 0.85,
      transparent: true,
      roughness: 0.06,
      ior: 1.15,
      clearcoat: 1.0,
      attenuationColor: new THREE.Color(0x38bdf8),
      attenuationDistance: 0.6
    });

    const instancedBubbles = new THREE.InstancedMesh(bubbleGeo, bubbleMat, BUBBLE_COUNT);
    scene.add(instancedBubbles);

    const dummy = new THREE.Object3D();
    const bubbleData = [];

    for (let i = 0; i < BUBBLE_COUNT; i++) {
      // 3 Layers: 25% Behind cloth (z < -0.3), 50% In front (z > 0.4), 25% Fabric origin
      let layer = 'front';
      let bz = 0.5 + Math.random() * 2.2;
      let bx = (Math.random() - 0.5) * 6.5;
      let by = (Math.random() - 0.5) * 5.0;
      let scale = 0.5 + Math.random() * 1.2;

      if (i < BUBBLE_COUNT * 0.25) {
        layer = 'behind';
        bz = -0.5 - Math.random() * 1.5;
        scale *= 0.8;
      } else if (i < BUBBLE_COUNT * 0.50) {
        layer = 'fabric';
        bx = (Math.random() - 0.5) * 2.4;
        by = (Math.random() - 0.5) * 1.8;
        bz = 0.06 + Math.random() * 0.3;
        scale *= 0.65;
      }

      bubbleData.push({
        layer: layer,
        x: bx,
        y: by,
        z: bz,
        baseScale: scale,
        vy: 0.4 + Math.random() * 0.7,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2
      });

      dummy.position.set(bx, by, bz);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      instancedBubbles.setMatrixAt(i, dummy.matrix);
    }
    instancedBubbles.instanceMatrix.needsUpdate = true;

    // -------------------------------------------------------------------------
    // 8. DISSOLVING DIRT PARTICLES (POINT 9)
    // -------------------------------------------------------------------------
    const DIRT_COUNT = isMobile ? 35 : 70;
    const dirtGeo = new THREE.BufferGeometry();
    const dirtPositions = new Float32Array(DIRT_COUNT * 3);
    const dirtInitialPos = [];
    const dirtVels = [];

    for (let i = 0; i < DIRT_COUNT; i++) {
      const dx = (Math.random() - 0.5) * 1.9;
      const dy = (Math.random() - 0.5) * 1.4;
      const dz = 0.02 + Math.random() * 0.05;

      dirtPositions[i * 3] = dx;
      dirtPositions[i * 3 + 1] = dy;
      dirtPositions[i * 3 + 2] = dz;

      dirtInitialPos.push(new THREE.Vector3(dx, dy, dz));
      dirtVels.push(new THREE.Vector3(
        (Math.random() - 0.5) * 1.6,
        (Math.random() - 0.5) * 1.6,
        0.9 + Math.random() * 1.8
      ));
    }

    dirtGeo.setAttribute('position', new THREE.BufferAttribute(dirtPositions, 3));
    const dirtMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0x5d4037,
      transparent: true,
      opacity: 0.95
    });
    const dirtPoints = new THREE.Points(dirtGeo, dirtMat);
    scene.add(dirtPoints);

    // -------------------------------------------------------------------------
    // 9. ANIMATION TIMELINE & HUD CONTROLS (POINTS 7 & 10)
    // -------------------------------------------------------------------------
    let currentProgress = 0.25;
    let targetProgress = 0.25;
    let isPlaying = true;
    let isUserInteracting = false;
    const playSpeed = 0.07;

    const scrubSlider = document.getElementById('cleaningScrubSlider');
    const playBtn = document.getElementById('cleaningPlayBtn');
    const playIcon = document.getElementById('playIcon');
    const playBtnText = document.getElementById('playBtnText');
    const stagePills = document.querySelectorAll('.stage-pill-btn');

    const hudBadge = document.getElementById('hudStageBadge');
    const hudHeading = document.getElementById('hudStageHeading');
    const hudDesc = document.getElementById('hudStageDesc');

    function updateHud(p) {
      if (!hudBadge || !hudHeading || !hudDesc) return;

      if (p < 0.22) {
        hudBadge.textContent = 'STAGE 01 / INITIAL STATE';
        hudHeading.textContent = 'Stubborn Dirt & Stains on Fabric';
        hudDesc.textContent = 'Deep-set tea, oil and sweat stains trapped within microscopic cotton weaves.';
      } else if (p < 0.52) {
        hudBadge.textContent = 'STAGE 02 / DROP PENETRATION';
        hudHeading.textContent = 'White Mist Formula Hits Fabric';
        hudDesc.textContent = 'Concentrated bio-surfactants spread rapidly, penetrating fiber junctions instantly.';
      } else if (p < 0.82) {
        hudBadge.textContent = 'STAGE 03 / BIO-ENZYME BREAKDOWN';
        hudHeading.textContent = 'Active Enzymes Dissolve Stains';
        hudDesc.textContent = 'Micro-bubbles lift grime particles away from fabric fibers without damaging threads.';
      } else {
        hudBadge.textContent = 'STAGE 04 / SPOTLESS FRESH';
        hudHeading.textContent = 'Dazzling Bright, Pristine Clean';
        hudDesc.textContent = 'Fabric is thoroughly purified with lasting 48-hour ocean mist fragrance.';
      }

      stagePills.forEach((pill) => {
        const val = parseFloat(pill.dataset.progress) / 100;
        pill.classList.toggle('active', Math.abs(val - p) < 0.18);
      });

      if (scrubSlider && !isUserInteracting && document.activeElement !== scrubSlider) {
        scrubSlider.value = Math.round(p * 100);
      }
    }

    function applyTimeline(p) {
      // 1. Droplet Descent & Impact
      if (p < 0.18) {
        dropletMesh.scale.set(0.001, 0.001, 0.001);
        rippleRing.material.opacity = 0;
      } else if (p < 0.44) {
        const dropT = (p - 0.18) / 0.26;
        const curY = 3.2 + (0.05 - 3.2) * dropT;
        dropletMesh.position.set(0, curY, 0.22);
        dropletMesh.scale.set(0.85, 1.45, 0.85);
        rippleRing.material.opacity = 0;
      } else if (p < 0.54) {
        const splashT = (p - 0.44) / 0.10;
        dropletMesh.position.set(0, 0.02, 0.06);
        dropletMesh.scale.set(1.6 * (1 - splashT), 0.04, 1.6 * (1 - splashT));

        rippleRing.material.opacity = (1 - splashT) * 0.95;
        rippleRing.scale.set(1 + splashT * 5.2, 1 + splashT * 5.2, 1);
        clothUniforms.uImpactRipple.value = Math.sin(splashT * Math.PI) * 1.6;
      } else {
        dropletMesh.scale.set(0.001, 0.001, 0.001);
        rippleRing.material.opacity = 0;
        clothUniforms.uImpactRipple.value = Math.max(0, 1.0 - (p - 0.54) * 3);
      }

      // 2. Stain Breakdown (0.44 to 0.94)
      if (p < 0.44) {
        clothUniforms.uCleanProgress.value = 0.0;
      } else if (p <= 0.94) {
        clothUniforms.uCleanProgress.value = (p - 0.44) / 0.50;
      } else {
        clothUniforms.uCleanProgress.value = 1.0;
      }

      // 3. Dirt Particles Release & Dissolution
      const dirtPosAttr = dirtGeo.attributes.position;
      if (p < 0.46) {
        dirtMat.opacity = 0.95;
        for (let i = 0; i < DIRT_COUNT; i++) {
          const init = dirtInitialPos[i];
          dirtPosAttr.setXYZ(i, init.x, init.y, init.z);
        }
      } else {
        const dirtT = (p - 0.46) / 0.42;
        dirtMat.opacity = Math.max(0, 0.95 * (1.0 - dirtT));
        for (let i = 0; i < DIRT_COUNT; i++) {
          const init = dirtInitialPos[i];
          const v = dirtVels[i];
          dirtPosAttr.setXYZ(
            i,
            init.x + v.x * dirtT * 2.3,
            init.y + v.y * dirtT * 2.3,
            init.z + v.z * dirtT * 3.2
          );
        }
      }
      dirtPosAttr.needsUpdate = true;

      // 4. Subtle Camera Choreography
      if (p < 0.44) {
        camera.position.set(0, 0, 7.6);
      } else if (p < 0.84) {
        const camT = (p - 0.44) / 0.40;
        camera.position.set(Math.sin(camT * Math.PI) * 0.35, 0, 7.6 - camT * 0.7);
      } else {
        const revT = (p - 0.84) / 0.16;
        camera.position.set(0, 0, 6.9 + revT * 0.7);
      }
      camera.lookAt(0, 0, 0);

      updateHud(p);
    }

    // -------------------------------------------------------------------------
    // 10. GSAP SCROLLTRIGGER INTEGRATION (POINT 10)
    // -------------------------------------------------------------------------
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && section) {
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        end: 'bottom 25%',
        scrub: 1.2,
        onUpdate: (self) => {
          if (!isUserInteracting) {
            isPlaying = false;
            targetProgress = self.progress;
            if (playIcon) playIcon.textContent = '▶';
            if (playBtnText) playBtnText.textContent = 'PLAY';
          }
        }
      });
    }

    // Scrub Controls Listeners
    if (scrubSlider) {
      scrubSlider.addEventListener('input', (e) => {
        isUserInteracting = true;
        isPlaying = false;
        targetProgress = parseFloat(e.target.value) / 100;
        if (playIcon) playIcon.textContent = '▶';
        if (playBtnText) playBtnText.textContent = 'PLAY';
      });

      scrubSlider.addEventListener('change', () => {
        setTimeout(() => { isUserInteracting = false; }, 400);
      });
    }

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        isUserInteracting = false;
        isPlaying = !isPlaying;
        if (isPlaying) {
          if (targetProgress >= 0.98) targetProgress = 0;
          if (playIcon) playIcon.textContent = '⏸';
          if (playBtnText) playBtnText.textContent = 'PAUSE';
        } else {
          if (playIcon) playIcon.textContent = '▶';
          if (playBtnText) playBtnText.textContent = 'PLAY';
        }
      });
    }

    stagePills.forEach((btn) => {
      btn.addEventListener('click', () => {
        isUserInteracting = false;
        isPlaying = false;
        targetProgress = parseFloat(btn.dataset.progress) / 100;
        if (playIcon) playIcon.textContent = '▶';
        if (playBtnText) playBtnText.textContent = 'PLAY';
      });
    });

    // -------------------------------------------------------------------------
    // 11. INTERACTIVE MOUSE & TOUCH 3D TILT ON CLOTH
    // -------------------------------------------------------------------------
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotX = 0;
    let rotY = 0;

    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        rotY += dx * 0.005;
        rotX += dy * 0.005;
        rotX = Math.max(-0.35, Math.min(0.35, rotX));
        rotY = Math.max(-0.55, Math.min(0.55, rotY));
        clothMesh.rotation.x = rotX;
        clothMesh.rotation.y = rotY;
        prevX = e.clientX;
        prevY = e.clientY;
      }
    });

    // Mobile Touch Drag
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - prevX;
        const dy = e.touches[0].clientY - prevY;
        rotY += dx * 0.006;
        rotX += dy * 0.006;
        rotX = Math.max(-0.35, Math.min(0.35, rotX));
        rotY = Math.max(-0.55, Math.min(0.55, rotY));
        clothMesh.rotation.x = rotX;
        clothMesh.rotation.y = rotY;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
      }
    }, { passive: true });

    // -------------------------------------------------------------------------
    // 12. RESIZE HANDLER & INTERSECTION OBSERVER (PERFORMANCE)
    // -------------------------------------------------------------------------
    function onResize() {
      if (!frame) return;
      width = frame.clientWidth;
      height = frame.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onResize);

    let isSectionVisible = true;
    if ('IntersectionObserver' in window && section) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isSectionVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      observer.observe(section);
    }

    // -------------------------------------------------------------------------
    // 13. MAIN ANIMATION LOOP
    // -------------------------------------------------------------------------
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      if (!isSectionVisible) return; // Pause rendering when offscreen

      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      clothUniforms.uTime.value = time;
      causticMat.uniforms.uTime.value = time;

      // Float 3D Instanced Bubbles
      for (let i = 0; i < BUBBLE_COUNT; i++) {
        const d = bubbleData[i];
        d.phase += d.wobbleSpeed;

        d.y += d.vy * delta * 1.4;
        d.x += Math.sin(d.phase) * 0.008;

        if (d.y > 4.5) {
          d.y = -4.5;
          d.x = (Math.random() - 0.5) * 6.5;
        }

        dummy.position.set(d.x, d.y, d.z);
        dummy.scale.set(d.baseScale, d.baseScale, d.baseScale);
        dummy.updateMatrix();
        instancedBubbles.setMatrixAt(i, dummy.matrix);
      }
      instancedBubbles.instanceMatrix.needsUpdate = true;

      // Autoplay progression when not scrubbing
      if (isPlaying && !prefersReducedMotion) {
        targetProgress += delta * playSpeed;
        if (targetProgress > 1.0) {
          targetProgress = 0.0;
        }
      }

      currentProgress += (targetProgress - currentProgress) * 0.12;
      applyTimeline(currentProgress);

      renderer.render(scene, camera);
    }

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSignatureCleaning);
  } else {
    initSignatureCleaning();
  }
})();

/**
 * WHITE MIST | ULTRA-PREMIUM FABRIC CLEANING LIQUID 3D ENGINE (THREE.JS)
 * 
 * BRAND CLARIFICATION:
 * WHITE MIST IS A PREMIUM CLOTHES / FABRIC CLEANING LIQUID (NOT A PERFUME / COSMETIC).
 * 
 * Features:
 * 1. Authentic FMCG Ergonomic Laundry Cleaning Liquid Bottle Geometry
 *    - Heavy-duty ergonomic handle loop for precision pouring
 *    - Fluted laundry dosing measuring cap (with measurement indicators)
 *    - PBR translucent recyclable crystal polymer with realistic plastic roughness & transmission
 *    - Viscous cleaning liquid core with sloshing inertia & active micro-cleaning bubbles
 *    - Surface micro-condensation water droplets
 * 2. Authentic Fabric Care Label (Triple Bio-Enzymes, 64 Loads, Stain Remover)
 * 3. Flowing Crystalline Water Ribbon Stream Spline
 * 4. Pure Clean Cotton Fabric Fiber Strands Undulating in Fluid Air
 * 5. Soft Volumetric Laundry Mist & Crisp Orbiting Droplets (CLEANING MIST, NOT PERFUME SMOKE)
 * 6. Cinematic Page-Load Reveal Sequence (White Screen Fade, Water Emergence, Fluid Rise, Title Reveal)
 * 7. Interactive 360° Mouse Drag, Cursor Parallax, Slosh Dynamics & Scent Variant Switcher
 */

(function () {
  'use strict';

  // Scent & Variant Configurations (Authentic Fabric Care Editions)
  const SCENT_HUES = {
    alpine: {
      color: 0x0284c7,
      name: 'Active Wash Original',
      liquidHex: '#0284c7',
      liquidColor: 0x38bdf8,
      liquidAbsorption: 0x0369a1,
      sub: 'Glacial Crisp Air & Deep Bio-Enzymes',
      badge: 'TRIPLE BIO-ENZYME FORMULA',
      note: 'Extra Stain Removal • Daily Wear'
    },
    cashmere: {
      color: 0xf472b6,
      name: 'Delicate Care & Silk',
      liquidHex: '#f472b6',
      liquidColor: 0xfb7185,
      liquidAbsorption: 0xbe185d,
      sub: 'Botanical Lotus & Soft Fiber Shield',
      badge: 'DELICATE FABRIC & SILK CARE',
      note: 'Zero Harsh Enzymes • Woolens & Silks'
    },
    linen: {
      color: 0x06b6d4,
      name: 'Crisp White Linen',
      liquidHex: '#06b6d4',
      liquidColor: 0x22d3ee,
      liquidAbsorption: 0x0e7490,
      sub: 'Pure Sunlit Cotton & Sea Breeze',
      badge: 'OPTICAL WHITENING SYSTEM',
      note: 'Luminous Whites • Deep Collar Care'
    },
    citrus: {
      color: 0xf59e0b,
      name: 'Citrus Sunshine',
      liquidHex: '#f59e0b',
      liquidColor: 0xfbbf24,
      liquidAbsorption: 0xb45309,
      sub: 'Cold-Pressed Citrus & Grease Dissolver',
      badge: 'HEAVY-DUTY GREASE DISSOLVER',
      note: 'Tough Cooking Oil & Sauce Stains'
    }
  };

  /**
   * Generates ultra-crisp, authentic FMCG Laundry Cleaning Liquid Label Texture
   */
  function createLaundryLabelTexture(title, subtitle, volumeText, scentNote, badgeText) {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Pristine Waterproof Gloss Label Background
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#f8fafc');
    grad.addColorStop(1, '#f1f5f9');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle micro-pattern of water-resistant synthetic label
    ctx.fillStyle = 'rgba(2, 132, 199, 0.02)';
    for (let i = 0; i < 3000; i++) {
      const rx = Math.random() * canvas.width;
      const ry = Math.random() * canvas.height;
      ctx.fillRect(rx, ry, 2, 2);
    }

    // 2. Cyan & Silver Protective Border
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 6;
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(66, 66, canvas.width - 132, canvas.height - 132);

    // 3. Top Category Banner: PREMIUM CLOTHES & FABRIC CLEANING LIQUID
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(200, 80, canvas.width - 400, 48);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '8px';
    ctx.fillText('ADVANCED FABRIC CLEANING LIQUID • BIO-CARE', canvas.width / 2, 112);

    // 4. Main Brand Header: WHITE MIST
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 112px "Outfit", sans-serif';
    ctx.letterSpacing = '14px';
    ctx.fillText('WHITE MIST', canvas.width / 2 + 7, 245);

    // Sub-title
    ctx.fillStyle = '#0284c7';
    ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '10px';
    ctx.fillText('ACTIVE WASH', canvas.width / 2, 298);

    // 5. Formulation Pill Badge (TRIPLE BIO-ENZYME FORMULA)
    const badgeW = 780;
    const badgeH = 56;
    const badgeX = canvas.width / 2 - badgeW / 2;
    const badgeY = 340;
    ctx.fillStyle = 'rgba(2, 132, 199, 0.1)';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 28) : ctx.rect(badgeX, badgeY, badgeW, badgeH);
    ctx.fill();

    ctx.fillStyle = '#0284c7';
    ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText(badgeText || 'TRIPLE BIO-ENZYME FORMULA • EXTRA STAIN REMOVER', canvas.width / 2, badgeY + 36);

    // 6. Edition & Note
    ctx.fillStyle = '#1e293b';
    ctx.font = '700 46px "Outfit", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText((title || 'ACTIVE WASH ORIGINAL').toUpperCase(), canvas.width / 2, 455);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 28px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(subtitle || 'Glacial Crisp Air & Deep Bio-Enzymes', canvas.width / 2, 502);

    // 7. Core Laundry Proof Metrics
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(120, 560);
    ctx.lineTo(canvas.width - 120, 560);
    ctx.stroke();

    const proofColumns = [
      { top: 'TOUGH ON STAINS', btm: 'Targeted Protein & Grease Lift' },
      { top: 'GENTLE ON FABRICS', btm: 'Color-Lock • Zero Thread Fray' },
      { top: '64 LOADS / 1L', btm: 'Ultra-Concentrated Liquid Care' }
    ];

    const colWidth = (canvas.width - 240) / 3;
    proofColumns.forEach((col, idx) => {
      const cx = 120 + colWidth * (idx + 0.5);
      ctx.fillStyle = '#0f172a';
      ctx.font = '800 26px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText(col.top, cx, 615);

      ctx.fillStyle = '#64748b';
      ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '1px';
      ctx.fillText(col.btm, cx, 650);
    });

    // 8. Bottom Machine Specifications & Volume
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.9)';
    ctx.beginPath();
    ctx.moveTo(120, 700);
    ctx.lineTo(canvas.width - 120, 700);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 36px "Outfit", sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText(volumeText || '1000 mL • FRONT & TOP LOADERS', canvas.width / 2, 765);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('0% BLEACH • 100% INSTANT SOLUBILITY • DERMATOLOGICALLY TESTED', canvas.width / 2, 815);

    // Circular Eco Seal Badge
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 885, 24, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#0284c7';
    ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('100%', canvas.width / 2, 891);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;
    texture.needsUpdate = true;
    return texture;
  }

  /**
   * Main 3D Laundry Bottle Engine
   */
  class LuxuryBottleEngine {
    constructor(options = {}) {
      this.canvas = options.canvas || document.getElementById('heroBottleCanvas');
      if (!this.canvas || typeof THREE === 'undefined') return;

      this.container = this.canvas.parentElement;
      this.currentScentKey = options.initialScent || 'alpine';
      this.isStudioMode = !!options.isStudioMode;

      this.width = this.container.clientWidth || window.innerWidth;
      this.height = this.container.clientHeight || (this.isStudioMode ? 580 : 720);

      this.isMobile = window.innerWidth < 768;
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Physics & Interaction State
      this.isDragging = false;
      this.previousMousePosition = { x: 0, y: 0 };
      this.targetRotation = { x: 0.05, y: -0.15 };
      this.currentRotation = { x: 0.05, y: -0.15 };
      this.dragVelocity = { x: 0, y: 0 };
      this.mouseParallax = { x: 0, y: 0 };
      this.targetParallax = { x: 0, y: 0 };

      // Slosh dynamics
      this.sloshAmount = 0.0;
      this.sloshVelocity = 0.0;

      // Cinematic load reveal state
      this.loadRevealProgress = this.isStudioMode ? 1.0 : 0.0;

      this.clock = new THREE.Clock();
      this.animFrameId = null;
      this.isVisible = true;

      this.initScene();
      this.initLighting();
      this.buildBottle();
      this.buildErgonomicHandle();
      this.buildLiquidCore();
      this.buildCapAndLabel();
      this.buildWaterRibbonStream();
      this.buildCottonFiberStrands();
      this.buildCondensationDroplets();
      this.buildAtmosphericMist();
      this.buildOrbitingDroplets();
      this.buildContactShadow();
      this.buildVolumetricGlow();
      this.initInteraction();
      this.initResizeListener();
      this.initIntersectionObserver();

      // Trigger cinematic reveal if hero mode
      if (!this.isStudioMode) {
        this.triggerPageLoadReveal();
      }

      this.animate = this.animate.bind(this);
      this.animate();
    }

    initScene() {
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0xf8fafc, 0.02);

      this.camera = new THREE.PerspectiveCamera(36, this.width / this.height, 0.1, 50);
      this.camera.position.set(0, 0.2, 5.8);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: !this.isMobile,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2.0));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.25;
      if (THREE.sRGBEncoding) this.renderer.outputEncoding = THREE.sRGBEncoding;

      this.bottlePivot = new THREE.Group();
      this.scene.add(this.bottlePivot);
    }

    initLighting() {
      // Diffuse pure white soft ambient light
      const ambient = new THREE.AmbientLight(0xffffff, 1.4);
      this.scene.add(ambient);

      // Key light: soft studio softbox
      this.keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
      this.keyLight.position.set(3.5, 6.0, 4.5);
      this.scene.add(this.keyLight);

      // Aqua rim light to accentuate water and fabric freshness
      this.rimLight = new THREE.DirectionalLight(0x38bdf8, 2.6);
      this.rimLight.position.set(-4.0, 3.5, -3.0);
      this.scene.add(this.rimLight);

      // Fill light from bottom
      this.fillLight = new THREE.DirectionalLight(0xf1f5f9, 1.1);
      this.fillLight.position.set(0, -4.0, 3.0);
      this.scene.add(this.fillLight);

      // Specular glint spot light for plastic reflection
      this.glintLight = new THREE.PointLight(0xffffff, 1.8, 12);
      this.glintLight.position.set(1.5, 2.0, 3.5);
      this.scene.add(this.glintLight);
    }

    /**
     * Builds the lathe silhouette of the laundry liquid bottle
     */
    buildBottle() {
      const points = [];

      // Indented base bottom
      points.push(new THREE.Vector2(0.00, -1.82));
      points.push(new THREE.Vector2(0.42, -1.80));
      points.push(new THREE.Vector2(0.82, -1.74));
      points.push(new THREE.Vector2(0.96, -1.62));

      // Lower body foot
      points.push(new THREE.Vector2(1.05, -1.40));
      points.push(new THREE.Vector2(1.08, -1.10));

      // Main ergonomic waist (contoured for holding)
      points.push(new THREE.Vector2(1.04, -0.55));
      points.push(new THREE.Vector2(0.96, -0.05));
      points.push(new THREE.Vector2(0.94, 0.40));

      // Shoulder sweep
      points.push(new THREE.Vector2(0.90, 0.85));
      points.push(new THREE.Vector2(0.80, 1.20));
      points.push(new THREE.Vector2(0.64, 1.46));
      points.push(new THREE.Vector2(0.46, 1.66));

      // Neck transition
      points.push(new THREE.Vector2(0.36, 1.80));
      points.push(new THREE.Vector2(0.33, 1.96));

      // Threaded ring collar for dosing cap
      points.push(new THREE.Vector2(0.36, 2.02));
      points.push(new THREE.Vector2(0.34, 2.08));
      points.push(new THREE.Vector2(0.36, 2.14));
      points.push(new THREE.Vector2(0.33, 2.20));

      // Pouring lip
      points.push(new THREE.Vector2(0.35, 2.28));
      points.push(new THREE.Vector2(0.30, 2.30));
      points.push(new THREE.Vector2(0.27, 2.24));

      // Inner hollow wall
      points.push(new THREE.Vector2(0.28, 1.96));
      points.push(new THREE.Vector2(0.31, 1.80));
      points.push(new THREE.Vector2(0.40, 1.64));
      points.push(new THREE.Vector2(0.84, 1.18));
      points.push(new THREE.Vector2(0.94, 0.40));
      points.push(new THREE.Vector2(0.98, -1.10));
      points.push(new THREE.Vector2(0.86, -1.66));
      points.push(new THREE.Vector2(0.00, -1.72));

      const bottleGeo = new THREE.LatheGeometry(points, 64);

      // Ultra-clean high-grade recyclable translucent PET plastic
      this.plasticMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.04,
        transmission: 0.92,
        ior: 1.49,
        reflectivity: 0.85,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        specularIntensity: 1.0,
        attenuationColor: new THREE.Color(0xe0f2fe),
        attenuationDistance: 2.2,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      this.bottleMesh = new THREE.Mesh(bottleGeo, this.plasticMaterial);
      this.bottlePivot.add(this.bottleMesh);
    }

    /**
     * Builds the authentic laundry detergent ergonomic side handle
     */
    buildErgonomicHandle() {
      // A curved side handle loop on the laundry bottle (+X axis)
      const handlePoints = [
        new THREE.Vector3(0.55, 1.40, 0.0),
        new THREE.Vector3(1.15, 1.25, 0.0),
        new THREE.Vector3(1.42, 0.70, 0.0),
        new THREE.Vector3(1.44, 0.00, 0.0),
        new THREE.Vector3(1.36, -0.70, 0.0),
        new THREE.Vector3(1.10, -1.20, 0.0),
        new THREE.Vector3(0.68, -1.35, 0.0)
      ];

      const handleCurve = new THREE.CatmullRomCurve3(handlePoints);
      const handleGeo = new THREE.TubeGeometry(handleCurve, 32, 0.12, 16, false);

      const handleMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.15,
        metalness: 0.04,
        transmission: 0.85,
        ior: 1.48,
        reflectivity: 0.8,
        clearcoat: 0.9,
        transparent: true,
        opacity: 0.92,
        depthWrite: false
      });

      this.handleMesh = new THREE.Mesh(handleGeo, handleMat);
      this.bottlePivot.add(this.handleMesh);
    }

    /**
     * Builds the viscous liquid detergent core inside
     */
    buildLiquidCore() {
      const liquidPoints = [];
      liquidPoints.push(new THREE.Vector2(0.00, -1.72));
      liquidPoints.push(new THREE.Vector2(0.68, -1.68));
      liquidPoints.push(new THREE.Vector2(0.92, -1.42));
      liquidPoints.push(new THREE.Vector2(0.96, -1.12));
      liquidPoints.push(new THREE.Vector2(0.94, -0.55));
      liquidPoints.push(new THREE.Vector2(0.88, 0.00));
      liquidPoints.push(new THREE.Vector2(0.86, 0.45));
      liquidPoints.push(new THREE.Vector2(0.80, 0.85)); // Liquid fill level ~75%
      liquidPoints.push(new THREE.Vector2(0.00, 0.85));

      const liquidGeo = new THREE.LatheGeometry(liquidPoints, 48);
      const scent = SCENT_HUES[this.currentScentKey] || SCENT_HUES.alpine;

      this.liquidMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(scent.liquidColor),
        emissive: new THREE.Color(scent.liquidAbsorption).multiplyScalar(0.15),
        roughness: 0.12,
        metalness: 0.05,
        transmission: 0.74,
        ior: 1.36,
        reflectivity: 0.55,
        transparent: true,
        opacity: 0.88,
        depthWrite: true
      });

      this.liquidMesh = new THREE.Mesh(liquidGeo, this.liquidMaterial);
      this.liquidMesh.scale.set(0.98, 0.98, 0.98);
      this.bottlePivot.add(this.liquidMesh);

      // Meniscus top surface with dynamic slosh
      const meniscusGeo = new THREE.CircleGeometry(0.78, 48);
      meniscusGeo.rotateX(-Math.PI / 2);
      this.meniscusMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(scent.liquidColor),
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: 0.95
      });
      this.meniscusMesh = new THREE.Mesh(meniscusGeo, this.meniscusMaterial);
      this.meniscusMesh.position.y = 0.85;
      this.bottlePivot.add(this.meniscusMesh);

      // Micro-bubbles suspended inside detergent fluid
      this.buildInternalBubbles();
    }

    buildInternalBubbles() {
      const bubbleCount = 45;
      const bubbleGeo = new THREE.SphereGeometry(0.024, 10, 10);
      const bubbleMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.02,
        transmission: 0.95,
        ior: 1.05,
        transparent: true,
        opacity: 0.85
      });

      this.bubblesGroup = new THREE.Group();
      this.bubbleData = [];

      for (let i = 0; i < bubbleCount; i++) {
        const mesh = new THREE.Mesh(bubbleGeo, bubbleMat);
        const radius = Math.random() * 0.70;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = -1.45 + Math.random() * 2.15;
        const scale = 0.4 + Math.random() * 1.1;

        mesh.position.set(x, y, z);
        mesh.scale.setScalar(scale);

        this.bubblesGroup.add(mesh);
        this.bubbleData.push({
          mesh: mesh,
          baseY: y,
          speed: 0.08 + Math.random() * 0.14,
          wobbleOffset: Math.random() * Math.PI * 2,
          radius: radius,
          angle: angle
        });
      }

      this.bottlePivot.add(this.bubblesGroup);
    }

    /**
     * Builds the ribbed dosing measuring cap and front label
     */
    buildCapAndLabel() {
      const capGroup = new THREE.Group();

      // Outer cap body
      const capBodyGeo = new THREE.CylinderGeometry(0.42, 0.44, 0.68, 48);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.28,
        metalness: 0.15
      });
      const capBody = new THREE.Mesh(capBodyGeo, capMat);
      capBody.position.y = 2.48;
      capGroup.add(capBody);

      // Measurement dosage indicator ring (Brand Blue)
      const capRingGeo = new THREE.TorusGeometry(0.39, 0.03, 16, 48);
      capRingGeo.rotateX(Math.PI / 2);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.2,
        metalness: 0.3
      });
      const capRing = new THREE.Mesh(capRingGeo, ringMat);
      capRing.position.y = 2.80;
      capGroup.add(capRing);

      // Fluting ribs for easy gripping
      const ribGeo = new THREE.BoxGeometry(0.015, 0.52, 0.03);
      const ribMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 });
      for (let r = 0; r < 32; r++) {
        const rad = (r / 32) * Math.PI * 2;
        const rib = new THREE.Mesh(ribGeo, ribMat);
        rib.position.set(Math.sin(rad) * 0.445, 2.48, Math.cos(rad) * 0.445);
        rib.rotation.y = rad;
        capGroup.add(rib);
      }

      this.bottlePivot.add(capGroup);

      // Front Label Decal
      const scent = SCENT_HUES[this.currentScentKey] || SCENT_HUES.alpine;
      this.labelTexture = createLaundryLabelTexture(scent.name, scent.sub, '1000 mL • 64 WASHES', scent.note, scent.badge);

      const labelGeo = new THREE.CylinderGeometry(1.03, 1.03, 1.48, 48, 1, true, -Math.PI * 0.24, Math.PI * 0.48);
      this.labelMaterial = new THREE.MeshStandardMaterial({
        map: this.labelTexture,
        roughness: 0.35,
        metalness: 0.08,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.98
      });
      this.labelMesh = new THREE.Mesh(labelGeo, this.labelMaterial);
      this.labelMesh.position.set(0, -0.32, 0);
      this.bottlePivot.add(this.labelMesh);
    }

    /**
     * Builds flowing crystalline water ribbon spline encircling the bottle
     */
    buildWaterRibbonStream() {
      const ribbonPoints = [];
      const ribbonTurns = 2.2;
      const count = 64;

      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const angle = t * Math.PI * 2 * ribbonTurns - 0.5;
        const radius = 1.35 + Math.sin(t * Math.PI) * 0.45;
        const y = -1.6 + t * 3.6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        ribbonPoints.push(new THREE.Vector3(x, y, z));
      }

      const ribbonCurve = new THREE.CatmullRomCurve3(ribbonPoints);
      const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 80, 0.045, 12, false);

      const ribbonMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.15,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.95,
        ior: 1.333, // Pure water IOR
        transparent: true,
        opacity: 0.75,
        depthWrite: false
      });

      this.waterRibbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
      this.scene.add(this.waterRibbonMesh);
    }

    /**
     * Builds pure clean cotton fabric fiber strands undulating in fluid air
     */
    buildCottonFiberStrands() {
      this.fiberGroup = new THREE.Group();
      this.fiberData = [];

      const fiberMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.4,
        metalness: 0.0,
        transparent: true,
        opacity: 0.8
      });

      for (let f = 0; f < 8; f++) {
        const pts = [];
        const baseY = -1.2 + Math.random() * 2.4;
        const baseRadius = 1.6 + Math.random() * 0.8;
        const baseAngle = (f / 8) * Math.PI * 2;

        for (let p = 0; p < 10; p++) {
          const ptT = p / 9;
          const a = baseAngle + ptT * 1.2;
          const r = baseRadius + Math.sin(ptT * Math.PI) * 0.3;
          const y = baseY + (ptT - 0.5) * 1.0;
          pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
        }

        const curve = new THREE.CatmullRomCurve3(pts);
        const geo = new THREE.TubeGeometry(curve, 24, 0.014, 8, false);
        const mesh = new THREE.Mesh(geo, fiberMat);

        this.fiberGroup.add(mesh);
        this.fiberData.push({
          mesh: mesh,
          baseY: baseY,
          speed: 0.3 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2
        });
      }

      this.scene.add(this.fiberGroup);
    }

    /**
     * Builds realistic micro-condensation droplets clinging to the plastic surface
     */
    buildCondensationDroplets() {
      const dropCount = 36;
      const dropGeo = new THREE.SphereGeometry(0.022, 8, 8);
      dropGeo.scale(1.0, 1.4, 0.6); // Flattened teardrop shape

      const dropMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.04,
        transmission: 0.95,
        ior: 1.333,
        transparent: true,
        opacity: 0.9,
        depthWrite: false
      });

      this.condensationGroup = new THREE.Group();

      for (let i = 0; i < dropCount; i++) {
        const mesh = new THREE.Mesh(dropGeo, dropMat);
        const y = -1.2 + Math.random() * 2.3;
        const angle = Math.random() * Math.PI * 2;
        // Surface radius based on body curve
        let r = 1.04;
        if (y > 0.8) r = 0.85;
        else if (y < -1.1) r = 1.05;

        mesh.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
        mesh.rotation.y = angle;
        mesh.scale.setScalar(0.5 + Math.random() * 0.8);

        this.condensationGroup.add(mesh);
      }

      this.bottlePivot.add(this.condensationGroup);
    }

    /**
     * Builds soft volumetric white mist particles (CLEANING / FRESHNESS MIST, NOT PERFUME SMOKE)
     */
    buildAtmosphericMist() {
      const mistCount = 28;
      this.mistGroup = new THREE.Group();
      this.mistData = [];

      const cloudCanvas = document.createElement('canvas');
      cloudCanvas.width = 256;
      cloudCanvas.height = 256;
      const cctx = cloudCanvas.getContext('2d');
      const cgrad = cctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      cgrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      cgrad.addColorStop(0.4, 'rgba(240, 248, 255, 0.22)');
      cgrad.addColorStop(0.8, 'rgba(224, 242, 254, 0.08)');
      cgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      cctx.fillStyle = cgrad;
      cctx.fillRect(0, 0, 256, 256);

      const cloudTex = new THREE.CanvasTexture(cloudCanvas);
      const planeGeo = new THREE.PlaneGeometry(2.6, 2.6);

      for (let i = 0; i < mistCount; i++) {
        const mat = new THREE.MeshBasicMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.18 + Math.random() * 0.16,
          depthWrite: false,
          blending: THREE.NormalBlending
        });

        const mesh = new THREE.Mesh(planeGeo, mat);
        const radius = 1.4 + Math.random() * 1.8;
        const angle = (i / mistCount) * Math.PI * 2 + Math.random();
        const y = -1.6 + Math.random() * 3.4;
        const scale = 0.8 + Math.random() * 1.2;

        mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        mesh.scale.setScalar(scale);

        this.mistGroup.add(mesh);
        this.mistData.push({
          mesh: mesh,
          angle: angle,
          radius: radius,
          y: y,
          speed: (0.04 + Math.random() * 0.05) * (Math.random() > 0.5 ? 1 : -1),
          rotSpeed: (Math.random() - 0.5) * 0.02
        });
      }

      this.scene.add(this.mistGroup);
    }

    buildOrbitingDroplets() {
      const dropCount = 18;
      const geo = new THREE.SphereGeometry(0.045, 16, 16);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.02,
        transmission: 0.98,
        ior: 1.333,
        transparent: true,
        opacity: 0.88,
        depthWrite: false
      });

      this.dropletsGroup = new THREE.Group();
      this.dropletData = [];

      for (let i = 0; i < dropCount; i++) {
        const mesh = new THREE.Mesh(geo, mat);
        const radius = 1.5 + Math.random() * 1.4;
        const theta = (i / dropCount) * Math.PI * 2;
        const y = -1.2 + Math.random() * 2.8;
        const scale = 0.4 + Math.random() * 0.9;

        mesh.position.set(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
        mesh.scale.setScalar(scale);

        this.dropletsGroup.add(mesh);
        this.dropletData.push({
          mesh: mesh,
          theta: theta,
          radius: radius,
          baseY: y,
          speed: (0.15 + Math.random() * 0.22) * (Math.random() > 0.5 ? 1 : -1),
          bobSpeed: 1.2 + Math.random() * 1.6,
          bobPhase: Math.random() * Math.PI * 2
        });
      }

      this.scene.add(this.dropletsGroup);
    }

    buildContactShadow() {
      const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
      shadowGeo.rotateX(-Math.PI / 2);

      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const sctx = canvas.getContext('2d');
      const grad = sctx.createRadialGradient(128, 128, 10, 128, 128, 128);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
      grad.addColorStop(0.3, 'rgba(15, 23, 42, 0.22)');
      grad.addColorStop(0.7, 'rgba(15, 23, 42, 0.06)');
      grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 256, 256);

      const shadowTex = new THREE.CanvasTexture(canvas);
      this.shadowMaterial = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.38,
        depthWrite: false
      });

      this.shadowMesh = new THREE.Mesh(shadowGeo, this.shadowMaterial);
      this.shadowMesh.position.y = -2.15;
      this.scene.add(this.shadowMesh);
    }

    buildVolumetricGlow() {
      const haloGeo = new THREE.PlaneGeometry(5.2, 5.2);
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const hctx = canvas.getContext('2d');
      const grad = hctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
      grad.addColorStop(0.4, 'rgba(224, 242, 254, 0.12)');
      grad.addColorStop(0.8, 'rgba(255, 255, 255, 0.04)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      hctx.fillStyle = grad;
      hctx.fillRect(0, 0, 256, 256);

      const haloTex = new THREE.CanvasTexture(canvas);
      const haloMat = new THREE.MeshBasicMaterial({
        map: haloTex,
        transparent: true,
        opacity: 0.65,
        depthWrite: false
      });

      this.haloMesh = new THREE.Mesh(haloGeo, haloMat);
      this.haloMesh.position.set(0, 0.2, -1.2);
      this.scene.add(this.haloMesh);
    }

    /**
     * Cinematic Page Load Reveal Sequence
     * 1. Soft water particles appear
     * 2. Thin layer of liquid flows across the background
     * 3. Product gradually rises and rotates subtly
     * 4. Mist particles move around the product
     * 5. Headline & CTA reveal
     */
    triggerPageLoadReveal() {
      if (typeof gsap !== 'undefined') {
        // Initial hidden state
        this.bottlePivot.position.y = -1.2;
        this.bottlePivot.scale.set(0.85, 0.85, 0.85);
        if (this.haloMesh) this.haloMesh.material.opacity = 0;
        if (this.waterRibbonMesh) this.waterRibbonMesh.material.opacity = 0;

        const tl = gsap.timeline({ delay: 0.2 });

        tl.to(this.bottlePivot.position, {
          y: 0,
          duration: 1.8,
          ease: 'power3.out'
        }, 0);

        tl.to(this.bottlePivot.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.8,
          ease: 'power3.out'
        }, 0);

        if (this.haloMesh) {
          tl.to(this.haloMesh.material, {
            opacity: 0.65,
            duration: 1.5,
            ease: 'power2.out'
          }, 0.4);
        }

        if (this.waterRibbonMesh) {
          tl.to(this.waterRibbonMesh.material, {
            opacity: 0.75,
            duration: 1.5,
            ease: 'power2.out'
          }, 0.5);
        }

        tl.to(this, {
          loadRevealProgress: 1.0,
          duration: 1.8,
          ease: 'power2.out'
        }, 0);
      } else {
        this.loadRevealProgress = 1.0;
      }
    }

    initInteraction() {
      const el = this.container || this.canvas;

      const onPointerDown = (clientX, clientY) => {
        this.isDragging = true;
        this.previousMousePosition = { x: clientX, y: clientY };
        this.dragVelocity = { x: 0, y: 0 };
      };

      const onPointerMove = (clientX, clientY) => {
        const rect = el.getBoundingClientRect();
        const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

        this.targetParallax.x = normX * 0.4;
        this.targetParallax.y = normY * 0.3;

        if (this.isDragging) {
          const deltaX = clientX - this.previousMousePosition.x;
          const deltaY = clientY - this.previousMousePosition.y;

          this.dragVelocity.x = deltaX * 0.007;
          this.dragVelocity.y = deltaY * 0.007;

          this.targetRotation.y += this.dragVelocity.x;
          this.targetRotation.x += this.dragVelocity.y;

          this.targetRotation.x = Math.max(-0.4, Math.min(0.4, this.targetRotation.x));

          this.previousMousePosition = { x: clientX, y: clientY };

          // Slosh on fast rotation
          const speed = Math.hypot(deltaX, deltaY);
          if (speed > 8) {
            this.triggerSlosh(Math.min(1.0, speed * 0.025));
          }
        }
      };

      const onPointerUp = () => {
        this.isDragging = false;
      };

      el.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
      window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
      window.addEventListener('mouseup', onPointerUp);

      el.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && this.isDragging) {
          onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      window.addEventListener('touchend', onPointerUp);

      // Double-click to slosh fluid
      el.addEventListener('dblclick', () => {
        this.triggerSlosh(0.85);
      });
    }

    triggerSlosh(intensity = 0.5) {
      this.sloshAmount = intensity * 0.65;
      this.sloshVelocity = (Math.random() - 0.5) * intensity * 4.0;
    }

    setScent(scentKey) {
      const scent = SCENT_HUES[scentKey];
      if (!scent) return;
      this.currentScentKey = scentKey;

      const targetColor = new THREE.Color(scent.liquidColor);
      const targetEmissive = new THREE.Color(scent.liquidAbsorption).multiplyScalar(0.15);

      if (typeof gsap !== 'undefined') {
        gsap.to(this.liquidMaterial.color, {
          r: targetColor.r,
          g: targetColor.g,
          b: targetColor.b,
          duration: 0.8
        });
        gsap.to(this.liquidMaterial.emissive, {
          r: targetEmissive.r,
          g: targetEmissive.g,
          b: targetEmissive.b,
          duration: 0.8
        });
        gsap.to(this.meniscusMaterial.color, {
          r: targetColor.r,
          g: targetColor.g,
          b: targetColor.b,
          duration: 0.8
        });
      } else {
        this.liquidMaterial.color.set(targetColor);
        this.liquidMaterial.emissive.set(targetEmissive);
        this.meniscusMaterial.color.set(targetColor);
      }

      if (this.labelMesh) {
        this.labelTexture = createLaundryLabelTexture(scent.name, scent.sub, '1000 mL • 64 WASHES', scent.note, scent.badge);
        this.labelMaterial.map = this.labelTexture;
        this.labelMaterial.needsUpdate = true;
      }

      this.triggerSlosh(0.65);
    }

    initResizeListener() {
      window.addEventListener('resize', () => {
        this.width = this.container.clientWidth || window.innerWidth;
        this.height = this.container.clientHeight || (this.isStudioMode ? 580 : 720);

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
      });
    }

    initIntersectionObserver() {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            this.isVisible = entry.isIntersecting;
          });
        }, { threshold: 0.05 });
        observer.observe(this.canvas);
      }
    }

    animate() {
      this.animFrameId = requestAnimationFrame(this.animate);
      if (!this.isVisible) return;

      const delta = this.clock.getDelta();
      const time = this.clock.getElapsedTime();

      // Anti-Gravity harmonic floating
      const floatAmp = this.isMobile ? 0.06 : 0.12;
      const floatY = Math.sin(time * 1.15) * floatAmp;
      const floatRoll = Math.sin(time * 0.85) * 0.03;
      const floatPitch = Math.cos(time * 0.95) * 0.02;

      // Slow cinematic auto-rotation
      if (!this.isDragging) {
        this.targetRotation.y += delta * 0.14;
      }

      // Smooth inertia damping
      this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
      this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;

      this.mouseParallax.x += (this.targetParallax.x - this.mouseParallax.x) * 0.05;
      this.mouseParallax.y += (this.targetParallax.y - this.mouseParallax.y) * 0.05;

      this.bottlePivot.position.y = floatY;
      this.bottlePivot.position.x = this.mouseParallax.x * 0.35;
      this.bottlePivot.rotation.x = this.currentRotation.x + floatPitch;
      this.bottlePivot.rotation.y = this.currentRotation.y;
      this.bottlePivot.rotation.z = floatRoll + this.mouseParallax.x * -0.05;

      // Dynamic sloshing
      this.sloshVelocity += -this.sloshAmount * 7.5 * delta;
      this.sloshVelocity *= Math.pow(0.88, delta * 60);
      this.sloshAmount += this.sloshVelocity * delta;

      if (this.meniscusMesh) {
        this.meniscusMesh.rotation.z = this.sloshAmount * 0.6 + floatRoll * 0.5;
        this.meniscusMesh.rotation.x = this.sloshAmount * 0.4 + floatPitch * 0.5;
      }

      // Update internal micro-bubbles
      if (this.bubbleData) {
        this.bubbleData.forEach((b) => {
          b.mesh.position.y += b.speed * delta;
          if (b.mesh.position.y > 0.82) {
            b.mesh.position.y = -1.45;
          }
          const wobble = Math.sin(time * 2.0 + b.wobbleOffset) * 0.015;
          b.mesh.position.x = Math.cos(b.angle) * (b.radius + wobble);
          b.mesh.position.z = Math.sin(b.angle) * (b.radius + wobble);
        });
      }

      // Update water ribbon spline rotation
      if (this.waterRibbonMesh) {
        this.waterRibbonMesh.rotation.y += delta * 0.08;
      }

      // Update undulating cotton fiber strands
      if (this.fiberData) {
        this.fiberData.forEach((f) => {
          f.mesh.position.y = f.baseY + Math.sin(time * f.speed + f.phase) * 0.15;
          f.mesh.rotation.y += delta * 0.04;
        });
      }

      // Update laundry mist particles
      if (this.mistData) {
        this.mistData.forEach((m) => {
          m.angle += m.speed * delta;
          m.mesh.position.x = Math.cos(m.angle) * m.radius;
          m.mesh.position.z = Math.sin(m.angle) * m.radius;
          m.mesh.rotation.z += m.rotSpeed;
          m.mesh.position.y = m.y + Math.sin(time * 0.7 + m.angle) * 0.18;
          m.mesh.lookAt(this.camera.position);
        });
      }

      // Update fine water droplets
      if (this.dropletData) {
        this.dropletData.forEach((d) => {
          d.theta += d.speed * delta;
          d.mesh.position.x = Math.cos(d.theta) * d.radius;
          d.mesh.position.z = Math.sin(d.theta) * d.radius;
          d.mesh.position.y = d.baseY + Math.sin(time * d.bobSpeed + d.bobPhase) * 0.1;
        });
      }

      // Contact shadow modulation
      if (this.shadowMesh) {
        const shadowScale = 1.0 - floatY * 0.45;
        this.shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);
        this.shadowMaterial.opacity = 0.38 - floatY * 0.18;
      }

      // Breathing halo
      if (this.haloMesh) {
        const pulse = 0.55 + Math.sin(time * 1.2) * 0.08;
        this.haloMesh.material.opacity = pulse;
      }

      // Subtle camera parallax
      this.camera.position.x = this.mouseParallax.x * 0.5;
      this.camera.position.y = 0.2 + this.mouseParallax.y * 0.3;
      this.camera.lookAt(0, 0.1, 0);

      this.renderer.render(this.scene, this.camera);
    }

    destroy() {
      if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
      if (this.renderer) this.renderer.dispose();
    }
  }

  window.LuxuryBottleEngine = LuxuryBottleEngine;

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Hero 3D Bottle
    const heroCanvas = document.getElementById('heroBottleCanvas');
    if (heroCanvas) {
      window.heroBottle3D = new LuxuryBottleEngine({
        canvas: heroCanvas,
        initialScent: 'alpine'
      });
    }

    // 2. 3D Studio Bottle (Product Detail)
    const studioCanvas = document.getElementById('studioBottleCanvas');
    if (studioCanvas) {
      window.studioBottle3D = new LuxuryBottleEngine({
        canvas: studioCanvas,
        initialScent: 'alpine',
        isStudioMode: true
      });
    }

    // Connect fragrance pills in Hero and Studio
    const bindScentButtons = (selector, instanceGetter) => {
      document.querySelectorAll(selector).forEach((btn) => {
        btn.addEventListener('click', () => {
          document.querySelectorAll(selector).forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const scent = btn.getAttribute('data-scent');
          const engine = instanceGetter();
          if (engine && scent) {
            engine.setScent(scent);
          }
        });
      });
    };

    bindScentButtons('.hero-scent-pill', () => window.heroBottle3D);
    bindScentButtons('.studio-scent-btn', () => window.studioBottle3D);

    // Studio Slosh Button
    const studioSloshBtn = document.getElementById('studioSloshBtn');
    if (studioSloshBtn) {
      studioSloshBtn.addEventListener('click', () => {
        if (window.studioBottle3D) window.studioBottle3D.triggerSlosh(0.9);
      });
    }

    // Studio Reset Camera
    const studioResetCamBtn = document.getElementById('studioResetCamBtn');
    if (studioResetCamBtn) {
      studioResetCamBtn.addEventListener('click', () => {
        if (window.studioBottle3D) {
          window.studioBottle3D.targetRotation = { x: 0.05, y: -0.15 };
          window.studioBottle3D.targetParallax = { x: 0, y: 0 };
        }
      });
    }
  });

})();

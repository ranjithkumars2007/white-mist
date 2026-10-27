/**
 * CLEANPRO | ULTRA-LUXURY 3D FLOATING WHITE DRESS SHIRT ENGINE (THREE.JS)
 * - Zero-Gravity Floating Anti-Gravity Physics (Harmonic Floating + Slow Cinematic Rotation)
 * - Realistic Fabric Shader with Cotton Weave Sheen & Subtle Cloth Breathing Movement
 * - Volumetric Swirling White Mist & Zero-G Micro-Particle System
 * - Dynamic Contact Shadow Modulation (Scales with Elevation)
 * - Interactive 360° Drag & Smooth Spring Return
 * - Volumetric God Rays & Depth-of-Field Lighting Atmosphere
 * - Camera Subtle Breathing Ambient Parallax
 */

(function () {
  'use strict';

  class FloatingShirt3DEngine {
    constructor(options = {}) {
      this.canvas = options.canvas || document.getElementById('heroShirtCanvas');
      if (!this.canvas || typeof THREE === 'undefined') return;

      this.container = this.canvas.parentElement;
      this.width = this.container.clientWidth || window.innerWidth;
      this.height = this.container.clientHeight || 780;

      this.isMobile = window.innerWidth < 768;
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Interaction physics state
      this.isDragging = false;
      this.previousMousePosition = { x: 0, y: 0 };
      this.targetRotation = { x: 0.04, y: 0.0 };
      this.currentRotation = { x: 0.04, y: 0.0 };
      this.dragVelocity = { x: 0, y: 0 };
      this.mouseParallax = { x: 0, y: 0 };
      this.targetParallax = { x: 0, y: 0 };

      // Fabric flutter wave impulse
      this.fabricImpulse = 0.0;
      this.fabricVelocity = 0.0;

      // Clock & animation frame
      this.clock = new THREE.Clock();
      this.animFrameId = null;
      this.isVisible = true;

      this.initScene();
      this.initLighting();
      this.build3DShirt();
      this.buildSwirlingMist();
      this.buildFineParticles();
      this.buildContactShadow();
      this.buildVolumetricGodRays();
      this.initInteraction();
      this.initResizeListener();
      this.initIntersectionObserver();

      this.animate = this.animate.bind(this);
      this.animate();
    }

    initScene() {
      this.scene = new THREE.Scene();
      // Ethereal pure white / sky-mist fog
      this.scene.fog = new THREE.FogExp2(0xf8fafc, 0.018);

      this.camera = new THREE.PerspectiveCamera(38, this.width / this.height, 0.1, 50);
      this.camera.position.set(0, 0.15, 6.2);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: !this.isMobile,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2.0));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.28;
      this.renderer.outputEncoding = THREE.sRGBEncoding;

      // Main pivot group for the floating shirt
      this.shirtPivot = new THREE.Group();
      this.scene.add(this.shirtPivot);
    }

    initLighting() {
      // 1. Diffused white ambient light
      const ambient = new THREE.AmbientLight(0xffffff, 1.85);
      this.scene.add(ambient);

      // 2. Softbox key light (Upper Right) - highlights collar & fabric creases
      this.keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
      this.keyLight.position.set(4.0, 7.0, 5.0);
      this.scene.add(this.keyLight);

      // 3. Cool rim light (Left Rear) - defines crisp sleeve contours
      this.rimLight = new THREE.DirectionalLight(0xe0f2fe, 3.2);
      this.rimLight.position.set(-5.0, 4.0, -3.5);
      this.scene.add(this.rimLight);

      // 4. Soft upward fill light - prevents harsh shadows in fabric drape
      this.fillLight = new THREE.DirectionalLight(0xf1f5f9, 1.2);
      this.fillLight.position.set(0, -5.0, 4.0);
      this.scene.add(this.fillLight);

      // 5. Specular point light for mother-of-pearl button glints
      this.buttonGlintLight = new THREE.PointLight(0xffffff, 1.8, 14);
      this.buttonGlintLight.position.set(0.5, 1.5, 3.8);
      this.scene.add(this.buttonGlintLight);
    }

    /**
     * Builds the realistic 3D White Formal Shirt with dynamic cloth vertex wave
     */
    build3DShirt() {
      // Texture loader for the high-res white formal shirt
      const textureLoader = new THREE.TextureLoader();
      const shirtTexture = textureLoader.load('public/images/shirt_cleanpro.jpg', () => {
        if (this.renderer) this.renderer.render(this.scene, this.camera);
      });
      shirtTexture.generateMipmaps = true;
      shirtTexture.minFilter = THREE.LinearMipmapLinearFilter;
      shirtTexture.magFilter = THREE.LinearFilter;
      shirtTexture.anisotropy = 16;

      // High-density subdiv Plane for organic cloth folding and vertex wind flutter
      // 3.6 width x 4.8 height with 96 x 128 subdivisions
      const segmentsX = 96;
      const segmentsY = 128;
      const clothGeo = new THREE.PlaneGeometry(3.6, 4.8, segmentsX, segmentsY);

      // Store initial rest positions for procedural cloth breathing
      const posAttr = clothGeo.attributes.position;
      this.clothRestPos = new Float32Array(posAttr.array.length);
      this.clothRestPos.set(posAttr.array);

      // Custom Shader Material that:
      // 1. Displaces vertices with natural zero-gravity cloth flutter
      // 2. Samples the shirt texture
      // 3. Uses an edge-feathered chroma key to dissolve the subtle background seamlessly
      // 4. Applies cotton fabric micro-sheen & subsurface scattering lighting
      const customClothShader = {
        uniforms: {
          uTexture: { value: shirtTexture },
          uTime: { value: 0 },
          uImpulse: { value: 0 },
          uLightPos: { value: new THREE.Vector3(3.5, 6.0, 5.0) }
        },
        vertexShader: `
          uniform float uTime;
          uniform float uImpulse;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vWorldPos;

          void main() {
            vUv = uv;
            vec3 pos = position;

            // Natural cloth breathing & gentle zero-g ripples
            // Greater movement at the bottom hem and sleeve edges
            float hemFactor = smoothstep(0.4, -0.9, pos.y);
            float sleeveFactor = smoothstep(0.5, 1.8, abs(pos.x));
            float freedom = 0.4 + hemFactor * 0.6 + sleeveFactor * 0.5;

            // Dual harmonic cloth wave
            float wave1 = sin(pos.x * 2.8 + uTime * 1.35) * 0.055;
            float wave2 = cos(pos.y * 3.4 + uTime * 1.8) * 0.045;
            float wave3 = sin((pos.x + pos.y) * 4.2 + uTime * 2.1) * 0.025;

            // Extra impulse from user drag / click
            float impulseWave = sin(pos.y * 6.0 - uTime * 4.0) * uImpulse * 0.12;

            // Curvature: subtle forward convex chest & draped waist
            float drapeDepth = -pow(pos.x * 0.55, 2.0) * 0.35 + (1.0 - hemFactor) * 0.15;

            pos.z += (wave1 + wave2 + wave3 + impulseWave) * freedom + drapeDepth;

            // Slight lateral sway on bottom hem
            pos.x += sin(pos.y * 2.0 + uTime * 1.1) * 0.02 * hemFactor;

            vec4 worldPos = modelMatrix * vec4(pos, 1.0);
            vWorldPos = worldPos.xyz;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vWorldPos;

          void main() {
            vec4 texColor = texture2D(uTexture, vUv);

            // Clean cut-out key: detect the pale studio background vs. crisp shirt
            // The background in the corner regions has a high uniform lightness with low local contrast
            // Soft border feathering on all 4 quad edges
            float edgeDistX = min(vUv.x, 1.0 - vUv.x);
            float edgeDistY = min(vUv.y, 1.0 - vUv.y);
            float borderFeather = smoothstep(0.005, 0.06, min(edgeDistX, edgeDistY));

            // Clean cut-out key: detect pale studio background gradient
            float distFromCenter = length((vUv - vec2(0.5, 0.46)) * vec2(1.0, 1.2));
            
            // Background is soft studio gradient (cool neutral tone)
            vec3 bgRef = vec3(0.82, 0.85, 0.88);
            float bgDiff = length(texColor.rgb - bgRef);

            float alpha = borderFeather;
            if (distFromCenter > 0.42 && bgDiff < 0.22) {
              alpha *= smoothstep(0.04, 0.22, bgDiff);
            }

            if (alpha < 0.015) discard;

            // Cotton fabric micro-sheen & specular highlight
            vec3 lightDir = normalize(vec3(3.0, 5.0, 4.0));
            vec3 viewDir = normalize(cameraPosition - vWorldPos);
            vec3 halfDir = normalize(lightDir + viewDir);

            float NdotL = max(dot(vNormal, lightDir), 0.0);
            float NdotH = max(dot(vNormal, halfDir), 0.0);
            float spec = pow(NdotH, 18.0) * 0.32;

            // Fabric rim lighting for luxurious edge glow
            float rim = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.8) * 0.38;

            vec3 finalColor = texColor.rgb * (0.88 + NdotL * 0.22) + vec3(spec + rim);

            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: true
      };

      this.clothMaterial = new THREE.ShaderMaterial(customClothShader);
      this.shirtMesh = new THREE.Mesh(clothGeo, this.clothMaterial);
      this.shirtMesh.position.set(0, 0.1, 0);

      this.shirtPivot.add(this.shirtMesh);
    }

    /**
     * Builds soft volumetric white mist swirling around the floating shirt
     */
    buildSwirlingMist() {
      const mistCount = 32;
      this.mistGroup = new THREE.Group();
      this.mistData = [];

      // Create soft radial cloud texture
      const cloudCanvas = document.createElement('canvas');
      cloudCanvas.width = 256;
      cloudCanvas.height = 256;
      const cctx = cloudCanvas.getContext('2d');
      const cgrad = cctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      cgrad.addColorStop(0, 'rgba(255, 255, 255, 0.48)');
      cgrad.addColorStop(0.35, 'rgba(240, 248, 255, 0.26)');
      cgrad.addColorStop(0.75, 'rgba(224, 242, 254, 0.08)');
      cgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      cctx.fillStyle = cgrad;
      cctx.fillRect(0, 0, 256, 256);

      const cloudTex = new THREE.CanvasTexture(cloudCanvas);
      const planeGeo = new THREE.PlaneGeometry(3.2, 3.2);

      for (let i = 0; i < mistCount; i++) {
        const mat = new THREE.MeshBasicMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.16 + Math.random() * 0.18,
          depthWrite: false,
          blending: THREE.NormalBlending
        });

        const mesh = new THREE.Mesh(planeGeo, mat);
        const radius = 1.4 + Math.random() * 2.2;
        const angle = (i / mistCount) * Math.PI * 2 + Math.random();
        const y = -2.0 + Math.random() * 4.2;
        const scale = 0.8 + Math.random() * 1.4;

        mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        mesh.scale.setScalar(scale);

        this.mistGroup.add(mesh);
        this.mistData.push({
          mesh: mesh,
          angle: angle,
          radius: radius,
          baseY: y,
          speed: (0.04 + Math.random() * 0.05) * (Math.random() > 0.5 ? 1 : -1),
          rotSpeed: (Math.random() - 0.5) * 0.018
        });
      }

      this.scene.add(this.mistGroup);
    }

    /**
     * Builds fine crystalline water / air particles floating in zero-g
     */
    buildFineParticles() {
      const pCount = 65;
      const pGeo = new THREE.SphereGeometry(0.028, 12, 12);
      const pMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.05,
        transmission: 0.95,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.85
      });

      this.particlesGroup = new THREE.Group();
      this.particleData = [];

      for (let i = 0; i < pCount; i++) {
        const mesh = new THREE.Mesh(pGeo, pMat);
        const radius = 1.2 + Math.random() * 2.4;
        const theta = Math.random() * Math.PI * 2;
        const y = -2.2 + Math.random() * 4.5;
        const scale = 0.35 + Math.random() * 1.1;

        mesh.position.set(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
        mesh.scale.setScalar(scale);

        this.particlesGroup.add(mesh);
        this.particleData.push({
          mesh: mesh,
          theta: theta,
          radius: radius,
          baseY: y,
          speed: 0.07 + Math.random() * 0.14,
          bobSpeed: 1.0 + Math.random() * 1.5,
          bobPhase: Math.random() * Math.PI * 2
        });
      }

      this.scene.add(this.particlesGroup);
    }

    /**
     * Builds dynamic contact shadow on the ground plane
     */
    buildContactShadow() {
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 512;
      shadowCanvas.height = 512;
      const sctx = shadowCanvas.getContext('2d');
      const sgrad = sctx.createRadialGradient(256, 256, 30, 256, 256, 245);
      sgrad.addColorStop(0, 'rgba(15, 23, 42, 0.44)');
      sgrad.addColorStop(0.35, 'rgba(51, 65, 85, 0.24)');
      sgrad.addColorStop(0.7, 'rgba(148, 163, 184, 0.07)');
      sgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      sctx.fillStyle = sgrad;
      sctx.fillRect(0, 0, 512, 512);

      const shadowTex = new THREE.CanvasTexture(shadowCanvas);
      const shadowGeo = new THREE.PlaneGeometry(4.2, 2.8);
      shadowGeo.rotateX(-Math.PI / 2);

      this.shadowMaterial = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.36,
        depthWrite: false
      });

      this.shadowMesh = new THREE.Mesh(shadowGeo, this.shadowMaterial);
      this.shadowMesh.position.y = -2.45;
      this.scene.add(this.shadowMesh);
    }

    /**
     * Builds ethereal volumetric god rays halo behind the shirt
     */
    buildVolumetricGodRays() {
      const haloGeo = new THREE.PlaneGeometry(7.2, 7.2);
      const hCanvas = document.createElement('canvas');
      hCanvas.width = 512;
      hCanvas.height = 512;
      const hctx = hCanvas.getContext('2d');
      const hgrad = hctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      hgrad.addColorStop(0, 'rgba(224, 242, 254, 0.48)');
      hgrad.addColorStop(0.4, 'rgba(240, 249, 255, 0.22)');
      hgrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.05)');
      hgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      hctx.fillStyle = hgrad;
      hctx.fillRect(0, 0, 512, 512);

      const hTex = new THREE.CanvasTexture(hCanvas);
      const haloMat = new THREE.MeshBasicMaterial({
        map: hTex,
        transparent: true,
        opacity: 0.65,
        depthWrite: false
      });

      this.haloMesh = new THREE.Mesh(haloGeo, haloMat);
      this.haloMesh.position.set(0, 0.2, -1.0);
      this.scene.add(this.haloMesh);
    }

    /**
     * Interactive 360° drag & parallax tracking
     */
    initInteraction() {
      const dom = this.canvas;

      const onPointerDown = (e) => {
        this.isDragging = true;
        this.dragVelocity.x = 0;
        this.dragVelocity.y = 0;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        this.previousMousePosition = { x: clientX, y: clientY };
      };

      const onPointerMove = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        // Window-wide parallax coordinates
        const normX = (clientX / window.innerWidth) * 2 - 1;
        const normY = -(clientY / window.innerHeight) * 2 + 1;
        this.targetParallax.x = normX * 0.18;
        this.targetParallax.y = normY * 0.12;

        if (!this.isDragging) return;

        const deltaX = clientX - this.previousMousePosition.x;
        const deltaY = clientY - this.previousMousePosition.y;

        this.dragVelocity.x = deltaX * 0.007;
        this.dragVelocity.y = deltaY * 0.005;

        this.targetRotation.y += this.dragVelocity.x;
        this.targetRotation.x += this.dragVelocity.y;

        // Clamp vertical tilt
        this.targetRotation.x = Math.max(-0.35, Math.min(0.35, this.targetRotation.x));

        // Inject cloth ripple impulse from drag speed
        const speed = Math.hypot(deltaX, deltaY);
        this.triggerFabricFlutter(speed * 0.02);

        this.previousMousePosition = { x: clientX, y: clientY };
      };

      const onPointerUp = () => {
        this.isDragging = false;
      };

      dom.addEventListener('mousedown', onPointerDown);
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);

      dom.addEventListener('touchstart', onPointerDown, { passive: true });
      window.addEventListener('touchmove', onPointerMove, { passive: true });
      window.addEventListener('touchend', onPointerUp);

      // Click to ripple fabric
      dom.addEventListener('click', () => {
        this.triggerFabricFlutter(0.75);
      });
      dom.addEventListener('dblclick', () => {
        this.triggerFabricFlutter(1.0);
      });
    }

    triggerFabricFlutter(amount = 0.5) {
      this.fabricVelocity += Math.min(amount, 1.2);
    }

    initResizeListener() {
      window.addEventListener('resize', () => {
        this.width = this.container.clientWidth || window.innerWidth;
        this.height = this.container.clientHeight || 780;

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

    /**
     * Render & Physics Loop
     */
    animate() {
      this.animFrameId = requestAnimationFrame(this.animate);
      if (!this.isVisible) return;

      const delta = this.clock.getDelta();
      const time = this.clock.getElapsedTime();

      // 1. Anti-Gravity Zero-G Floating Physics
      const floatAmp = this.isMobile ? 0.09 : 0.16;
      const floatY = Math.sin(time * 1.05) * floatAmp + Math.cos(time * 0.6) * (floatAmp * 0.35);
      const floatRoll = Math.sin(time * 0.8) * 0.03;
      const floatPitch = Math.cos(time * 0.9) * 0.025;

      // 2. Slow Cinematic Auto-Rotation
      if (!this.isDragging) {
        this.targetRotation.y += delta * 0.14;
      }

      // Smooth Inertia Damping for Rotation
      this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.07;
      this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.07;

      // Mouse Parallax Damping
      this.mouseParallax.x += (this.targetParallax.x - this.mouseParallax.x) * 0.05;
      this.mouseParallax.y += (this.targetParallax.y - this.mouseParallax.y) * 0.05;

      // Apply transformations to shirt group
      this.shirtPivot.position.y = floatY;
      this.shirtPivot.position.x = this.mouseParallax.x * 0.35;
      this.shirtPivot.rotation.x = this.currentRotation.x + floatPitch;
      this.shirtPivot.rotation.y = this.currentRotation.y;
      this.shirtPivot.rotation.z = floatRoll + this.mouseParallax.x * -0.05;

      // 3. Dynamic Fabric Flutter Decay
      this.fabricVelocity += -this.fabricImpulse * 8.0 * delta;
      this.fabricVelocity *= Math.pow(0.85, delta * 60);
      this.fabricImpulse += this.fabricVelocity * delta;

      // Pass time and impulse to cloth shader
      if (this.clothMaterial && this.clothMaterial.uniforms) {
        this.clothMaterial.uniforms.uTime.value = time;
        this.clothMaterial.uniforms.uImpulse.value = this.fabricImpulse;
      }

      // 4. Update Orbiting Swirling Mist Particles
      if (this.mistData) {
        this.mistData.forEach((m) => {
          m.angle += m.speed * delta;
          m.mesh.position.x = Math.cos(m.angle) * m.radius;
          m.mesh.position.z = Math.sin(m.angle) * m.radius;
          m.mesh.rotation.z += m.rotSpeed;
          m.mesh.position.y = m.baseY + Math.sin(time * 0.65 + m.angle) * 0.22;
          m.mesh.lookAt(this.camera.position);
        });
      }

      // 5. Update Fine Zero-G Particles
      if (this.particleData) {
        this.particleData.forEach((p) => {
          p.theta += p.speed * delta;
          p.mesh.position.x = Math.cos(p.theta) * p.radius;
          p.mesh.position.z = Math.sin(p.theta) * p.radius;
          p.mesh.position.y = p.baseY + Math.sin(time * p.bobSpeed + p.bobPhase) * 0.14;
        });
      }

      // 6. Dynamic Contact Shadow Modulation
      if (this.shadowMesh) {
        const shadowScale = 1.0 - floatY * 0.45;
        this.shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);
        this.shadowMaterial.opacity = 0.36 - floatY * 0.16;
      }

      // 7. God Rays Halo Breathing Glow
      if (this.haloMesh) {
        const pulse = 0.58 + Math.sin(time * 1.1) * 0.08;
        this.haloMesh.material.opacity = pulse;
      }

      // 8. Camera Subtle Breathing Ambient Parallax
      this.camera.position.x = this.mouseParallax.x * 0.55;
      this.camera.position.y = 0.15 + this.mouseParallax.y * 0.35;
      this.camera.lookAt(0, 0.1, 0);

      this.renderer.render(this.scene, this.camera);
    }

    destroy() {
      if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
      if (this.renderer) this.renderer.dispose();
    }
  }

  // Export engine globally
  window.FloatingShirt3DEngine = FloatingShirt3DEngine;

  // Auto-initialize when hero canvas is present
  document.addEventListener('DOMContentLoaded', () => {
    const shirtCanvas = document.getElementById('heroShirtCanvas');
    if (shirtCanvas) {
      window.heroShirt3D = new FloatingShirt3DEngine({
        canvas: shirtCanvas
      });
    }
  });

})();

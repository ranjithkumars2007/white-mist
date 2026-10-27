/**
 * WHITE MIST | MACRO 3D FABRIC CARE ENGINE (THREE.JS)
 * Macro 3D textile visualization of fabric fibers being conditioned and protected.
 * 
 * Supports:
 * - COTTON (Breathable cellular loops)
 * - LINEN (Crisp natural flax weave)
 * - POLYESTER (Sleek high-density micro-filaments)
 * - DAILY WEAR (Reinforced blended cotton-poly weave)
 * - DELICATE FABRICS (Fine spun silk & cashmere micro-strands)
 */

(function () {
  'use strict';

  const FABRIC_SPECS = {
    cotton: {
      name: 'Pure Spun Cotton',
      type: 'COTTON',
      desc: 'White Mist bio-enzymes soften rigid cellulose bonds without thinning yarn tensile strength.',
      color: 0xf8fafc,
      roughness: 0.55,
      bumpScale: 0.08,
      yarnDensity: 14,
      waveFreq: 2.5
    },
    linen: {
      name: 'Natural Crisp Linen',
      type: 'LINEN',
      desc: 'Protects natural flax fibers against wash abrasion, preserving natural crispness with zero stiff creases.',
      color: 0xf1f5f9,
      roughness: 0.45,
      bumpScale: 0.12,
      yarnDensity: 11,
      waveFreq: 2.0
    },
    polyester: {
      name: 'High-Performance Polyester',
      type: 'POLYESTER',
      desc: 'Eliminates electrostatic soil attraction and breaks down trapped sweat lipids inside athletic fibers.',
      color: 0xe2e8f0,
      roughness: 0.25,
      bumpScale: 0.04,
      yarnDensity: 18,
      waveFreq: 3.2
    },
    daily: {
      name: 'Everyday Daily Wear',
      type: 'DAILY WEAR',
      desc: 'Balanced formula removes collar sweat, food grease, and street dust across school uniforms and work shirts.',
      color: 0xf8fafc,
      roughness: 0.4,
      bumpScale: 0.06,
      yarnDensity: 15,
      waveFreq: 2.8
    },
    delicate: {
      name: 'Silk & Delicate Fabrics',
      type: 'DELICATE FABRICS',
      desc: 'Neutral pH conditioning agents coat micro-fibrils with a protective liquid envelope preventing fabric fuzz.',
      color: 0xfff1f2,
      roughness: 0.18,
      bumpScale: 0.03,
      yarnDensity: 22,
      waveFreq: 4.0
    }
  };

  class FabricCare3DEngine {
    constructor(canvasId = 'fabricCareCanvas') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas || typeof THREE === 'undefined') return;

      this.container = this.canvas.parentElement;
      this.currentFabric = 'cotton';

      this.width = this.container.clientWidth || 600;
      this.height = this.container.clientHeight || 480;

      this.clock = new THREE.Clock();
      this.animFrameId = null;
      this.isVisible = true;

      this.initScene();
      this.buildWeave();
      this.buildLiquidFilm();
      this.buildBioParticles();
      this.initListeners();

      this.animate = this.animate.bind(this);
      this.animate();
    }

    initScene() {
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0xf8fafc, 0.03);

      this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 50);
      this.camera.position.set(0, 2.2, 4.5);
      this.camera.lookAt(0, 0, 0);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Lighting
      const ambient = new THREE.AmbientLight(0xffffff, 1.6);
      this.scene.add(ambient);

      const sun = new THREE.DirectionalLight(0xffffff, 2.4);
      sun.position.set(4, 6, 5);
      this.scene.add(sun);

      const blueRim = new THREE.DirectionalLight(0x38bdf8, 1.8);
      blueRim.position.set(-4, -2, -3);
      this.scene.add(blueRim);
    }

    buildWeave() {
      if (this.weaveGroup) this.scene.remove(this.weaveGroup);

      this.weaveGroup = new THREE.Group();
      const spec = FABRIC_SPECS[this.currentFabric] || FABRIC_SPECS.cotton;

      const yarnCount = spec.yarnDensity;
      const spacing = 4.2 / yarnCount;
      const strandRadius = spacing * 0.42;

      this.yarnMat = new THREE.MeshStandardMaterial({
        color: spec.color,
        roughness: spec.roughness,
        metalness: 0.02
      });

      // Warp strands (along X)
      for (let i = 0; i < yarnCount; i++) {
        const pts = [];
        const yBase = -2.1 + i * spacing;
        for (let j = 0; j <= 24; j++) {
          const x = -2.1 + (j / 24) * 4.2;
          const z = Math.sin(j * spec.waveFreq * 0.5 + i * Math.PI) * strandRadius * 0.8;
          pts.push(new THREE.Vector3(x, yBase, z));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        const geo = new THREE.TubeGeometry(curve, 24, strandRadius, 8, false);
        const mesh = new THREE.Mesh(geo, this.yarnMat);
        this.weaveGroup.add(mesh);
      }

      // Weft strands (along Y)
      for (let j = 0; j < yarnCount; j++) {
        const pts = [];
        const xBase = -2.1 + j * spacing;
        for (let i = 0; i <= 24; i++) {
          const y = -2.1 + (i / 24) * 4.2;
          const z = Math.sin(i * spec.waveFreq * 0.5 + j * Math.PI + Math.PI / 2) * strandRadius * 0.8;
          pts.push(new THREE.Vector3(xBase, y, z));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        const geo = new THREE.TubeGeometry(curve, 24, strandRadius, 8, false);
        const mesh = new THREE.Mesh(geo, this.yarnMat);
        this.weaveGroup.add(mesh);
      }

      this.weaveGroup.rotation.x = -Math.PI * 0.28;
      this.scene.add(this.weaveGroup);
    }

    buildLiquidFilm() {
      // Protective White Mist liquid film glistening across fabric
      const filmGeo = new THREE.PlaneGeometry(4.4, 4.4, 32, 32);
      this.filmMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.1,
        roughness: 0.08,
        transmission: 0.92,
        ior: 1.34,
        transparent: true,
        opacity: 0.55,
        depthWrite: false
      });

      this.filmMesh = new THREE.Mesh(filmGeo, this.filmMat);
      this.filmMesh.position.z = 0.15;
      this.weaveGroup.add(this.filmMesh);
    }

    buildBioParticles() {
      const pCount = 30;
      const pGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const pMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.5,
        roughness: 0.1
      });

      this.particlesGroup = new THREE.Group();
      this.particles = [];

      for (let i = 0; i < pCount; i++) {
        const mesh = new THREE.Mesh(pGeo, pMat);
        const x = (Math.random() - 0.5) * 3.6;
        const y = (Math.random() - 0.5) * 3.6;
        const z = 0.2 + Math.random() * 0.5;
        mesh.position.set(x, y, z);
        this.particlesGroup.add(mesh);
        this.particles.push({
          mesh: mesh,
          baseZ: z,
          speed: 0.8 + Math.random() * 1.2,
          phase: Math.random() * Math.PI * 2
        });
      }

      this.weaveGroup.add(this.particlesGroup);
    }

    setFabric(typeKey) {
      if (!FABRIC_SPECS[typeKey]) return;
      this.currentFabric = typeKey;
      this.buildWeave();
      this.buildLiquidFilm();
      this.buildBioParticles();

      // Update UI texts if available
      const titleEl = document.getElementById('fabricCareTypeName');
      const descEl = document.getElementById('fabricCareTypeDesc');
      if (titleEl) titleEl.textContent = FABRIC_SPECS[typeKey].name;
      if (descEl) descEl.textContent = FABRIC_SPECS[typeKey].desc;
    }

    initListeners() {
      window.addEventListener('resize', () => {
        if (!this.container) return;
        this.width = this.container.clientWidth || 600;
        this.height = this.container.clientHeight || 480;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
      });

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((e) => { this.isVisible = e.isIntersecting; });
        }, { threshold: 0.05 });
        observer.observe(this.canvas);
      }
    }

    animate() {
      this.animFrameId = requestAnimationFrame(this.animate);
      if (!this.isVisible) return;

      const time = this.clock.getElapsedTime();

      // Subtle fabric breathing
      if (this.weaveGroup) {
        this.weaveGroup.rotation.z = Math.sin(time * 0.4) * 0.04;
        this.weaveGroup.position.y = Math.sin(time * 0.8) * 0.05;
      }

      // Bio particles drifting and conditioning
      if (this.particles) {
        this.particles.forEach((p) => {
          p.mesh.position.z = p.baseZ + Math.sin(time * p.speed + p.phase) * 0.08;
        });
      }

      this.renderer.render(this.scene, this.camera);
    }
  }

  window.FabricCare3DEngine = FabricCare3DEngine;

  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fabricCareCanvas');
    if (canvas) {
      window.fabricCareEngine = new FabricCare3DEngine('fabricCareCanvas');

      // Bind fabric selector tab buttons
      const tabBtns = document.querySelectorAll('.fabric-tab-btn');
      tabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          tabBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const fabricType = btn.getAttribute('data-fabric');
          if (window.fabricCareEngine && fabricType) {
            window.fabricCareEngine.setFabric(fabricType);
          }
        });
      });
    }
  });

})();

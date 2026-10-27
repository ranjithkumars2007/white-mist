/**
 * WHITE MIST | ADVANCED LIQUID TECHNOLOGY 3D ENGINE (THREE.JS)
 * 
 * Visualizes a suspended, transparent 3D liquid droplet with internal
 * catalytic bio-enzyme micro-particles, optical dispersion, and 4 interactive
 * cleaning technology pillars:
 * 1. DEEP CLEANING (Triple Bio-Enzymes)
 * 2. STAIN REMOVAL (Lipid & Protein Targeting)
 * 3. FABRIC CARE (Fiber-Smooth Polymer Barrier)
 * 4. LONG-LASTING FRESHNESS (Micro-Encapsulated Ocean Breeze)
 */

(function () {
  'use strict';

  class LiquidTech3DEngine {
    constructor(canvasId = 'liquidTechCanvas') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas || typeof THREE === 'undefined') return;

      this.container = this.canvas.parentElement;
      this.width = this.container.clientWidth || 550;
      this.height = this.container.clientHeight || 450;

      this.clock = new THREE.Clock();
      this.animFrameId = null;
      this.isVisible = true;

      this.initScene();
      this.buildDroplet();
      this.buildInternalEnzymeParticles();
      this.buildEnergyRings();
      this.initListeners();

      this.animate = this.animate.bind(this);
      this.animate();
    }

    initScene() {
      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(38, this.width / this.height, 0.1, 50);
      this.camera.position.set(0, 0, 5.2);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Crisp clean aquatic studio lighting
      const ambient = new THREE.AmbientLight(0xffffff, 1.8);
      this.scene.add(ambient);

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
      keyLight.position.set(3, 5, 4);
      this.scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0x0284c7, 3.0);
      rimLight.position.set(-4, -2, -3);
      this.scene.add(rimLight);

      this.dropletPivot = new THREE.Group();
      this.scene.add(this.dropletPivot);
    }

    buildDroplet() {
      // Viscous liquid droplet geometry: morphed sphere with tapered apex
      const dropGeo = new THREE.SphereGeometry(1.4, 48, 48);
      const pos = dropGeo.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);

        // Taper top into teardrop shape
        if (y > 0) {
          const taper = 1.0 - (y / 1.4) * 0.45;
          x *= taper;
          z *= taper;
          y *= 1.25;
        }

        pos.setXYZ(i, x, y, z);
      }
      dropGeo.computeVertexNormals();

      // Optical clear liquid material with high transmission and clean aqua tint
      this.dropMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.12,
        roughness: 0.05,
        metalness: 0.02,
        transmission: 0.94,
        ior: 1.34, // Viscous liquid detergent IOR
        reflectivity: 0.85,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        transparent: true,
        opacity: 0.88,
        depthWrite: false
      });

      this.dropMesh = new THREE.Mesh(dropGeo, this.dropMat);
      this.dropletPivot.add(this.dropMesh);
    }

    buildInternalEnzymeParticles() {
      // Catalytic bio-enzyme particles inside the droplet
      const pCount = 55;
      const pGeo = new THREE.SphereGeometry(0.04, 10, 10);
      const pMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.8,
        roughness: 0.2
      });

      this.particleGroup = new THREE.Group();
      this.particles = [];

      for (let i = 0; i < pCount; i++) {
        const mesh = new THREE.Mesh(pGeo, pMat);
        const radius = Math.random() * 0.85;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi) * 0.8;
        const z = radius * Math.sin(phi) * Math.sin(theta);

        mesh.position.set(x, y, z);
        const scale = 0.4 + Math.random() * 0.8;
        mesh.scale.setScalar(scale);

        this.particleGroup.add(mesh);
        this.particles.push({
          mesh: mesh,
          radius: radius,
          theta: theta,
          phi: phi,
          speed: 0.4 + Math.random() * 0.6
        });
      }

      this.dropletPivot.add(this.particleGroup);
    }

    buildEnergyRings() {
      // Concentric clean technology resonance rings
      this.ringGroup = new THREE.Group();
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
        wireframe: true
      });

      for (let r = 0; r < 2; r++) {
        const ringGeo = new THREE.TorusGeometry(1.6 + r * 0.35, 0.015, 8, 48);
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI * 0.35 + r * 0.4;
        this.ringGroup.add(ring);
      }

      this.dropletPivot.add(this.ringGroup);
    }

    initListeners() {
      window.addEventListener('resize', () => {
        if (!this.container) return;
        this.width = this.container.clientWidth || 550;
        this.height = this.container.clientHeight || 450;
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

      const delta = this.clock.getDelta();
      const time = this.clock.getElapsedTime();

      // Slow harmonic levitation & rotation
      this.dropletPivot.rotation.y += delta * 0.2;
      this.dropletPivot.position.y = Math.sin(time * 1.2) * 0.08;

      // Pulse droplet scale gently
      const pulse = 1.0 + Math.sin(time * 2.0) * 0.02;
      if (this.dropMesh) {
        this.dropMesh.scale.set(pulse, 1.0 + Math.cos(time * 2.0) * 0.02, pulse);
      }

      // Rotate internal bio-particles
      if (this.particles) {
        this.particles.forEach((p) => {
          p.theta += delta * p.speed;
          p.mesh.position.x = p.radius * Math.sin(p.phi) * Math.cos(p.theta);
          p.mesh.position.z = p.radius * Math.sin(p.phi) * Math.sin(p.theta);
        });
      }

      // Rotate resonance rings
      if (this.ringGroup) {
        this.ringGroup.rotation.z += delta * 0.15;
      }

      this.renderer.render(this.scene, this.camera);
    }
  }

  window.LiquidTech3DEngine = LiquidTech3DEngine;

  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('liquidTechCanvas');
    if (canvas) {
      window.liquidTechEngine = new LiquidTech3DEngine('liquidTechCanvas');
    }
  });

})();

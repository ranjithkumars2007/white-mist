/**
 * WHITE MIST | 3D WASHING MACHINE SIMULATION ENGINE (THREE.JS)
 * 
 * Interactive premium front-load drum visualization:
 * - Transparent circular door with brushed aluminum rim
 * - Perforated stainless steel inner drum
 * - Active washing cycle states:
 *   1. DISPENSE (White Mist liquid pouring into drum)
 *   2. SPIN WASH (Vortex water, micro-suds, and fabric rotation)
 *   3. RINSE & FRESH (Pristine clean water and spotless fabric reveal)
 */

(function () {
  'use strict';

  class WashingMachine3DEngine {
    constructor(canvasId = 'machine3DCanvas') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas || typeof THREE === 'undefined') return;

      this.container = this.canvas.parentElement;
      this.width = this.container.clientWidth || 550;
      this.height = this.container.clientHeight || 450;

      this.clock = new THREE.Clock();
      this.animFrameId = null;
      this.isVisible = true;

      this.cycleState = 'dispense'; // 'dispense', 'wash', 'rinse'
      this.spinSpeed = 0.5;

      this.initScene();
      this.buildMachineHousing();
      this.buildDrum();
      this.buildWaterAndSuds();
      this.buildTumblingClothes();
      this.initListeners();

      this.animate = this.animate.bind(this);
      this.animate();
    }

    initScene() {
      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(38, this.width / this.height, 0.1, 50);
      this.camera.position.set(0, 0, 5.0);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Lighting
      const ambient = new THREE.AmbientLight(0xffffff, 1.8);
      this.scene.add(ambient);

      const mainSun = new THREE.DirectionalLight(0xffffff, 2.5);
      mainSun.position.set(3, 4, 5);
      this.scene.add(mainSun);

      const blueRim = new THREE.PointLight(0x0284c7, 2.5, 12);
      blueRim.position.set(0, 0, 2);
      this.scene.add(blueRim);

      this.machineGroup = new THREE.Group();
      this.scene.add(this.machineGroup);
    }

    buildMachineHousing() {
      // Sleek brushed aluminum door bezel
      const rimGeo = new THREE.TorusGeometry(1.5, 0.12, 16, 64);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.2,
        metalness: 0.8
      });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      this.machineGroup.add(rim);

      // Tinted transparent front glass door
      const glassGeo = new THREE.CircleGeometry(1.42, 48);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xe0f2fe,
        roughness: 0.05,
        transmission: 0.9,
        ior: 1.45,
        transparent: true,
        opacity: 0.65,
        depthWrite: false
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.z = 0.06;
      this.machineGroup.add(glass);
    }

    buildDrum() {
      this.drumGroup = new THREE.Group();

      // Stainless steel perforated drum cylinder
      const drumGeo = new THREE.CylinderGeometry(1.35, 1.35, 1.8, 48, 1, true);
      drumGeo.rotateX(Math.PI / 2);
      const drumMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.25,
        metalness: 0.85,
        side: THREE.DoubleSide
      });
      const drum = new THREE.Mesh(drumGeo, drumMat);
      drum.position.z = -0.9;
      this.drumGroup.add(drum);

      // Internal drum paddles / lifters
      const paddleGeo = new THREE.BoxGeometry(0.12, 0.22, 1.6);
      const paddleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3 });
      for (let p = 0; p < 3; p++) {
        const rad = (p / 3) * Math.PI * 2;
        const paddle = new THREE.Mesh(paddleGeo, paddleMat);
        paddle.position.set(Math.sin(rad) * 1.25, Math.cos(rad) * 1.25, -0.9);
        paddle.rotation.z = -rad;
        this.drumGroup.add(paddle);
      }

      this.machineGroup.add(this.drumGroup);
    }

    buildWaterAndSuds() {
      // Rotating vortex liquid disk inside drum
      const waterGeo = new THREE.CircleGeometry(1.3, 32);
      this.waterMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.15,
        roughness: 0.1,
        transmission: 0.85,
        ior: 1.333,
        transparent: true,
        opacity: 0.6,
        depthWrite: false
      });
      this.waterMesh = new THREE.Mesh(waterGeo, this.waterMat);
      this.waterMesh.position.z = -0.4;
      this.machineGroup.add(this.waterMesh);

      // Micro-suds bubbles
      const bubbleCount = 40;
      const bGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const bMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.05,
        transmission: 0.95,
        transparent: true,
        opacity: 0.85
      });

      this.sudsGroup = new THREE.Group();
      this.sudsData = [];

      for (let i = 0; i < bubbleCount; i++) {
        const mesh = new THREE.Mesh(bGeo, bMat);
        const radius = Math.random() * 1.0;
        const angle = Math.random() * Math.PI * 2;
        const z = -0.8 + Math.random() * 0.7;

        mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, z);
        mesh.scale.setScalar(0.4 + Math.random() * 0.8);

        this.sudsGroup.add(mesh);
        this.sudsData.push({
          mesh: mesh,
          radius: radius,
          angle: angle,
          speed: 1.2 + Math.random() * 1.8
        });
      }

      this.machineGroup.add(this.sudsGroup);
    }

    buildTumblingClothes() {
      // 3D folded fabrics tumbling inside drum
      this.clothesGroup = new THREE.Group();
      const clothMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.4
      });

      for (let c = 0; c < 4; c++) {
        const geo = new THREE.TorusGeometry(0.28, 0.12, 12, 24);
        const mesh = new THREE.Mesh(geo, clothMat);
        mesh.position.set((Math.random() - 0.5) * 0.8, -0.4 + Math.random() * 0.8, -0.7 + c * 0.2);
        this.clothesGroup.add(mesh);
      }

      this.drumGroup.add(this.clothesGroup);
    }

    setCycle(state) {
      this.cycleState = state;
      if (state === 'dispense') {
        this.spinSpeed = 0.5;
        this.waterMat.color.setHex(0x0284c7);
        this.waterMat.opacity = 0.4;
      } else if (state === 'wash') {
        this.spinSpeed = 3.5;
        this.waterMat.color.setHex(0x38bdf8);
        this.waterMat.opacity = 0.75;
      } else if (state === 'rinse') {
        this.spinSpeed = 1.2;
        this.waterMat.color.setHex(0xe0f2fe);
        this.waterMat.opacity = 0.45;
      }

      // Update HUD status label
      const statusLabel = document.getElementById('machineCycleStatus');
      if (statusLabel) {
        if (state === 'dispense') statusLabel.textContent = 'STAGE 01: White Mist Active Wash Dispensed';
        else if (state === 'wash') statusLabel.textContent = 'STAGE 02: High-Speed Bio-Enzyme Vortex Spin';
        else if (state === 'rinse') statusLabel.textContent = 'STAGE 03: Fresh Rinse • Spotless Clothes Emerged';
      }
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

      // Drum rotation
      if (this.drumGroup) {
        this.drumGroup.rotation.z += delta * this.spinSpeed;
      }

      // Suds & water vortex spin
      if (this.sudsData) {
        this.sudsData.forEach((s) => {
          s.angle += delta * (this.spinSpeed * 1.2);
          s.mesh.position.x = Math.cos(s.angle) * s.radius;
          s.mesh.position.y = Math.sin(s.angle) * s.radius;
        });
      }

      this.renderer.render(this.scene, this.camera);
    }
  }

  window.WashingMachine3DEngine = WashingMachine3DEngine;

  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('machine3DCanvas');
    if (canvas) {
      window.washingMachineEngine = new WashingMachine3DEngine('machine3DCanvas');

      // Bind machine cycle buttons
      const cycleBtns = document.querySelectorAll('.machine-cycle-btn');
      cycleBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          cycleBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const cycle = btn.getAttribute('data-cycle');
          if (window.washingMachineEngine && cycle) {
            window.washingMachineEngine.setCycle(cycle);
          }
        });
      });
    }
  });

})();

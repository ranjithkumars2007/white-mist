/**
 * WHITE MIST — 3D REALISTIC LIQUID DETERGENT BUBBLES ENGINE
 * Ultra-realistic washing liquid bubbles with thin-film interference,
 * surface-tension wobble, buoyant drift, mouse repulsion, and click-to-pop physics.
 * Tuned specifically for a luminous, fresh luxury light/white aesthetic.
 */

(function () {
  'use strict';

  // Ensure canvas exists
  let canvas = document.getElementById('bubbleCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'bubbleCanvas';
    canvas.className = 'global-bubble-canvas';
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Mouse & Scroll tracking
  const mouse = {
    x: width / 2,
    y: height / 2,
    targetX: width / 2,
    targetY: height / 2,
    active: false
  };

  let scrollY = window.scrollY;
  let lastScrollY = scrollY;
  let scrollVelocity = 0;

  // Responsive bubble count
  const isMobile = width < 768;
  const BUBBLE_COUNT = isMobile ? 22 : 45;
  const SUDS_PARTICLE_COUNT = isMobile ? 25 : 55;

  const bubbles = [];
  const sudsParticles = [];
  const pops = [];

  // 3D Realistic Detergent Bubble Class
  class LiquidBubble3D {
    constructor(initAtRandomY = true) {
      this.reset(initAtRandomY);
    }

    reset(initAtRandomY = false) {
      // 3D Depth layer: 0.3 (background) to 1.8 (close foreground)
      const depthRand = Math.random();
      if (depthRand < 0.4) {
        this.z = 0.35 + Math.random() * 0.35; // far
      } else if (depthRand < 0.8) {
        this.z = 0.75 + Math.random() * 0.45; // mid
      } else {
        this.z = 1.25 + Math.random() * 0.55; // near
      }

      this.baseRadius = 16 + Math.random() * 32;
      this.radius = this.baseRadius * (0.65 + this.z * 0.6);

      this.x = Math.random() * width;
      this.y = initAtRandomY ? Math.random() * height : height + this.radius + Math.random() * 80;

      // Buoyancy upward speed (scaled by depth)
      this.baseVy = -(0.4 + Math.random() * 0.8) * (0.6 + this.z * 0.7);
      this.vy = this.baseVy;
      this.vx = (Math.random() - 0.5) * 0.35 * this.z;

      // Surface tension wobble parameters
      this.wobblePhase = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.02 + Math.random() * 0.03;
      this.wobbleIntensity = 0.05 + Math.random() * 0.05;

      // Iridescent hue shift
      this.hueShift = Math.random() * 360;
      this.opacity = Math.min(0.95, 0.45 + this.z * 0.35);
      this.isPopped = false;
    }

    update(delta) {
      this.wobblePhase += this.wobbleSpeed;
      this.hueShift += 0.3;

      // Buoyancy drift and scroll reaction
      this.y += this.vy + scrollVelocity * 0.35 * (this.z * 0.6);
      this.x += this.vx + Math.sin(this.wobblePhase) * 0.4;

      // Mouse repulsion physics
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      const repelDist = this.radius * 2.2;

      if (dist < repelDist && dist > 1) {
        const force = (1 - dist / repelDist) * 2.8 * this.z;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force;
      }

      // Recycle when off-screen
      if (this.y < -this.radius * 2) {
        this.reset(false);
      } else if (this.x < -this.radius * 2) {
        this.x = width + this.radius;
      } else if (this.x > width + this.radius * 2) {
        this.x = -this.radius;
      }
    }

    draw(ctx) {
      if (this.isPopped) return;

      ctx.save();
      const wobbleX = 1 + Math.sin(this.wobblePhase) * this.wobbleIntensity;
      const wobbleY = 1 - Math.sin(this.wobblePhase) * this.wobbleIntensity;
      const r = this.radius;

      ctx.translate(this.x, this.y);
      ctx.scale(wobbleX, wobbleY);

      // 1. Soap Sphere Translucent Body (Clean blue-lavender glass gradient for light background)
      const bodyGrad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.1, 0, 0, r);
      bodyGrad.addColorStop(0, `rgba(255, 255, 255, ${0.4 * this.opacity})`);
      bodyGrad.addColorStop(0.35, `rgba(235, 248, 255, ${0.2 * this.opacity})`);
      bodyGrad.addColorStop(0.7, `rgba(0, 166, 255, ${0.12 * this.opacity})`);
      bodyGrad.addColorStop(0.9, `rgba(147, 51, 234, ${0.18 * this.opacity})`);
      bodyGrad.addColorStop(1, `rgba(0, 153, 255, ${0.35 * this.opacity})`);

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // 2. Thin-Film Rainbow Iridescent Rim (Fresnel interference ring)
      ctx.lineWidth = Math.max(1.2, 2.4 * (this.z * 0.8));
      const rimGrad = ctx.createLinearGradient(-r, -r, r, r);
      rimGrad.addColorStop(0, `rgba(255, 255, 255, ${0.95 * this.opacity})`);
      rimGrad.addColorStop(0.2, `rgba(0, 180, 255, ${0.85 * this.opacity})`);
      rimGrad.addColorStop(0.45, `rgba(168, 85, 247, ${0.75 * this.opacity})`);
      rimGrad.addColorStop(0.7, `rgba(236, 72, 153, ${0.7 * this.opacity})`);
      rimGrad.addColorStop(0.9, `rgba(0, 210, 255, ${0.8 * this.opacity})`);
      rimGrad.addColorStop(1, `rgba(255, 255, 255, ${0.9 * this.opacity})`);

      ctx.strokeStyle = rimGrad;
      ctx.stroke();

      // 3. Primary Curved Specular Highlight (Reflection of window/light)
      ctx.save();
      ctx.rotate(-Math.PI / 4);
      ctx.beginPath();
      ctx.ellipse(-r * 0.35, -r * 0.45, r * 0.35, r * 0.14, Math.PI / 8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.88 * this.opacity})`;
      ctx.shadowColor = 'rgba(0, 166, 255, 0.4)';
      ctx.shadowBlur = 6;
      ctx.fill();

      // Secondary pinpoint specular dot
      ctx.beginPath();
      ctx.arc(-r * 0.55, -r * 0.15, r * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * this.opacity})`;
      ctx.fill();
      ctx.restore();

      // 4. Secondary Bottom Rim Reflection (Soft blue counter-reflection)
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.88, Math.PI * 0.18, Math.PI * 0.48);
      ctx.lineWidth = Math.max(1, 2.5 * this.z);
      ctx.strokeStyle = `rgba(0, 166, 255, ${0.45 * this.opacity})`;
      ctx.stroke();

      ctx.restore();
    }

    pop() {
      if (this.isPopped) return;
      this.isPopped = true;
      pops.push(new BubblePop(this.x, this.y, this.radius, this.z));
      setTimeout(() => this.reset(false), 260);
    }
  }

  // Bubble Pop & Liquid Droplet Burst Physics
  class BubblePop {
    constructor(x, y, radius, z) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.z = z;
      this.currentRadius = radius;
      this.maxRadius = radius * 1.6;
      this.alpha = 0.95;
      this.droplets = [];

      const count = Math.floor(8 + Math.random() * 8);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.4;
        const speed = 2 + Math.random() * 3.5 * z;
        this.droplets.push({
          x: this.x,
          y: this.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          size: 1.8 + Math.random() * 2.2 * z,
          alpha: 1
        });
      }
    }

    update() {
      this.currentRadius += (this.maxRadius - this.currentRadius) * 0.22;
      this.alpha *= 0.82;

      for (const d of this.droplets) {
        d.x += d.vx;
        d.y += d.vy;
        d.vy += 0.14; // gravity pull
        d.alpha *= 0.9;
      }
    }

    draw(ctx) {
      if (this.alpha > 0.05) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 166, 255, ${this.alpha * 0.85})`;
        ctx.lineWidth = 2 * this.z;
        ctx.stroke();
      }

      for (const d of this.droplets) {
        if (d.alpha > 0.05) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 166, 255, ${d.alpha * 0.85})`;
          ctx.fill();
        }
      }
    }

    get isDead() {
      return this.alpha <= 0.05 && this.droplets.every((d) => d.alpha <= 0.05);
    }
  }

  // Micro Foam/Suds Particle
  class SudsParticle {
    constructor() {
      this.reset(true);
    }

    reset(initRandom = false) {
      this.x = Math.random() * width;
      this.y = initRandom ? Math.random() * height : height + 10;
      this.size = 1.2 + Math.random() * 2.8;
      this.vy = -(0.25 + Math.random() * 0.5);
      this.vx = (Math.random() - 0.5) * 0.25;
      this.alpha = 0.25 + Math.random() * 0.45;
      this.color = Math.random() > 0.5 ? 'rgba(0, 166, 255, ' : 'rgba(168, 85, 247, ';
    }

    update() {
      this.y += this.vy + scrollVelocity * 0.2;
      this.x += this.vx;

      if (this.y < -10) this.reset(false);
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  // Initialize Entities
  for (let i = 0; i < BUBBLE_COUNT; i++) bubbles.push(new LiquidBubble3D(true));
  for (let i = 0; i < SUDS_PARTICLE_COUNT; i++) sudsParticles.push(new SudsParticle());

  // Interactive Click to Burst Bubbles
  window.addEventListener('click', (e) => {
    const clickX = e.clientX;
    const clickY = e.clientY;
    for (const b of bubbles) {
      if (b.isPopped) continue;
      const d = Math.hypot(b.x - clickX, b.y - clickY);
      if (d <= b.radius * 1.35) {
        b.pop();
        break;
      }
    }
  });

  // Track Mouse Movement smoothly
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.active = true;
  });

  // Scroll Tracking
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    scrollVelocity = (scrollY - lastScrollY) * 0.2;
    lastScrollY = scrollY;
  }, { passive: true });

  // Window Resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Animation Loop
  let lastTime = performance.now();
  function animate(now) {
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;
    scrollVelocity *= 0.92;

    ctx.clearRect(0, 0, width, height);

    for (const p of sudsParticles) {
      p.update();
      p.draw(ctx);
    }

    bubbles.sort((a, b) => a.z - b.z);

    for (const b of bubbles) {
      b.update(delta);
      b.draw(ctx);
    }

    for (let i = pops.length - 1; i >= 0; i--) {
      const p = pops[i];
      p.update();
      p.draw(ctx);
      if (p.isDead) pops.splice(i, 1);
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();

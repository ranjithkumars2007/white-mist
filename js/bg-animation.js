/**
 * WHITE MIST - AMBIENT FLUID & LIQUID WAVE BACKGROUND ENGINE
 * Creates an interactive, organic fresh aqua water atmosphere:
 * - Undulating multi-layer sinusoidal fluid wave ribbons
 * - Drifting luminous bio-enzyme particles & micro-droplets
 * - Cursor water ripple ripples on mousemove / click
 * - Optimized 60fps canvas animation with automatic pause when scrolled out of view
 */

(function () {
  'use strict';

  function initHeroBgAnimation() {
    const canvas = document.getElementById('heroBgCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
      const parent = canvas.parentElement;
      width = canvas.width = parent ? parent.clientWidth : window.innerWidth;
      height = canvas.height = parent ? parent.clientHeight : 700;
    }
    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking for interactive water distortion & ripples
    const mouse = {
      x: width * 0.4,
      y: height * 0.5,
      targetX: width * 0.4,
      targetY: height * 0.5,
      speed: 0
    };

    let lastMouseX = mouse.x;
    let lastMouseY = mouse.y;

    const ripples = [];
    const particles = [];

    // Initialize 35 ambient floating enzyme & water sparkle particles
    const PARTICLE_COUNT = window.innerWidth < 768 ? 20 : 38;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1.5 + Math.random() * 3.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.25 + Math.random() * 0.6), // upward buoyancy
        alpha: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.015 + Math.random() * 0.025,
        isBubble: Math.random() > 0.45
      });
    }

    // Add ripple on mousemove if moved sufficiently
    let lastRippleTime = 0;
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;

        const now = performance.now();
        const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
        if (dist > 35 && now - lastRippleTime > 120 && ripples.length < 15) {
          ripples.push({
            x: mouse.targetX,
            y: mouse.targetY,
            radius: 4,
            maxRadius: 65 + Math.random() * 45,
            alpha: 0.45,
            speed: 1.8 + Math.random() * 1.2
          });
          lastRippleTime = now;
          lastMouseX = e.clientX;
          lastMouseY = e.clientY;
        }
      }
    }, { passive: true });

    // Click creates a stronger ripple
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 6,
        maxRadius: 110,
        alpha: 0.65,
        speed: 2.4
      });
    });

    let time = 0;
    let isVisible = true;

    // Pause when scrolled past hero
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => { isVisible = entry.isIntersecting; });
      }, { threshold: 0.05 });
      obs.observe(canvas);
    }

    // Wave parameters (3 layered sinusoidal ribbons)
    const waves = [
      {
        color: 'rgba(224, 242, 254, 0.42)', // very soft aqua
        amplitude: 45,
        frequency: 0.0035,
        speed: 0.012,
        yOffset: 0.65
      },
      {
        color: 'rgba(186, 230, 253, 0.32)', // clean cyan wash
        amplitude: 60,
        frequency: 0.0028,
        speed: 0.008,
        yOffset: 0.75
      },
      {
        color: 'rgba(147, 197, 253, 0.22)', // light soft blue
        amplitude: 35,
        frequency: 0.0042,
        speed: 0.016,
        yOffset: 0.85
      }
    ];

    function drawWave(wave) {
      ctx.beginPath();
      ctx.fillStyle = wave.color;

      const baseY = height * wave.yOffset;
      ctx.moveTo(0, height);
      ctx.lineTo(0, baseY);

      for (let x = 0; x <= width; x += 12) {
        // Organic multi-sine undulation
        const sin1 = Math.sin(x * wave.frequency + time * wave.speed);
        const sin2 = Math.cos(x * wave.frequency * 1.7 - time * wave.speed * 0.8) * 0.4;
        
        // Mouse proximity lift
        const mouseDist = Math.abs(x - mouse.x);
        const mouseLift = Math.exp(-mouseDist * 0.006) * 16 * Math.sin(time * 0.03);

        const y = baseY + (sin1 + sin2) * wave.amplitude + mouseLift;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
    }

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      time += 1;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Soft radial background gradients (warm sunlight + cool aqua ambient)
      const grad1 = ctx.createRadialGradient(
        width * 0.22, height * 0.35, 10,
        width * 0.22, height * 0.35, width * 0.45
      );
      grad1.addColorStop(0, 'rgba(224, 247, 255, 0.65)');
      grad1.addColorStop(0.5, 'rgba(238, 248, 255, 0.35)');
      grad1.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.78, height * 0.45, 20,
        width * 0.78, height * 0.45, width * 0.4
      );
      grad2.addColorStop(0, 'rgba(186, 230, 253, 0.45)');
      grad2.addColorStop(0.6, 'rgba(224, 242, 254, 0.2)');
      grad2.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Render 3 Fluid Wave Ribbons
      for (let i = 0; i < waves.length; i++) {
        drawWave(waves[i]);
      }

      // 3. Render Interactive Liquid Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha -= 0.012;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${r.alpha})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Secondary concentric inner ring
        if (r.radius > 14) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.65, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(186, 230, 253, ${r.alpha * 0.6})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 4. Render Floating Ambient Micro-Bubbles & Active Enzyme Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.phase += p.wobbleSpeed;
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.phase) * 0.4;

        // Wrap around
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;

        if (p.isBubble) {
          // Micro iridescent detergent bubble
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 0.8;
          ctx.fillStyle = 'rgba(186, 230, 253, 0.35)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Highlight
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.28, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Luminous active enzyme speck
          ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroBgAnimation);
  } else {
    initHeroBgAnimation();
  }
})();

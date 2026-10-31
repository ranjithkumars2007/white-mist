/**
 * WHITE MIST — Hero Ambient Canvas & 3D Interactive Droplets
 * Creates translucent floating liquid droplets, atmospheric illumination, and pointer parallax.
 */

(function () {
  const canvas = document.getElementById('heroAmbientCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let droplets = [];
  const DROPLET_COUNT = 24;

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    initDroplets();
  }

  function initDroplets() {
    droplets = [];
    for (let i = 0; i < DROPLET_COUNT; i++) {
      droplets.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 9 + 4,
        speedY: (Math.random() * 0.4 + 0.15) * -1, // gentle upward drift
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.45 + 0.2,
        glowColor: Math.random() > 0.4 ? 'rgba(0, 153, 255, ' : 'rgba(124, 58, 237, ',
        parallaxFactor: Math.random() * 0.04 + 0.01
      });
    }
  }

  function drawDroplet(d) {
    const px = d.x + (mouseX - width / 2) * d.parallaxFactor;
    const py = d.y + (mouseY - height / 2) * d.parallaxFactor;

    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, d.radius, 0, Math.PI * 2);

    // Droplet radial gradient with highlight reflection
    const grad = ctx.createRadialGradient(
      px - d.radius * 0.35, py - d.radius * 0.35, d.radius * 0.1,
      px, py, d.radius
    );
    grad.addColorStop(0, `rgba(255, 255, 255, ${d.opacity * 1.5})`);
    grad.addColorStop(0.3, d.glowColor + (d.opacity * 0.8) + ')');
    grad.addColorStop(0.8, d.glowColor + (d.opacity * 0.3) + ')');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');

    ctx.fillStyle = grad;
    ctx.shadowColor = d.glowColor + '0.4)';
    ctx.shadowBlur = 12;
    ctx.fill();

    // Specular highlight dot
    ctx.beginPath();
    ctx.arc(px - d.radius * 0.35, py - d.radius * 0.35, d.radius * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.shadowBlur = 4;
    ctx.fill();

    ctx.restore();
  }

  function update() {
    ctx.clearRect(0, 0, width, height);

    // Smooth pointer interpolation
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    // Subtle background illumination glow at cursor
    const bgGlow = ctx.createRadialGradient(
      mouseX, mouseY, 10,
      mouseX, mouseY, 350
    );
    bgGlow.addColorStop(0, 'rgba(0, 153, 255, 0.08)');
    bgGlow.addColorStop(0.5, 'rgba(76, 29, 149, 0.05)');
    bgGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = bgGlow;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < droplets.length; i++) {
      const d = droplets[i];
      d.y += d.speedY;
      d.x += d.speedX;

      if (d.y + d.radius < 0) {
        d.y = height + d.radius;
        d.x = Math.random() * width;
      }
      if (d.x < -d.radius) d.x = width + d.radius;
      if (d.x > width + d.radius) d.x = -d.radius;

      drawDroplet(d);
    }

    requestAnimationFrame(update);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;

    // Parallax on hero main bottle if present
    const bottle = document.getElementById('heroBottle');
    if (bottle) {
      const offsetX = (e.clientX - window.innerWidth / 2) * 0.015;
      const offsetY = (e.clientY - window.innerHeight / 2) * 0.015;
      bottle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
  });

  resize();
  update();
})();

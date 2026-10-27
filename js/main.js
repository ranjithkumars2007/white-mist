/**
 * WHITE MIST - MAIN APPLICATION CONTROLLER
 * Premium FMCG E-Commerce 3D Interactive Layer:
 * 1. Hero 3D Product Interactive Presentation (Load Rise, 5deg Rotate, Settle, Sheen Sweep, Floating Motion)
 * 2. Liquid Droplet Lifecycle & Bottom Ripple
 * 3. Hero Depth-of-Field 3D Bubbles Interactive Parallax
 * 4. Product Cards Subtle 3D Hover & Image Forward Push
 * 5. Interactive Stain Removal 3D Micro-Particles & Bubbles
 * 6. Mobile Drawer Navigation & Bottom App Bar State Sync
 * 7. Product Variant Selector & Stepper
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // =========================================================================
    // 1. HERO 3D PRODUCT INTERACTIVE PRESENTATION (Point 1, 2 & 3)
    // =========================================================================
    const heroStage = document.getElementById('heroProductStage');
    const heroPouch = document.getElementById('heroPouchTilt');
    const heroShadow = document.getElementById('heroContactShadow');
    const pouchSheen = document.getElementById('pouchLightSheen');
    const heroDrop = document.getElementById('heroLiquidDrop');
    const heroRipple = document.getElementById('heroDropRipple');
    const heroBubbles = document.querySelectorAll('.hero-3d-bubble');

    if (heroStage && heroPouch) {
      // 1. Initial Page Load Choreography:
      // - Product softly rises into position
      // - Rotates 4-6 degrees
      // - Gently settles
      // - Realistic light reflection moves across package
      if (!prefersReducedMotion) {
        heroPouch.classList.add('hero-loading-anim');

        // Trigger sheen sweep right after settling
        setTimeout(() => {
          if (pouchSheen) {
            pouchSheen.classList.add('sweep');
            setTimeout(() => { pouchSheen.classList.remove('sweep'); }, 1800);
          }
        }, 1100);

        // Also trigger sheen on desktop hover
        heroPouch.addEventListener('mouseenter', () => {
          if (pouchSheen && !pouchSheen.classList.contains('sweep')) {
            pouchSheen.classList.add('sweep');
            setTimeout(() => { pouchSheen.classList.remove('sweep'); }, 1800);
          }
        });
      }

      // 2. Desktop Mouse Parallax & Mobile Touch Tilt
      let targetRotX = 0;
      let targetRotY = 0;
      let targetTransZ = 0;
      let curRotX = 0;
      let curRotY = 0;
      let curTransZ = 0;

      heroStage.addEventListener('mousemove', (e) => {
        const rect = heroStage.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const normX = (e.clientX - centerX) / (rect.width / 2);
        const normY = (e.clientY - centerY) / (rect.height / 2);

        // Subtle tilt: max 6 degrees left/right, 4 degrees up/down
        targetRotY = normX * 6.0;
        targetRotX = -normY * 4.5;
        targetTransZ = Math.hypot(normX, normY) * 12;

        // Subtle parallax offset on the 7 bubbles based on depth
        heroBubbles.forEach((bubble) => {
          let factor = 12;
          if (bubble.classList.contains('bubble-dof-fore')) factor = 24;
          else if (bubble.classList.contains('bubble-dof-back')) factor = 6;
          bubble.style.transform = `translate(${normX * factor}px, ${normY * factor}px)`;
        });
      });

      heroStage.addEventListener('mouseleave', () => {
        targetRotX = 0;
        targetRotY = 0;
        targetTransZ = 0;
        heroBubbles.forEach((b) => { b.style.transform = ''; });
      });

      // Mobile Touch Move
      heroStage.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
          const rect = heroStage.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const normX = (e.touches[0].clientX - centerX) / (rect.width / 2);
          const normY = (e.touches[0].clientY - centerY) / (rect.height / 2);

          targetRotY = normX * 5.0;
          targetRotX = -normY * 3.5;
        }
      }, { passive: true });

      heroStage.addEventListener('touchend', () => {
        targetRotX = 0;
        targetRotY = 0;
      });

      // Smooth render loop with subtle breathing float
      function updateHeroTilt() {
        curRotX += (targetRotX - curRotX) * 0.08;
        curRotY += (targetRotY - curRotY) * 0.08;
        curTransZ += (targetTransZ - curTransZ) * 0.08;

        const time = performance.now() * 0.0013;
        const floatY = prefersReducedMotion ? 0 : Math.sin(time) * 5.5;

        heroPouch.style.transform = `
          perspective(1000px)
          translateY(${floatY}px)
          translateZ(${curTransZ}px)
          rotateX(${curRotX}deg)
          rotateY(${curRotY}deg)
        `;

        if (heroShadow) {
          const shadowScale = 1 - floatY * 0.014;
          const shadowOffsetX = curRotY * 1.8;
          const shadowOffsetY = -curRotX * 1.2;
          heroShadow.style.transform = `scale(${shadowScale}) translate(${shadowOffsetX}px, ${shadowOffsetY}px)`;
        }

        requestAnimationFrame(updateHeroTilt);
      }

      requestAnimationFrame(updateHeroTilt);

      // 3. Realistic Detergent Liquid Droplet Cycle (Point 2)
      // Forms at cap -> stretches -> falls -> hits contact level -> tiny ripple
      function runLiquidDropCycle() {
        if (!heroDrop || !heroRipple || prefersReducedMotion) return;

        // Reset
        heroDrop.classList.remove('falling');
        heroRipple.classList.remove('ripple-active');

        // Trigger drop formation & fall
        requestAnimationFrame(() => {
          heroDrop.classList.add('falling');

          // Impact ripple triggers as droplet hits bottom (at ~1.35s of fall)
          setTimeout(() => {
            heroRipple.classList.add('ripple-active');
          }, 1320);

          // Clear after cycle finishes
          setTimeout(() => {
            heroDrop.classList.remove('falling');
            heroRipple.classList.remove('ripple-active');
          }, 2100);
        });
      }

      // Initial drop after page load settle
      setTimeout(runLiquidDropCycle, 2400);

      // Recurring drop every 5.2 seconds
      setInterval(runLiquidDropCycle, 5200);
    }

    // =========================================================================
    // 2. PRODUCT CARDS 3D TILT & FLOAT EFFECT (Required 3D Effect 3)
    // =========================================================================
    const productCards = document.querySelectorAll('.clean-product-card');

    productCards.forEach((card) => {
      let isHovered = false;

      card.addEventListener('mouseenter', () => {
        isHovered = true;
      });

      card.addEventListener('mousemove', (e) => {
        if (prefersReducedMotion || !isHovered) return;
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const normX = (e.clientX - centerX) / (rect.width / 2);
        const normY = (e.clientY - centerY) / (rect.height / 2);

        // 3D tilt with smooth perspective and -12px lift
        const cardRotY = normX * 6.0;
        const cardRotX = -normY * 6.0;

        card.style.transform = `
          perspective(1000px)
          translateY(-12px)
          translateZ(14px)
          rotateX(${cardRotX}deg)
          rotateY(${cardRotY}deg)
        `;

        const shadowX = -normX * 10;
        const shadowY = 24 - normY * 8;
        card.style.boxShadow = `
          ${shadowX}px ${shadowY}px 48px -10px rgba(15, 23, 42, 0.12),
          0 10px 24px -4px rgba(2, 132, 199, 0.18)
        `;
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });

    // =========================================================================
    // 3. STAIN TEST 3D MICRO-INTERACTION (Point 11)
    // =========================================================================
    const stainBox = document.getElementById('stainCompareBox');
    const afterClip = document.getElementById('sliderAfterClip');
    const dividerBar = document.getElementById('sliderDividerBar');
    const stainCanvas = document.getElementById('stainParticlesCanvas');

    if (stainBox && afterClip && dividerBar && stainCanvas) {
      const sCtx = stainCanvas.getContext('2d');
      let particles = [];
      let isDraggingStain = false;
      let currentSplitPct = 50;

      function resizeStainCanvas() {
        stainCanvas.width = stainBox.clientWidth;
        stainCanvas.height = stainBox.clientHeight;
      }
      resizeStainCanvas();
      window.addEventListener('resize', resizeStainCanvas);

      // Spawn micro-bubbles and clean particles along the active slider divider
      function emitStainParticles(dividerX, count = 3) {
        if (prefersReducedMotion) return;
        const h = stainCanvas.height;

        for (let i = 0; i < count; i++) {
          particles.push({
            x: dividerX + (Math.random() - 0.5) * 18,
            y: Math.random() * h,
            radius: 2 + Math.random() * 4.5,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -(0.8 + Math.random() * 1.6),
            life: 1.0,
            decay: 0.025 + Math.random() * 0.035,
            isBubble: Math.random() > 0.4
          });
        }
      }

      function updateStainParticles() {
        sCtx.clearRect(0, 0, stainCanvas.width, stainCanvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          sCtx.save();
          sCtx.globalAlpha = p.life;

          if (p.isBubble) {
            // Iridescent micro-bubble
            sCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            sCtx.lineWidth = 1;
            sCtx.fillStyle = 'rgba(186, 230, 253, 0.45)';
            sCtx.beginPath();
            sCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.stroke();

            // Tiny specular glint
            sCtx.fillStyle = '#ffffff';
            sCtx.beginPath();
            sCtx.arc(p.x - p.radius * 0.35, p.y - p.radius * 0.35, p.radius * 0.3, 0, Math.PI * 2);
            sCtx.fill();
          } else {
            // Detergent active spark
            sCtx.fillStyle = 'rgba(56, 189, 248, 0.85)';
            sCtx.beginPath();
            sCtx.arc(p.x, p.y, p.radius * 0.7, 0, Math.PI * 2);
            sCtx.fill();
          }

          sCtx.restore();
        }

        requestAnimationFrame(updateStainParticles);
      }

      requestAnimationFrame(updateStainParticles);

      function updateStainSlider(clientX) {
        const rect = stainBox.getBoundingClientRect();
        let posX = clientX - rect.left;
        posX = Math.max(0, Math.min(rect.width, posX));
        currentSplitPct = (posX / rect.width) * 100;

        afterClip.style.width = `${currentSplitPct}%`;
        dividerBar.style.left = `${currentSplitPct}%`;

        emitStainParticles(posX, 4);
      }

      stainBox.addEventListener('mousedown', (e) => {
        isDraggingStain = true;
        updateStainSlider(e.clientX);
      });

      window.addEventListener('mouseup', () => {
        isDraggingStain = false;
      });

      window.addEventListener('mousemove', (e) => {
        if (isDraggingStain) {
          updateStainSlider(e.clientX);
        }
      });

      // Mobile Touch Support
      stainBox.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          isDraggingStain = true;
          updateStainSlider(e.touches[0].clientX);
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        isDraggingStain = false;
      });

      window.addEventListener('touchmove', (e) => {
        if (isDraggingStain && e.touches.length === 1) {
          updateStainSlider(e.touches[0].clientX);
        }
      }, { passive: true });
    }

    // =========================================================================
    // 4. MOBILE NAVIGATION DRAWER & BOTTOM APP BAR
    // =========================================================================
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    const mobileMenuOpenBtn = document.getElementById('mobileMenuOpenBtn');
    const mobileMenuCloseBtn = document.getElementById('mobileMenuCloseBtn');
    const drawerLinks = document.querySelectorAll('.mobile-drawer-link');

    if (mobileMenuOpenBtn && mobileDrawer) {
      mobileMenuOpenBtn.addEventListener('click', () => {
        mobileDrawer.classList.add('open');
      });
    }

    if (mobileMenuCloseBtn && mobileDrawer) {
      mobileMenuCloseBtn.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    }

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileDrawer) mobileDrawer.classList.remove('open');
      });
    });

    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    bottomNavItems.forEach(item => {
      item.addEventListener('click', function () {
        bottomNavItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
      });
    });

    // Mobile Sticky Purchase Bar Visibility
    const stickyPurchaseBar = document.getElementById('mobileStickyPurchaseBar');
    const heroSection = document.getElementById('hero');

    window.addEventListener('scroll', () => {
      if (!stickyPurchaseBar || !heroSection) return;
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      if (heroBottom < 100 && window.innerWidth < 1024) {
        stickyPurchaseBar.classList.add('visible');
      } else {
        stickyPurchaseBar.classList.remove('visible');
      }
    }, { passive: true });

    // Sticky Bar Actions
    const stickyBarAddBtn = document.getElementById('stickyBarAddBtn');
    const stickyBarBuyBtn = document.getElementById('stickyBarBuyBtn');

    if (stickyBarAddBtn) {
      stickyBarAddBtn.addEventListener('click', () => {
        if (window.WhiteMistCart) {
          const heroImg = document.getElementById('heroProductImg');
          window.WhiteMistCart.addItem('wm-pouch-1000', 1, heroImg);
        }
      });
    }

    if (stickyBarBuyBtn) {
      stickyBarBuyBtn.addEventListener('click', () => {
        if (window.WhiteMistCart) {
          window.WhiteMistCart.addItem('wm-pouch-1000', 1);
          window.WhiteMistCart.openCart();
        }
      });
    }

    // =========================================================================
    // 5. PRODUCT DETAIL & VARIANT SELECTOR
    // =========================================================================
    const variantButtons = document.querySelectorAll('.variant-btn');
    const detailImg = document.getElementById('detailProductImage');
    const detailPrice = document.getElementById('detailCurrentPrice');
    const detailMrp = document.getElementById('detailCurrentMrp');
    const detailDiscount = document.getElementById('detailCurrentDiscount');

    const qtyMinusBtn = document.getElementById('qtyMinusBtn');
    const qtyPlusBtn = document.getElementById('qtyPlusBtn');
    const qtyDisplay = document.getElementById('detailQtyDisplay');
    const detailAddToCartBtn = document.getElementById('detailAddToCartBtn');
    const detailBuyNowBtn = document.getElementById('detailBuyNowBtn');

    let currentVariant = {
      id: 'wm-pouch-1000',
      price: 249,
      mrp: 299,
      img: 'public/images/pouch_blue.png',
      name: 'White Mist Active Wash 1000ml Refill'
    };
    let currentQty = 1;

    variantButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        variantButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const variant = this.getAttribute('data-variant');
        const price = parseInt(this.getAttribute('data-price'), 10);
        const mrp = parseInt(this.getAttribute('data-mrp'), 10);
        const img = this.getAttribute('data-img');
        const name = this.getAttribute('data-name');

        let id = 'wm-pouch-1000';
        if (variant === '2L') id = 'wm-bottle-2000';
        else if (variant === 'Family') id = 'wm-family-3000';

        currentVariant = { id, price, mrp, img, name };

        if (detailPrice) detailPrice.textContent = `₹${price}`;
        if (detailMrp) detailMrp.textContent = `MRP ₹${mrp}`;
        if (detailDiscount) {
          const discountPct = Math.round(((mrp - price) / mrp) * 100);
          detailDiscount.textContent = `${discountPct}% OFF`;
        }

        if (detailImg) {
          detailImg.style.opacity = '0.35';
          detailImg.src = img;
          setTimeout(() => { detailImg.style.opacity = '1'; }, 180);
        }
      });
    });

    if (qtyMinusBtn && qtyDisplay) {
      qtyMinusBtn.addEventListener('click', () => {
        if (currentQty > 1) {
          currentQty--;
          qtyDisplay.textContent = currentQty;
        }
      });
    }

    if (qtyPlusBtn && qtyDisplay) {
      qtyPlusBtn.addEventListener('click', () => {
        if (currentQty < 20) {
          currentQty++;
          qtyDisplay.textContent = currentQty;
        }
      });
    }

    if (detailAddToCartBtn) {
      detailAddToCartBtn.addEventListener('click', () => {
        if (window.addToCart) {
          window.addToCart(currentVariant.id, currentQty, detailAddToCartBtn);
        }
      });
    }

    if (detailBuyNowBtn) {
      detailBuyNowBtn.addEventListener('click', () => {
        if (window.addToCart && window.openCheckout) {
          window.addToCart(currentVariant.id, currentQty);
          window.openCheckout();
        }
      });
    }

    // =========================================================================
    // 6. SMOOTH IN-PAGE NAVIGATION & ACTIVE LINK HIGHLIGHTS
    // =========================================================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
      let currentSection = '';
      const scrollPos = window.scrollY + 140;

      sections.forEach(sec => {
        if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
          currentSection = sec.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });

    // =========================================================================
    // 7. 3D BOTTLE STUDIO INITIALIZATION & CONTROLS
    // =========================================================================
    const studioCanvas = document.getElementById('studioBottleCanvas');
    if (studioCanvas && typeof window.LuxuryBottleEngine !== 'undefined') {
      window.studioBottle3D = new window.LuxuryBottleEngine({
        canvas: studioCanvas,
        isStudioMode: true,
        initialScent: 'alpine'
      });

      const studioSloshBtn = document.getElementById('studioSloshBtn');
      if (studioSloshBtn) {
        studioSloshBtn.addEventListener('click', () => {
          if (window.studioBottle3D) {
            window.studioBottle3D.triggerSlosh(0.9);
          }
        });
      }

      const studioResetBtn = document.getElementById('studioResetCamBtn');
      if (studioResetBtn) {
        studioResetBtn.addEventListener('click', () => {
          if (window.studioBottle3D) {
            window.studioBottle3D.targetRotation.x = 0.05;
            window.studioBottle3D.targetRotation.y = -0.2;
            window.studioBottle3D.triggerSlosh(0.4);
          }
        });
      }

      const studioScentBtns = document.querySelectorAll('.studio-scent-btn');
      const studioTitle = document.getElementById('studioProductTitle');
      const studioNote = document.getElementById('studioFragranceNote');

      const SCENT_NOTES = {
        alpine: { title: 'WHITE MIST ACTIVE WASH', note: 'Alpine Dew • Crisp Glacial Air & Pure Lotus' },
        cashmere: { title: 'WHITE MIST CASHMERE CARE', note: 'Cashmere Mist • White Peony & Silk Shield' },
        linen: { title: 'WHITE MIST BRIGHT LINEN', note: 'Crisp Linen • Sea Breeze & Sunlit Cotton' },
        citrus: { title: 'WHITE MIST SOLAR CITRUS', note: 'Solar Bergamot • Sun-Drenched Neroli Extracts' }
      };

      studioScentBtns.forEach(btn => {
        btn.addEventListener('click', function () {
          studioScentBtns.forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          const scent = this.getAttribute('data-scent');
          if (window.studioBottle3D && scent) {
            window.studioBottle3D.setScent(scent);
          }
          if (SCENT_NOTES[scent]) {
            if (studioTitle) studioTitle.textContent = SCENT_NOTES[scent].title;
            if (studioNote) studioNote.textContent = SCENT_NOTES[scent].note;
          }
        });
      });
    }

    // Quick 3D View triggers on product cards
    document.querySelectorAll('.card-quick-3d-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const scent = this.getAttribute('data-scent') || 'alpine';
        const studioSec = document.getElementById('studio');
        if (studioSec) {
          studioSec.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            const scentBtn = document.querySelector(`.studio-scent-btn[data-scent="${scent}"]`);
            if (scentBtn) scentBtn.click();
            if (window.studioBottle3D) window.studioBottle3D.triggerSlosh(0.7);
          }, 600);
        }
      });
    });

    // =========================================================================
    // 8. HERO 3D MODEL SWITCHER (CLEANPRO SHIRT VS WHITE-MIST BOTTLE)
    // =========================================================================
    const toggleShirt = document.getElementById('heroToggleShirt');
    const toggleBottle = document.getElementById('heroToggleBottle');
    const shirtCanvas = document.getElementById('heroShirtCanvas');
    const bottleCanvas = document.getElementById('heroBottleCanvas');
    const upperHeadline = document.getElementById('heroUpperHeadline');
    const hintPill = document.getElementById('heroInteractionHint');
    const heroScentSelector = document.getElementById('heroScentSelector');

    if (toggleShirt && toggleBottle && shirtCanvas && bottleCanvas) {
      toggleShirt.addEventListener('click', () => {
        toggleShirt.classList.add('active');
        toggleBottle.classList.remove('active');
        shirtCanvas.style.display = 'block';
        bottleCanvas.style.display = 'none';

        if (upperHeadline) {
          upperHeadline.innerHTML = 'Effortless to keep your <span>wardrobe flawless.</span>';
        }
        if (hintPill) {
          hintPill.innerHTML = '<span>✦</span> 360° Drag to Float • Click to Ripple Fabric';
        }
        if (heroScentSelector) {
          heroScentSelector.style.display = 'none';
        }
        window.dispatchEvent(new Event('resize'));
      });

      toggleBottle.addEventListener('click', () => {
        toggleBottle.classList.add('active');
        toggleShirt.classList.remove('active');
        bottleCanvas.style.display = 'block';
        shirtCanvas.style.display = 'none';

        if (upperHeadline) {
          upperHeadline.innerHTML = 'Effortless purity for <span>every wash.</span>';
        }
        if (hintPill) {
          hintPill.innerHTML = '<span>✦</span> 360° Drag to Rotate • Double-Click to Slosh Liquid';
        }
        if (heroScentSelector) {
          heroScentSelector.style.display = 'flex';
        }
        window.dispatchEvent(new Event('resize'));
      });
    }

  });

})();

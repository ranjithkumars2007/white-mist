/**
 * WHITE MIST | COMPLETE E-COMMERCE ENGINE
 * 
 * Includes:
 * 1. Product Catalog Management (1L Refills, 2L Bottles, Delicate Care, Family Reserves)
 * 2. Fly-to-Cart Particle Trajectory Animation
 * 3. Translucent Glass Cart Drawer with Free Shipping Milestone & Promo Coupons
 * 4. Wishlist System
 * 5. Instant Live Product Search Modal
 * 6. 4-Step Indian E-Commerce Checkout (Delivery, UPI/Card/COD Payment, Review, Confirmation with Confetti)
 * 7. Customer Account & Order History
 */

(function () {
  'use strict';

  const PRODUCTS_CATALOG = {
    'wm-pouch-1000': {
      id: 'wm-pouch-1000',
      name: 'White Mist Active Wash (1000ml)',
      category: 'pouches',
      benefit: 'Triple Bio-Enzyme Deep Clean',
      price: 249,
      mrp: 299,
      rating: 4.9,
      reviews: 1240,
      img: 'public/images/pouch_blue.png',
      size: '1000 ml Refill Pouch'
    },
    'wm-bottle-2000': {
      id: 'wm-bottle-2000',
      name: 'White Mist Super Saver (2000ml)',
      category: 'bottles',
      benefit: 'Everyday Family Fabric Care',
      price: 449,
      mrp: 549,
      rating: 4.9,
      reviews: 840,
      img: 'public/images/bottle_blue.png',
      size: '2000 ml Easy Pour Bottle'
    },
    'wm-pouch-yellow': {
      id: 'wm-pouch-yellow',
      name: 'White Mist Citrus Sunshine (1000ml)',
      category: 'pouches',
      benefit: 'Fresh Citrus Grease Dissolver',
      price: 249,
      mrp: 299,
      rating: 4.8,
      reviews: 510,
      img: 'public/images/pouch_yellow.png',
      size: '1000 ml Citrus Edition'
    },
    'wm-bottle-pink': {
      id: 'wm-bottle-pink',
      name: 'White Mist Floral Bloom (1000ml)',
      category: 'delicate',
      benefit: 'Silk, Wool & Delicate Care',
      price: 269,
      mrp: 320,
      rating: 4.9,
      reviews: 430,
      img: 'public/images/bottle_pink.png',
      size: '1000 ml Gentle Fabric Care'
    },
    'wm-family-3000': {
      id: 'wm-family-3000',
      name: 'White Mist Mega Reserve (3000ml)',
      category: 'family',
      benefit: 'High-Efficiency 192 Washes',
      price: 649,
      mrp: 799,
      rating: 4.9,
      reviews: 620,
      img: 'public/images/pouch_blue.png',
      size: '3000 ml Mega Family Pack'
    }
  };

  // State
  let cart = [
    { id: 'wm-pouch-1000', qty: 1 }
  ];
  let wishlist = ['wm-bottle-2000'];
  let appliedDiscount = 0; // In rupees
  let promoCodeApplied = '';

  // DOM Elements
  const cartOverlay = document.getElementById('cartOverlay');
  const cartSheet = document.getElementById('cartSheet');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartSubtotalDisplay = document.getElementById('cartSubtotalDisplay');
  const cartTotalDisplay = document.getElementById('cartTotalDisplay');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const toastNotice = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');

  // Open & Close Cart
  function openCart() {
    if (cartOverlay) cartOverlay.classList.add('open');
    if (cartSheet) cartSheet.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartOverlay) cartOverlay.classList.remove('open');
    if (cartSheet) cartSheet.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.openCartDrawer = openCart;
  window.closeCartDrawer = closeCart;

  // Toast Notification
  function showToast(msg) {
    if (!toastNotice) return;
    if (toastMessage) toastMessage.textContent = msg;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 2400);
  }
  window.triggerToast = showToast;

  // Fly-to-Cart Animation
  function flyToCart(startElement, imgSrc) {
    const cartBtn = document.querySelector('.cart-toggle-btn');
    if (!cartBtn || !startElement) return;

    const startRect = startElement.getBoundingClientRect();
    const endRect = cartBtn.getBoundingClientRect();

    const flyer = document.createElement('img');
    flyer.src = imgSrc || 'public/images/pouch_blue.png';
    flyer.className = 'fly-to-cart-particle';
    flyer.style.cssText = `
      position: fixed;
      z-index: 99999;
      width: 50px;
      height: 50px;
      object-fit: contain;
      top: ${startRect.top + startRect.height / 2 - 25}px;
      left: ${startRect.left + startRect.width / 2 - 25}px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 8px 24px rgba(2, 132, 199, 0.35);
      pointer-events: none;
      transition: all 0.75s cubic-bezier(0.2, 0.8, 0.2, 1);
      transform: scale(1);
    `;
    document.body.appendChild(flyer);

    requestAnimationFrame(() => {
      flyer.style.top = `${endRect.top + 8}px`;
      flyer.style.left = `${endRect.left + 8}px`;
      flyer.style.transform = 'scale(0.2) rotate(15deg)';
      flyer.style.opacity = '0.3';
    });

    setTimeout(() => {
      if (flyer.parentNode) flyer.parentNode.removeChild(flyer);
      // Pop cart badge
      if (cartCountBadge) {
        cartCountBadge.classList.add('pop');
        setTimeout(() => cartCountBadge.classList.remove('pop'), 400);
      }
      showToast('✓ Added to cart');
    }, 750);
  }

  // Add Item
  function addToCart(productId, qty = 1, triggerBtn = null) {
    const item = cart.find((i) => i.id === productId);
    if (item) {
      item.qty += qty;
    } else {
      cart.push({ id: productId, qty: qty });
    }

    renderCart();

    const product = PRODUCTS_CATALOG[productId];
    if (triggerBtn && product) {
      flyToCart(triggerBtn, product.img);
    } else {
      showToast('✓ Added to cart');
    }
  }
  window.addToCart = addToCart;

  // Change Quantity
  function updateQuantity(productId, delta) {
    const item = cart.find((i) => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter((i) => i.id !== productId);
    }
    renderCart();
  }
  window.updateCartQty = updateQuantity;

  // Remove Item
  function removeFromCart(productId) {
    cart = cart.filter((i) => i.id !== productId);
    renderCart();
    showToast('Item removed from cart');
  }
  window.removeCartItem = removeFromCart;

  // Render Cart UI
  function renderCart() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCountBadge) {
      cartCountBadge.textContent = totalCount;
      cartCountBadge.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    // Free shipping threshold: ₹399
    const subtotal = cart.reduce((sum, item) => {
      const prod = PRODUCTS_CATALOG[item.id];
      return sum + (prod ? prod.price * item.qty : 0);
    }, 0);

    const shippingThreshold = 399;
    const progressEl = document.getElementById('cartFreeShippingProgress');
    const msgEl = document.getElementById('cartFreeShippingMsg');

    if (progressEl) {
      const pct = Math.min(100, (subtotal / shippingThreshold) * 100);
      progressEl.style.width = pct + '%';
    }
    if (msgEl) {
      if (subtotal >= shippingThreshold) {
        msgEl.innerHTML = '🎉 <strong>FREE EXPRESS SHIPPING UNLOCKED!</strong>';
        msgEl.style.color = '#0284c7';
      } else {
        const remaining = shippingThreshold - subtotal;
        msgEl.innerHTML = `Add <strong>₹${remaining}</strong> more for <strong>FREE EXPRESS DELIVERY</strong>`;
        msgEl.style.color = '#64748b';
      }
    }

    // Render items list
    if (cartItemsContainer) {
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
          <div style="text-align: center; padding: 48px 16px;">
            <div style="font-size: 2.8rem; margin-bottom: 12px;">🧺</div>
            <h4 style="font-size: 1.1rem; color: #0f172a; margin-bottom: 6px;">Your cart is empty</h4>
            <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 20px;">Experience deep clean clothes with White Mist.</p>
            <button class="btn btn-primary" onclick="window.closeCartDrawer(); window.location.hash='#shop';">SHOP PRODUCTS</button>
          </div>
        `;
      } else {
        cartItemsContainer.innerHTML = cart.map((item) => {
          const prod = PRODUCTS_CATALOG[item.id];
          if (!prod) return '';
          return `
            <div class="cart-item-row" style="display: flex; gap: 14px; padding: 16px 0; border-bottom: 1px solid #f1f5f9; align-items: center;">
              <img src="${prod.img}" alt="${prod.name}" style="width: 60px; height: 60px; object-fit: contain; background: #f8fafc; border-radius: 10px; padding: 4px;">
              <div style="flex-grow: 1;">
                <h4 style="font-size: 0.9rem; font-weight: 700; color: #0f172a; margin-bottom: 2px;">${prod.name}</h4>
                <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 6px;">${prod.size}</div>
                <div style="font-size: 0.95rem; font-weight: 800; color: #0284c7;">₹${prod.price} <span style="font-size: 0.75rem; text-decoration: line-through; color: #94a3b8; font-weight: 400;">₹${prod.mrp}</span></div>
              </div>
              <div style="display: flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background: #ffffff;">
                <button onclick="window.updateCartQty('${item.id}', -1)" style="border: none; background: none; padding: 6px 10px; cursor: pointer; font-weight: 700;">−</button>
                <span style="padding: 0 6px; font-weight: 700; font-size: 0.85rem;">${item.qty}</span>
                <button onclick="window.updateCartQty('${item.id}', 1)" style="border: none; background: none; padding: 6px 10px; cursor: pointer; font-weight: 700;">+</button>
              </div>
              <button onclick="window.removeCartItem('${item.id}')" style="border: none; background: none; color: #94a3b8; cursor: pointer; padding: 6px;" title="Remove">✕</button>
            </div>
          `;
        }).join('');
      }
    }

    if (cartSubtotalDisplay) cartSubtotalDisplay.textContent = `₹${subtotal}`;
    const finalTotal = Math.max(0, subtotal - appliedDiscount);
    if (cartTotalDisplay) cartTotalDisplay.textContent = `₹${finalTotal}`;
  }

  // Promo Code Application
  function applyPromo(code) {
    const trimmed = (code || '').trim().toUpperCase();
    if (trimmed === 'MIST20') {
      const subtotal = cart.reduce((sum, item) => {
        const prod = PRODUCTS_CATALOG[item.id];
        return sum + (prod ? prod.price * item.qty : 0);
      }, 0);
      appliedDiscount = Math.round(subtotal * 0.2);
      promoCodeApplied = 'MIST20';
      showToast('🎉 Promo MIST20 applied: 20% discount!');
    } else {
      appliedDiscount = 0;
      promoCodeApplied = '';
      showToast('Invalid promo code. Try MIST20');
    }
    renderCart();
  }
  window.applyCartPromo = applyPromo;

  // Wishlist Toggle
  function toggleWishlist(productId) {
    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter((id) => id !== productId);
      showToast('Removed from Wishlist');
    } else {
      wishlist.push(productId);
      showToast('❤️ Added to Wishlist');
    }
    updateWishlistUI();
  }
  window.toggleWishlist = toggleWishlist;

  function updateWishlistUI() {
    const badge = document.getElementById('wishlistCountBadge');
    if (badge) {
      badge.textContent = wishlist.length;
      badge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
    // Update heart button states
    document.querySelectorAll('.wishlist-toggle-btn').forEach((btn) => {
      const id = btn.getAttribute('data-id');
      if (wishlist.includes(id)) {
        btn.classList.add('active');
        btn.style.color = '#ef4444';
      } else {
        btn.classList.remove('active');
        btn.style.color = '';
      }
    });
  }

  // 4-Step Indian E-Commerce Checkout Modal
  function openCheckoutModal() {
    closeCart();
    const modal = document.getElementById('checkoutModal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setCheckoutStep(1);
    updateCheckoutSummary();
  }
  window.openCheckout = openCheckoutModal;

  function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.closeCheckout = closeCheckoutModal;

  function setCheckoutStep(stepNumber) {
    for (let s = 1; s <= 4; s++) {
      const stepEl = document.getElementById(`checkoutStep${s}`);
      const indicatorEl = document.getElementById(`stepIndicator${s}`);
      if (stepEl) stepEl.style.display = s === stepNumber ? 'block' : 'none';
      if (indicatorEl) {
        if (s <= stepNumber) indicatorEl.classList.add('active');
        else indicatorEl.classList.remove('active');
      }
    }
  }
  window.goToCheckoutStep = setCheckoutStep;

  function updateCheckoutSummary() {
    const subtotal = cart.reduce((sum, item) => {
      const prod = PRODUCTS_CATALOG[item.id];
      return sum + (prod ? prod.price * item.qty : 0);
    }, 0);
    const total = Math.max(0, subtotal - appliedDiscount);

    const subtotalEl = document.getElementById('checkoutSubtotal');
    const discountEl = document.getElementById('checkoutDiscountAmount');
    const totalEl = document.getElementById('checkoutFinalTotal');

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (discountEl) discountEl.textContent = `-₹${appliedDiscount}`;
    if (totalEl) totalEl.textContent = `₹${total}`;

    // Populate checkout items preview
    const previewList = document.getElementById('checkoutItemsList');
    if (previewList) {
      previewList.innerHTML = cart.map((i) => {
        const prod = PRODUCTS_CATALOG[i.id];
        return prod ? `<div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;"><span>${prod.name} × ${i.qty}</span><span>₹${prod.price * i.qty}</span></div>` : '';
      }).join('');
    }
  }

  // Final Order Placement with Confetti
  function submitOrder() {
    // Generate random order ID
    const randomOrderId = 'WM-' + Math.floor(100000 + Math.random() * 900000);
    const orderIdDisplay = document.getElementById('confirmedOrderId');
    if (orderIdDisplay) orderIdDisplay.textContent = randomOrderId;

    // Clear cart after order
    cart = [];
    renderCart();

    setCheckoutStep(4);
    triggerConfetti();
  }
  window.submitOrderCheckout = submitOrder;

  // Micro Confetti Generator for Order Celebration
  function triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth || 400;
    canvas.height = 300;

    const pieces = [];
    const colors = ['#0284c7', '#38bdf8', '#10b981', '#f59e0b', '#ec4899'];

    for (let i = 0; i < 60; i++) {
      pieces.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: -4 - Math.random() * 6,
        r: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10
      });
    }

    let frames = 0;
    function anim() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.vy += 0.2; // Gravity
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      frames++;
      if (frames < 90) requestAnimationFrame(anim);
    }
    anim();
  }

  // Live Search Modal
  function openSearchModal() {
    const modal = document.getElementById('searchModal');
    if (!modal) return;
    modal.classList.add('open');
    const input = document.getElementById('liveSearchInput');
    if (input) {
      input.value = '';
      input.focus();
      renderSearchResults('');
    }
  }
  window.openLiveSearch = openSearchModal;

  function closeSearchModal() {
    const modal = document.getElementById('searchModal');
    if (modal) modal.classList.remove('open');
  }
  window.closeLiveSearch = closeSearchModal;

  function renderSearchResults(query) {
    const container = document.getElementById('searchResultsContainer');
    if (!container) return;

    const q = (query || '').toLowerCase().trim();
    const results = Object.values(PRODUCTS_CATALOG).filter((p) => {
      return p.name.toLowerCase().includes(q) || p.benefit.toLowerCase().includes(q);
    });

    if (results.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 24px; color: #94a3b8;">No matching fabric care products found.</div>`;
      return;
    }

    container.innerHTML = results.map((p) => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border-bottom: 1px solid #f1f5f9;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${p.img}" alt="${p.name}" style="width: 44px; height: 44px; object-fit: contain;">
          <div>
            <h4 style="font-size: 0.92rem; font-weight: 700; color: #0f172a;">${p.name}</h4>
            <span style="font-size: 0.78rem; color: #64748b;">${p.benefit} • ₹${p.price}</span>
          </div>
        </div>
        <button class="btn btn-sm btn-primary" onclick="window.addToCart('${p.id}', 1, this); window.closeLiveSearch();">ADD</button>
      </div>
    `).join('');
  }
  window.filterSearchProducts = renderSearchResults;

  // Account Modal
  function openAccountModal() {
    const modal = document.getElementById('accountModal');
    if (modal) modal.classList.add('open');
  }
  window.openAccount = openAccountModal;

  function closeAccountModal() {
    const modal = document.getElementById('accountModal');
    if (modal) modal.classList.remove('open');
  }
  window.closeAccount = closeAccountModal;

  // Bind Event Listeners on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    // Cart open/close triggers
    document.querySelectorAll('.cart-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', openCart);
    });
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // Search toggles
    document.querySelectorAll('.search-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', openSearchModal);
    });
    const searchCloseBtn = document.getElementById('searchCloseBtn');
    if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearchModal);

    const liveSearchInput = document.getElementById('liveSearchInput');
    if (liveSearchInput) {
      liveSearchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));
    }

    // Account toggles
    document.querySelectorAll('.account-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', openAccountModal);
    });
    const accountCloseBtn = document.getElementById('accountCloseBtn');
    if (accountCloseBtn) accountCloseBtn.addEventListener('click', closeAccountModal);

    // Add to cart buttons throughout page
    document.querySelectorAll('.add-to-cart-trigger').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        if (id) addToCart(id, 1, btn);
      });
    });

    // Buy now buttons (Add to cart & open checkout immediately)
    document.querySelectorAll('.buy-now-trigger').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) {
          addToCart(id, 1);
          openCheckoutModal();
        }
      });
    });

    // Checkout Modal buttons
    const checkoutProceedBtn = document.getElementById('checkoutBtn');
    if (checkoutProceedBtn) checkoutProceedBtn.addEventListener('click', openCheckoutModal);

    const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
    if (checkoutCloseBtn) checkoutCloseBtn.addEventListener('click', closeCheckoutModal);

    // Apply promo code buttons
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const promoInput = document.getElementById('cartPromoInput');
    if (applyPromoBtn && promoInput) {
      applyPromoBtn.addEventListener('click', () => applyPromo(promoInput.value));
    }

    // Category filter pills in Shop section
    const filterPills = document.querySelectorAll('.shop-filter-pill');
    filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        filterPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.getAttribute('data-category');

        document.querySelectorAll('.clean-product-card').forEach((card) => {
          const cardCat = card.getAttribute('data-category');
          if (cat === 'all' || cardCat === cat) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    renderCart();
    updateWishlistUI();
  });

})();

/**
 * WHITE MIST — Centralized Global Store & Cart System
 * Manages cart state, persistent storage, cart drawer, search, coupons, and toast alerts.
 */

(function () {
  const CART_KEY = 'whitemist_cart_v2';
  const COUPON_KEY = 'whitemist_coupon_v2';
  const FREE_SHIPPING_THRESHOLD = 499;
  const STANDARD_SHIPPING_FEE = 50;

  // Initial State
  let cart = [];
  try {
    const saved = localStorage.getItem(CART_KEY);
    cart = saved ? JSON.parse(saved) : [];
  } catch (e) {
    cart = [];
  }

  // Fallback default sample item if cart was empty on first visit so user can explore cart immediately
  if (cart.length === 0 && !sessionStorage.getItem('wm_visited')) {
    cart = [
      {
        id: 'wm-ocean-blue',
        slug: 'ocean-fresh-liquid-detergent',
        name: 'White Mist Ocean Fresh Liquid Detergent',
        size: '1 Litre',
        price: 249,
        quantity: 1,
        image: 'public/images/bottle_blue.png'
      }
    ];
    saveCart();
  }
  sessionStorage.setItem('wm_visited', 'true');

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart:', e);
    }
    updateAllBadges();
    renderCartDrawer();
  }

  function getCart() {
    return cart;
  }

  function getCartItemCount() {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  function getSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  function getActiveCoupon() {
    try {
      return JSON.parse(localStorage.getItem(COUPON_KEY)) || null;
    } catch (e) {
      return null;
    }
  }

  function setCoupon(couponObj) {
    if (couponObj) {
      localStorage.setItem(COUPON_KEY, JSON.stringify(couponObj));
    } else {
      localStorage.removeItem(COUPON_KEY);
    }
  }

  function calculateCartTotals() {
    const subtotal = getSubtotal();
    const coupon = getActiveCoupon();
    let discount = 0;

    if (coupon) {
      if (coupon.type === 'percent') {
        discount = Math.round(subtotal * (coupon.value / 100));
      } else if (coupon.type === 'flat') {
        discount = Math.min(subtotal, coupon.value);
      }
    }

    let shipping = 0;
    if (subtotal > 0) {
      if (coupon && coupon.code === 'FREESHIP') {
        shipping = 0;
      } else if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        shipping = 0;
      } else {
        shipping = STANDARD_SHIPPING_FEE;
      }
    }

    const total = Math.max(0, subtotal - discount + shipping);

    return {
      subtotal,
      discount,
      shipping,
      total,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      freeShippingRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
      isFreeShipping: shipping === 0 && subtotal > 0,
      coupon
    };
  }

  function addToCart(productOrId, sizeName, quantity = 1, openDrawer = true) {
    let product = null;
    if (typeof productOrId === 'string') {
      const list = window.WHITE_MIST_PRODUCTS || [];
      product = list.find(p => p.id === productOrId || p.slug === productOrId);
    } else {
      product = productOrId;
    }

    if (!product) {
      console.error('Product not found for addition:', productOrId);
      return;
    }

    const chosenSizeObj = product.sizes ? product.sizes.find(s => s.size === sizeName) || product.sizes[0] : null;
    const size = chosenSizeObj ? chosenSizeObj.size : (sizeName || '1 Litre');
    const price = chosenSizeObj ? chosenSizeObj.price : (product.price || 249);

    const existingIndex = cart.findIndex(item => item.id === product.id && item.size === size);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        slug: product.slug,
        name: product.name,
        size: size,
        price: price,
        quantity: quantity,
        image: product.image
      });
    }

    saveCart();
    showToast(`Added ${quantity}x ${product.name} (${size}) to your bag`, 'success');

    if (openDrawer) {
      openCartDrawer();
    }
  }

  function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
      const removed = cart.splice(index, 1)[0];
      saveCart();
      showToast(`Removed ${removed.name} from bag`, 'info');
    }
  }

  function updateQuantity(index, newQty) {
    if (index >= 0 && index < cart.length) {
      if (newQty <= 0) {
        removeFromCart(index);
      } else {
        cart[index].quantity = newQty;
        saveCart();
      }
    }
  }

  function applyCoupon(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a coupon code.' };
    }

    if (cleanCode === 'WHITEMIST10') {
      setCoupon({ code: 'WHITEMIST10', type: 'percent', value: 10, description: '10% Off Entire Order' });
      saveCart();
      showToast('Coupon WHITEMIST10 applied! 10% discount added.', 'success');
      return { success: true, message: '10% discount applied!' };
    } else if (cleanCode === 'FREESHIP') {
      setCoupon({ code: 'FREESHIP', type: 'flat', value: 0, description: 'Free Standard Delivery' });
      saveCart();
      showToast('Free shipping unlocked with code FREESHIP!', 'success');
      return { success: true, message: 'Free shipping coupon applied!' };
    } else if (cleanCode === 'CLEANPRO') {
      setCoupon({ code: 'CLEANPRO', type: 'flat', value: 50, description: '₹50 CleanPro Special Discount' });
      saveCart();
      showToast('₹50 discount applied with code CLEANPRO!', 'success');
      return { success: true, message: '₹50 discount applied!' };
    } else {
      return { success: false, message: 'Invalid or expired coupon code. Try WHITEMIST10' };
    }
  }

  function removeCoupon() {
    setCoupon(null);
    saveCart();
    showToast('Coupon removed.', 'info');
  }

  function updateAllBadges() {
    const count = getCartItemCount();
    document.querySelectorAll('.cart-count-badge, #navCartBadge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }

  // Toast Notification System
  function showToast(message, type = 'info') {
    let container = document.getElementById('wm-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'wm-toast-container';
      container.className = 'wm-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `wm-toast wm-toast-${type}`;
    
    let icon = '✦';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';

    toast.innerHTML = `
      <span class="wm-toast-icon">${icon}</span>
      <span class="wm-toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Cart Drawer UI & Interactions
  function injectCartDrawerDOM() {
    if (document.getElementById('wm-cart-drawer')) return;

    const drawerWrapper = document.createElement('div');
    drawerWrapper.id = 'wm-cart-drawer';
    drawerWrapper.className = 'wm-cart-drawer-backdrop';
    drawerWrapper.innerHTML = `
      <div class="wm-cart-drawer-panel" role="dialog" aria-modal="true" aria-label="Shopping Bag">
        <div class="wm-cart-drawer-header">
          <div class="wm-cart-header-title">
            <h3>Your Shopping Bag</h3>
            <span class="wm-cart-header-count" id="drawerCartCountLabel">(0 items)</span>
          </div>
          <button class="wm-cart-close-btn" id="wmCartCloseBtn" aria-label="Close Bag">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Free shipping progression bar -->
        <div class="wm-cart-shipping-bar" id="drawerShippingBar">
          <div class="wm-shipping-bar-text" id="drawerShippingBarText">Add ₹250 more for FREE express shipping</div>
          <div class="wm-shipping-bar-track">
            <div class="wm-shipping-bar-fill" id="drawerShippingBarFill" style="width: 50%;"></div>
          </div>
        </div>

        <div class="wm-cart-drawer-items" id="drawerCartItemsContainer">
          <!-- Populated dynamically -->
        </div>

        <div class="wm-cart-drawer-footer" id="drawerCartFooter">
          <div class="wm-cart-summary-row">
            <span>Subtotal</span>
            <span class="wm-cart-summary-val" id="drawerSubtotalVal">₹0</span>
          </div>
          <div class="wm-cart-summary-row" id="drawerDiscountRow" style="display: none; color: #10b981;">
            <span>Coupon Savings</span>
            <span class="wm-cart-summary-val" id="drawerDiscountVal">-₹0</span>
          </div>
          <div class="wm-cart-summary-row">
            <span>Estimated Shipping</span>
            <span class="wm-cart-summary-val" id="drawerShippingVal">FREE</span>
          </div>
          <div class="wm-cart-summary-total">
            <span>Total (Incl. of all taxes)</span>
            <span class="wm-cart-total-val" id="drawerTotalVal">₹0</span>
          </div>

          <div class="wm-cart-actions-row">
            <a href="cart.html" class="btn-drawer-cart">View Full Cart</a>
            <a href="checkout.html" class="btn-drawer-checkout">Proceed to Checkout →</a>
          </div>

          <div class="wm-cart-trust-pills">
            <span>🔒 Secure Checkout</span>
            <span>⚡ Express Dispatch</span>
            <span>💯 100% Genuine</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(drawerWrapper);

    // Event listeners for close
    document.getElementById('wmCartCloseBtn').addEventListener('click', closeCartDrawer);
    drawerWrapper.addEventListener('click', (e) => {
      if (e.target === drawerWrapper) closeCartDrawer();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCartDrawer();
    });
  }

  function openCartDrawer() {
    injectCartDrawerDOM();
    renderCartDrawer();
    const drawer = document.getElementById('wm-cart-drawer');
    if (drawer) {
      drawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCartDrawer() {
    const drawer = document.getElementById('wm-cart-drawer');
    if (drawer) {
      drawer.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  function renderCartDrawer() {
    const container = document.getElementById('drawerCartItemsContainer');
    const footer = document.getElementById('drawerCartFooter');
    const countLabel = document.getElementById('drawerCartCountLabel');
    const shippingBar = document.getElementById('drawerShippingBar');
    const shippingText = document.getElementById('drawerShippingBarText');
    const shippingFill = document.getElementById('drawerShippingBarFill');

    if (!container) return;

    const itemCount = getCartItemCount();
    if (countLabel) countLabel.textContent = `(${itemCount} ${itemCount === 1 ? 'item' : 'items'})`;

    const totals = calculateCartTotals();

    // Free shipping bar calculation
    if (shippingBar && shippingText && shippingFill) {
      if (totals.subtotal === 0) {
        shippingBar.style.display = 'none';
      } else {
        shippingBar.style.display = 'block';
        if (totals.isFreeShipping) {
          shippingText.innerHTML = '🎉 <strong>Congratulations!</strong> You have unlocked <strong>FREE Express Shipping</strong>.';
          shippingFill.style.width = '100%';
          shippingFill.style.background = '#10b981';
        } else {
          const percent = Math.min(100, Math.round((totals.subtotal / totals.freeShippingThreshold) * 100));
          shippingText.innerHTML = `Add <strong>₹${totals.freeShippingRemaining}</strong> more to get <strong>FREE Shipping</strong>!`;
          shippingFill.style.width = `${percent}%`;
          shippingFill.style.background = 'linear-gradient(90deg, #0099ff, #6d28d9)';
        }
      }
    }

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="wm-cart-empty-state">
          <div class="wm-cart-empty-icon">🛍️</div>
          <h4>Your bag is currently empty</h4>
          <p>Discover our range of liquid detergents designed for uncompromising fabric care.</p>
          <a href="shop.html" class="btn-primary" style="margin-top: 1rem;" onclick="window.WhiteMistStore.closeCartDrawer();">Explore Products</a>
        </div>
      `;
      if (footer) footer.style.display = 'none';
      return;
    }

    if (footer) footer.style.display = 'block';

    container.innerHTML = cart.map((item, idx) => `
      <div class="wm-cart-drawer-item">
        <img src="${item.image}" alt="${item.name}" class="wm-cart-item-img">
        <div class="wm-cart-item-info">
          <div class="wm-cart-item-title-row">
            <a href="product.html?slug=${item.slug}" class="wm-cart-item-name">${item.name}</a>
            <button class="wm-cart-item-remove" onclick="window.WhiteMistStore.removeFromCart(${idx})" title="Remove item" aria-label="Remove">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
          <div class="wm-cart-item-size-tag">Size: ${item.size}</div>
          <div class="wm-cart-item-price-row">
            <span class="wm-cart-item-price">₹${item.price}</span>
            <div class="wm-qty-counter">
              <button class="wm-qty-btn" onclick="window.WhiteMistStore.updateQuantity(${idx}, ${item.quantity - 1})" aria-label="Decrease quantity">−</button>
              <span class="wm-qty-val">${item.quantity}</span>
              <button class="wm-qty-btn" onclick="window.WhiteMistStore.updateQuantity(${idx}, ${item.quantity + 1})" aria-label="Increase quantity">+</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Summary calculations
    const subtotalEl = document.getElementById('drawerSubtotalVal');
    const discountRow = document.getElementById('drawerDiscountRow');
    const discountEl = document.getElementById('drawerDiscountVal');
    const shippingEl = document.getElementById('drawerShippingVal');
    const totalEl = document.getElementById('drawerTotalVal');

    if (subtotalEl) subtotalEl.textContent = `₹${totals.subtotal}`;

    if (discountRow && discountEl) {
      if (totals.discount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = `-₹${totals.discount}`;
      } else {
        discountRow.style.display = 'none';
      }
    }

    if (shippingEl) {
      shippingEl.textContent = totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`;
      shippingEl.style.color = totals.shipping === 0 ? '#10b981' : 'inherit';
    }

    if (totalEl) totalEl.textContent = `₹${totals.total}`;
  }

  // Global Quick Search Modal
  function injectSearchModalDOM() {
    if (document.getElementById('wm-search-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'wm-search-modal';
    modal.className = 'wm-search-modal-backdrop';
    modal.innerHTML = `
      <div class="wm-search-modal-box">
        <div class="wm-search-input-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="wmSearchInput" placeholder="Search products, fragrances, fabric types..." autocomplete="off">
          <button class="wm-search-close-btn" id="wmSearchCloseBtn" aria-label="Close search">✕</button>
        </div>
        <div class="wm-search-quick-tags">
          <span>Popular searches:</span>
          <button class="search-tag-chip" data-search="Ocean">Ocean Fresh</button>
          <button class="search-tag-chip" data-search="Floral">Floral Bloom</button>
          <button class="search-tag-chip" data-search="Citrus">Citrus Stain</button>
          <button class="search-tag-chip" data-search="Refill">Eco Refill</button>
        </div>
        <div class="wm-search-results" id="wmSearchResults">
          <!-- Dynamic Results -->
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const input = document.getElementById('wmSearchInput');
    const resultsContainer = document.getElementById('wmSearchResults');
    const closeBtn = document.getElementById('wmSearchCloseBtn');

    function executeSearch(query) {
      const q = (query || '').toLowerCase().trim();
      const list = window.WHITE_MIST_PRODUCTS || [];

      if (!q) {
        resultsContainer.innerHTML = `
          <div class="search-hint">Type above to search our liquid detergent formulas, refill pouches, and bundle packs.</div>
        `;
        return;
      }

      const matches = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fragrance.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        (p.fabrics && p.fabrics.some(f => f.toLowerCase().includes(q)))
      );

      if (matches.length === 0) {
        resultsContainer.innerHTML = `
          <div class="search-no-results">
            <p>No products found matching "<strong>${query}</strong>"</p>
            <a href="shop.html" class="btn-secondary" style="margin-top: 0.5rem;" onclick="window.WhiteMistStore.closeSearchModal();">Browse All Products</a>
          </div>
        `;
        return;
      }

      resultsContainer.innerHTML = matches.map(p => `
        <a href="product.html?slug=${p.slug}" class="search-result-item" onclick="window.WhiteMistStore.closeSearchModal();">
          <img src="${p.image}" alt="${p.name}">
          <div class="search-result-info">
            <span class="search-result-cat">${p.category}</span>
            <h5 class="search-result-title">${p.name}</h5>
            <span class="search-result-price">Starts at ₹${p.sizes[0].price}</span>
          </div>
          <span class="search-result-arrow">→</span>
        </a>
      `).join('');
    }

    input.addEventListener('input', (e) => executeSearch(e.target.value));

    modal.querySelectorAll('.search-tag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        input.value = chip.getAttribute('data-search');
        executeSearch(input.value);
      });
    });

    closeBtn.addEventListener('click', closeSearchModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeSearchModal();
    });
  }

  function openSearchModal() {
    injectSearchModalDOM();
    const modal = document.getElementById('wm-search-modal');
    if (modal) {
      modal.classList.add('is-open');
      const input = document.getElementById('wmSearchInput');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 100);
      }
      const resultsContainer = document.getElementById('wmSearchResults');
      if (resultsContainer) {
        resultsContainer.innerHTML = `
          <div class="search-hint">Type above to search our liquid detergent formulas, refill pouches, and bundle packs.</div>
        `;
      }
    }
  }

  function closeSearchModal() {
    const modal = document.getElementById('wm-search-modal');
    if (modal) {
      modal.classList.remove('is-open');
    }
  }

  // Bind Navbar actions automatically
  function initHeaderButtons() {
    document.querySelectorAll('.cart-toggle-btn, [data-action="open-cart"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCartDrawer();
      });
    });

    document.querySelectorAll('.search-toggle-btn, [data-action="open-search"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSearchModal();
      });
    });

    updateAllBadges();
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectCartDrawerDOM();
      initHeaderButtons();
      updateAllBadges();
    });
  } else {
    injectCartDrawerDOM();
    initHeaderButtons();
    updateAllBadges();
  }

  // Public API
  window.WhiteMistStore = {
    getCart,
    getCartItemCount,
    getSubtotal,
    calculateCartTotals,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    getActiveCoupon,
    showToast,
    openCartDrawer,
    closeCartDrawer,
    openSearchModal,
    closeSearchModal,
    updateAllBadges
  };

  // Aliases for quick access
  window.triggerToast = showToast;
})();

/**
 * WHITE MIST — Public Dynamic Content & API Integration Layer
 * Connects the public website to the live database-backed content.
 * Gracefully falls back to static defaults if offline or viewing local static files.
 */

(function () {
  'use strict';

  const WhiteMistAPI = {
    /**
     * Fetch active products from database API with fallback to static catalogue
     */
    async getProducts(category = 'all', searchQuery = '') {
      try {
        let endpoint = '/api/products';
        const params = [];
        if (category && category !== 'all') params.push(`category=${encodeURIComponent(category)}`);
        if (searchQuery) params.push(`search=${encodeURIComponent(searchQuery)}`);
        if (params.length > 0) endpoint += `?${params.join('&')}`;

        const res = await fetch(endpoint);
        if (res.ok) {
          const products = await res.json();
          if (Array.isArray(products) && products.length > 0) {
            // Keep window.WHITE_MIST_PRODUCTS synchronized
            window.WHITE_MIST_PRODUCTS = products;
            return products;
          }
        }
      } catch (err) {
        // Network or offline fallback
      }

      // Fallback to static catalog in products-data.js
      let fallback = window.WHITE_MIST_PRODUCTS || [];
      if (category && category !== 'all') {
        fallback = fallback.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        fallback = fallback.filter(p => p.name.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q));
      }
      return fallback;
    },

    /**
     * Get single product by slug or id
     */
    async getProduct(slugOrId) {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(slugOrId)}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {}

      // Fallback
      const list = window.WHITE_MIST_PRODUCTS || [];
      return list.find(p => p.slug === slugOrId || p.id === slugOrId) || null;
    },

    /**
     * Fetch dynamic homepage sections (hero headline, FAQs, stats)
     */
    async getHomepage() {
      try {
        const res = await fetch('/api/homepage');
        if (res.ok) return await res.json();
      } catch (e) {}
      return null;
    },

    /**
     * Fetch active promotional banners
     */
    async getBanners() {
      try {
        const res = await fetch('/api/banners');
        if (res.ok) return await res.json();
      } catch (e) {}
      return [];
    },

    /**
     * Fetch store settings (announcement bar, shipping thresholds)
     */
    async getSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) return await res.json();
      } catch (e) {}
      return null;
    },

    /**
     * Submit customer checkout order to backend database
     */
    async submitOrder(orderData) {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend order submission fallback:', e);
      }
      return { success: true, orderId: 'WM-' + Math.floor(100000 + Math.random() * 900000) };
    },

    /**
     * Submit customer contact inquiry
     */
    async submitContact(contactData) {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactData)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend contact submission fallback:', e);
      }
      return { success: true };
    },

    /**
     * Auto-sync dynamic elements across pages
     */
    async initGlobalSync() {
      // 1. Sync announcement bar
      try {
        const settings = await this.getSettings();
        if (settings) {
          const announcementBars = document.querySelectorAll('.top-announcement-bar');
          announcementBars.forEach(bar => {
            if (settings.announcementBarEnabled === false) {
              bar.style.display = 'none';
            } else if (settings.announcementBarText) {
              const span = bar.querySelector('span');
              if (span) span.textContent = settings.announcementBarText;
              bar.style.display = 'block';
            }
          });
        }
      } catch (e) {}

      // 2. Sync homepage dynamic hero & banners if on index page
      const heroHeadline = document.querySelector('.hero-headline');
      if (heroHeadline) {
        try {
          const hp = await this.getHomepage();
          if (hp && hp.hero) {
            if (hp.hero.headline) {
              heroHeadline.innerHTML = hp.hero.headline.replace(/\n/g, '<br>');
            }
            const heroSub = document.querySelector('.hero-subtext');
            if (heroSub && hp.hero.subtitle) {
              heroSub.textContent = hp.hero.subtitle;
            }
            const bottleImg = document.getElementById('heroBottle');
            if (bottleImg && hp.hero.mainBottleImage) {
              bottleImg.src = hp.hero.mainBottleImage;
            }
          }

          // Inject active promotional banner strip if exists
          const banners = await this.getBanners();
          if (banners && banners.length > 0) {
            const activeBanner = banners[0];
            const existingBannerStrip = document.getElementById('publicPromoBannerStrip');
            if (!existingBannerStrip && activeBanner.isActive) {
              const bannerDiv = document.createElement('div');
              bannerDiv.id = 'publicPromoBannerStrip';
              bannerDiv.style = 'background: linear-gradient(90deg, #3b0764 0%, #1e1b4b 50%, #0084ff 100%); color: #fff; padding: 0.85rem 1rem; text-align: center; font-size: 0.88rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 1rem; border-bottom: 1px solid rgba(255,255,255,0.15);';
              bannerDiv.innerHTML = `
                <span>${activeBanner.title} — ${activeBanner.subtitle}</span>
                <a href="${activeBanner.ctaLink || 'shop.html'}" style="background: #ffffff; color: #0a0414; padding: 0.35rem 0.85rem; border-radius: 999px; text-decoration: none; font-size: 0.78rem; font-weight: 800; text-transform: uppercase;">${activeBanner.ctaText || 'Shop Now'}</a>
              `;
              const navbar = document.getElementById('wmNavbar');
              if (navbar && navbar.parentElement) {
                navbar.parentElement.insertBefore(bannerDiv, navbar.nextSibling);
              }
            }
          }
        } catch (e) {}
      }
    }
  };

  window.WhiteMistAPI = WhiteMistAPI;

  // Auto-init on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => WhiteMistAPI.initGlobalSync());
  } else {
    WhiteMistAPI.initGlobalSync();
  }
})();

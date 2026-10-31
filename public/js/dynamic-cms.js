/**
 * WHITE MIST — Dynamic CMS Client Bridge & Theme Switching Engine
 * 1. Synchronizes public website with live CMS settings from /api/public-cms
 * 2. Implements instantaneous, zero-flicker Light / Dark / System theme switching
 * 3. Provides public floating theme toggle and Admin CMS quick-access badge
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. THEME ENGINE (PURE WHITE / LIGHT THEME ENFORCED ONLY)
  // =========================================================================
  const THEME_KEY = 'whitemist_theme_preference';

  function applyTheme() {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('theme-dark');
    document.documentElement.classList.add('theme-light');
    localStorage.setItem(THEME_KEY, 'light');
  }

  // Initial apply immediately
  applyTheme();

  // =========================================================================
  // 2. FLOATING CONTROLS
  // =========================================================================
  function removeFloatingControls() {
    const el = document.getElementById("wmFloatingControls");
    if (el) el.remove();
  }
  document.addEventListener('DOMContentLoaded', removeFloatingControls);

  // =========================================================================
  // 3. DYNAMIC CMS CONTENT HYDRATION
  // =========================================================================
  async function hydrateFromCms() {
    try {
      const res = await fetch('/api/public-cms');
      if (!res.ok) return;
      const cms = await res.json();
      window.__WHITE_MIST_CMS__ = cms;

      // 1. If admin set default theme and user hasn't chosen personal preference
      if (!localStorage.getItem(THEME_KEY) && cms.theme && cms.theme.defaultTheme) {
        applyTheme(cms.theme.defaultTheme);
      }

      // 2. SEO Title and Meta
      if (cms.seo) {
        if (cms.seo.siteTitle) document.title = cms.seo.siteTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && cms.seo.metaDescription) metaDesc.setAttribute('content', cms.seo.metaDescription);
      }

      // 3. Announcement bar
      if (cms.headerNav && cms.headerNav.announcementBar) {
        const bar = document.querySelector('.top-announcement-bar') || document.querySelector('[class*="announcement"]');
        if (bar) {
          if (cms.headerNav.announcementBar.enabled === false) {
            bar.style.display = 'none';
          } else {
            bar.style.display = '';
            const span = bar.querySelector('span') || bar;
            if (cms.headerNav.announcementBar.text) span.textContent = cms.headerNav.announcementBar.text;
            if (cms.headerNav.announcementBar.bgColor) bar.style.backgroundColor = cms.headerNav.announcementBar.bgColor;
            if (cms.headerNav.announcementBar.textColor) bar.style.color = cms.headerNav.announcementBar.textColor;
          }
        }
      }

      // 4. Hero text & Subtitle
      if (cms.homepage && cms.homepage.hero) {
        const headlineEl = document.querySelector('.hero-headline') || document.querySelector('h1');
        if (headlineEl && cms.homepage.hero.headline) {
          headlineEl.innerHTML = cms.homepage.hero.headline.replace(/\n/g, '<br>');
        }
        const subtextEl = document.querySelector('.hero-subtext') || document.querySelector('.hero-description-text');
        if (subtextEl && cms.homepage.hero.subtitle) {
          subtextEl.textContent = cms.homepage.hero.subtitle;
        }
      }

      // 5. Benefits Strip
      if (cms.benefits && Array.isArray(cms.benefits) && cms.benefits.length > 0) {
        const benefitItems = document.querySelectorAll('.benefit-item, .why-feature-card');
        cms.benefits.forEach((b, idx) => {
          if (benefitItems[idx]) {
            const titleEl = benefitItems[idx].querySelector('h4, .why-card-title');
            const descEl = benefitItems[idx].querySelector('p, .why-card-desc');
            const iconEl = benefitItems[idx].querySelector('.benefit-icon-box, .why-icon-box');
            if (titleEl && b.title) titleEl.textContent = b.title;
            if (descEl && b.desc) descEl.textContent = b.desc;
            if (iconEl && b.icon) iconEl.textContent = b.icon;
          }
        });
      }

      // 6. Footer Information
      if (cms.footer) {
        const footerDesc = document.querySelector('.footer-brand-col p, footer p');
        if (footerDesc && cms.footer.description) {
          footerDesc.textContent = cms.footer.description;
        }
        const copyrightEl = document.querySelector('.footer-bottom-bar div, footer .copyright');
        if (copyrightEl && cms.footer.copyrightText) {
          copyrightEl.textContent = cms.footer.copyrightText;
        }
      }

      console.log('✓ White Mist Dynamic CMS hydrated successfully');
    } catch (e) {
      console.warn('CMS hydration skipped:', e);
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      removeFloatingControls();
      hydrateFromCms();
    });
  } else {
    removeFloatingControls();
    hydrateFromCms();
  }
})();

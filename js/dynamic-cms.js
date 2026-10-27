/**
 * WHITE MIST — Dynamic CMS Client Bridge & Theme Switching Engine
 * 1. Synchronizes public website with live CMS settings from /api/public-cms
 * 2. Implements instantaneous, zero-flicker Light / Dark / System theme switching
 * 3. Provides public floating theme toggle and Admin CMS quick-access badge
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. THEME SWITCHING ENGINE (LIGHT / DARK / SYSTEM)
  // =========================================================================
  const THEME_KEY = 'whitemist_theme_preference';

  function getSystemTheme() {
    return 'light';
  }

  function getSavedTheme() {
    return 'light';
  }

  function applyTheme() {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('theme-dark');
    document.documentElement.classList.add('theme-light');
    localStorage.setItem(THEME_KEY, 'light');
  }

  // Initial apply
  applyTheme(getSavedTheme());

  // Listen to system changes if system theme is selected
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (getSavedTheme() === 'system') applyTheme('system');
    });
  }

  // =========================================================================
  // 2. INJECT DARK MODE STYLES & TOKENS
  // =========================================================================
  const themeStyles = document.createElement('style');
  themeStyles.id = 'whitemist-dynamic-theme-styles';
  themeStyles.textContent = `
    /* DARK THEME SYSTEM OVERRIDES */
    html[data-theme="dark"], body.theme-dark {
      background-color: #070311 !important;
      color: #f1f5f9 !important;
    }

    html[data-theme="dark"] body {
      background-color: #070311 !important;
      background-image: 
        radial-gradient(circle at 15% 20%, rgba(0, 132, 255, 0.08) 0%, transparent 45%),
        radial-gradient(circle at 85% 60%, rgba(124, 58, 237, 0.08) 0%, transparent 50%),
        #070311 !important;
      color: #f1f5f9 !important;
    }

    html[data-theme="dark"] .main-navbar {
      background: rgba(13, 5, 30, 0.85) !important;
      border-bottom: 1px solid rgba(124, 58, 237, 0.25) !important;
    }

    html[data-theme="dark"] .main-navbar.scrolled {
      background: rgba(13, 5, 30, 0.95) !important;
      border-bottom: 1px solid rgba(124, 58, 237, 0.35) !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6) !important;
    }

    html[data-theme="dark"] h1, 
    html[data-theme="dark"] h2, 
    html[data-theme="dark"] h3, 
    html[data-theme="dark"] h4, 
    html[data-theme="dark"] h5, 
    html[data-theme="dark"] h6 {
      color: #ffffff !important;
    }

    html[data-theme="dark"] p,
    html[data-theme="dark"] span {
      color: inherit;
    }

    html[data-theme="dark"] .product-card,
    html[data-theme="dark"] .why-feature-card,
    html[data-theme="dark"] .stain-comparison-card,
    html[data-theme="dark"] .bio-enzyme-card,
    html[data-theme="dark"] div[style*="background: #ffffff"],
    html[data-theme="dark"] div[style*="background: #f8fafc"],
    html[data-theme="dark"] div[style*="background: rgb(255, 255, 255)"],
    html[data-theme="dark"] div[style*="background: rgb(248, 250, 252)"] {
      background-color: #100722 !important;
      border-color: rgba(124, 58, 237, 0.25) !important;
      color: #e2e8f0 !important;
    }

    html[data-theme="dark"] .btn-secondary {
      background: #190c36 !important;
      color: #c4b5fd !important;
      border-color: rgba(124, 58, 237, 0.35) !important;
    }

    html[data-theme="dark"] .btn-secondary:hover {
      background: #23124a !important;
      color: #ffffff !important;
      border-color: #0084ff !important;
    }

    html[data-theme="dark"] footer,
    html[data-theme="dark"] .wm-footer {
      background: #05020c !important;
      border-top: 1px solid rgba(124, 58, 237, 0.25) !important;
    }

    /* FLOATING CONTROLS: REMOVED */
    #wmFloatingControls, .wm-floating-controls, .wm-theme-pill, .wm-admin-pill {
      display: none !important;
    }
    /* FLOATING CONTROLS: THEME SWITCHER & ADMIN CMS BUTTON */
    .wm-floating-controls {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 99999;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }

    .wm-theme-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(0, 132, 255, 0.3);
      padding: 7px 14px;
      border-radius: 999px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
      cursor: pointer;
      font-size: 0.82rem;
      font-weight: 700;
      color: #1e1b4b;
      transition: all 0.22s ease;
    }

    html[data-theme="dark"] .wm-theme-pill {
      background: rgba(16, 7, 34, 0.9);
      border-color: rgba(124, 58, 237, 0.5);
      color: #ffffff;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
    }

    .wm-theme-pill:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(0, 132, 255, 0.3);
      border-color: #0084ff;
    }

    .wm-admin-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, #3f1b85, #0084ff);
      color: #ffffff;
      text-decoration: none;
      padding: 7px 15px;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 700;
      box-shadow: 0 8px 25px rgba(63, 27, 133, 0.4);
      transition: all 0.22s ease;
    }

    .wm-admin-pill:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(0, 132, 255, 0.5);
      color: #ffffff;
    }
  `;
  document.head.appendChild(themeStyles);

  // =========================================================================
  // 3. MOUNT FLOATING CONTROLS
  // =========================================================================
  function removeFloatingControls() {
    const el = document.getElementById("wmFloatingControls");
    if (el) el.remove();
  }

  // =========================================================================
  // 4. DYNAMIC CMS CONTENT HYDRATION
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

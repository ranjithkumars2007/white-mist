/**
 * WHITE MIST - FORMULA & INGREDIENT ORBITAL VISUALIZER
 * Interactive planetary science visualization with dynamic explanation cards.
 */

(function () {
  'use strict';

  const formulaData = {
    cleaning: {
      title: 'CLEANING POWER',
      subtitle: 'Multi-Surfactant Soil Release Matrix',
      description: 'Engineered with synergistic anionic and non-ionic active agents that reduce water surface tension instantly, lifting tough grease, everyday dirt, and street grime from deep fabric weaves.',
      icon: 'sparkles',
      stats: '99.4% Dirt Removal Efficiency'
    },
    freshness: {
      title: '48H FRESHNESS',
      subtitle: 'Touch-Activated Micro-Capsule Technology',
      description: 'Microscopic fragrance pearls bind securely to textile fibers during the final rinse. Each friction movement throughout the day breaks individual pearls, releasing fresh ocean scent bursts for up to 48 hours.',
      icon: 'wind',
      stats: '48 Hours Long-Lasting Fragrance'
    },
    fabric: {
      title: 'FABRIC CARE',
      subtitle: 'Color-Lock & Fiber Smoothing Polymers',
      description: 'Special conditioning polymers wrap around cotton and synthetic threads, preventing micro-fibril fraying, bobbling, and pigment wash-out. Keeps colored garments vivid and white shirts luminous wash after wash.',
      icon: 'shield',
      stats: 'Zero Fabric Thinning or Fraying'
    },
    stain: {
      title: 'BIO-STAIN REMOVAL',
      subtitle: 'Quad-Enzyme Catalytic Action',
      description: 'High-potency Protease, Amylase, Lipase, and Cellulase bio-enzymes surgically dismantle organic stains including coffee, sweat, grease, tea, blood, and sauces without harsh bleaching.',
      icon: 'zap',
      stats: '10x Bio-Enzyme Deep Penetration'
    }
  };

  function initOrbital() {
    const nodes = document.querySelectorAll('.orbital-node');
    const titleEl = document.getElementById('orbitDetailTitle');
    const subEl = document.getElementById('orbitDetailSub');
    const descEl = document.getElementById('orbitDetailDesc');
    const statsEl = document.getElementById('orbitDetailStats');

    if (!nodes.length || !titleEl) return;

    function selectNode(key) {
      const data = formulaData[key];
      if (!data) return;

      nodes.forEach((n) => {
        n.classList.toggle('active', n.dataset.node === key);
      });

      titleEl.textContent = data.title;
      subEl.textContent = data.subtitle;
      descEl.textContent = data.description;
      if (statsEl) statsEl.textContent = data.stats;

      // Visual pulse
      const explainer = document.querySelector('.orbital-explainer-card');
      if (explainer) {
        explainer.style.transform = 'scale(0.98)';
        setTimeout(() => {
          explainer.style.transform = 'scale(1)';
        }, 150);
      }
    }

    nodes.forEach((node) => {
      node.addEventListener('mouseenter', () => {
        selectNode(node.dataset.node);
      });
      node.addEventListener('click', () => {
        selectNode(node.dataset.node);
      });
    });

    // Default selection
    selectNode('stain');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOrbital);
  } else {
    initOrbital();
  }
})();

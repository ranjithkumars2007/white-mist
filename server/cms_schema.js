/**
 * WHITE MIST — Extended CMS Schema & Data Models
 * Defines comprehensive defaults for:
 * - Header & Navigation
 * - Theme Settings (Light, Dark, System tokens)
 * - Brand Story / About Us
 * - Benefits & Features
 * - Ingredients & Usage Information
 * - Testimonials
 * - PDP Settings
 * - Contact Information
 * - Footer Editor
 * - SEO Management
 * - Visual Sections Builder
 * - Publishing Status & Drafts
 */

function getDefaultCmsData() {
  return {
    headerNav: {
      logoText: 'White Mist',
      logoImage: '/assets/images/logo.png',
      announcementBar: {
        enabled: true,
        text: '✦ FREE EXPRESS DELIVERY ACROSS INDIA ON ORDERS OVER ₹499 • 100% GENTLE BIO-ENZYME FORMULA ✦',
        bgColor: '#3f1b85',
        textColor: '#ffffff',
        link: '#products'
      },
      navLinks: [
        { id: 'nav_home', label: 'Home', url: '/', isHighlight: false },
        { id: 'nav_detergents', label: 'Liquid Detergents', url: '#products', isHighlight: false },
        { id: 'nav_bulk', label: 'Bulk Order Quote', url: '#bulk-quote', isHighlight: false },
        { id: 'nav_sample', label: 'Request Free Sample', url: '#free-sample', isHighlight: false },
        { id: 'nav_dose', label: 'Dose Guide', url: '#dose-calculator', isHighlight: false }
      ],
      headerCta: {
        label: 'Shopping Bag',
        url: '#cart',
        showBadge: true
      }
    },

    themeSettings: {
      defaultTheme: 'light',
      allowPublicSwitching: true,
      lightBgMain: '#fafcff',
      lightTextMain: '#1e1b4b',
      darkBgMain: '#070311',
      darkCardBg: '#100722',
      darkTextMain: '#ffffff',
      primaryPurple: '#3f1b85',
      accentOceanBlue: '#0084ff',
      accentFloralPink: '#f01262',
      accentCitrusYellow: '#d97706',
      fontHeading: "'Baloo 2', 'Poppins', sans-serif",
      fontBody: "'Inter', system-ui, sans-serif"
    },

    brandStory: {
      heroTitle: 'Care Beyond Clean',
      heroSubtitle: 'Born from a simple belief: your favorite clothes deserve more than harsh chalk powders.',
      vision: 'To deliver clinical-grade stain removal combined with gentle silk-like yarn conditioning in every Indian household.',
      mission: 'Zero chalk residue, 100% instant cold water dissolution, and 70% reduced virgin plastic waste.',
      storyParagraphs: [
        'Traditional washing powders rely on cheap limestone or calcium carbonate fillers that settle into cloth weaves, causing stiff fabric, faded colors, and scratchy collars.',
        'White Mist was engineered from the molecular level up. Our active bio-surfactants penetrate deep into fiber yarns within 3 seconds of water contact, lifting stains from the inside out.',
        'Engineered for front and top-loading automatic machines, our low-foam rinse technology protects sensitive electronic motors while saving up to 40% water per wash cycle.'
      ],
      keyMetrics: [
        { value: '10x', label: 'Faster Bio-Stain Dissolution' },
        { value: '48 Hrs', label: 'Micro-Capsule Fragrance Lock' },
        { value: '0%', label: 'Chalky Residue or Grit' },
        { value: '70%', label: 'Plastic Saved in Eco Pouches' }
      ]
    },

    benefits: [
      { id: 'ben_1', icon: '🌡️', title: '70°C Hot Sterilization', desc: 'Eliminates 99.99% of bacteria, viruses, and stubborn grease from Indian kadhais, oily pans, and baby clothes.', order: 1, isActive: true },
      { id: 'ben_2', icon: '🔊', title: '40dB Whisper Quiet', desc: 'Acoustic insulation panels and BLDC EcoSilent motors ensure disturbance-free washing, perfect for night cycles.', order: 2, isActive: true },
      { id: 'ben_3', icon: '💧', title: '70% Water Saving', desc: 'Uses only 9.5 liters of water per eco cycle compared to 40+ liters required during traditional manual tap handwashing.', order: 3, isActive: true },
      { id: 'ben_4', icon: '🛡️', title: '2-Year Direct Warranty', desc: 'Comprehensive door-step coverage, free installation by certified technicians, and 10-year motor guarantee.', order: 4, isActive: true }
    ],

    ingredientsUsage: {
      heading: 'Certified Formulation & Precise Dosing',
      subtitle: 'Pure, safe, and laboratory-verified ingredients designed for maximum cleaning performance with zero garment wear.',
      dosageGuide: [
        { loadType: 'Regular Load (5–6 kg)', lightSoil: '30 ml', mediumSoil: '40 ml (1 Cap)', heavySoil: '60 ml (1.5 Caps)' },
        { loadType: 'Heavy Load / Curtains (7–9 kg)', lightSoil: '45 ml', mediumSoil: '60 ml (1.5 Caps)', heavySoil: '80 ml (2 Caps)' },
        { loadType: 'Bucket Handwash (10L Water)', lightSoil: '15 ml', mediumSoil: '25 ml', heavySoil: '35 ml' }
      ],
      fabricMatrix: [
        { fabric: 'Cottons & Linens', recommendedVariant: 'Ocean Fresh (Blue)', cycle: 'Normal / Warm 40°C', notes: 'Deep stain lifting' },
        { fabric: 'Silks & Delicates', recommendedVariant: 'Floral Bloom (Pink)', cycle: 'Delicate / Cold 30°C', notes: 'Protects yarn softness' },
        { fabric: 'Workwear & Denims', recommendedVariant: 'Citrus Sunshine (Yellow)', cycle: 'Heavy Duty / 40°C', notes: 'Cuts grease & sports grime' }
      ],
      activeIngredients: [
        { name: 'Bio-Enzymes (Protease, Amylase, Lipase)', purpose: 'Breaks down proteins, starches, and oily residue into water-soluble molecules' },
        { name: 'Plant-Derived Non-Ionic Surfactants', purpose: 'Gentle lifting action with low foam index for machine pump longevity' },
        { name: 'Micro-Encapsulated Fragrance Spheres', purpose: 'Slow-release floral and ocean scents activated by body heat and movement' },
        { name: 'Anti-Redeposition Polymers', purpose: 'Prevents suspended dirt from settling back onto clean garments during rinse' }
      ]
    },

    testimonials: [
      { id: 't1', author: 'Priya Sundaram', location: 'Bengaluru', rating: 5, variantUsed: 'Ocean Fresh (1L)', comment: 'Switched from powdered detergent 3 months ago. The difference in my black trousers and kurtas is unbelievable—absolutely zero white streaks or chalk residue!', verifiedBuyer: true, date: '2026-10-15' },
      { id: 't2', author: 'Rajesh Nambiar', location: 'Chennai', rating: 5, variantUsed: 'Citrus Sunshine (2L)', comment: 'Removes tough sambar and oil stains without vigorous brushing. And the citrus fragrance leaves gym clothes smelling crisp for days.', verifiedBuyer: true, date: '2026-10-12' },
      { id: 't3', author: 'Meera Patel', location: 'Mumbai', rating: 5, variantUsed: 'Floral Bloom (1L)', comment: 'Extremely gentle on silk sarees and soft cottons. My front-load washing machine uses much less water now and smells fresh every time.', verifiedBuyer: true, date: '2026-10-08' },
      { id: 't4', author: 'Amitabh Sen', location: 'Kolkata', rating: 5, variantUsed: 'Twin Master Bundle', comment: 'The value refill pouches are fantastic. Saves plastic and money. The pour spout makes refilling our bottle 100% mess-free.', verifiedBuyer: true, date: '2026-10-02' }
    ],

    pdpSettings: {
      enableQuickView: true,
      enableReviewsTab: true,
      enableDosageTab: true,
      enableSpecificationsTab: true,
      defaultDeliveryPincode: '560001',
      deliveryEstimateText: 'Free Express Dispatch within 24–48 hours across India',
      guaranteeBadgeText: '100% Satisfaction Guarantee • Easy 7-Day Replacement'
    },

    contactInfo: {
      supportEmail: 'support@whitemistcare.com',
      supportPhone: '+91 98765 43210',
      whatsappNumber: '+91 98765 43210',
      operatingHours: 'Monday to Saturday: 9:00 AM – 7:00 PM IST',
      address: '42, Textile Garden Avenue, Near Green Mills, Coimbatore, Tamil Nadu — 641001',
      responsePromise: 'We respond to all customer enquiries within 2–4 business hours.',
      mapUrl: 'https://maps.google.com'
    },

    footer: {
      logo: '/assets/images/logo.png',
      description: 'White Mist is an ultra-premium liquid detergent formulated with active bio-enzymes, low-foam rinse technology, and color-lock protection. Engineered for front & top load washing machines.',
      copyrightText: '© 2026 Meridian White Mist Ltd. All rights reserved. Premium Liquid Detergent Brand.',
      newsletterHeading: 'Get Fabric Care Tips & Exclusive Discounts',
      newsletterSubtext: 'Join 15,000+ Indian households who care for their clothes the modern way.',
      socialLinks: [
        { platform: 'Instagram', url: 'https://instagram.com/whitemist' },
        { platform: 'Facebook', url: 'https://facebook.com/whitemist' },
        { platform: 'YouTube', url: 'https://youtube.com/whitemist' }
      ],
      quickLinks: [
        { label: 'Daily Wash Liquid', url: '#products' },
        { label: 'Delicate Fabric Care', url: '#products' },
        { label: 'Tough Stain Remover', url: '#products' },
        { label: 'Eco Refill Pouches', url: '#products' }
      ],
      supportLinks: [
        { label: 'Dose Calculator', url: '#dose-calculator' },
        { label: 'Stain Removal Guide', url: '#stain-demo' },
        { label: 'Machine Compatibility', url: '#benefits' },
        { label: 'Track My Order', url: '#orders' }
      ]
    },

    seoSettings: {
      siteTitle: 'White Mist Liquid Detergent | 10x Bio-Stain Action & 48hr Freshness',
      metaDescription: 'Shop Meridian White Mist Liquid Detergent in Blue Ocean Fresh, Pink Floral Bloom, and Yellow Citrus Sunshine. Engineered for Front & Top Load Washing Machines with 10x Bio-Enzyme stain removal.',
      keywords: 'White Mist detergent, liquid detergent, laundry detergent, front load detergent, top load detergent, bio enzyme stain remover, eco refill pouch',
      ogImage: '/assets/images/fresh_clean_fabrics.jpg',
      canonicalUrl: 'https://white-mist.vercel.app/',
      robots: 'index, follow'
    },

    visualSections: [
      { id: 'sec_announcement', name: 'Top Announcement Bar', isEnabled: true, order: 1 },
      { id: 'sec_header', name: 'Global Sticky Header & Nav', isEnabled: true, order: 2 },
      { id: 'sec_hero', name: 'Full-Screen Hero & Fragrance Switcher', isEnabled: true, order: 3 },
      { id: 'sec_benefits', name: 'Brand Benefits Strip (70°C, 40dB, 70% Water)', isEnabled: true, order: 4 },
      { id: 'sec_stain_demo', name: 'Interactive Stain Slider (10x Bio-Clean)', isEnabled: true, order: 5 },
      { id: 'sec_shirt_wash', name: '3D Fabric Wash Scroll Animation', isEnabled: true, order: 6 },
      { id: 'sec_products', name: 'Featured Products Catalogue', isEnabled: true, order: 7 },
      { id: 'sec_calculator', name: 'Precision Dosing Calculator', isEnabled: true, order: 8 },
      { id: 'sec_saver_pack', name: 'Super Saver Refill Combo', isEnabled: true, order: 9 },
      { id: 'sec_testimonials', name: 'Customer Reviews & Ratings', isEnabled: true, order: 10 },
      { id: 'sec_faq', name: 'Frequently Asked Questions', isEnabled: true, order: 11 },
      { id: 'sec_footer', name: 'Global Footer & Newsletter', isEnabled: true, order: 12 }
    ],

    publishStatus: {
      hasUnpublishedDrafts: false,
      lastPublishedAt: '2026-10-24T14:00:00.000Z',
      publishedBy: 'admin@whitemist.com'
    }
  };
}

function ensureCmsSchema(state) {
  const defaults = getDefaultCmsData();
  let changed = false;

  for (const [key, val] of Object.entries(defaults)) {
    if (!state[key]) {
      state[key] = val;
      changed = true;
    }
  }

  // Ensure homepage has extended sections
  if (state.homepage) {
    if (!state.homepage.stainDemo) {
      state.homepage.stainDemo = {
        heading: 'Drag to Reveal 10x Bio-Clean Magic',
        subtitle: 'Slide across the fabric below to see how White Mist active bio-enzymes penetrate deep fibers, dissolving tough stains instantly without harming fabric color.',
        stains: [
          { id: 'stain_oil', name: 'Tough Cooking Oil & Kadhai Grease', beforeImg: '/assets/images/stain_grease_before.jpg', afterImg: '/assets/images/fabric_clean.jpg', active: true },
          { id: 'stain_mud', name: 'Stubborn Mud & Grass Stains', beforeImg: '/assets/images/stain_mud_before.jpg', afterImg: '/assets/images/fabric_clean.jpg', active: true },
          { id: 'stain_tea', name: 'Dark Coffee, Tea & Turmeric', beforeImg: '/assets/images/stain_coffee_before.jpg', afterImg: '/assets/images/fabric_clean.jpg', active: true },
          { id: 'stain_sweat', name: 'Yellow Collar Sweat & Odor', beforeImg: '/assets/images/stain_sweat_before.jpg', afterImg: '/assets/images/fabric_clean.jpg', active: true }
        ]
      };
      changed = true;
    }

    if (!state.homepage.heroVariants) {
      state.homepage.heroVariants = [
        { id: 'variant_blue', name: 'Blue Ocean Fresh', color: '#0084ff', bottleImg: '/assets/images/bottle_blue.png', pouchImg: '/assets/images/pouch_blue.png', tag: 'Bestseller' },
        { id: 'variant_pink', name: 'Pink Floral Bloom', color: '#f01262', bottleImg: '/assets/images/bottle_pink.png', pouchImg: '/assets/images/pouch_pink.png', tag: 'Gentle Care' },
        { id: 'variant_yellow', name: 'Yellow Citrus Sunshine', color: '#d97706', bottleImg: '/assets/images/bottle_yellow.png', pouchImg: '/assets/images/pouch_yellow.png', tag: 'Tough Stain Action' }
      ];
      changed = true;
    }

    if (!state.homepage.shirtWash) {
      state.homepage.shirtWash = {
        heading: 'The 3D Micro-Fiber Deep Clean',
        subtitle: 'Watch dirt particles disintegrate as bio-enzymes lock onto collar grease and restore fabric brightness.',
        stainedShirtImg: '/assets/images/shirt_stained_before.png',
        cleanShirtImg: '/assets/images/shirt_clean_after.png',
        badgeText: '1 Wash Cycle Result'
      };
      changed = true;
    }
  }

  return changed;
}

module.exports = {
  getDefaultCmsData,
  ensureCmsSchema
};

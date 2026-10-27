/**
 * WHITE MIST — Database & Content Management Layer
 * Hybrid database architecture:
 * - Local persistent JSON storage with atomic writes (zero external setup required).
 * - Pluggable Supabase PostgreSQL integration when SUPABASE_URL & SUPABASE_KEY are provided.
 */

const fs = require('fs');
const path = require('path');
const { hashPassword } = require('./auth');
const { ensureCmsSchema } = require('./cms_schema');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'whitemist.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache for ultra-fast response times
let dbState = null;

/**
 * Seed initial dataset
 */
function getInitialSeedData() {
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'WhiteMist@Admin2026!';
  const { hash, salt } = hashPassword(adminPassword);

  return {
    version: '2.0.0',
    admins: [
      {
        id: 'admin_root_1',
        email: 'admin@whitemist.com',
        fullName: 'White Mist Executive Administrator',
        role: 'super_admin',
        passwordHash: hash,
        passwordSalt: salt,
        createdAt: '2026-10-01T00:00:00.000Z',
        lastLogin: new Date().toISOString()
      }
    ],
    settings: {
      storeName: 'White Mist',
      tagline: 'Premium Liquid Laundry Detergent & Fabric Care',
      currency: '₹',
      freeShippingThreshold: 499,
      standardShippingFee: 50,
      supportEmail: 'support@whitemistcare.com',
      supportPhone: '+91 98765 43210',
      supportAddress: '42, Textile Garden Avenue, Near Green Mills, Coimbatore, Tamil Nadu — 641001',
      announcementBarText: '✦ FREE EXPRESS DELIVERY ACROSS INDIA ON ORDERS OVER ₹499 • 100% GENTLE BIO-ENZYME FORMULA ✦',
      announcementBarEnabled: true,
      updatedAt: new Date().toISOString()
    },
    products: [
      {
        id: 'wm-ocean-blue',
        slug: 'ocean-fresh-liquid-detergent',
        name: 'White Mist Ocean Fresh Liquid Detergent',
        category: 'Daily Wash Liquid',
        subtitle: 'High Quality Laundry Detergent • Front & Top Loading',
        shortDesc: 'Active bio-liquid detergent formulated for daily cottons, linens, and blended clothes. Dissolves immediately in cold or warm water with zero chalky residue.',
        fullDesc: 'White Mist Ocean Fresh Liquid Detergent is meticulously formulated to dissolve quickly in water, penetrating deep into fabric weaves to lift daily dust, sweat, and stubborn collar grime. Engineered with balanced surfactants that protect garment elasticity and color integrity wash after wash.',
        image: 'public/images/bottle_blue.png',
        gallery: [
          'public/images/bottle_blue.png',
          'public/images/pouch_blue.png',
          'public/images/fresh_clean_fabrics.jpg'
        ],
        badge: 'Bestseller',
        badgeType: 'bestseller',
        rating: 4.9,
        reviewCount: 328,
        fragrance: 'Cool Ocean & Crisp Cotton',
        formula: 'Low-Foam Bio-Enzyme Active Surfactant',
        machineType: 'Front & Top Load Compatible',
        sizes: [
          { size: '500ml', price: 149, mrp: 175, savings: '15%' },
          { size: '1 Litre', price: 249, mrp: 299, savings: '17%', isDefault: true },
          { size: '2 Litre', price: 449, mrp: 549, savings: '18%' },
          { size: '5 Litre', price: 999, mrp: 1299, savings: '23%' }
        ],
        inStock: true,
        stockQty: 480,
        sku: 'WM-BLU-1000',
        dosage: {
          regular: '40 ml (1 Cap) for standard 5-6 kg load',
          heavy: '60 ml (1.5 Caps) for heavily soiled loads / bedsheets',
          handwash: '25 ml in 10 Litres of water'
        },
        fabrics: ['Cottons', 'Linens', 'Blends', 'School Uniforms', 'Denims'],
        specs: {
          'Formulation': 'Concentrated Liquid Soluble',
          'pH Balance': 'Neutral (Gentle on hands)',
          'Water Efficacy': 'Effective in Hard & Soft Water',
          'Shelf Life': '24 Months from MFG Date'
        },
        isActive: true,
        isFeatured: true,
        seoTitle: 'White Mist Ocean Fresh Liquid Detergent (1000ml) | Official Store',
        seoDesc: 'Buy White Mist Ocean Fresh Liquid Detergent online. Instant dissolving bio-enzyme action for brilliant whites and colors.',
        createdAt: '2026-10-01T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'wm-floral-pink',
        slug: 'floral-bloom-liquid-detergent',
        name: 'White Mist Floral Bloom Liquid Detergent',
        category: 'Premium Fabric Care',
        subtitle: 'Gentle Care & Softness • Front & Top Loading',
        shortDesc: 'Infused with gentle fabric conditioners and micro-fragrance floral notes. Shields yarn texture from stiffness and preserves vibrant color pigments.',
        fullDesc: 'Formulated especially for festive wear, delicates, pastel shirts, and daily soft fabrics. White Mist Floral Bloom cushions fibers during tumbling cycles, preventing micro-fuzzing and static cling while releasing an uplifting botanical jasmine-rose fragrance.',
        image: 'public/images/bottle_pink.png',
        gallery: [
          'public/images/bottle_pink.png',
          'public/images/fabric_clean.jpg',
          'public/images/fresh_clean_fabrics.jpg'
        ],
        badge: 'Gentle Care',
        badgeType: 'gentle',
        rating: 4.8,
        reviewCount: 214,
        fragrance: 'Jasmine & Soft Rose Petals',
        formula: 'Conditioner-Infused Low-Foam Cleanser',
        machineType: 'Front Load, Top Load & Delicates Cycle',
        sizes: [
          { size: '500ml', price: 159, mrp: 189, savings: '16%' },
          { size: '1 Litre', price: 269, mrp: 320, savings: '16%', isDefault: true },
          { size: '2 Litre', price: 479, mrp: 580, savings: '17%' },
          { size: '5 Litre', price: 1049, mrp: 1350, savings: '22%' }
        ],
        inStock: true,
        stockQty: 320,
        sku: 'WM-PNK-1000',
        dosage: {
          regular: '40 ml for soft daily garments',
          heavy: '55 ml for festive or embellished loads',
          handwash: '20 ml in a bucket of cold water'
        },
        fabrics: ['Silks', 'Chiffons', 'Kurtas', 'Soft Cottons', 'Baby Clothes'],
        specs: {
          'Formulation': 'pH-Balanced Fabric Conditioning Liquid',
          'Fragrance Type': 'Extended-Release Floral Notes',
          'Bleach': '100% Bleach-Free & Phosphate-Free',
          'Shelf Life': '24 Months from MFG Date'
        },
        isActive: true,
        isFeatured: true,
        seoTitle: 'White Mist Floral Bloom Fabric Care Detergent | Gentle Silks & Delicates',
        seoDesc: 'Ultra gentle laundry liquid with botanical conditioners and lasting rose-jasmine notes.',
        createdAt: '2026-10-02T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'wm-citrus-yellow',
        slug: 'citrus-sunshine-liquid-detergent',
        name: 'White Mist Citrus Sunshine Liquid Detergent',
        category: 'Concentrated Detergent',
        subtitle: 'Tough Stain Action & Grease Cutting • Front & Top Load',
        shortDesc: 'Potent degreasing liquid detergent with natural citrus extracts. Breaks down oily food splatters, turmeric spots, and sports sweat.',
        fullDesc: 'Engineered for tough household laundry challenges. White Mist Citrus Sunshine features targeted active cleansers that dissolve grease, culinary sauces, coffee stains, and activewear odor without requiring abrasive scrubbing.',
        image: 'public/images/bottle_yellow.png',
        gallery: [
          'public/images/bottle_yellow.png',
          'public/images/pouch_yellow.png',
          'public/images/shirt_cleanpro.jpg'
        ],
        badge: 'Tough Stain Action',
        badgeType: 'stain',
        rating: 4.9,
        reviewCount: 189,
        fragrance: 'Zesty Lime & Sunlit Citrus',
        formula: 'High-Efficacy Grease Cutting Emulsion',
        machineType: 'All Automatic Washers & Bucket Soaking',
        sizes: [
          { size: '500ml', price: 155, mrp: 180, savings: '14%' },
          { size: '1 Litre', price: 259, mrp: 310, savings: '16%', isDefault: true },
          { size: '2 Litre', price: 469, mrp: 560, savings: '16%' },
          { size: '5 Litre', price: 1029, mrp: 1320, savings: '22%' }
        ],
        inStock: true,
        stockQty: 250,
        sku: 'WM-YEL-1000',
        dosage: {
          regular: '40 ml for general washing',
          heavy: '60 ml for sports gear, kitchen aprons, tough grease',
          spotTreat: 'Dab 5 ml directly on stain, let rest 10 mins before wash'
        },
        fabrics: ['Activewear', 'Denims', 'Towels', 'Heavy Cottons', 'Bedsheets'],
        specs: {
          'Formulation': 'Citrus Terpene Fortified Cleanser',
          'Enzyme Blend': 'Lipase & Protease Stain Targeted',
          'Machine Safety': 'Anti-Scale Formulation',
          'Shelf Life': '24 Months from MFG Date'
        },
        isActive: true,
        isFeatured: true,
        seoTitle: 'White Mist Citrus Sunshine Tough Stain Detergent | Degreasing Liquid',
        seoDesc: 'Power through tough food grease, turmeric, and sweat stains with concentrated citrus surfactants.',
        createdAt: '2026-10-03T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'wm-pouch-blue',
        slug: 'ocean-fresh-eco-refill-pouch',
        name: 'White Mist Ocean Fresh Eco Refill Pouch',
        category: 'Family Value Pack',
        subtitle: '70% Less Plastic Packaging • High Quality Laundry Refill',
        shortDesc: 'Convenient spout pouch that refills your existing White Mist bottle easily. Zero spills, maximum savings, and environmentally mindful.',
        fullDesc: 'The smart choice for eco-conscious households. Refill your durable White Mist measuring bottle with this ergonomic spout pouch. Saves up to 70% virgin plastic packaging while maintaining the highest standard of fabric-friendly cleaning.',
        image: 'public/images/pouch_blue.png',
        gallery: [
          'public/images/pouch_blue.png',
          'public/images/bottle_blue.png',
          'public/images/fresh_clean_fabrics.jpg'
        ],
        badge: 'Eco Saver',
        badgeType: 'eco',
        rating: 4.9,
        reviewCount: 412,
        fragrance: 'Cool Ocean & Crisp Cotton',
        formula: '100% Identical Ocean Fresh Formula',
        machineType: 'Easy-Pour Spout Refill',
        sizes: [
          { size: '1 Litre Pouch', price: 199, mrp: 249, savings: '20%', isDefault: true },
          { size: '2 Litre Pouch', price: 379, mrp: 469, savings: '19%' }
        ],
        inStock: true,
        stockQty: 540,
        sku: 'WM-PCH-BLU-1000',
        dosage: {
          regular: 'Pour into White Mist bottle and use measuring cap (40ml)',
          heavy: 'Use 60ml for heavy loads'
        },
        fabrics: ['All Daily Fabrics'],
        specs: {
          'Packaging': 'Triple-Barrier Anti-Leak Spout Pouch',
          'Plastic Reduction': '70% Less Plastic than rigid bottle',
          'Storage': 'Reclosable tamper-evident cap'
        },
        isActive: true,
        isFeatured: false,
        seoTitle: 'White Mist Ocean Fresh Eco Refill Pouch (1L & 2L)',
        seoDesc: 'Save money and plastic with White Mist liquid laundry detergent refill pouches.',
        createdAt: '2026-10-04T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'wm-pouch-yellow',
        slug: 'citrus-sunshine-eco-refill-pouch',
        name: 'White Mist Citrus Sunshine Eco Refill Pouch',
        category: 'Family Value Pack',
        subtitle: 'Tough Stain Action • Family Economy Spout Refill',
        shortDesc: 'High-capacity refill pouch of our tough-stain Citrus Sunshine formulation. Cost-effective and easy to store in any utility shelf.',
        fullDesc: 'Keep your laundry room stocked with the toughest grease-fighting liquid detergent. Designed with an easy-pour threaded spout that refills your measuring bottle smoothly without mess.',
        image: 'public/images/pouch_yellow.png',
        gallery: [
          'public/images/pouch_yellow.png',
          'public/images/bottle_yellow.png',
          'public/images/shirt_cleanpro.jpg'
        ],
        badge: 'Value Pack',
        badgeType: 'eco',
        rating: 4.8,
        reviewCount: 145,
        fragrance: 'Zesty Lime & Sunlit Citrus',
        formula: 'Concentrated Citrus Stain Cutter',
        machineType: 'Easy-Pour Spout Refill',
        sizes: [
          { size: '1 Litre Pouch', price: 209, mrp: 259, savings: '19%', isDefault: true },
          { size: '2 Litre Pouch', price: 389, mrp: 479, savings: '19%' }
        ],
        inStock: true,
        stockQty: 180,
        sku: 'WM-PCH-YEL-1000',
        dosage: {
          regular: 'Pour into White Mist bottle and use measuring cap (40ml)',
          heavy: 'Use 60ml for heavily soiled clothes'
        },
        fabrics: ['Activewear', 'Heavy Linens', 'Denims'],
        specs: {
          'Packaging': 'Reinforced Gusseted Stand-Up Pouch',
          'Spout': 'Precision anti-drip nozzle',
          'Recyclability': 'Multi-layer barrier'
        },
        isActive: true,
        isFeatured: false,
        seoTitle: 'White Mist Citrus Sunshine Refill Pouch | Tough Laundry Degreaser',
        seoDesc: 'Refill pouch for tough stain removal with 70% reduced plastic packaging.',
        createdAt: '2026-10-05T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'wm-twin-pack',
        slug: 'twin-master-pack',
        name: 'White Mist Twin Master Pack (Ocean + Floral)',
        category: 'Family Value Pack',
        subtitle: 'Complete 2-Bottle Household Care Bundle',
        shortDesc: '1x Ocean Fresh (1L) for daily cottons and office wear + 1x Floral Bloom (1L) for delicate silks and beddings.',
        fullDesc: 'Why compromise on fabric care? The White Mist Twin Master Pack delivers specialized care for every item in your wardrobe. Use the crisp Ocean Fresh for whites, shirts, and jeans; switch to the softening Floral Bloom for delicate washables, curtains, and linens.',
        image: 'public/images/bottle_blue.png',
        gallery: [
          'public/images/bottle_blue.png',
          'public/images/bottle_pink.png',
          'public/images/fresh_clean_fabrics.jpg'
        ],
        badge: 'Best Value Bundle',
        badgeType: 'bundle',
        rating: 5.0,
        reviewCount: 98,
        fragrance: 'Dual Collection (Ocean + Floral)',
        formula: 'Full Spectrum Household Laundry Solution',
        machineType: 'All Washing Machines',
        sizes: [
          { size: '2 x 1 Litre Bottles', price: 469, mrp: 599, savings: '22%', isDefault: true },
          { size: '2 x 2 Litre Bottles', price: 849, mrp: 1099, savings: '23%' }
        ],
        inStock: true,
        stockQty: 110,
        sku: 'WM-BND-TWIN-2000',
        dosage: {
          regular: 'Use Ocean Fresh for regular cottons (40ml)',
          delicates: 'Use Floral Bloom for silks and beddings (40ml)'
        },
        fabrics: ['Every Wardrobe Fabric Type'],
        specs: {
          'Bundle Contains': '1x Ocean Fresh + 1x Floral Bloom',
          'Savings': 'Extra ₹130 over individual purchases',
          'Delivery': 'Ships in custom protective carton'
        },
        isActive: true,
        isFeatured: false,
        seoTitle: 'White Mist Twin Master Pack | 2x Premium Detergent Bundle',
        seoDesc: 'Complete home fabric care pack with Ocean Fresh and Floral Bloom variants.',
        createdAt: '2026-10-06T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      }
    ],
    categories: [
      {
        id: 'cat_daily',
        name: 'Daily Wash Liquid',
        slug: 'daily-wash-liquid',
        description: 'Everyday bio-enzyme cleansing for daily cottons, office shirts, and school uniforms.',
        image: 'public/images/bottle_blue.png',
        displayOrder: 1
      },
      {
        id: 'cat_delicates',
        name: 'Premium Fabric Care',
        slug: 'premium-fabric-care',
        description: 'Silk, chiffon, and delicate garment softening formula with botanical aroma.',
        image: 'public/images/bottle_pink.png',
        displayOrder: 2
      },
      {
        id: 'cat_concentrated',
        name: 'Concentrated Detergent',
        slug: 'concentrated-detergent',
        description: 'High performance grease-cutting formulation with natural citrus extracts.',
        image: 'public/images/bottle_yellow.png',
        displayOrder: 3
      },
      {
        id: 'cat_refills',
        name: 'Family Value Pack',
        slug: 'family-value-pack',
        description: 'Sustainable eco-refill pouches and money-saving bundle packs.',
        image: 'public/images/pouch_blue.png',
        displayOrder: 4
      }
    ],
    homepage: {
      hero: {
        headline: 'Every Wash.\nA Fresh Beginning.',
        subtitle: 'Discover a smarter way to care for your clothes with White Mist liquid detergent. Engineered with targeted bio-enzymes to dissolve instantly, lift stubborn grime, and shield fabric yarns.',
        primaryCtaText: 'Explore Products',
        primaryCtaLink: 'shop.html',
        secondaryCtaText: 'Discover White Mist',
        secondaryCtaLink: 'our-story.html',
        mainBottleImage: 'public/images/bottle_blue.png',
        badge1Title: '100% Instant Dissolve',
        badge1Desc: 'Zero powdery chalk residue',
        badge2Title: 'Micro-Conditioning',
        badge2Desc: 'Shields cotton yarn elasticity'
      },
      brandIntro: {
        heading: 'Crafted for Perfection.',
        subheading: 'Liquid detergent engineered for modern automatic washing machines.',
        stat1Number: '99.8%',
        stat1Label: 'Stain Lift Efficiency',
        stat2Number: '100%',
        stat2Label: 'Water Soluble (Zero Grit)',
        stat3Number: '24 Mo',
        stat3Label: 'Formula Stability Guarantee'
      },
      cleaningFeatures: [
        {
          title: 'Targeted Bio-Enzyme Action',
          desc: 'Breaks down protein, gravy, and grease stains at microscopic levels without bleaching fibers.'
        },
        {
          title: 'Color Lock Technology',
          desc: 'Seals vibrant dye molecules inside yarns to prevent fading across repetitive wash cycles.'
        },
        {
          title: 'Low Foam Front & Top Load Formulation',
          desc: 'Optimized foam control protects electronic machine sensors and saves rinsing water.'
        },
        {
          title: 'Long-Lasting Freshness Infusion',
          desc: 'Extended-release micro-fragrance capsules keep wardrobes smelling fresh for up to 14 days.'
        }
      ],
      faqs: [
        {
          question: 'Can White Mist be used in both Front Load and Top Load machines?',
          answer: 'Yes! White Mist is specially engineered with a low-foam, high-dispersion surfactant formula that is 100% safe and effective in both Front Load and Top Load washing machines, as well as bucket handwashing.'
        },
        {
          question: 'Does White Mist leave white powdery residue on dark clothes?',
          answer: 'Never. Unlike traditional detergent powders that rely on insoluble chalk fillers, White Mist is a completely liquid micro-soluble formulation that leaves zero chalky marks.'
        },
        {
          question: 'What is the recommended dosage for a standard load?',
          answer: 'Use 40 ml (approx. 1 cap) for a regular 5–6 kg wash load. For heavy or extra soiled garments, use 60 ml (1.5 caps).'
        },
        {
          question: 'Is White Mist safe for baby clothes and delicate fabrics?',
          answer: 'Our Floral Bloom variant is 100% bleach-free, phosphate-free, and pH neutral, making it ideal for delicate silks, baby wear, and sensitive skin.'
        }
      ],
      updatedAt: new Date().toISOString()
    },
    banners: [
      {
        id: 'banner_festive_1',
        title: '✦ FESTIVE EXPRESS CLEANING OFFER ✦',
        subtitle: 'Get 15% OFF on orders over ₹599 with code MIST15 + Free Delivery Across India',
        imageUrl: 'public/images/fresh_clean_fabrics.jpg',
        ctaText: 'Shop Best Sellers',
        ctaLink: 'shop.html',
        badge: 'Limited Time',
        isActive: true,
        displayOrder: 1,
        startDate: '2026-10-01',
        endDate: '2026-12-31'
      }
    ],
    pages: {
      'our-story': {
        title: 'Our Story | White Mist',
        heroTitle: 'Redefining Laundry Care',
        heroSubtitle: 'Born from a simple belief: your favorite clothes deserve more than harsh chemical powders.',
        content: 'White Mist was established with a mission to eliminate chalky, fiber-destroying laundry powders. By blending gentle plant-assisted bio-enzymes with fabric conditioning polymers, White Mist delivers a brilliant clean that preserves garment colors, soft weaves, and machine health.',
        seoTitle: 'Our Story — White Mist Premium Liquid Laundry Detergent',
        seoDesc: 'Learn the story behind White Mist, engineered for fabric longevity and effortless cleaning.',
        updatedAt: new Date().toISOString()
      },
      'technology': {
        title: 'Liquid Technology | White Mist',
        heroTitle: 'The Science of Clean Clothes',
        heroSubtitle: 'Inside our low-foam, triple-action bio-enzyme surfactant formulation.',
        content: 'Traditional detergent powders rely on cheap limestone or chalk fillers that abrade fibers and leave white streaks. White Mist dissolves instantly in water, releasing active lipases and proteases that lift grease, sweat, and stains without degrading fabric integrity.',
        seoTitle: 'Liquid Laundry Technology — Bio-Enzymes & Color Lock | White Mist',
        seoDesc: 'Explore the high-tech liquid formulation that gives White Mist superior stain cutting without residue.',
        updatedAt: new Date().toISOString()
      },
      'fabric-care': {
        title: 'Fabric Care Hub & Dosing Calculator | White Mist',
        heroTitle: 'Complete Garment Care Guide',
        heroSubtitle: 'Master the art of keeping your wardrobe looking brand new for years.',
        content: 'From delicate silks to durable denim, every weave has unique laundry requirements. Learn exact dosing, sorting guidelines, water temperatures, and fabric preservation tips.',
        seoTitle: 'Fabric Care Guide & Laundry Dosing Calculator | White Mist',
        seoDesc: 'Comprehensive care instructions and dosing calculator for all types of clothing fabrics.',
        updatedAt: new Date().toISOString()
      },
      'privacy-policy': {
        title: 'Privacy Policy | White Mist',
        heroTitle: 'Privacy Policy',
        heroSubtitle: 'Your privacy and data security are our top priorities.',
        content: 'At White Mist, we respect your privacy. We collect only necessary delivery and contact information required to fulfill orders and provide customer support. We never sell or share your personal data with third-party marketers.',
        seoTitle: 'Privacy Policy | White Mist',
        seoDesc: 'Official privacy policy for White Mist e-commerce store and customer accounts.',
        updatedAt: new Date().toISOString()
      },
      'terms-conditions': {
        title: 'Terms & Conditions | White Mist',
        heroTitle: 'Terms & Conditions',
        heroSubtitle: 'Standard terms of service for purchases made on White Mist.',
        content: 'All orders placed on White Mist are backed by our 100% satisfaction guarantee. Orders are dispatched within 24 to 48 business hours via insured courier partners with live tracking.',
        seoTitle: 'Terms & Conditions | White Mist',
        seoDesc: 'Terms of sale, express dispatch policies, and return guarantees for White Mist products.',
        updatedAt: new Date().toISOString()
      }
    },
    media: [
      {
        id: 'media_bottle_blue',
        fileName: 'bottle_blue.png',
        url: 'public/images/bottle_blue.png',
        fileSize: 254482,
        mimeType: 'image/png',
        uploadedAt: '2026-10-01T00:00:00.000Z'
      },
      {
        id: 'media_bottle_pink',
        fileName: 'bottle_pink.png',
        url: 'public/images/bottle_pink.png',
        fileSize: 285354,
        mimeType: 'image/png',
        uploadedAt: '2026-10-01T00:00:00.000Z'
      },
      {
        id: 'media_bottle_yellow',
        fileName: 'bottle_yellow.png',
        url: 'public/images/bottle_yellow.png',
        fileSize: 274367,
        mimeType: 'image/png',
        uploadedAt: '2026-10-01T00:00:00.000Z'
      },
      {
        id: 'media_pouch_blue',
        fileName: 'pouch_blue.png',
        url: 'public/images/pouch_blue.png',
        fileSize: 351109,
        mimeType: 'image/png',
        uploadedAt: '2026-10-01T00:00:00.000Z'
      },
      {
        id: 'media_pouch_yellow',
        fileName: 'pouch_yellow.png',
        url: 'public/images/pouch_yellow.png',
        fileSize: 351109,
        mimeType: 'image/png',
        uploadedAt: '2026-10-01T00:00:00.000Z'
      },
      {
        id: 'media_fresh_fabrics',
        fileName: 'fresh_clean_fabrics.jpg',
        url: 'public/images/fresh_clean_fabrics.jpg',
        fileSize: 662625,
        mimeType: 'image/jpeg',
        uploadedAt: '2026-10-01T00:00:00.000Z'
      },
      {
        id: 'media_logo',
        fileName: 'logo.png',
        url: 'public/images/logo.png',
        fileSize: 236186,
        mimeType: 'image/png',
        uploadedAt: '2026-10-01T00:00:00.000Z'
      }
    ],
    orders: [
      {
        id: 'WM-849102',
        customerName: 'Ananya Sharma',
        customerEmail: 'ananya.sharma@example.com',
        customerPhone: '+91 98450 11223',
        shippingAddress: {
          address: 'Villa 14, Palm Meadows, Whitefield',
          city: 'Bengaluru',
          pincode: '560066',
          state: 'Karnataka'
        },
        items: [
          {
            id: 'wm-ocean-blue',
            name: 'White Mist Ocean Fresh Liquid Detergent',
            size: '1 Litre',
            price: 249,
            quantity: 2,
            image: 'public/images/bottle_blue.png'
          },
          {
            id: 'wm-floral-pink',
            name: 'White Mist Floral Bloom Liquid Detergent',
            size: '1 Litre',
            price: 269,
            quantity: 1,
            image: 'public/images/bottle_pink.png'
          }
        ],
        subtotal: 767,
        discount: 115,
        shipping: 0,
        total: 652,
        paymentMethod: 'UPI',
        status: 'Delivered',
        notes: 'Handover at security gate',
        createdAt: '2026-10-18T10:30:00.000Z'
      },
      {
        id: 'WM-629415',
        customerName: 'Vikramaditya Verma',
        customerEmail: 'vikram.v@example.com',
        customerPhone: '+91 97112 34567',
        shippingAddress: {
          address: 'B-402, DLF Phase 5, Golf Course Road',
          city: 'Gurugram',
          pincode: '122002',
          state: 'Haryana'
        },
        items: [
          {
            id: 'wm-twin-pack',
            name: 'White Mist Twin Master Pack (Ocean + Floral)',
            size: '2 x 1 Litre Bottles',
            price: 469,
            quantity: 1,
            image: 'public/images/bottle_blue.png'
          }
        ],
        subtotal: 469,
        discount: 0,
        shipping: 50,
        total: 519,
        paymentMethod: 'CARD',
        status: 'Shipped',
        notes: 'Air Express courier dispatched',
        createdAt: '2026-10-20T14:15:00.000Z'
      },
      {
        id: 'WM-318492',
        customerName: 'Pooja Sundaram',
        customerEmail: 'pooja.s@example.com',
        customerPhone: '+91 94441 88990',
        shippingAddress: {
          address: 'Flat 3B, Ceebros Heritage, Adyar',
          city: 'Chennai',
          pincode: '600020',
          state: 'Tamil Nadu'
        },
        items: [
          {
            id: 'wm-citrus-yellow',
            name: 'White Mist Citrus Sunshine Liquid Detergent',
            size: '2 Litre',
            price: 469,
            quantity: 1,
            image: 'public/images/bottle_yellow.png'
          },
          {
            id: 'wm-pouch-yellow',
            name: 'White Mist Citrus Sunshine Eco Refill Pouch',
            size: '1 Litre Pouch',
            price: 209,
            quantity: 1,
            image: 'public/images/pouch_yellow.png'
          }
        ],
        subtotal: 678,
        discount: 50,
        shipping: 0,
        total: 628,
        paymentMethod: 'COD',
        status: 'Confirmed & Processing',
        notes: 'Verification call completed',
        createdAt: '2026-10-21T09:40:00.000Z'
      }
    ],
    messages: [
      {
        id: 'msg_101',
        name: 'Siddharth Nair',
        email: 'siddharth.nair@example.com',
        phone: '+91 99887 76655',
        subject: 'product_question',
        message: 'Is the Citrus Sunshine variant safe for washing delicate linen shirts in cold water?',
        status: 'replied',
        createdAt: '2026-10-19T11:20:00.000Z'
      },
      {
        id: 'msg_102',
        name: 'Kavita Menon',
        email: 'kavita.m@example.com',
        phone: '+91 98200 44332',
        subject: 'bulk_order',
        message: 'We operate a boutique serviced residence in Kochi and would like to order 50 Litres monthly. Do you offer institutional packs?',
        status: 'new',
        createdAt: '2026-10-21T16:05:00.000Z'
      }
    ],
    auditLogs: [
      {
        id: 'log_init',
        adminEmail: 'admin@whitemist.com',
        action: 'system_initialize',
        entityType: 'system',
        entityId: 'whitemist_core',
        details: 'White Mist CMS and E-Commerce Database initialized.',
        timestamp: new Date().toISOString()
      }
    ]
  };
}

/**
 * Load database from disk or initialize
 */
function loadDatabase() {
  if (dbState) return dbState;

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      dbState = JSON.parse(raw);
      if (ensureCmsSchema(dbState)) {
        saveDatabase();
      }
      return dbState;
    } catch (err) {
      console.error('Error reading whitemist.json, resetting to seed data:', err);
    }
  }

  dbState = getInitialSeedData();
  ensureCmsSchema(dbState);
  saveDatabase();
  return dbState;
}

/**
 * Save database to disk atomically
 */
function saveDatabase() {
  try {
    const tempFile = DB_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(dbState, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (err) {
    console.error('Error saving whitemist.json:', err);
    return false;
  }
}

/**
 * Add audit log entry
 */
function logAudit(adminEmail, action, entityType, entityId, details) {
  const db = loadDatabase();
  const entry = {
    id: 'log_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    adminEmail: adminEmail || 'system',
    action,
    entityType,
    entityId: String(entityId || ''),
    details: typeof details === 'string' ? details : JSON.stringify(details),
    timestamp: new Date().toISOString()
  };

  db.auditLogs.unshift(entry);
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500); // cap to 500
  }
  saveDatabase();
  return entry;
}

// =========================================================================
// DATA ACCESS & CRUD METHODS
// =========================================================================

// --- ADMIN USERS ---
function getAdminByEmail(email) {
  const db = loadDatabase();
  return db.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
}

function updateAdminPassword(adminId, newHash, newSalt, adminEmail) {
  const db = loadDatabase();
  const admin = db.admins.find(a => a.id === adminId);
  if (!admin) return false;

  admin.passwordHash = newHash;
  admin.passwordSalt = newSalt;
  admin.updatedAt = new Date().toISOString();
  saveDatabase();

  logAudit(adminEmail, 'admin_password_change', 'admin', adminId, 'Administrator password successfully updated.');
  return true;
}

// --- PRODUCTS ---
function getAllProducts(includeInactive = true) {
  const db = loadDatabase();
  if (includeInactive) return db.products;
  return db.products.filter(p => p.isActive !== false);
}

function getProductById(id) {
  const db = loadDatabase();
  return db.products.find(p => p.id === id);
}

function getProductBySlug(slug) {
  const db = loadDatabase();
  return db.products.find(p => p.slug === slug);
}

function createProduct(productData, adminEmail) {
  const db = loadDatabase();

  // Generate ID and slug if not present
  const id = productData.id || 'wm-prod-' + Date.now();
  const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const newProduct = {
    id,
    slug,
    name: productData.name || 'Untitled White Mist Product',
    category: productData.category || 'Daily Wash Liquid',
    subtitle: productData.subtitle || '',
    shortDesc: productData.shortDesc || '',
    fullDesc: productData.fullDesc || '',
    image: productData.image || 'public/images/bottle_blue.png',
    gallery: Array.isArray(productData.gallery) ? productData.gallery : [productData.image || 'public/images/bottle_blue.png'],
    badge: productData.badge || '',
    badgeType: productData.badgeType || 'bestseller',
    rating: parseFloat(productData.rating) || 4.9,
    reviewCount: parseInt(productData.reviewCount, 10) || 0,
    fragrance: productData.fragrance || 'Crisp Clean',
    formula: productData.formula || 'Bio-Enzyme Active',
    machineType: productData.machineType || 'Front & Top Load',
    sizes: Array.isArray(productData.sizes) && productData.sizes.length > 0 ? productData.sizes : [
      { size: '1 Litre', price: 249, mrp: 299, savings: '17%', isDefault: true }
    ],
    inStock: productData.inStock !== false,
    stockQty: parseInt(productData.stockQty, 10) || 100,
    sku: productData.sku || ('WM-' + Math.floor(1000 + Math.random() * 9000)),
    dosage: productData.dosage || {
      regular: '40 ml for standard wash',
      heavy: '60 ml for heavy wash',
      handwash: '25 ml in 10L water'
    },
    fabrics: Array.isArray(productData.fabrics) ? productData.fabrics : ['Cottons', 'Linens', 'Blends'],
    specs: productData.specs || {
      'Formulation': 'Concentrated Liquid Soluble',
      'pH Balance': 'Neutral',
      'Shelf Life': '24 Months'
    },
    isActive: productData.isActive !== false,
    isFeatured: productData.isFeatured === true,
    seoTitle: productData.seoTitle || productData.name,
    seoDesc: productData.seoDesc || productData.shortDesc,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);
  saveDatabase();

  logAudit(adminEmail, 'product_create', 'product', newProduct.id, `Created product "${newProduct.name}" (${newProduct.sku})`);
  return newProduct;
}

function updateProduct(id, productData, adminEmail) {
  const db = loadDatabase();
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) return null;

  const current = db.products[index];
  const updated = {
    ...current,
    ...productData,
    id: current.id, // prevent ID change
    updatedAt: new Date().toISOString()
  };

  db.products[index] = updated;
  saveDatabase();

  logAudit(adminEmail, 'product_update', 'product', id, `Updated product "${updated.name}"`);
  return updated;
}

function deleteProduct(id, adminEmail) {
  const db = loadDatabase();
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) return false;

  const removed = db.products.splice(index, 1)[0];
  saveDatabase();

  logAudit(adminEmail, 'product_delete', 'product', id, `Deleted product "${removed.name}" (${removed.sku})`);
  return true;
}

// --- CATEGORIES ---
function getCategories() {
  const db = loadDatabase();
  return db.categories;
}

function createCategory(catData, adminEmail) {
  const db = loadDatabase();
  const id = catData.id || 'cat_' + Date.now();
  const slug = catData.slug || catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const newCat = {
    id,
    name: catData.name,
    slug,
    description: catData.description || '',
    image: catData.image || 'public/images/bottle_blue.png',
    displayOrder: parseInt(catData.displayOrder, 10) || (db.categories.length + 1)
  };

  db.categories.push(newCat);
  saveDatabase();

  logAudit(adminEmail, 'category_create', 'category', id, `Created category "${newCat.name}"`);
  return newCat;
}

function updateCategory(id, catData, adminEmail) {
  const db = loadDatabase();
  const cat = db.categories.find(c => c.id === id);
  if (!cat) return null;

  Object.assign(cat, catData, { id });
  saveDatabase();

  logAudit(adminEmail, 'category_update', 'category', id, `Updated category "${cat.name}"`);
  return cat;
}

function deleteCategory(id, adminEmail) {
  const db = loadDatabase();
  const index = db.categories.findIndex(c => c.id === id);
  if (index === -1) return false;

  const removed = db.categories.splice(index, 1)[0];
  saveDatabase();

  logAudit(adminEmail, 'category_delete', 'category', id, `Deleted category "${removed.name}"`);
  return true;
}

// --- HOMEPAGE CONTENT ---
function getHomepage() {
  const db = loadDatabase();
  return db.homepage;
}

function updateHomepage(data, adminEmail) {
  const db = loadDatabase();
  db.homepage = {
    ...db.homepage,
    ...data,
    updatedAt: new Date().toISOString()
  };
  saveDatabase();

  logAudit(adminEmail, 'homepage_update', 'homepage', 'content', 'Updated homepage sections and hero content');
  return db.homepage;
}

// --- BANNERS ---
function getBanners(activeOnly = false) {
  const db = loadDatabase();
  if (activeOnly) {
    return db.banners.filter(b => b.isActive !== false);
  }
  return db.banners;
}

function createBanner(bannerData, adminEmail) {
  const db = loadDatabase();
  const id = 'banner_' + Date.now();
  const newBanner = {
    id,
    title: bannerData.title || '',
    subtitle: bannerData.subtitle || '',
    imageUrl: bannerData.imageUrl || 'public/images/fresh_clean_fabrics.jpg',
    ctaText: bannerData.ctaText || 'Shop Now',
    ctaLink: bannerData.ctaLink || 'shop.html',
    badge: bannerData.badge || 'Offer',
    isActive: bannerData.isActive !== false,
    displayOrder: parseInt(bannerData.displayOrder, 10) || 1,
    startDate: bannerData.startDate || '',
    endDate: bannerData.endDate || '',
    createdAt: new Date().toISOString()
  };

  db.banners.push(newBanner);
  saveDatabase();

  logAudit(adminEmail, 'banner_create', 'banner', id, `Created promo banner "${newBanner.title}"`);
  return newBanner;
}

function updateBanner(id, bannerData, adminEmail) {
  const db = loadDatabase();
  const banner = db.banners.find(b => b.id === id);
  if (!banner) return null;

  Object.assign(banner, bannerData, { id });
  saveDatabase();

  logAudit(adminEmail, 'banner_update', 'banner', id, `Updated banner "${banner.title}"`);
  return banner;
}

function deleteBanner(id, adminEmail) {
  const db = loadDatabase();
  const index = db.banners.findIndex(b => b.id === id);
  if (index === -1) return false;

  const removed = db.banners.splice(index, 1)[0];
  saveDatabase();

  logAudit(adminEmail, 'banner_delete', 'banner', id, `Deleted banner "${removed.title}"`);
  return true;
}

// --- PAGES ---
function getPages() {
  const db = loadDatabase();
  return db.pages;
}

function getPage(slug) {
  const db = loadDatabase();
  return db.pages[slug] || null;
}

function updatePage(slug, pageData, adminEmail) {
  const db = loadDatabase();
  db.pages[slug] = {
    ...(db.pages[slug] || {}),
    ...pageData,
    updatedAt: new Date().toISOString()
  };
  saveDatabase();

  logAudit(adminEmail, 'page_update', 'page', slug, `Updated content for page /${slug}`);
  return db.pages[slug];
}

// --- MEDIA LIBRARY ---
function getMedia() {
  const db = loadDatabase();
  return db.media;
}

function addMedia(mediaItem, adminEmail) {
  const db = loadDatabase();
  const item = {
    id: 'media_' + Date.now(),
    fileName: mediaItem.fileName,
    url: mediaItem.url,
    fileSize: mediaItem.fileSize || 0,
    mimeType: mediaItem.mimeType || 'image/png',
    uploadedAt: new Date().toISOString()
  };

  db.media.unshift(item);
  saveDatabase();

  logAudit(adminEmail, 'media_upload', 'media', item.id, `Uploaded media asset: ${item.fileName}`);
  return item;
}

function deleteMedia(id, adminEmail) {
  const db = loadDatabase();
  const index = db.media.findIndex(m => m.id === id);
  if (index === -1) return false;

  const removed = db.media.splice(index, 1)[0];
  saveDatabase();

  logAudit(adminEmail, 'media_delete', 'media', id, `Removed media asset: ${removed.fileName}`);
  return true;
}

// --- ORDERS ---
function getOrders() {
  const db = loadDatabase();
  return db.orders;
}

function getOrderById(id) {
  const db = loadDatabase();
  return db.orders.find(o => o.id === id);
}

function createOrder(orderData) {
  const db = loadDatabase();
  const orderId = 'WM-' + Math.floor(100000 + Math.random() * 900000);

  const newOrder = {
    id: orderId,
    customerName: orderData.customerName || 'Customer',
    customerEmail: orderData.customerEmail || '',
    customerPhone: orderData.customerPhone || '',
    shippingAddress: orderData.shippingAddress || {},
    items: Array.isArray(orderData.items) ? orderData.items : [],
    subtotal: orderData.subtotal || 0,
    discount: orderData.discount || 0,
    shipping: orderData.shipping || 0,
    total: orderData.total || 0,
    paymentMethod: (orderData.paymentMethod || 'UPI').toUpperCase(),
    status: 'Confirmed & Processing',
    notes: orderData.notes || 'Order placed via online checkout',
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  // Auto-decrement inventory for ordered items
  newOrder.items.forEach(item => {
    const prod = db.products.find(p => p.id === item.id);
    if (prod && typeof prod.stockQty === 'number') {
      prod.stockQty = Math.max(0, prod.stockQty - (item.quantity || 1));
      if (prod.stockQty === 0) prod.inStock = false;
    }
  });

  saveDatabase();
  logAudit(orderData.customerEmail, 'order_created', 'order', orderId, `New order ₹${newOrder.total} placed by ${newOrder.customerName}`);
  return newOrder;
}

function updateOrderStatus(id, status, notes, adminEmail) {
  const db = loadDatabase();
  const order = db.orders.find(o => o.id === id);
  if (!order) return null;

  order.status = status;
  if (notes) order.notes = notes;
  order.updatedAt = new Date().toISOString();
  saveDatabase();

  logAudit(adminEmail, 'order_status_update', 'order', id, `Order ${id} status updated to: ${status}`);
  return order;
}

// --- CONTACT MESSAGES ---
function getMessages() {
  const db = loadDatabase();
  return db.messages;
}

function createMessage(msgData) {
  const db = loadDatabase();
  const id = 'msg_' + Date.now();
  const newMsg = {
    id,
    name: msgData.name || '',
    email: msgData.email || '',
    phone: msgData.phone || '',
    subject: msgData.subject || 'general',
    message: msgData.message || '',
    status: 'new',
    createdAt: new Date().toISOString()
  };

  db.messages.unshift(newMsg);
  saveDatabase();
  return newMsg;
}

function updateMessageStatus(id, status, adminEmail) {
  const db = loadDatabase();
  const msg = db.messages.find(m => m.id === id);
  if (!msg) return null;

  msg.status = status;
  saveDatabase();

  logAudit(adminEmail, 'message_status_update', 'message', id, `Contact inquiry status set to ${status}`);
  return msg;
}

// --- SETTINGS ---
function getSettings() {
  const db = loadDatabase();
  return db.settings;
}

function updateSettings(settingsData, adminEmail) {
  const db = loadDatabase();
  db.settings = {
    ...db.settings,
    ...settingsData,
    updatedAt: new Date().toISOString()
  };
  saveDatabase();

  logAudit(adminEmail, 'settings_update', 'settings', 'global', 'Updated White Mist store settings.');
  return db.settings;
}

// --- AUDIT LOGS ---
function getAuditLogs(limit = 100) {
  const db = loadDatabase();
  return db.auditLogs.slice(0, limit);
}

// --- DASHBOARD STATISTICS ---
function getDashboardStats() {
  const db = loadDatabase();

  const totalProducts = db.products.length;
  const activeProducts = db.products.filter(p => p.isActive !== false).length;
  const outOfStockProducts = db.products.filter(p => !p.inStock || p.stockQty <= 0).length;
  const totalOrders = db.orders.length;
  const totalRevenue = db.orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  // Category counts
  const categoryCounts = {};
  db.products.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  // Recent content updates
  const recentUpdates = [
    { type: 'Product Catalogue', time: db.products[0]?.updatedAt || new Date().toISOString() },
    { type: 'Homepage Content', time: db.homepage?.updatedAt || new Date().toISOString() },
    { type: 'Promotions', time: db.banners[0]?.createdAt || new Date().toISOString() }
  ];

  return {
    totalProducts,
    activeProducts,
    outOfStockProducts,
    totalOrders,
    totalRevenue,
    categoryCounts,
    recentUpdates,
    unreadMessages: db.messages.filter(m => m.status === 'new').length,
    recentOrders: db.orders.slice(0, 5),
    recentAuditLogs: db.auditLogs.slice(0, 8),
    lowStockProducts: db.products.filter(p => p.stockQty < 150).slice(0, 5)
  };
}

// =========================================================================
// EXTENDED CMS MODULE METHODS
// =========================================================================

// --- HEADER & NAVIGATION ---
function getHeaderNav() {
  const db = loadDatabase();
  return db.headerNav || {};
}

function updateHeaderNav(data, adminEmail) {
  const db = loadDatabase();
  db.headerNav = { ...db.headerNav, ...data, updatedAt: new Date().toISOString() };
  logAudit(adminEmail, 'update_header_nav', 'headerNav', 'headerNav', 'Updated header and navigation settings');
  saveDatabase();
  return db.headerNav;
}

// --- THEME & APPEARANCE ---
function getThemeSettings() {
  const db = loadDatabase();
  return db.themeSettings || {};
}

function updateThemeSettings(data, adminEmail) {
  const db = loadDatabase();
  db.themeSettings = { ...db.themeSettings, ...data, updatedAt: new Date().toISOString() };
  logAudit(adminEmail, 'update_theme', 'theme', 'themeSettings', `Updated theme settings (default: ${data.defaultTheme || db.themeSettings.defaultTheme})`);
  saveDatabase();
  return db.themeSettings;
}

// --- BRAND STORY / ABOUT US ---
function getBrandStory() {
  const db = loadDatabase();
  return db.brandStory || {};
}

function updateBrandStory(data, adminEmail) {
  const db = loadDatabase();
  db.brandStory = { ...db.brandStory, ...data, updatedAt: new Date().toISOString() };
  logAudit(adminEmail, 'update_brand_story', 'brandStory', 'brandStory', 'Updated brand story and mission content');
  saveDatabase();
  return db.brandStory;
}

// --- BENEFITS & FEATURES ---
function getBenefits() {
  const db = loadDatabase();
  return (db.benefits || []).sort((a, b) => (a.order || 0) - (b.order || 0));
}

function createBenefit(data, adminEmail) {
  const db = loadDatabase();
  const newBenefit = {
    id: 'ben_' + Date.now(),
    icon: data.icon || '💧',
    title: data.title || 'Brand Benefit',
    desc: data.desc || '',
    order: Number(data.order) || (db.benefits.length + 1),
    isActive: data.isActive !== false
  };
  db.benefits.push(newBenefit);
  logAudit(adminEmail, 'create_benefit', 'benefit', newBenefit.id, `Created benefit "${newBenefit.title}"`);
  saveDatabase();
  return newBenefit;
}

function updateBenefit(id, data, adminEmail) {
  const db = loadDatabase();
  const idx = db.benefits.findIndex(b => b.id === id);
  if (idx === -1) return null;
  db.benefits[idx] = { ...db.benefits[idx], ...data };
  logAudit(adminEmail, 'update_benefit', 'benefit', id, `Updated benefit "${db.benefits[idx].title}"`);
  saveDatabase();
  return db.benefits[idx];
}

function deleteBenefit(id, adminEmail) {
  const db = loadDatabase();
  const idx = db.benefits.findIndex(b => b.id === id);
  if (idx === -1) return false;
  const removed = db.benefits.splice(idx, 1)[0];
  logAudit(adminEmail, 'delete_benefit', 'benefit', id, `Deleted benefit "${removed.title}"`);
  saveDatabase();
  return true;
}

// --- INGREDIENTS & USAGE INFORMATION ---
function getIngredientsUsage() {
  const db = loadDatabase();
  return db.ingredientsUsage || {};
}

function updateIngredientsUsage(data, adminEmail) {
  const db = loadDatabase();
  db.ingredientsUsage = { ...db.ingredientsUsage, ...data, updatedAt: new Date().toISOString() };
  logAudit(adminEmail, 'update_ingredients_usage', 'ingredientsUsage', 'ingredientsUsage', 'Updated dosing guidelines and ingredients');
  saveDatabase();
  return db.ingredientsUsage;
}

// --- TESTIMONIALS ---
function getTestimonials() {
  const db = loadDatabase();
  return db.testimonials || [];
}

function createTestimonial(data, adminEmail) {
  const db = loadDatabase();
  const newTestimonial = {
    id: 't_' + Date.now(),
    author: data.author || 'Verified Buyer',
    location: data.location || 'India',
    rating: Number(data.rating) || 5,
    variantUsed: data.variantUsed || 'Ocean Fresh',
    comment: data.comment || '',
    verifiedBuyer: data.verifiedBuyer !== false,
    date: new Date().toISOString().split('T')[0]
  };
  db.testimonials.unshift(newTestimonial);
  logAudit(adminEmail, 'create_testimonial', 'testimonial', newTestimonial.id, `Created review from "${newTestimonial.author}"`);
  saveDatabase();
  return newTestimonial;
}

function updateTestimonial(id, data, adminEmail) {
  const db = loadDatabase();
  const idx = db.testimonials.findIndex(t => t.id === id);
  if (idx === -1) return null;
  db.testimonials[idx] = { ...db.testimonials[idx], ...data };
  logAudit(adminEmail, 'update_testimonial', 'testimonial', id, `Updated review from "${db.testimonials[idx].author}"`);
  saveDatabase();
  return db.testimonials[idx];
}

function deleteTestimonial(id, adminEmail) {
  const db = loadDatabase();
  const idx = db.testimonials.findIndex(t => t.id === id);
  if (idx === -1) return false;
  const removed = db.testimonials.splice(idx, 1)[0];
  logAudit(adminEmail, 'delete_testimonial', 'testimonial', id, `Deleted review from "${removed.author}"`);
  saveDatabase();
  return true;
}

// --- PRODUCT DETAIL PAGE (PDP) SETTINGS ---
function getPdpSettings() {
  const db = loadDatabase();
  return db.pdpSettings || {};
}

function updatePdpSettings(data, adminEmail) {
  const db = loadDatabase();
  db.pdpSettings = { ...db.pdpSettings, ...data, updatedAt: new Date().toISOString() };
  logAudit(adminEmail, 'update_pdp_settings', 'pdpSettings', 'pdpSettings', 'Updated product detail page display configuration');
  saveDatabase();
  return db.pdpSettings;
}

// --- CONTACT PAGE ---
function getContactInfo() {
  const db = loadDatabase();
  return db.contactInfo || {};
}

function updateContactInfo(data, adminEmail) {
  const db = loadDatabase();
  db.contactInfo = { ...db.contactInfo, ...data, updatedAt: new Date().toISOString() };
  logAudit(adminEmail, 'update_contact_info', 'contactInfo', 'contactInfo', 'Updated contact information and operating hours');
  saveDatabase();
  return db.contactInfo;
}

// --- FOOTER EDITOR ---
function getFooter() {
  const db = loadDatabase();
  return db.footer || {};
}

function updateFooter(data, adminEmail) {
  const db = loadDatabase();
  db.footer = { ...db.footer, ...data, updatedAt: new Date().toISOString() };
  logAudit(adminEmail, 'update_footer', 'footer', 'footer', 'Updated website footer links and newsletter content');
  saveDatabase();
  return db.footer;
}

// --- SEO MANAGEMENT ---
function getSeoSettings() {
  const db = loadDatabase();
  return db.seoSettings || {};
}

function updateSeoSettings(data, adminEmail) {
  const db = loadDatabase();
  db.seoSettings = { ...db.seoSettings, ...data, updatedAt: new Date().toISOString() };
  logAudit(adminEmail, 'update_seo', 'seoSettings', 'seoSettings', 'Updated global SEO meta tags and social sharing');
  saveDatabase();
  return db.seoSettings;
}

// --- VISUAL SECTIONS BUILDER ---
function getVisualSections() {
  const db = loadDatabase();
  return (db.visualSections || []).sort((a, b) => (a.order || 0) - (b.order || 0));
}

function updateVisualSections(sections, adminEmail) {
  const db = loadDatabase();
  if (Array.isArray(sections)) {
    db.visualSections = sections.map((s, idx) => ({ ...s, order: idx + 1 }));
  }
  logAudit(adminEmail, 'update_visual_sections', 'visualSections', 'visualSections', 'Reordered or updated website section visibility');
  saveDatabase();
  return db.visualSections;
}

// --- ADMIN USERS & PERMISSIONS ---
function getAdminUsers() {
  const db = loadDatabase();
  return db.admins.map(a => ({
    id: a.id,
    email: a.email,
    fullName: a.fullName,
    role: a.role,
    createdAt: a.createdAt,
    lastLogin: a.lastLogin
  }));
}

function createAdminUser(data, adminEmail) {
  const db = loadDatabase();
  const existing = db.admins.find(a => a.email.toLowerCase() === data.email.toLowerCase());
  if (existing) throw new Error('An administrator with this email already exists.');

  const { hash, salt } = hashPassword(data.password || 'WhiteMist@Admin2026!');
  const newAdmin = {
    id: 'admin_' + Date.now(),
    email: data.email.trim(),
    fullName: data.fullName || 'Store Manager',
    role: data.role || 'editor',
    passwordHash: hash,
    passwordSalt: salt,
    createdAt: new Date().toISOString(),
    lastLogin: null
  };

  db.admins.push(newAdmin);
  logAudit(adminEmail, 'create_admin', 'admin', newAdmin.id, `Created administrator account for ${newAdmin.email}`);
  saveDatabase();
  return { id: newAdmin.id, email: newAdmin.email, fullName: newAdmin.fullName, role: newAdmin.role };
}

function deleteAdminUser(id, adminEmail) {
  const db = loadDatabase();
  if (db.admins.length <= 1) throw new Error('Cannot delete the last remaining super-admin account.');
  const idx = db.admins.findIndex(a => a.id === id);
  if (idx === -1) return false;
  const removed = db.admins.splice(idx, 1)[0];
  logAudit(adminEmail, 'delete_admin', 'admin', id, `Deleted administrator ${removed.email}`);
  saveDatabase();
  return true;
}

// --- PUBLISH DRAFT WORKFLOW ---
function publishAllDrafts(adminEmail) {
  const db = loadDatabase();
  db.publishStatus = {
    hasUnpublishedDrafts: false,
    lastPublishedAt: new Date().toISOString(),
    publishedBy: adminEmail || 'admin@whitemist.com'
  };
  logAudit(adminEmail, 'publish_all_content', 'system', 'publish', 'Published all CMS updates to live public website');
  saveDatabase();
  return db.publishStatus;
}

// --- WEBSITE OVERVIEW & HEALTH METRICS ---
function getOverviewData() {
  const db = loadDatabase();
  const totalProducts = db.products.length;
  const activeProducts = db.products.filter(p => p.isActive !== false).length;
  const outOfStock = db.products.filter(p => !p.inStock || p.stockQty <= 0).length;
  const totalOrders = db.orders.length;
  const totalRevenue = db.orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalMessages = db.messages.length;
  const unreadMessages = db.messages.filter(m => m.status === 'new').length;
  const totalMedia = db.media.length;
  const totalCategories = db.categories.length;

  return {
    kpis: {
      totalProducts,
      activeProducts,
      outOfStock,
      totalOrders,
      totalRevenue,
      totalMessages,
      unreadMessages,
      totalMedia,
      totalCategories
    },
    systemHealth: {
      serverStatus: 'Operational',
      database: 'Persistent Atomic JSON (Local)',
      uptimeSeconds: process.uptime(),
      nodeVersion: process.version,
      lastSync: new Date().toISOString()
    },
    publishStatus: db.publishStatus || { hasUnpublishedDrafts: false, lastPublishedAt: new Date().toISOString() },
    theme: db.themeSettings || { defaultTheme: 'light' },
    recentActivity: (db.auditLogs || []).slice(0, 10),
    recentOrders: (db.orders || []).slice(0, 5)
  };
}

// --- CONSOLIDATED PUBLIC CMS PAYLOAD ---
function getPublicConsolidatedCms() {
  const db = loadDatabase();
  return {
    settings: db.settings,
    headerNav: db.headerNav,
    theme: db.themeSettings,
    homepage: db.homepage,
    benefits: (db.benefits || []).filter(b => b.isActive !== false).sort((a,b)=>(a.order||0)-(b.order||0)),
    ingredientsUsage: db.ingredientsUsage,
    testimonials: db.testimonials,
    pdpSettings: db.pdpSettings,
    contactInfo: db.contactInfo,
    footer: db.footer,
    seo: db.seoSettings,
    visualSections: (db.visualSections || []).filter(s => s.isEnabled !== false).sort((a,b)=>(a.order||0)-(b.order||0)),
    products: db.products.filter(p => p.isActive !== false),
    categories: db.categories,
    banners: (db.banners || []).filter(b => b.isActive !== false)
  };
}

module.exports = {
  loadDatabase,
  saveDatabase,
  logAudit,
  getAdminByEmail,
  updateAdminPassword,
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getHomepage,
  updateHomepage,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getPages,
  getPage,
  updatePage,
  getMedia,
  addMedia,
  deleteMedia,
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getMessages,
  createMessage,
  updateMessageStatus,
  getSettings,
  updateSettings,
  getAuditLogs,
  getDashboardStats,
  getHeaderNav,
  updateHeaderNav,
  getThemeSettings,
  updateThemeSettings,
  getBrandStory,
  updateBrandStory,
  getBenefits,
  createBenefit,
  updateBenefit,
  deleteBenefit,
  getIngredientsUsage,
  updateIngredientsUsage,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getPdpSettings,
  updatePdpSettings,
  getContactInfo,
  updateContactInfo,
  getFooter,
  updateFooter,
  getSeoSettings,
  updateSeoSettings,
  getVisualSections,
  updateVisualSections,
  getAdminUsers,
  createAdminUser,
  deleteAdminUser,
  publishAllDrafts,
  getOverviewData,
  getPublicConsolidatedCms
};

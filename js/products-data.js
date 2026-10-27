/**
 * WHITE MIST — Centralized Product Data Layer
 * Authentic brand catalogue with verified pricing (INR), sizes, and variants
 */

const WHITE_MIST_PRODUCTS = [
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
  }
];

if (typeof window !== 'undefined') {
  window.WHITE_MIST_PRODUCTS = WHITE_MIST_PRODUCTS;
}

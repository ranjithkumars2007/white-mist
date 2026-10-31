import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '..', 'data', 'whitemist_db.json');

const INITIAL_SEED_DATA = {
  products: [
    {
      id: "wm-ocean-blue",
      slug: "ocean-fresh-liquid-detergent",
      name: "White Mist Ocean Fresh Liquid Detergent",
      category: "Daily Wash Liquid",
      sku: "WM-BLU-1000",
      subtitle: "High Quality Laundry Detergent • Front & Top Loading",
      shortDesc: "Active bio-liquid detergent formulated for daily cottons, linens, and blended clothes. Dissolves immediately in cold or warm water with zero chalky residue.",
      fullDesc: "White Mist Ocean Fresh Liquid Detergent is meticulously formulated to dissolve quickly in water, penetrating deep into fabric weaves to lift daily dust, sweat, and stubborn collar grime. Engineered with balanced surfactants that protect garment elasticity and color integrity wash after wash.",
      image: "/assets/images/bottle_blue.png",
      fragrance: "Cool Ocean & Crisp Cotton",
      stockQty: 180,
      inStock: true,
      formula: "Low-Foam Bio-Enzyme Active Surfactant",
      machineType: "Front & Top Load Compatible",
      dosage: {
        regular: "40 ml (1 Cap) for standard 5-6 kg load",
        heavy: "60 ml (1.5 Caps) for heavily soiled loads",
        handwash: "25 ml in 10 Litres of water"
      },
      fabrics: ["Cottons", "Linens", "Blends", "Denims"],
      badge: "Bestseller",
      badgeType: "bestseller",
      seoTitle: "White Mist Ocean Fresh Liquid Detergent | Front & Top Load",
      seoDesc: "Bio-enzyme liquid laundry detergent with 48hr sea breeze scent lock.",
      isActive: true,
      isFeatured: true,
      sizes: [
        { size: "500ml", price: 149, mrp: 175, savings: "15%", isDefault: false },
        { size: "1 Litre", price: 249, mrp: 299, savings: "17%", isDefault: true },
        { size: "2 Litre", price: 449, mrp: 549, savings: "18%", isDefault: false },
        { size: "5 Litre", price: 999, mrp: 1299, savings: "23%", isDefault: false }
      ],
      createdAt: new Date("2026-01-10T08:00:00Z").toISOString(),
      updatedAt: new Date("2026-10-25T10:00:00Z").toISOString()
    },
    {
      id: "wm-floral-pink",
      slug: "floral-bloom-liquid-detergent",
      name: "White Mist Floral Bloom Liquid Detergent",
      category: "Premium Fabric Care",
      sku: "WM-PNK-1000",
      subtitle: "Gentle Care & Softness • Front & Top Loading",
      shortDesc: "Infused with gentle fabric conditioners and micro-fragrance floral notes. Shields yarn texture from stiffness and preserves vibrant color pigments.",
      fullDesc: "Formulated especially for festive wear, delicates, pastel shirts, and daily soft fabrics. White Mist Floral Bloom cushions fibers during tumbling cycles, preventing micro-fuzzing and static cling while releasing an uplifting botanical jasmine-rose fragrance.",
      image: "/assets/images/bottle_pink.png",
      fragrance: "Jasmine & Soft Rose Petals",
      stockQty: 120,
      inStock: true,
      formula: "Conditioner-Infused Low-Foam Cleanser",
      machineType: "Front Load, Top Load & Delicates Cycle",
      dosage: {
        regular: "40 ml for soft daily garments",
        heavy: "55 ml for festive or embellished loads",
        handwash: "20 ml in a bucket of cold water"
      },
      fabrics: ["Silks", "Chiffons", "Kurtas", "Soft Cottons", "Baby Clothes"],
      badge: "Gentle Care",
      badgeType: "gentle",
      seoTitle: "White Mist Floral Bloom Liquid Detergent | Rose Softness",
      seoDesc: "Fabric conditioning liquid detergent infused with rose botanical extracts.",
      isActive: true,
      isFeatured: true,
      sizes: [
        { size: "500ml", price: 159, mrp: 189, savings: "16%", isDefault: false },
        { size: "1 Litre", price: 269, mrp: 320, savings: "16%", isDefault: true },
        { size: "2 Litre", price: 479, mrp: 580, savings: "17%", isDefault: false },
        { size: "5 Litre", price: 1049, mrp: 1350, savings: "22%", isDefault: false }
      ],
      createdAt: new Date("2026-01-12T08:00:00Z").toISOString(),
      updatedAt: new Date("2026-10-26T10:00:00Z").toISOString()
    },
    {
      id: "wm-citrus-yellow",
      slug: "citrus-sunshine-liquid-detergent",
      name: "White Mist Citrus Sunshine Liquid Detergent",
      category: "Concentrated Detergent",
      sku: "WM-YEL-1000",
      subtitle: "Tough Stain Action & Grease Cutting • Front & Top Load",
      shortDesc: "Potent degreasing liquid detergent with natural citrus extracts. Breaks down oily food splatters, turmeric spots, and sports sweat.",
      fullDesc: "Engineered for tough household laundry challenges. White Mist Citrus Sunshine features targeted active cleansers that dissolve grease, culinary sauces, coffee stains, and activewear odor without requiring abrasive scrubbing.",
      image: "/assets/images/bottle_yellow.png",
      fragrance: "Zesty Lime & Sunlit Citrus",
      stockQty: 95,
      inStock: true,
      formula: "High-Efficacy Grease Cutting Emulsion",
      machineType: "All Automatic Washers & Bucket Soaking",
      dosage: {
        regular: "40 ml for general washing",
        heavy: "60 ml for sports gear, kitchen aprons, tough grease",
        handwash: "25 ml in 10 Litres water"
      },
      fabrics: ["Activewear", "Denims", "Towels", "Heavy Cottons", "Bedsheets"],
      badge: "Tough Stain Action",
      badgeType: "stain",
      seoTitle: "White Mist Citrus Sunshine | Tough Stain Liquid Detergent",
      seoDesc: "Zesty citrus enzymes break down turmeric, grease, and tough stains.",
      isActive: true,
      isFeatured: true,
      sizes: [
        { size: "500ml", price: 155, mrp: 180, savings: "14%", isDefault: false },
        { size: "1 Litre", price: 259, mrp: 310, savings: "16%", isDefault: true },
        { size: "2 Litre", price: 469, mrp: 560, savings: "16%", isDefault: false },
        { size: "5 Litre", price: 1029, mrp: 1320, savings: "22%", isDefault: false }
      ],
      createdAt: new Date("2026-01-15T08:00:00Z").toISOString(),
      updatedAt: new Date("2026-10-27T10:00:00Z").toISOString()
    },
    {
      id: "wm-pouch-blue",
      slug: "ocean-fresh-eco-refill-pouch",
      name: "White Mist Ocean Fresh Eco Refill Pouch",
      category: "Family Value Pack",
      sku: "WM-PCH-BLU-1000",
      subtitle: "70% Less Plastic Packaging • High Quality Laundry Refill",
      shortDesc: "Convenient spout pouch that refills your existing White Mist bottle easily. Zero spills, maximum savings, and environmentally mindful.",
      fullDesc: "The smart choice for eco-conscious households. Refill your durable White Mist measuring bottle with this ergonomic spout pouch. Saves up to 70% virgin plastic packaging while maintaining the highest standard of fabric-friendly cleaning.",
      image: "/assets/images/pouch_blue.png",
      fragrance: "Cool Ocean & Crisp Cotton",
      stockQty: 140,
      inStock: true,
      formula: "100% Identical Ocean Fresh Formula",
      machineType: "Easy-Pour Spout Refill",
      dosage: {
        regular: "Pour into White Mist bottle and use measuring cap (40ml)",
        heavy: "Use 60ml for heavy loads"
      },
      fabrics: ["All Daily Fabrics"],
      badge: "Eco Saver",
      badgeType: "eco",
      seoTitle: "White Mist Ocean Fresh Eco Refill Pouch",
      seoDesc: "70% less plastic eco spout refill pouch for White Mist detergent.",
      isActive: true,
      isFeatured: false,
      sizes: [
        { size: "1 Litre Pouch", price: 199, mrp: 249, savings: "20%", isDefault: true },
        { size: "2 Litre Pouch", price: 379, mrp: 469, savings: "19%", isDefault: false }
      ],
      createdAt: new Date("2026-02-01T08:00:00Z").toISOString(),
      updatedAt: new Date("2026-10-25T10:00:00Z").toISOString()
    },
    {
      id: "wm-pouch-yellow",
      slug: "citrus-sunshine-eco-refill-pouch",
      name: "White Mist Citrus Sunshine Eco Refill Pouch",
      category: "Family Value Pack",
      sku: "WM-PCH-YEL-1000",
      subtitle: "Tough Stain Action • Family Economy Spout Refill",
      shortDesc: "High-capacity refill pouch of our tough-stain Citrus Sunshine formulation. Cost-effective and easy to store in any utility shelf.",
      fullDesc: "Keep your laundry room stocked with the toughest grease-fighting liquid detergent. Designed with an easy-pour threaded spout that refills your measuring bottle smoothly without mess.",
      image: "/assets/images/pouch_yellow.png",
      fragrance: "Zesty Lime & Sunlit Citrus",
      stockQty: 85,
      inStock: true,
      formula: "Concentrated Citrus Stain Cutter",
      machineType: "Easy-Pour Spout Refill",
      dosage: {
        regular: "Pour into White Mist bottle and use measuring cap (40ml)",
        heavy: "Use 60ml for heavily soiled clothes"
      },
      fabrics: ["Activewear", "Heavy Linens", "Denims"],
      badge: "Value Pack",
      badgeType: "eco",
      seoTitle: "White Mist Citrus Sunshine Eco Refill Pouch",
      seoDesc: "Economy spout pouch for citrus enzyme stain fighting.",
      isActive: true,
      isFeatured: false,
      sizes: [
        { size: "1 Litre Pouch", price: 209, mrp: 259, savings: "19%", isDefault: true },
        { size: "2 Litre Pouch", price: 389, mrp: 479, savings: "19%", isDefault: false }
      ],
      createdAt: new Date("2026-02-05T08:00:00Z").toISOString(),
      updatedAt: new Date("2026-10-26T10:00:00Z").toISOString()
    },
    {
      id: "wm-twin-pack",
      slug: "twin-master-pack",
      name: "White Mist Twin Master Pack (Ocean + Floral)",
      category: "Family Value Pack",
      sku: "WM-BND-TWIN-2000",
      subtitle: "Complete 2-Bottle Household Care Bundle",
      shortDesc: "1x Ocean Fresh (1L) for daily cottons and office wear + 1x Floral Bloom (1L) for delicate silks and beddings.",
      fullDesc: "Why compromise on fabric care? The White Mist Twin Master Pack delivers specialized care for every item in your wardrobe. Use the crisp Ocean Fresh for whites, shirts, and jeans; switch to the softening Floral Bloom for delicate washables, curtains, and linens.",
      image: "/assets/images/bottle_blue.png",
      fragrance: "Dual Collection (Ocean + Floral)",
      stockQty: 60,
      inStock: true,
      formula: "Full Spectrum Household Laundry Solution",
      machineType: "All Washing Machines",
      dosage: {
        regular: "Use Ocean Fresh for regular cottons (40ml)",
        delicates: "Use Floral Bloom for silks and beddings (40ml)"
      },
      fabrics: ["Every Wardrobe Fabric Type"],
      badge: "Best Value Bundle",
      badgeType: "bundle",
      seoTitle: "White Mist Twin Master Pack | Complete Household Care",
      seoDesc: "Twin combo pack containing 1x Ocean Fresh and 1x Floral Bloom.",
      isActive: true,
      isFeatured: true,
      sizes: [
        { size: "2 x 1 Litre Bottles", price: 469, mrp: 599, savings: "22%", isDefault: true },
        { size: "2 x 2 Litre Bottles", price: 849, mrp: 1099, savings: "23%", isDefault: false }
      ],
      createdAt: new Date("2026-02-10T08:00:00Z").toISOString(),
      updatedAt: new Date("2026-10-27T10:00:00Z").toISOString()
    }
  ],
  categories: [
    { id: "cat-1", name: "Daily Wash Liquid", slug: "daily-wash-liquid", description: "Everyday bio-clean detergents for shirts, linens, and blended clothes.", productCount: 1 },
    { id: "cat-2", name: "Premium Fabric Care", slug: "premium-fabric-care", description: "Enzyme conditioners formulated for silks, woolens, and delicate garments.", productCount: 1 },
    { id: "cat-3", name: "Concentrated Detergent", slug: "concentrated-detergent", description: "Heavy-duty grease and stain-fighting formulations.", productCount: 1 },
    { id: "cat-4", name: "Family Value Pack", slug: "family-value-pack", description: "Eco refill pouches and multi-bottle value packs.", productCount: 3 }
  ],
  homepage: {
    hero: {
      headline: "Ultra-Pure Bio Enzyme Liquid Laundry Detergent",
      subtitle: "10x deeper stain lift, fabric protection, and 48-hour fragrance lock for Front Load and Top Load machines.",
      primaryCtaText: "Explore Products",
      primaryCtaLink: "#products",
      secondaryCtaText: "Smart Dose Calculator",
      secondaryCtaLink: "#calculator",
      mainBottleImage: "/assets/images/bottle_blue.png"
    },
    brandIntro: {
      heading: "Engineered For Exceptional Fabric Care",
      subheading: "White Mist merges biodegradable active surfactants with plant-derived botanical fragrances to redefine your everyday laundry.",
      stat1Number: "48-Hr",
      stat1Label: "Scent Lock",
      stat2Number: "10x",
      stat2Label: "Bio-Stain Lift",
      stat3Number: "100%",
      stat3Label: "Fabric Safe"
    },
    faqs: [
      {
        question: "Is White Mist safe for front load washing machines?",
        answer: "Yes, White Mist is low-foam optimized for all front load, top load, and semi-automatic machines."
      },
      {
        question: "Can I use it for delicate silks and baby clothes?",
        answer: "Our Floral Bloom formula is 100% bleach-free, phosphate-free, and dermatologically tested for soft fabrics and sensitive skin."
      },
      {
        question: "How many washes do I get from a 2L bottle?",
        answer: "A 2 Litre bottle delivers approximately 40 full loads (5-6kg machine load) using the recommended 40ml dosage cap."
      },
      {
        question: "Does White Mist leave white powdery residue on dark clothes?",
        answer: "No! Liquid detergents dissolve 100% instantly in water, leaving zero chalky residue or fabric stiffness on dark or colored clothes."
      }
    ]
  },
  settings: {
    siteTitle: "White Mist — Bio-Enzyme Liquid Detergent",
    announcementBarText: "✦ FREE DELIVERY ON ALL PREPAID ORDERS OVER ₹499 • 100% QUALITY GUARANTEE ✦",
    announcementBarEnabled: true,
    freeShippingThreshold: 499,
    standardShippingFee: 50,
    contactEmail: "care@whitemist.com",
    contactPhone: "+91 98860 44210"
  },
  banners: [
    {
      id: "ban-1",
      title: "✦ MEGA FESTIVE SAVER BUNDLE ✦",
      subtitle: "Flat 30% OFF on 4kg Family Combos + Free Delivery",
      badge: "PROMO",
      ctaText: "Shop Best Sellers",
      ctaLink: "#products",
      isActive: true
    }
  ],
  orders: [
    {
      id: "WM-ORD-8921",
      customerName: "Aarav Deshmukh",
      customerEmail: "aarav.d@gmail.com",
      customerPhone: "+91 98201 44510",
      items: [{ name: "Ocean Fresh 2L Bottle", qty: 2, price: 349 }],
      total: 698,
      status: "Delivered",
      paymentMethod: "Razorpay UPI",
      paymentStatus: "PAID",
      date: "28 Oct 2026",
      createdAt: new Date("2026-10-28T09:30:00Z").toISOString()
    },
    {
      id: "WM-ORD-8919",
      customerName: "Meera Krishnan",
      customerEmail: "meera.k@outlook.com",
      customerPhone: "+91 98450 11209",
      items: [{ name: "Floral Bloom 2kg Refill Pouch", qty: 2, price: 289 }],
      total: 578,
      status: "In Transit",
      paymentMethod: "Credit Card",
      paymentStatus: "PAID",
      date: "27 Oct 2026",
      createdAt: new Date("2026-10-27T14:15:00Z").toISOString()
    },
    {
      id: "WM-ORD-8914",
      customerName: "Vikram Malhotra",
      customerEmail: "vikram.m@corp.in",
      customerPhone: "+91 97110 88200",
      items: [
        { name: "Ocean Fresh 2L Bottle", qty: 1, price: 349 },
        { name: "Floral Bloom 2L Bottle", qty: 1, price: 349 },
        { name: "Citrus Sunshine 2L Bottle", qty: 1, price: 349 }
      ],
      total: 921,
      status: "Processing",
      paymentMethod: "Net Banking",
      paymentStatus: "PAID",
      date: "26 Oct 2026",
      createdAt: new Date("2026-10-26T11:45:00Z").toISOString()
    },
    {
      id: "WM-ORD-8902",
      customerName: "Pooja Hegde",
      customerEmail: "pooja.h@yahoo.com",
      customerPhone: "+91 98861 33201",
      items: [{ name: "Ocean Fresh 2L Bottle", qty: 1, price: 349 }],
      total: 349,
      status: "Delivered",
      paymentMethod: "Razorpay UPI",
      paymentStatus: "PAID",
      transactionId: "TXN-WM-890204",
      invoiceNumber: "WM-INV-2026-8902",
      date: "25 Oct 2026",
      createdAt: new Date("2026-10-25T16:20:00Z").toISOString()
    }
  ],
  transactions: [
    {
      id: "TXN-WM-892101",
      orderId: "WM-ORD-8921",
      customerName: "Aarav Deshmukh",
      customerEmail: "aarav.d@gmail.com",
      customerPhone: "+91 98201 44510",
      amount: 698,
      currency: "INR",
      paymentGateway: "Razorpay",
      paymentMethod: "UPI (Google Pay)",
      gatewayReference: "pay_O7bK9z4w18921",
      paymentStatus: "SUCCESS",
      refundStatus: "NONE",
      refundedAmount: 0,
      invoiceNumber: "WM-INV-2026-8921",
      transactionDate: new Date("2026-10-28T09:30:45Z").toISOString(),
      createdAt: new Date("2026-10-28T09:30:45Z").toISOString()
    },
    {
      id: "TXN-WM-891902",
      orderId: "WM-ORD-8919",
      customerName: "Meera Krishnan",
      customerEmail: "meera.k@outlook.com",
      customerPhone: "+91 98450 11209",
      amount: 578,
      currency: "INR",
      paymentGateway: "HDFC Payment Gateway",
      paymentMethod: "Credit Card (Visa **4242)",
      gatewayReference: "hdfc_auth_8829104",
      paymentStatus: "SUCCESS",
      refundStatus: "NONE",
      refundedAmount: 0,
      invoiceNumber: "WM-INV-2026-8919",
      transactionDate: new Date("2026-10-27T14:15:30Z").toISOString(),
      createdAt: new Date("2026-10-27T14:15:30Z").toISOString()
    },
    {
      id: "TXN-WM-889905",
      orderId: "WM-ORD-8899",
      customerName: "Rohan Verma",
      customerEmail: "rohan.v@gmail.com",
      customerPhone: "+91 99001 22334",
      amount: 1498,
      currency: "INR",
      paymentGateway: "Razorpay",
      paymentMethod: "UPI (Paytm)",
      gatewayReference: "pay_Q88xP900122",
      paymentStatus: "PENDING",
      refundStatus: "NONE",
      refundedAmount: 0,
      invoiceNumber: null,
      failureReason: "Awaiting UPI app PIN confirmation",
      transactionDate: new Date("2026-10-29T10:15:00Z").toISOString(),
      createdAt: new Date("2026-10-29T10:15:00Z").toISOString()
    },
    {
      id: "TXN-WM-888806",
      orderId: "WM-ORD-8888",
      customerName: "Ananya Iyer",
      customerEmail: "ananya.i@techcorp.com",
      customerPhone: "+91 98112 33445",
      amount: 799,
      currency: "INR",
      paymentGateway: "Stripe India",
      paymentMethod: "Debit Card (Mastercard **8910)",
      gatewayReference: "ch_3PkL7129988",
      paymentStatus: "FAILED",
      refundStatus: "NONE",
      refundedAmount: 0,
      invoiceNumber: null,
      failureReason: "Card issuing bank 3D-Secure authentication timed out",
      transactionDate: new Date("2026-10-29T08:30:00Z").toISOString(),
      createdAt: new Date("2026-10-29T08:30:00Z").toISOString()
    }
  ],
  invoices: [
    {
      id: "INV-8921",
      invoiceNumber: "WM-INV-2026-8921",
      orderId: "WM-ORD-8921",
      transactionId: "TXN-WM-892101",
      invoiceDate: new Date("2026-10-28T09:31:00Z").toISOString(),
      paymentDate: new Date("2026-10-28T09:30:45Z").toISOString(),
      customerName: "Aarav Deshmukh",
      customerEmail: "aarav.d@gmail.com",
      customerPhone: "+91 98201 44510",
      billingAddress: {
        street: "Flat 402, Green Palms, Outer Ring Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560103",
        country: "India"
      },
      companyDetails: {
        name: "Meridian White Mist Private Limited",
        brand: "White Mist",
        address: "Plot 42, Eco Clean Corridor, Bellandur, Outer Ring Road, Bengaluru, Karnataka, India - 560103",
        gstin: "29AAACW1234F1Z8",
        cin: "U24246KA2026PTC189210",
        pan: "AAACW1234F",
        contactEmail: "care@whitemist.com",
        contactPhone: "+91 98860 44210",
        website: "www.whitemist.com"
      },
      items: [
        {
          name: "White Mist Ocean Fresh Liquid Detergent 2L",
          sku: "WM-BLU-2000",
          hsn: "3402",
          qty: 2,
          unitPrice: 295.76,
          gstRate: 18,
          taxAmount: 106.48,
          total: 698
        }
      ],
      subtotal: 591.52,
      discount: 0,
      taxableAmount: 591.52,
      cgst: 53.24,
      sgst: 53.24,
      igst: 0,
      totalTax: 106.48,
      shippingCharges: 0,
      grandTotal: 698,
      amountPaid: 698,
      balanceDue: 0,
      paymentMethod: "Razorpay UPI",
      paymentStatus: "PAID",
      status: "PAID",
      createdAt: new Date("2026-10-28T09:31:00Z").toISOString()
    }
  ],
  messages: [
    {
      id: "MSG-4102",
      name: "Rajesh Nair (The Grand Orchid Hotel)",
      email: "procurement@grandorchid.com",
      phone: "+91 98860 44210",
      subject: "Bulk Institutional Order",
      message: "Requirement for 150 units of 2kg Refill Pouches monthly for hotel laundry operations.",
      status: "pending",
      date: "28 Oct 2026",
      createdAt: new Date("2026-10-28T08:00:00Z").toISOString()
    },
    {
      id: "MSG-4099",
      name: "Sunita Ramanathan (Care & Clean)",
      email: "sunita@careclean.in",
      phone: "+91 98451 90211",
      subject: "Commercial Trial Sample Kit",
      message: "Requesting sample pouches of Ocean Fresh and Floral Bloom for front-load machines.",
      status: "replied",
      date: "26 Oct 2026",
      createdAt: new Date("2026-10-26T12:00:00Z").toISOString()
    }
  ],
  media: [
    {
      id: "med-1",
      fileName: "bottle_blue.png",
      originalName: "bottle_blue.png",
      url: "/assets/images/bottle_blue.png",
      size: 142000,
      mimeType: "image/png",
      uploadedAt: new Date("2026-10-01T10:00:00Z").toISOString()
    },
    {
      id: "med-2",
      fileName: "bottle_pink.png",
      originalName: "bottle_pink.png",
      url: "/assets/images/bottle_pink.png",
      size: 138000,
      mimeType: "image/png",
      uploadedAt: new Date("2026-10-01T10:00:00Z").toISOString()
    },
    {
      id: "med-3",
      fileName: "bottle_yellow.png",
      originalName: "bottle_yellow.png",
      url: "/assets/images/bottle_yellow.png",
      size: 145000,
      mimeType: "image/png",
      uploadedAt: new Date("2026-10-01T10:00:00Z").toISOString()
    },
    {
      id: "med-4",
      fileName: "pouch_blue.png",
      originalName: "pouch_blue.png",
      url: "/assets/images/pouch_blue.png",
      size: 122000,
      mimeType: "image/png",
      uploadedAt: new Date("2026-10-01T10:00:00Z").toISOString()
    }
  ],
  audit_logs: [
    {
      id: "aud-1",
      action: "System Initialization",
      details: "White Mist Enterprise Database engine started with persistent storage",
      adminEmail: "admin@whitemist.com",
      timestamp: new Date("2026-10-29T06:00:00Z").toISOString()
    }
  ],
  pages: {
    "about": {
      title: "About White Mist",
      content: "White Mist is an Indian manufacturer of premium bio-enzyme laundry solutions..."
    },
    "privacy": {
      title: "Privacy Policy",
      content: "Your privacy is important to White Mist. We do not sell your personal information..."
    },
    "terms": {
      title: "Terms of Service",
      content: "Welcome to White Mist. By using our website, you agree to these terms..."
    },
    "shipping": {
      title: "Shipping & Return Policy",
      content: "We deliver across 19,000+ pin codes in India with standard delivery within 3-5 business days..."
    }
  }
};

class DatabaseManager {
  constructor() {
    this.data = null;
    this.ensureLoaded();
  }

  ensureLoaded() {
    if (this.data) return;

    try {
      const dataDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.data = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
        this.persistSync();
      }
    } catch (e) {
      console.error('[DB] Failed to load database file, initializing fallback:', e);
      this.data = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
      try { this.persistSync(); } catch (err) {}
    }
  }

  persistSync() {
    try {
      const dataDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const tmpPath = DB_PATH + '.tmp';
      fs.writeFileSync(tmpPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpPath, DB_PATH);
    } catch (e) {
      console.error('[DB] Critical: Failed to persist database to disk:', e);
      throw e;
    }
  }

  get(collection) {
    this.ensureLoaded();
    return this.data[collection] || [];
  }

  set(collection, val) {
    this.ensureLoaded();
    this.data[collection] = val;
    this.persistSync();
  }

  logAudit(action, details, adminEmail = 'admin@whitemist.com') {
    this.ensureLoaded();
    const entry = {
      id: 'aud-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      action,
      details,
      adminEmail,
      timestamp: new Date().toISOString()
    };
    if (!this.data.audit_logs) this.data.audit_logs = [];
    this.data.audit_logs.unshift(entry);
    if (this.data.audit_logs.length > 100) this.data.audit_logs.pop();
    this.persistSync();
    return entry;
  }
}

export const db = new DatabaseManager();

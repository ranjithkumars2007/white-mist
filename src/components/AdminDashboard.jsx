import InvoiceModal from './InvoiceModal';
import React, { useState, useEffect } from 'react';
import { 
  UserCheck,
  Receipt,
  CreditCard,
  Printer,
  Download,
  TrendingUp, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Plus, 
  RefreshCw, 
  ExternalLink, 
  Eye, 
  Edit3, 
  Trash2,
  ChevronRight, 
  FileText, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Check, 
  X, 
  Boxes, 
  Sparkles, 
  LogOut, 
  ArrowLeft,
  Layers,
  Home,
  Flag,
  Image as ImageIcon,
  Settings,
  Menu,
  ShoppingCart,
  Upload
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';

export default function AdminDashboard({ onNavigateToStore, onLogout }) {
  const [currentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('wm_admin_user') || localStorage.getItem('wm_admin_user');
      return saved ? JSON.parse(saved) : { fullName: 'Super Admin', email: 'admin@whitemist.com' };
    } catch (e) {
      return { fullName: 'Super Admin', email: 'admin@whitemist.com' };
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'products' | 'categories' | 'homepage' | 'banners' | 'pages' | 'media' | 'orders' | 'messages' | 'settings'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('wm_admin_token') || localStorage.getItem('wm_admin_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  // Modals state
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryForm, setNewCategoryForm] = useState({ name: '', slug: '', description: '' });
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [isAddBannerModalOpen, setIsAddBannerModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [transactionsList, setTransactionsList] = useState([]);
  const [invoicesList, setInvoicesList] = useState([]);
  const [billingAnalytics, setBillingAnalytics] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [txnSearchQuery, setTxnSearchQuery] = useState('');
  const [txnStatusFilter, setTxnStatusFilter] = useState('all');
  const [txnMethodFilter, setTxnMethodFilter] = useState('all');
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('all');

  // Customer Login Activity State
  const [customerLoginsList, setCustomerLoginsList] = useState([]);
  const [customerLoginsTotal, setCustomerLoginsTotal] = useState(0);
  const [customerLoginsToday, setCustomerLoginsToday] = useState(0);
  const [customerLoginsSearch, setCustomerLoginsSearch] = useState('');
  const [customerLoginsStatus, setCustomerLoginsStatus] = useState('all');
  const [customerLoginsDate, setCustomerLoginsDate] = useState('');
  const [customerLoginsPage, setCustomerLoginsPage] = useState(1);
  const [customerLoginsTotalPages, setCustomerLoginsTotalPages] = useState(1);
  const [customerLoginsLoading, setCustomerLoginsLoading] = useState(false);

  const handleCreateCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryForm.name.trim()) {
      showToast('Please enter category name');
      return;
    }

    setIsSubmittingCategory(true);
    const slug = newCategoryForm.slug.trim() || newCategoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: newCategoryForm.name.trim(),
          slug,
          description: newCategoryForm.description.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        const created = data.category || {
          id: `cat-${Date.now()}`,
          name: newCategoryForm.name.trim(),
          slug,
          desc: newCategoryForm.description.trim(),
          order: categoriesList.length + 1,
          count: 0
        };
        setCategoriesList(prev => [...prev, {
          id: created.id,
          name: created.name,
          slug: created.slug,
          desc: created.description || newCategoryForm.description.trim(),
          order: prev.length + 1,
          count: 0
        }]);
        setIsAddCategoryModalOpen(false);
        setNewCategoryForm({ name: '', slug: '', description: '' });
        showToast(`Category "${created.name}" created successfully!`);
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || 'Failed to create category');
      }
    } catch (err) {
      showToast('Error creating category');
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setCategoriesList(prev => prev.filter(c => c.id !== id));
        showToast(`Category "${name}" deleted.`);
      } else {
        showToast('Failed to delete category');
      }
    } catch (err) {
      showToast('Error deleting category');
    }
  };

  // Add Product Form State (Full Homepage Content & Media)
  const initialNewProductState = {
    sku: 'WM-LD-2L-NEW',
    name: 'White Mist Ocean Fresh 2L Liquid Detergent',
    category: 'bottles',
    tagline: 'Deep Bio-Clean & 48-Hour Sea Breeze Scent Lock',
    badge: 'Bestseller',
    accentColor: '#0084FF',
    fragrance: 'Cool Ocean & Crisp Cotton',
    machineType: 'Front & Top Load',
    image: '/assets/images/bottle_blue.png',
    price: 349,
    mrp: 499,
    stock: 50,
    hasPouchVariant: true,
    pouchPrice: 289,
    pouchMrp: 399,
    pouchImage: '/assets/images/pouch_blue.png',
    shortDesc: 'Premium bio-enzyme liquid laundry detergent formulated for daily cottons, linens, and blended clothes. Removes 10x tough mud, oil, and sweat stains while locking in a fresh fragrance.',
    features: '10x Bio-Enzyme Stain Dissolving Action\nFront Load & Top Load Washing Machine Safe\n48-Hour Micro-Capsule Fragrance Lock\nColor Guard Technology Prevents Fading',
    isFeatured: true,
    isActive: true
  };

  const [newProductForm, setNewProductForm] = useState(initialNewProductState);
  const [modalActiveTab, setModalActiveTab] = useState('general'); // 'general' | 'images' | 'pricing' | 'details'
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image file size must be less than 10MB');
      return;
    }

    setIsUploadingImage(true);
    setImageUploadSuccess(false);

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      try {
        const res = await fetch('/api/admin/media/upload', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            fileName: file.name,
            dataUrl: dataUrl
          })
        });

        if (res.ok) {
          const result = await res.json();
          const publicUrl = result.url || dataUrl;
          setNewProductForm(prev => ({ ...prev, image: publicUrl }));
          setImageUploadSuccess(true);
          showToast(`Image "${file.name}" uploaded successfully!`);
        } else {
          setNewProductForm(prev => ({ ...prev, image: dataUrl }));
          setImageUploadSuccess(true);
          showToast(`Image loaded for product!`);
        }
      } catch (err) {
        setNewProductForm(prev => ({ ...prev, image: dataUrl }));
        setImageUploadSuccess(true);
      } finally {
        setIsUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProductSubmit = async (e) => {
    e.preventDefault();

    if (!newProductForm.name.trim()) {
      showToast('Please enter a product name');
      return;
    }
    if (!newProductForm.sku.trim()) {
      showToast('Please enter a unique SKU code');
      return;
    }

    setIsSubmittingProduct(true);

    const priceNum = Number(newProductForm.price) || 349;
    const mrpNum = Number(newProductForm.mrp) || 499;
    const stockNum = Number(newProductForm.stock) || 50;

    const formats = [
      {
        id: `fmt-bottle-${Date.now()}`,
        name: '2L Ergonomic Handle Bottle',
        price: priceNum,
        mrp: mrpNum,
        discount: `${Math.max(0, Math.round(((mrpNum - priceNum) / mrpNum) * 100))}% OFF`,
        image: newProductForm.image || '/assets/images/bottle_blue.png',
        doses: 40
      }
    ];

    if (newProductForm.hasPouchVariant) {
      const pouchPriceNum = Number(newProductForm.pouchPrice) || 289;
      const pouchMrpNum = Number(newProductForm.pouchMrp) || 399;
      formats.push({
        id: `fmt-pouch-${Date.now()}`,
        name: '2kg Eco Spout Refill Pouch',
        price: pouchPriceNum,
        mrp: pouchMrpNum,
        discount: `${Math.max(0, Math.round(((pouchMrpNum - pouchPriceNum) / pouchMrpNum) * 100))}% OFF`,
        image: newProductForm.pouchImage || newProductForm.image || '/assets/images/pouch_blue.png',
        doses: 40
      });
    }

    const sizes = formats.map((f, idx) => ({
      size: f.name,
      price: f.price,
      mrp: f.mrp,
      savings: f.discount,
      isDefault: idx === 0
    }));

    const featuresList = newProductForm.features
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const categoryNames = {
      bottles: 'Ergonomic Bottles (2L)',
      pouches: 'Eco Spout Refill Pouches',
      funwash: 'Fun Wash™ Value Packs',
      combos: 'Super Saver Combos',
      'Daily Wash Liquid': 'Daily Wash Liquid',
      'Premium Fabric Care': 'Premium Fabric Care'
    };

    const payload = {
      sku: newProductForm.sku.trim().toUpperCase(),
      name: newProductForm.name.trim(),
      category: newProductForm.category,
      categoryName: categoryNames[newProductForm.category] || newProductForm.category,
      tagline: newProductForm.tagline.trim(),
      subtitle: newProductForm.tagline.trim(),
      shortDesc: newProductForm.shortDesc.trim(),
      fullDesc: newProductForm.shortDesc.trim(),
      description: newProductForm.shortDesc.trim(),
      image: newProductForm.image || '/assets/images/bottle_blue.png',
      formats,
      sizes,
      price: priceNum,
      mrp: mrpNum,
      stockQty: stockNum,
      badge: newProductForm.badge.trim(),
      accentColor: newProductForm.accentColor,
      bgGradient: `linear-gradient(135deg, ${newProductForm.accentColor}18 0%, #FFFFFF 100%)`,
      color: newProductForm.accentColor === '#0084FF' ? 'blue' :
             newProductForm.accentColor === '#F01262' ? 'pink' :
             newProductForm.accentColor === '#D97706' ? 'yellow' : 'all',
      fragrance: newProductForm.fragrance.trim(),
      machineType: newProductForm.machineType.trim(),
      formula: 'Low-Foam Bio-Enzyme Active Surfactant',
      features: featuresList.length > 0 ? featuresList : ['10x Bio-Enzyme Stain Dissolving Action', '48-Hour Micro-Capsule Fragrance Lock', 'Color Safe'],
      rating: 4.9,
      reviewsCount: 120,
      isFeatured: newProductForm.isFeatured,
      isActive: newProductForm.isActive
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const saved = data.product || payload;
        setProductsList(prev => [{
          ...saved,
          stock: saved.stockQty !== undefined ? saved.stockQty : stockNum,
          price: (saved.sizes && saved.sizes[0]?.price) || priceNum,
          mrp: (saved.sizes && saved.sizes[0]?.mrp) || mrpNum
        }, ...prev]);
        setIsAddProductModalOpen(false);
        setNewProductForm(initialNewProductState);
        showToast(`Product "${payload.name}" published to store and homepage!`);
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || 'Failed to save product');
      }
    } catch (err) {
      showToast('Error saving product');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 1. Live Products State initialized from actual products
  const [productsList, setProductsList] = useState([
    {
      id: 'wm-blue-ocean',
      sku: 'WM-LD-2L-BLU',
      name: 'White Mist Ocean Fresh Liquid Detergent',
      category: 'Bottles',
      categorySlug: 'bottles',
      fragrance: 'Blue Ocean Fresh',
      price: 349,
      mrp: 499,
      stock: 48,
      image: '/assets/images/bottle_blue.png',
      isActive: true
    },
    {
      id: 'wm-pink-floral',
      sku: 'WM-LD-2L-PNK',
      name: 'White Mist Floral Bloom Liquid Detergent',
      category: 'Bottles',
      categorySlug: 'bottles',
      fragrance: 'Pink Floral Bloom',
      price: 349,
      mrp: 499,
      stock: 14,
      image: '/assets/images/bottle_pink.png',
      isActive: true
    },
    {
      id: 'wm-yellow-citrus',
      sku: 'WM-LD-2L-YLW',
      name: 'White Mist Citrus Sunshine Liquid Detergent',
      category: 'Bottles',
      categorySlug: 'bottles',
      fragrance: 'Yellow Citrus Sunshine',
      price: 349,
      mrp: 499,
      stock: 76,
      image: '/assets/images/bottle_yellow.png',
      isActive: true
    },
    {
      id: 'wm-pouch-blue',
      sku: 'WM-POUCH-2L-BLU',
      name: 'Ocean Fresh Eco Refill Spout Pouch (2kg)',
      category: 'Pouches',
      categorySlug: 'pouches',
      fragrance: 'Blue Ocean Fresh',
      price: 289,
      mrp: 399,
      stock: 112,
      image: '/assets/images/pouch_blue.png',
      isActive: true
    },
    {
      id: 'wm-pouch-pink',
      sku: 'WM-POUCH-2L-PNK',
      name: 'Floral Bloom Eco Refill Spout Pouch (2kg)',
      category: 'Pouches',
      categorySlug: 'pouches',
      fragrance: 'Pink Floral Bloom',
      price: 289,
      mrp: 399,
      stock: 0,
      image: '/assets/images/pouch_pink.png',
      isActive: true
    },
    {
      id: 'wm-bundle-family',
      sku: 'WM-MEGA-BUNDLE-4KG',
      name: '4kg Ultra Clean Family Value Combo (Bottle + Refill)',
      category: 'Combos',
      categorySlug: 'combos',
      fragrance: 'Multi-Fragrance Pack',
      price: 599,
      mrp: 898,
      stock: 32,
      image: '/assets/images/bottle_blue.png',
      isActive: true
    }
  ]);

  // 2. Categories State
  const [categoriesList, setCategoriesList] = useState([
    { id: 1, slug: 'bottles', name: 'Ergonomic Bottles (2L)', desc: '2L Ergonomic Handle Bottles for easy pour laundry detergent.', count: 3, order: 1 },
    { id: 2, slug: 'pouches', name: 'Eco Spout Refill Pouches', desc: 'Environment friendly 2kg eco spout refill pouches.', count: 2, order: 2 },
    { id: 3, slug: 'funwash', name: 'Fun Wash™ Value Range', desc: 'Fun Wash 2kg high quality liquid detergent offer packs.', count: 0, order: 3 },
    { id: 4, slug: 'combos', name: 'Super Saver Combos', desc: 'Mega value twin bottle & pouch combo packs.', count: 1, order: 4 },
  ]);

  // 3. Orders State
  const [ordersList, setOrdersList] = useState([
    {
      id: 'WM-ORD-9281',
      customer: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98450 12384',
      address: 'A-402 Prestige Palms, Whitefield, Bengaluru 560066',
      items: [
        { name: 'Ocean Fresh 2L Bottle', qty: 2, price: 349 },
        { name: 'Floral Bloom 2kg Refill Pouch', qty: 1, price: 289 }
      ],
      total: 987,
      paymentMethod: 'UPI (PhonePe)',
      paymentStatus: 'PAID',
      orderStatus: 'Confirmed & Processing',
      date: '28 Oct 2026'
    },
    {
      id: 'WM-ORD-9280',
      customer: 'Arjun Venkatesh',
      email: 'arjun.v@company.in',
      phone: '+91 97412 88391',
      address: 'Flat 12B, Skylark Apartments, Indiranagar, Bengaluru 560038',
      items: [
        { name: '4kg Ultra Clean Family Value Combo', qty: 2, price: 599 }
      ],
      total: 1198,
      paymentMethod: 'Credit Card (HDFC)',
      paymentStatus: 'PAID',
      orderStatus: 'Shipped',
      date: '27 Oct 2026'
    },
    {
      id: 'WM-ORD-9279',
      customer: 'Ananya Deshmukh',
      email: 'ananya.d@gmail.com',
      phone: '+91 91234 56780',
      address: 'Rowhouse #7, Green Meadows, Koramangala 4th Block, Bengaluru',
      items: [
        { name: 'Citrus Sunshine 2L Bottle', qty: 1, price: 349 }
      ],
      total: 349,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'PENDING',
      orderStatus: 'Confirmed & Processing',
      date: '26 Oct 2026'
    },
    {
      id: 'WM-ORD-9278',
      customer: 'Vikram Malhotra',
      email: 'vikram.m@zenith.org',
      phone: '+91 99887 76655',
      address: 'Villa 14, Palm Springs, Sarjapur Road, Bengaluru 560035',
      items: [
        { name: 'Ocean Fresh 2L Bottle', qty: 1, price: 349 }
      ],
      total: 349,
      paymentMethod: 'Razorpay UPI',
      paymentStatus: 'PAID',
      orderStatus: 'Delivered',
      date: '25 Oct 2026'
    }
  ]);

  // 4. Contact / B2B Messages
  const [messagesList, setMessagesList] = useState([
    {
      id: 'MSG-4102',
      name: 'Rajesh Nair (The Grand Orchid Hotel)',
      email: 'procurement@grandorchid.com',
      phone: '+91 98860 44210',
      subject: 'Bulk Institutional Order',
      message: 'Requirement for 150 units of 2kg Refill Pouches monthly for hotel laundry.',
      status: 'pending',
      date: '28 Oct 2026'
    },
    {
      id: 'MSG-4099',
      name: 'Sunita Ramanathan (Care & Clean)',
      email: 'sunita@careclean.in',
      phone: '+91 98451 90211',
      subject: 'Commercial Trial Sample Kit',
      message: 'Requesting sample pouches of Ocean Fresh and Floral Bloom for front-load machines.',
      status: 'replied',
      date: '26 Oct 2026'
    }
  ]);

  // 5. Banners State
  const [bannersList, setBannersList] = useState([
    {
      id: 'ban-1',
      title: '✦ MEGA FESTIVE SAVER BUNDLE ✦',
      subtitle: 'Flat 30% OFF on 4kg Family Combos + Free Delivery',
      badge: 'PROMO',
      ctaText: 'Shop Best Sellers',
      ctaLink: '#products',
      imageUrl: '/assets/images/fabric_bg.jpg',
      isActive: true
    }
  ]);

  // 6. Homepage CMS State
  const [homepageContent, setHomepageContent] = useState({
    heroHeadline: '10x Bio-Clean Action, 48-Hour Freshness.',
    heroSubtitle: 'Plant-powered enzymes that dissolve tough grease, sweat, and food stains while locking in ocean-breeze fragrance.',
    primaryCtaText: 'Shop Liquid Detergent',
    secondaryCtaText: 'Smart Dose Guide',
    bottleImage: '/assets/images/bottle_blue.png',
    stat1Num: '10x',
    stat1Label: 'Tough Stain Action',
    stat2Num: '48hr',
    stat2Label: 'Scent Lock',
    stat3Num: '100%',
    stat3Label: 'Fabric Safe'
  });

  // Calculate live KPI metrics (matching 2nd image exactly)
  const totalProductsCount = productsList.length; // 6
  const activeProductsCount = productsList.filter(p => p.isActive).length; // 6
  const outOfStockCount = productsList.filter(p => p.stock === 0).length; // 1 or 0
  const totalOrdersCount = ordersList.length; // 4
  const totalRevenueSum = ordersList.reduce((acc, o) => acc + o.total, 0); // ₹2,546

  // Tab Titles map
  const tabTitles = {
    dashboard: 'Dashboard Overview',
    products: 'Products Catalogue',
    categories: 'Product Categories',
    homepage: 'Homepage Content',
    banners: 'Banners & Promotions',
    pages: 'Website Pages',
    media: 'Media Library',
    orders: 'Customer Orders',
    messages: 'Contact Messages',
    settings: 'Settings & Security'
  };

  useEffect(() => {
    // 1. Fetch live products from backend
    fetch('/api/admin/products', { headers: getAuthHeaders() })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProductsList(data.map(p => ({
            ...p,
            stock: p.stockQty !== undefined ? p.stockQty : (p.stock || 0),
            price: (p.sizes && p.sizes[0]?.price) || p.price || 249,
            mrp: (p.sizes && p.sizes[0]?.mrp) || p.mrp || 299
          })));
        }
      })
      .catch(() => {});

    // 2. Fetch live orders
    fetch('/api/admin/orders', { headers: getAuthHeaders() })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setOrdersList(data.map(o => ({
            ...o,
            customer: o.customerName || o.customer || 'Customer',
            email: o.customerEmail || o.email || '',
            phone: o.customerPhone || o.phone || '',
            orderStatus: o.status || o.orderStatus || 'Confirmed & Processing'
          })));
        }
      })
      .catch(() => {});

    // Fetch live transactions
    fetch('/api/admin/transactions', { headers: getAuthHeaders() })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data)) setTransactionsList(data);
      })
      .catch(() => {});

    // Fetch live invoices
    fetch('/api/admin/invoices', { headers: getAuthHeaders() })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data)) setInvoicesList(data);
      })
      .catch(() => {});

    // Fetch live billing analytics
    fetch('/api/admin/billing/analytics', { headers: getAuthHeaders() })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.totalRevenue !== undefined) setBillingAnalytics(data);
      })
      .catch(() => {});

    // 3. Fetch live categories
    fetch('/api/admin/categories', { headers: getAuthHeaders() })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategoriesList(data.map((c, idx) => ({
            id: c.id,
            slug: c.slug || c.id,
            name: c.name,
            desc: c.description || c.desc || '',
            count: c.productCount !== undefined ? c.productCount : 0,
            order: c.displayOrder || idx + 1
          })));
        }
      })
      .catch(() => {});

    // 4. Fetch live contact messages
    fetch('/api/admin/messages', { headers: getAuthHeaders() })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMessagesList(data);
        }
      })
      .catch(() => {});

    // 4. Fetch live homepage content
    fetch('/api/homepage')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.hero) {
          setHomepageContent(prev => ({
            ...prev,
            heroHeadline: data.hero.headline || prev.heroHeadline,
            heroSubtitle: data.hero.subtitle || prev.heroSubtitle,
            primaryCtaText: data.hero.primaryCtaText || prev.primaryCtaText,
            bottleImage: data.hero.mainBottleImage || prev.bottleImage,
            stat1Num: data.brandIntro?.stat1Number || prev.stat1Num,
            stat1Label: data.brandIntro?.stat1Label || prev.stat1Label,
            stat2Num: data.brandIntro?.stat2Number || prev.stat2Num,
            stat2Label: data.brandIntro?.stat2Label || prev.stat2Label,
            stat3Num: data.brandIntro?.stat3Number || prev.stat3Num,
            stat3Label: data.brandIntro?.stat3Label || prev.stat3Label
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleProductActive = async (id) => {
    const current = productsList.find(p => p.id === id);
    const newStatus = current ? !current.isActive : true;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive: newStatus })
      });
      if (res.ok) {
        setProductsList(prev => prev.map(p => p.id === id ? { ...p, isActive: newStatus } : p));
        showToast('Product status updated.');
      }
    } catch (e) {
      showToast('Error updating product status');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Delete product "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setProductsList(prev => prev.filter(p => p.id !== id));
        showToast(`Deleted ${name}`);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to delete product');
      }
    } catch (e) {
      showToast('Error deleting product');
    }
  };

  const handleRegenerateInvoice = async (orderId) => {
    if (!window.confirm(`Regenerate tax invoice for order ${orderId}? This verified process updates calculations without duplicating invoice numbers.`)) return;
    try {
      const res = await fetch('/api/admin/invoices/regenerate', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ orderId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Tax invoice ${data.invoice.invoiceNumber} successfully regenerated!`);
        // Refresh invoices and orders
        const oRes = await fetch('/api/admin/orders', { headers: getAuthHeaders() });
        if (oRes.ok) {
          const oData = await oRes.json();
          setOrdersList(oData.map(o => ({
            ...o,
            customer: o.customerName || o.customer || 'Customer',
            email: o.customerEmail || o.email || '',
            phone: o.customerPhone || o.phone || '',
            orderStatus: o.status || o.orderStatus || 'Confirmed & Processing'
          })));
        }
        const iRes = await fetch('/api/admin/invoices', { headers: getAuthHeaders() });
        if (iRes.ok) setInvoicesList(await iRes.json());
        setSelectedInvoice(data.invoice);
      } else {
        showToast(data.error || 'Failed to regenerate invoice', 'error');
      }
    } catch (e) {
      showToast('Error regenerating invoice', 'error');
    }
  };

  const handleResendInvoice = async (invoiceNumber, email) => {
    if (!window.confirm(`Resend official Tax Invoice ${invoiceNumber} to ${email || 'customer'}?`)) return;
    try {
      const res = await fetch('/api/admin/invoices/resend', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ invoiceNumber, email })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || `Invoice ${invoiceNumber} resent to customer.`);
      } else {
        showToast(data.error || 'Failed to resend invoice', 'error');
      }
    } catch (e) {
      showToast('Error sending invoice', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));
      }
      showToast(`Order ${orderId} marked as ${newStatus}`);
    } catch (e) {
      showToast('Error updating order');
    }
  };

  const handleMarkMessageReplied = async (id) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'replied' })
      });
      setMessagesList(prev => prev.map(m => m.id === id ? { ...m, status: 'replied' } : m));
      showToast('Message marked as replied.');
    } catch (e) {
      showToast('Error updating message');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      color: '#0F172A',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      display: 'flex'
    }}>
      
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.88rem',
          fontWeight: '600',
          animation: 'fadeIn 0.2s ease'
        }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          1. LEFT SIDEBAR (WHITE THEME SAAS — AS SEEN IN 2ND IMAGE)
          ========================================================================= */}
      <aside style={{
        width: sidebarCollapsed ? '80px' : '260px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        flexShrink: 0
      }}>
        
        {/* Sidebar Header: Logo + Toggle */}
        <div style={{
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          borderBottom: '1px solid #E2E8F0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <img 
              src="/assets/images/logo.png" 
              alt="White Mist Logo" 
              style={{ height: '36px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
              onError={(e) => { e.currentTarget.src = '/public/assets/images/logo.png'; }}
            />
            {!sidebarCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '800', fontSize: '0.98rem', color: '#0F172A', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                  White Mist
                </span>
                <span style={{ fontSize: '0.65rem', color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>
                  ADMIN CONSOLE
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'background-color 0.15s ease'
            }}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Navigation Items List */}
        <nav style={{
          flex: 1,
          padding: '1rem 0.75rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          
          {/* Section: Overview */}
          <div style={{
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#94A3B8',
            fontWeight: '700',
            padding: '0.6rem 0.75rem 0.35rem',
            whiteSpace: 'nowrap',
            display: sidebarCollapsed ? 'none' : 'block'
          }}>
            Overview
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.7rem 0.85rem',
              color: activeTab === 'dashboard' ? '#0284C7' : '#64748B',
              backgroundColor: activeTab === 'dashboard' ? '#EFF6FF' : 'transparent',
              border: activeTab === 'dashboard' ? '1px solid #BFDBFE' : '1px solid transparent',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: activeTab === 'dashboard' ? '700' : '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              width: '100%',
              textAlign: 'left',
              boxShadow: activeTab === 'dashboard' ? '0 1px 3px rgba(2, 132, 199, 0.08)' : 'none',
              transition: 'all 0.18s ease'
            }}
          >
            <Home size={18} />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </button>

          {/* Section: Catalogue & Content */}
          <div style={{
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#94A3B8',
            fontWeight: '700',
            padding: '0.8rem 0.75rem 0.35rem',
            whiteSpace: 'nowrap',
            display: sidebarCollapsed ? 'none' : 'block'
          }}>
            Catalogue & Content
          </div>

          {[
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'products', label: 'Products', icon: Package, badge: productsList.length },
            { id: 'homepage', label: 'Homepage Content', icon: Home }
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.65rem 0.85rem',
                  color: isActive ? '#0284C7' : '#64748B',
                  backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                  border: isActive ? '1px solid #BFDBFE' : '1px solid transparent',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? '700' : '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  width: '100%',
                  textAlign: 'left',
                  boxShadow: isActive ? '0 1px 3px rgba(2, 132, 199, 0.08)' : 'none',
                  transition: 'all 0.18s ease'
                }}
              >
                <Icon size={18} />
                {!sidebarCollapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                {!sidebarCollapsed && item.badge !== undefined && (
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    backgroundColor: '#E0F2FE',
                    color: '#0284C7',
                    fontWeight: '700'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Section: Sales & Support */}
          <div style={{
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#94A3B8',
            fontWeight: '700',
            padding: '0.8rem 0.75rem 0.35rem',
            whiteSpace: 'nowrap',
            display: sidebarCollapsed ? 'none' : 'block'
          }}>
            Sales & Support
          </div>

          {[
            { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: ordersList.length },
            { id: 'transactions', label: 'Transaction History', icon: CreditCard, badge: transactionsList.length },
            { id: 'invoices', label: 'Invoices', icon: Receipt, badge: invoicesList.length },
            { id: 'customer-logins', label: 'Customer Logins', icon: UserCheck, badge: customerLoginsToday || customerLoginsList.length },
            { id: 'settings', label: 'Settings & Security', icon: Settings }
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.65rem 0.85rem',
                  color: isActive ? '#0284C7' : '#64748B',
                  backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                  border: isActive ? '1px solid #BFDBFE' : '1px solid transparent',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? '700' : '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  width: '100%',
                  textAlign: 'left',
                  boxShadow: isActive ? '0 1px 3px rgba(2, 132, 199, 0.08)' : 'none',
                  transition: 'all 0.18s ease'
                }}
              >
                <Icon size={18} />
                {!sidebarCollapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    backgroundColor: item.id === 'messages' ? '#FEE2E2' : '#E0F2FE',
                    color: item.id === 'messages' ? '#DC2626' : '#0284C7',
                    fontWeight: '700'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

        </nav>

        {/* Sidebar Footer: Super Admin Profile + Logout */}
        <div style={{
          padding: '1rem 0.85rem',
          borderTop: '1px solid #E2E8F0',
          backgroundColor: '#F8FAFC'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284C7 0%, #6366F1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '0.88rem',
              color: '#FFFFFF',
              flexShrink: 0
            }}>
              SA
            </div>
            {!sidebarCollapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser.fullName || 'Super Admin'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#0284C7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser.email || 'admin@whitemist.com'}
                </div>
              </div>
            )}
            <button
              onClick={onLogout}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Sign Out of Admin Portal"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

      </aside>

      {/* =========================================================================
          2. MAIN CONTENT AREA (TOPBAR + PANELS)
          ========================================================================= */}
      <div style={{ flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', minWidth: 0, maxWidth: '100%', overflowX: 'hidden' }}>
        
        {/* Top Bar */}
        <header style={{
          height: '70px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderBottom: '1px solid #E2E8F0',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 90,
          backdropFilter: 'blur(12px)',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          
          {/* Breadcrumb Trail */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: '#64748B' }}>
            <span>White Mist</span>
            <span>/</span>
            <strong style={{ color: '#0F172A', fontWeight: '700' }}>
              {tabTitles[activeTab] || 'Dashboard Overview'}
            </strong>
          </div>

          {/* Topbar Actions: Search + View Store + Add Product */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            
            {/* Search Input Box */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '999px',
              padding: '0.45rem 0.95rem',
              gap: '0.5rem',
              width: '260px'
            }}>
              <Search size={15} color="#94A3B8" />
              <input 
                type="text"
                placeholder="Search products, orders, pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.82rem',
                  color: '#0F172A',
                  width: '100%'
                }}
              />
            </div>
          </div>
        </header>

        {/* Content Body Container */}
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>

          {/* ===================================================================
              PANEL 1: EXECUTIVE OVERVIEW (EXACT MATCH TO 2ND IMAGE)
              =================================================================== */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Header with Title + Refresh Metrics */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
                    Executive Overview
                  </h1>
                  <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '0.25rem' }}>
                    Live inventory metrics, sales volume, and real-time catalogue updates.
                  </p>
                </div>
                <button
                  onClick={() => showToast('Dashboard metrics synchronized!')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#334155',
                    padding: '0.5rem 0.95rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <RefreshCw size={14} /> Refresh Metrics
                </button>
              </div>

              {/* 5 KPI Stat Cards Grid (Exact match to 2nd image) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '1.25rem'
              }}>
                
                {/* Card 1: Total Products */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.35rem 1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>Total Products</span>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(2, 132, 199, 0.08)',
                      color: '#0284C7'
                    }}>
                      <ShoppingBag size={18} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0F172A', lineHeight: 1.1, marginBottom: '0.35rem' }}>
                    {totalProductsCount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600' }}>
                    <span>●</span>
                    <span>{activeProductsCount} Active in catalogue</span>
                  </div>
                </div>

                {/* Card 2: Out of Stock */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.35rem 1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>Out of Stock</span>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(217, 119, 6, 0.08)',
                      color: '#D97706'
                    }}>
                      <AlertTriangle size={18} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#D97706', lineHeight: 1.1, marginBottom: '0.35rem' }}>
                    {outOfStockCount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    Units requiring restock
                  </div>
                </div>

                {/* Card 3: Total Orders Placed */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.35rem 1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>Total Orders Placed</span>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(99, 102, 241, 0.08)',
                      color: '#6366F1'
                    }}>
                      <ShoppingCart size={18} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0F172A', lineHeight: 1.1, marginBottom: '0.35rem' }}>
                    {totalOrdersCount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>
                    Verified customer checkouts
                  </div>
                </div>

                {/* Card 4: Total Revenue */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.35rem 1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>Total Revenue</span>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(5, 150, 105, 0.08)',
                      color: '#059669',
                      fontWeight: '700',
                      fontSize: '1.15rem'
                    }}>
                      ₹
                    </div>
                  </div>
                  <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0F172A', lineHeight: 1.1, marginBottom: '0.35rem' }}>
                    ₹{totalRevenueSum.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>
                    Across all product sizes
                  </div>
                </div>

                {/* Card 5: Recent Updates */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.35rem 1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>Recent Updates</span>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(2, 132, 199, 0.08)',
                      color: '#0284C7'
                    }}>
                      <RefreshCw size={18} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0284C7', lineHeight: 1.4, marginBottom: '0.35rem' }}>
                    Live Sync
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    Real-time DB connection
                  </div>
                </div>

              </div>

              {/* Lower Section: Recent Orders + Catalogue Distribution */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.8fr 1.2fr',
                gap: '1.5rem'
              }}>
                
                {/* Recent Customer Orders Card Panel */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>
                      Recent Customer Orders
                    </h2>
                    <button
                      onClick={() => setActiveTab('orders')}
                      style={{ background: 'none', border: 'none', color: '#0284C7', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      View All Orders →
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order ID</th>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</th>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Items</th>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</th>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordersList.map(order => (
                          <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#0284C7', fontFamily: 'monospace' }}>
                              {order.id}
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ fontWeight: '600', color: '#0F172A' }}>{order.customer}</div>
                              <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{order.email}</div>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: '#4B5563', fontSize: '0.82rem' }}>
                              {order.items.length} items
                            </td>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#0F172A' }}>
                              ₹{order.total}
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                padding: '3px 8px',
                                borderRadius: '999px',
                                backgroundColor: 
                                  String(order.orderStatus || order.status || '').includes('Delivered') ? '#ECFDF5' :
                                  String(order.orderStatus || order.status || '').includes('Shipped') ? '#EFF6FF' : '#FEF3C7',
                                color: 
                                  String(order.orderStatus || order.status || '').includes('Delivered') ? '#047857' :
                                  String(order.orderStatus || order.status || '').includes('Shipped') ? '#0284C7' : '#B45309'
                              }}>
                                {order.orderStatus || order.status || 'Processing'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Catalogue Distribution Card Panel */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06)'
                }}>
                  <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0F172A', margin: '0 0 1.25rem 0' }}>
                    Catalogue Distribution
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { name: 'Ergonomic Bottles (2L)', count: 3, pct: 50, color: '#0284C7' },
                      { name: 'Eco Spout Refill Pouches (2kg)', count: 2, pct: 33, color: '#F43F5E' },
                      { name: 'Family Value Combos', count: 1, pct: 17, color: '#10B981' }
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                          <span style={{ color: '#0F172A', fontWeight: '600' }}>{item.name}</span>
                          <span style={{ color: '#0284C7', fontWeight: '700' }}>{item.count} products ({item.pct}%)</span>
                        </div>
                        <div style={{ height: '7px', backgroundColor: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${item.pct}%`, backgroundColor: item.color }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Operational Quality Assurance Badge */}
                  <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <ShieldCheck size={24} color="#10B981" />
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0F172A' }}>
                        Bio-Enzyme Laboratory Certified
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        Batch WM-902 passed all 48hr stability & fabric protection checks.
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ===================================================================
              PANEL 2: PRODUCTS CATALOGUE
              =================================================================== */}
          {activeTab === 'products' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    Products Catalogue & Inventory
                  </h1>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                    Manage liquid detergent SKUs, bottle formats, pricing, and live stock allocations.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  style={{
                    backgroundColor: '#0284C7',
                    color: 'white',
                    border: 'none',
                    padding: '0.55rem 1.15rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
                  }}
                >
                  <Plus size={16} /> Add New Product
                </button>
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
              }}>
                <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Product & Variant</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Category</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Fragrance</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Price / MRP</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Stock Status</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Visibility</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsList.map(prod => (
                      <tr key={prod.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <img src={prod.image} alt={prod.name} style={{ width: '40px', height: '45px', objectFit: 'contain', backgroundColor: '#F8FAFC', padding: '3px', borderRadius: '6px', border: '1px solid #E2E8F0' }} />
                            <div>
                              <div style={{ fontWeight: '700', color: '#0F172A' }}>{prod.name}</div>
                              <div style={{ fontSize: '0.74rem', color: '#0284C7', fontFamily: 'monospace' }}>{prod.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: '#4B5563' }}>{prod.category}</td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: '600', padding: '3px 8px', borderRadius: '6px', backgroundColor: '#F1F5F9', color: '#334155' }}>
                            {prod.fragrance}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <strong style={{ color: '#0F172A' }}>₹{prod.price}</strong>
                          <span style={{ fontSize: '0.74rem', color: '#94A3B8', textDecoration: 'line-through', marginLeft: '6px' }}>₹{prod.mrp}</span>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span style={{
                            fontSize: '0.74rem',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '999px',
                            backgroundColor: prod.stock > 15 ? '#ECFDF5' : prod.stock > 0 ? '#FEF3C7' : '#FEE2E2',
                            color: prod.stock > 15 ? '#047857' : prod.stock > 0 ? '#B45309' : '#DC2626'
                          }}>
                            {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of stock'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <button
                            onClick={() => handleToggleProductActive(prod.id)}
                            style={{
                              backgroundColor: prod.isActive ? '#ECFDF5' : '#F1F5F9',
                              color: prod.isActive ? '#047857' : '#64748B',
                              border: '1px solid #E2E8F0',
                              padding: '3px 9px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            {prod.isActive ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                            title="Delete SKU"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              PANEL 3: ORDERS MANAGEMENT
              =================================================================== */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Customer Orders & Fulfillment
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  Review order manifests, manage status dispatches, and verify payment gateways.
                </p>
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                      <th style={{ width: '45px', textAlign: 'center', padding: '0.85rem 0.5rem' }}>#</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Order ID</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Items Ordered</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Total</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Order Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersList.map((order, orderIdx) => {
                      const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (order.date || '--');

                      return (
                        <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ textAlign: 'center', fontWeight: '700', color: '#94A3B8', width: '45px', padding: '0.85rem 0.5rem' }}>{orderIdx + 1}</td>
                          <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                fontWeight: '800',
                                color: '#0284C7',
                                fontFamily: 'monospace',
                                fontSize: '0.92rem',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                              }}
                              title="View Order Details"
                            >
                              {order.id}
                            </button>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                            {dateStr}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ fontWeight: '600', color: '#0F172A' }}>{order.customer}</div>
                            <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{order.email || order.phone}</div>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: '#4B5563', fontSize: '0.8rem' }}>
                            {(order.items || []).map((it, i) => (
                              <div key={i}>• {it.name} (x{it.qty || it.quantity || 1})</div>
                            ))}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#0F172A' }}>
                            ₹{order.total}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <select
                              value={order.orderStatus || order.status || 'Confirmed & Processing'}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '6px',
                                padding: '4px 8px',
                                fontSize: '0.78rem',
                                fontWeight: '600',
                                color: '#0F172A',
                                outline: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="Confirmed & Processing">Confirmed & Processing</option>
                              <option value="In Transit">In Transit</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              PANEL 3b: TRANSACTION HISTORY
              =================================================================== */}
          {activeTab === 'transactions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Customer Transaction History
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  Verified payment gateway settlement records, real-time transaction states, and authorization tracking.
                </p>
              </div>

              {/* Toolbar */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem 0.85rem' }}>
                    <Search size={16} color="#64748B" />
                    <input
                      type="text"
                      placeholder="Search Txn ID, Order ID, Customer..."
                      value={txnSearchQuery}
                      onChange={(e) => setTxnSearchQuery(e.target.value)}
                      style={{ border: 'none', outline: 'none', fontSize: '0.85rem', width: '220px' }}
                    />
                  </div>
                  <select
                    value={txnStatusFilter}
                    onChange={(e) => setTxnStatusFilter(e.target.value)}
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    <option value="all">All Payment Statuses</option>
                    <option value="SUCCESS">SUCCESS</option>
                    <option value="PENDING">PENDING</option>
                    <option value="FAILED">FAILED</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                  <select
                    value={txnMethodFilter}
                    onChange={(e) => setTxnMethodFilter(e.target.value)}
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    <option value="all">All Payment Methods</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="COD">COD</option>
                  </select>
                </div>
                <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Total: {transactionsList.length} transactions
                </span>
              </div>

              {/* Transactions Table */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflowX: 'auto', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
                <table style={{ width: '100%', minWidth: '950px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                      <th style={{ width: '45px', textAlign: 'center', padding: '0.85rem 0.5rem' }}>#</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Txn ID</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Order ID</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Date & Time</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Gateway</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Method</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Amount</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionsList
                      .filter(t => {
                        const q = txnSearchQuery.toLowerCase();
                        if (q && !(
                          (t.id && t.id.toLowerCase().includes(q)) ||
                          (t.orderId && t.orderId.toLowerCase().includes(q)) ||
                          (t.customerName && t.customerName.toLowerCase().includes(q))
                        )) return false;
                        if (txnStatusFilter !== 'all' && t.paymentStatus?.toUpperCase() !== txnStatusFilter.toUpperCase()) return false;
                        if (txnMethodFilter !== 'all' && !t.paymentMethod?.toLowerCase().includes(txnMethodFilter.toLowerCase())) return false;
                        return true;
                      })
                      .map(txn => {
                        const isSuccess = (txn.paymentStatus || 'SUCCESS').toUpperCase() === 'SUCCESS';
                        const d = new Date(txn.transactionDate || txn.createdAt);
                        return (
                          <tr key={txn.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#0284C7', fontFamily: 'monospace' }}>
                              <button
                                onClick={() => setSelectedTransaction(txn)}
                                style={{ background: 'none', border: 'none', padding: 0, color: '#0284C7', fontWeight: '800', fontFamily: 'monospace', fontSize: '0.88rem', cursor: 'pointer', textDecoration: 'underline' }}
                                title="Click to view transaction details"
                              >
                                {txn.id}
                              </button>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: '600' }}>
                              {txn.orderId}
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ fontWeight: '600', color: '#0F172A' }}>{txn.customerName}</div>
                              <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{txn.customerEmail || ''}</div>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                              {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: '600' }}>
                              {txn.paymentGateway || 'Razorpay'}
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{txn.paymentMethod || 'UPI'}</span>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#0F172A' }}>
                              ₹{txn.amount}
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <span style={{
                                fontSize: '0.74rem',
                                fontWeight: '700',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                backgroundColor: isSuccess ? '#ECFDF5' : (txn.paymentStatus === 'PENDING' ? '#FEF3C7' : '#FEF2F2'),
                                color: isSuccess ? '#047857' : (txn.paymentStatus === 'PENDING' ? '#92400E' : '#B91C1C')
                              }}>
                                {txn.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              PANEL 3c: INVOICE MANAGEMENT
              =================================================================== */}
          {/* CUSTOMER LOGIN ACTIVITY VIEW */}
          {activeTab === 'customer-logins' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                    Customer Login Activity
                  </h1>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                    Monitor and manage customer sign-in history.
                  </p>
                </div>
                <button
                  onClick={() => fetchCustomerLogins(1)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.5rem 0.85rem',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: '#334155',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                  }}
                >
                  <RefreshCw size={14} className={customerLoginsLoading ? 'spin' : ''} />
                  Refresh
                </button>
              </div>

              {/* 2 Compact Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Total Logins
                    </span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(2, 132, 199, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7' }}>
                      <UserCheck size={18} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    {customerLoginsTotal}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '600', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>●</span> All-time customer sessions
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Today's Logins
                    </span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                      <Clock size={18} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#10B981', margin: 0 }}>
                    {customerLoginsToday}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>●</span> Active today (since 00:00)
                  </div>
                </div>
              </div>

              {/* Toolbar Search & Filter */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem 0.85rem' }}>
                    <Search size={16} color="#64748B" />
                    <input
                      type="text"
                      placeholder="Search customer name or email..."
                      value={customerLoginsSearch}
                      onChange={(e) => setCustomerLoginsSearch(e.target.value)}
                      style={{ border: 'none', outline: 'none', fontSize: '0.85rem', width: '220px' }}
                    />
                  </div>
                  <select
                    value={customerLoginsStatus}
                    onChange={(e) => setCustomerLoginsStatus(e.target.value)}
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Logged In">Logged In</option>
                    <option value="Logged Out">Logged Out</option>
                  </select>
                  <input
                    type="date"
                    value={customerLoginsDate}
                    onChange={(e) => setCustomerLoginsDate(e.target.value)}
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                  />
                  {(customerLoginsSearch || customerLoginsStatus !== 'all' || customerLoginsDate) && (
                    <button
                      onClick={() => {
                        setCustomerLoginsSearch('');
                        setCustomerLoginsStatus('all');
                        setCustomerLoginsDate('');
                        fetchCustomerLogins(1);
                      }}
                      style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem 0.75rem', fontSize: '0.82rem', cursor: 'pointer' }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Showing {customerLoginsList.length} of {customerLoginsTotal} records
                </span>
              </div>

              {/* Login History Table */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflowX: 'auto', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
                <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                      <th style={{ width: '45px', textAlign: 'center', padding: '0.85rem 0.5rem' }}>#</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Email Address</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Login Date</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Login Time</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerLoginsList.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                              <UserCheck size={24} />
                            </div>
                            <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '0.95rem' }}>No customer login activity found</div>
                            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0, maxWidth: '320px' }}>No customer sign-in records match the current filter criteria.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      customerLoginsList.map((item, idx) => {
                        const name = item.customerName || item.email?.split('@')[0] || 'Customer';
                        const initials = name.split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase() || 'CU';
                        const isLoggedIn = (item.status || '').toLowerCase() === 'logged in';

                        return (
                          <tr key={item.id || idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ textAlign: 'center', fontWeight: '700', color: '#94A3B8', width: '45px', padding: '0.85rem 0.5rem' }}>
                              {(customerLoginsPage - 1) * 10 + idx + 1}
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284C7, #0369A1)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
                                  {initials}
                                </div>
                                <strong style={{ color: '#0F172A', fontSize: '0.9rem' }}>{name}</strong>
                              </div>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: '#64748B', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                              {item.email}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap', fontSize: '0.82rem', color: '#64748B' }}>
                              {item.loginDate || '—'}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap', fontSize: '0.82rem', color: '#64748B' }}>
                              {item.loginTime || '—'}
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              {isLoggedIn ? (
                                <span style={{ backgroundColor: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.65rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                                  Logged In
                                </span>
                              ) : (
                                <span style={{ backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.65rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#94A3B8' }} />
                                  Logged Out
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Page {customerLoginsPage} of {customerLoginsTotalPages}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    disabled={customerLoginsPage <= 1}
                    onClick={() => fetchCustomerLogins(customerLoginsPage - 1)}
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.4rem 0.8rem', fontSize: '0.82rem', cursor: customerLoginsPage <= 1 ? 'not-allowed' : 'pointer', opacity: customerLoginsPage <= 1 ? 0.5 : 1 }}
                  >
                    ← Previous
                  </button>
                  <button
                    disabled={customerLoginsPage >= customerLoginsTotalPages}
                    onClick={() => fetchCustomerLogins(customerLoginsPage + 1)}
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.4rem 0.8rem', fontSize: '0.82rem', cursor: customerLoginsPage >= customerLoginsTotalPages ? 'not-allowed' : 'pointer', opacity: customerLoginsPage >= customerLoginsTotalPages ? 0.5 : 1 }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Tax Invoice & Billing Management
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  GST-compliant invoices, automated billing tax registers, PDF downloads, and customer reprint dispatch.
                </p>
              </div>

              {/* Toolbar */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem 0.85rem' }}>
                    <Search size={16} color="#64748B" />
                    <input
                      type="text"
                      placeholder="Search Invoice #, Order ID, Customer..."
                      value={invoiceSearchQuery}
                      onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                      style={{ border: 'none', outline: 'none', fontSize: '0.85rem', width: '220px' }}
                    />
                  </div>
                  <select
                    value={invoiceStatusFilter}
                    onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    <option value="all">All Invoice Statuses</option>
                    <option value="PAID">PAID</option>
                    <option value="ISSUED">ISSUED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
                <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Total: {invoicesList.length} invoices
                </span>
              </div>

              {/* Invoices Table */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflowX: 'auto', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
                <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                      <th style={{ width: '45px', textAlign: 'center', padding: '0.85rem 0.5rem' }}>#</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Invoice Number</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Order ID</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Invoice Date</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Total Amount</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Payment Status</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Invoice Status</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoicesList
                      .filter(inv => {
                        const q = invoiceSearchQuery.toLowerCase();
                        if (q && !(
                          (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(q)) ||
                          (inv.orderId && inv.orderId.toLowerCase().includes(q)) ||
                          (inv.customerName && inv.customerName.toLowerCase().includes(q))
                        )) return false;
                        if (invoiceStatusFilter !== 'all' && inv.status?.toUpperCase() !== invoiceStatusFilter.toUpperCase()) return false;
                        return true;
                      })
                      .map(inv => {
                        const d = new Date(inv.invoiceDate || inv.createdAt);
                        return (
                          <tr key={inv.id || inv.invoiceNumber} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#0284C7', fontFamily: 'monospace' }}>
                              {inv.invoiceNumber}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: '600' }}>
                              {inv.orderId}
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ fontWeight: '600', color: '#0F172A' }}>{inv.customerName}</div>
                              <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{inv.customerEmail || ''}</div>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                              {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#0F172A' }}>
                              ₹{inv.grandTotal || inv.total}
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <span style={{ fontSize: '0.74rem', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', backgroundColor: '#ECFDF5', color: '#047857' }}>
                                {inv.paymentStatus || 'PAID'}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <span style={{ fontSize: '0.74rem', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', backgroundColor: '#EEF2FF', color: '#4338CA' }}>
                                {inv.status || 'ISSUED'}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  onClick={() => setSelectedInvoice(inv)}
                                  style={{ backgroundColor: '#0284C7', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                                >
                                  Preview
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedInvoice(inv);
                                    setTimeout(() => window.print(), 300);
                                  }}
                                  style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                                >
                                  🖨 PDF
                                </button>
                                <button
                                  onClick={() => handleResendInvoice(inv.invoiceNumber, inv.customerEmail)}
                                  style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                                >
                                  Resend
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              PANEL 4: CATEGORIES MANAGEMENT
              =================================================================== */}
          {activeTab === 'categories' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    Product Category Taxonomy
                  </h1>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                    Configure customer navigation categories and liquid detergent product hierarchies.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddCategoryModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: '#0284C7',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                    transition: 'all 0.18s ease'
                  }}
                >
                  <Plus size={16} />
                  <span>Add Category</span>
                </button>
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
              }}>
                <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Order</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Category Name</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>URL Slug</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Description</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Live Products</th>
                      <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoriesList.map(cat => (
                      <tr key={cat.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#64748B' }}>#{cat.order}</td>
                        <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#0F172A' }}>{cat.name}</td>
                        <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', color: '#0284C7' }}>/{cat.slug}</td>
                        <td style={{ padding: '1rem 1.25rem', color: '#64748B' }}>{cat.desc}</td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: '700', padding: '3px 8px', borderRadius: '999px', backgroundColor: '#EFF6FF', color: '#0284C7' }}>
                            {cat.count} items
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#EF4444',
                              cursor: 'pointer',
                              padding: '6px',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background-color 0.15s ease'
                            }}
                            title={`Delete ${cat.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              PANEL 5: HOMEPAGE CMS EDITOR
              =================================================================== */}
          {activeTab === 'homepage' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Homepage Content & Hero Showcase
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  Edit public storefront hero headlines, promotional copy, and feature statements.
                </p>
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.4rem' }}>
                    Main Hero Headline
                  </label>
                  <input 
                    type="text"
                    value={homepageContent.heroHeadline}
                    onChange={(e) => setHomepageContent({ ...homepageContent, heroHeadline: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.4rem' }}>
                    Hero Subtitle Narrative
                  </label>
                  <textarea 
                    rows={3}
                    value={homepageContent.heroSubtitle}
                    onChange={(e) => setHomepageContent({ ...homepageContent, heroSubtitle: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.4rem' }}>
                      Primary CTA Button Label
                    </label>
                    <input 
                      type="text"
                      value={homepageContent.primaryCtaText}
                      onChange={(e) => setHomepageContent({ ...homepageContent, primaryCtaText: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.4rem' }}>
                      Secondary CTA Button Label
                    </label>
                    <input 
                      type="text"
                      value={homepageContent.secondaryCtaText}
                      onChange={(e) => setHomepageContent({ ...homepageContent, secondaryCtaText: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const payload = {
                        hero: {
                          headline: homepageContent.heroHeadline,
                          subtitle: homepageContent.heroSubtitle,
                          primaryCtaText: homepageContent.primaryCtaText,
                          mainBottleImage: homepageContent.bottleImage
                        },
                        brandIntro: {
                          stat1Number: homepageContent.stat1Num,
                          stat1Label: homepageContent.stat1Label,
                          stat2Number: homepageContent.stat2Num,
                          stat2Label: homepageContent.stat2Label,
                          stat3Number: homepageContent.stat3Num,
                          stat3Label: homepageContent.stat3Label
                        }
                      };
                      const res = await fetch('/api/admin/homepage', {
                        method: 'PUT',
                        headers: getAuthHeaders(),
                        body: JSON.stringify(payload)
                      });
                      if (res.ok) {
                        showToast('Homepage content published successfully.');
                      } else {
                        const err = await res.json().catch(() => ({}));
                        showToast(err.error || 'Failed to save homepage');
                      }
                    } catch (e) {
                      showToast('Error saving homepage');
                    }
                  }}
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: '#0284C7',
                    color: 'white',
                    border: 'none',
                    padding: '0.7rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  Save & Publish Homepage
                </button>
              </div>
            </div>
          )}

          {/* ===================================================================
              PANEL 6: BANNERS & PROMOTIONS
              =================================================================== */}
          {activeTab === 'banners' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    Promotional Banners & Sale Highlights
                  </h1>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                    Configure top announcement bars, seasonal discount ribbons, and voucher banners.
                  </p>
                </div>
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
              }}>
                {bannersList.map(b => (
                  <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#0284C7', backgroundColor: '#EFF6FF', padding: '2px 8px', borderRadius: '4px' }}>{b.badge}</span>
                      <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A', margin: '0.35rem 0 0.15rem 0' }}>{b.title}</h4>
                      <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>{b.subtitle}</p>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px', borderRadius: '999px', backgroundColor: '#ECFDF5', color: '#047857' }}>
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              PANEL 7: MEDIA LIBRARY
              =================================================================== */}
          {activeTab === 'media' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Media Library & Brand Assets
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  High-resolution bottle photography, packaging artwork, and transparent marketing icons.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '1.25rem'
              }}>
                {[
                  { name: 'bottle_blue.png', path: '/assets/images/bottle_blue.png', size: '248 KB' },
                  { name: 'bottle_pink.png', path: '/assets/images/bottle_pink.png', size: '278 KB' },
                  { name: 'bottle_yellow.png', path: '/assets/images/bottle_yellow.png', size: '268 KB' },
                  { name: 'pouch_blue.png', path: '/assets/images/pouch_blue.png', size: '342 KB' },
                  { name: 'pouch_pink.png', path: '/assets/images/pouch_pink.png', size: '386 KB' },
                  { name: 'logo.png', path: '/assets/images/logo.png', size: '230 KB' }
                ].map((asset, i) => (
                  <div key={i} style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '1rem',
                    textAlign: 'center',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                  }}>
                    <img src={asset.path} alt={asset.name} style={{ height: '80px', objectFit: 'contain', margin: '0 auto 0.5rem auto' }} />
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {asset.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: '0.5rem' }}>{asset.size}</div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(asset.path);
                        showToast(`Copied path ${asset.path}`);
                      }}
                      style={{
                        width: '100%',
                        backgroundColor: '#F1F5F9',
                        border: '1px solid #E2E8F0',
                        color: '#0284C7',
                        padding: '4px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Copy URL
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              PANEL 8: CONTACT MESSAGES
              =================================================================== */}
          {activeTab === 'messages' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Contact Messages & B2B Leads
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  Institutional quotations, hotel laundry orders, and retail distribution enquiries.
                </p>
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
              }}>
                <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Date</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Sender Name</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Email & Phone</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Subject</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Message Content</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Status</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messagesList.map(msg => (
                      <tr key={msg.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '1rem 1.25rem', color: '#64748B', fontSize: '0.82rem' }}>{msg.date}</td>
                        <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#0F172A' }}>{msg.name}</td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ color: '#0284C7', fontWeight: '600' }}>{msg.email}</div>
                          <div style={{ color: '#94A3B8', fontSize: '0.74rem' }}>{msg.phone}</div>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>{msg.subject}</td>
                        <td style={{ padding: '1rem 1.25rem', color: '#4B5563', maxWidth: '300px' }}>{msg.message}</td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span style={{
                            fontSize: '0.74rem',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '999px',
                            backgroundColor: msg.status === 'replied' ? '#ECFDF5' : '#FEF3C7',
                            color: msg.status === 'replied' ? '#047857' : '#B45309'
                          }}>
                            {msg.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <button
                            onClick={() => handleMarkMessageReplied(msg.id)}
                            style={{
                              backgroundColor: '#F1F5F9',
                              border: '1px solid #E2E8F0',
                              color: '#0F172A',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            {msg.status === 'replied' ? 'Replied' : 'Mark Replied'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              PANEL 9: SETTINGS & SECURITY
              =================================================================== */}
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Store Settings & Operational Security
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  Manage store contact details, shipping fee thresholds, and administrative credentials.
                </p>
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.4rem' }}>
                      Store Brand Name
                    </label>
                    <input type="text" defaultValue="Meridian White Mist" style={{ width: '100%', padding: '0.65rem', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.9rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.4rem' }}>
                      Free Shipping Threshold (₹)
                    </label>
                    <input type="number" defaultValue="499" style={{ width: '100%', padding: '0.65rem', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.9rem' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.4rem' }}>
                      Support Email Address
                    </label>
                    <input type="email" defaultValue="care@meridianwhitemist.com" style={{ width: '100%', padding: '0.65rem', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.9rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.4rem' }}>
                      Customer Care Hotline
                    </label>
                    <input type="text" defaultValue="1800-425-MIST" style={{ width: '100%', padding: '0.65rem', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.9rem' }} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Store settings saved successfully.')}
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: '#0284C7',
                    color: 'white',
                    border: 'none',
                    padding: '0.7rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  Save Store Settings
                </button>
              </div>
            </div>
          )}

          {/* ===================================================================
              PANEL 10: WEBSITE PAGES
              =================================================================== */}
          {activeTab === 'pages' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Website Pages & Policy Information
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  Update static content for About Us, Sustainability, Terms, and Shipping guidelines.
                </p>
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.4rem' }}>
                    Select Page To Edit
                  </label>
                  <select style={{ width: '100%', padding: '0.65rem', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.9rem' }}>
                    <option value="about">About Meridian White Mist</option>
                    <option value="sustainability">Sustainability & Bio-Enzymes</option>
                    <option value="warranty">Machine Care & Dosage Instructions</option>
                    <option value="shipping">Shipping & Return Policy</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.4rem' }}>
                    Page Content Body
                  </label>
                  <textarea rows={5} defaultValue="Meridian White Mist represents the next generation of premium bio-enzyme laundry care engineered to eliminate tough stains while ensuring complete fabric color protection." style={{ width: '100%', padding: '0.65rem', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.9rem' }} />
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Page content updated.')}
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: '#0284C7',
                    color: 'white',
                    border: 'none',
                    padding: '0.7rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Save Page Content
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* =========================================================================
          ORDER MANIFEST MODAL
          ========================================================================= */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1.5rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            maxWidth: '520px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '700' }}>Order Manifest</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0284C7', margin: 0, fontFamily: 'monospace' }}>
                  {selectedOrder.id}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '700' }}>Customer & Destination</div>
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '4px' }}>
                  <div style={{ fontWeight: '700', color: '#0F172A' }}>{selectedOrder.customer}</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B' }}>{selectedOrder.email} • {selectedOrder.phone}</div>
                  <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '4px' }}>{selectedOrder.address}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '700' }}>Items Breakdown</div>
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '4px' }}>
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.35rem 0', borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                      <span>{it.name} <strong style={{ color: '#0284C7' }}>x{it.qty}</strong></span>
                      <strong style={{ color: '#0F172A' }}>₹{it.price * it.qty}</strong>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.65rem', marginTop: '0.65rem', borderTop: '1px solid #E2E8F0', fontWeight: '800' }}>
                    <span style={{ color: '#64748B' }}>Total Amount:</span>
                    <span style={{ fontSize: '1.1rem', color: '#059669' }}>₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>Quick Dispatch Action</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {['Confirmed & Processing', 'Shipped', 'Delivered'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, status)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: (selectedOrder.orderStatus || selectedOrder.status) === status ? '#0284C7' : '#F1F5F9',
                        color: (selectedOrder.orderStatus || selectedOrder.status) === status ? '#FFFFFF' : '#334155',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADD PRODUCT MODAL
          ========================================================================= */}
      {/* =====================================================================
          ENTERPRISE ADD PRODUCT MODAL (HOMEPAGE CONTENT & MEDIA UPLOADS)
          ===================================================================== */}
      {isAddProductModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            maxWidth: '860px',
            width: '100%',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #E2E8F0',
              backgroundColor: '#FAFCFF'
            }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Package size={20} color="#0284C7" />
                  <span>Register New Detergent SKU & Homepage Showcase</span>
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                  Configure product catalog details, homepage presentation, media images, variants, and formula highlights.
                </p>
              </div>
              <button 
                onClick={() => setIsAddProductModalOpen(false)} 
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs Navigation */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
              padding: '0 1.25rem',
              overflowX: 'auto',
              gap: '0.5rem'
            }}>
              {[
                { id: 'general', label: 'Homepage & Branding', icon: Sparkles },
                { id: 'images', label: 'Product Images & Media', icon: ImageIcon },
                { id: 'pricing', label: 'Pack Sizes & Pricing', icon: ShoppingBag },
                { id: 'details', label: 'Description & Features', icon: FileText },
                { id: 'preview', label: 'Live Homepage Card Preview', icon: Eye }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = modalActiveTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalActiveTab(tab.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.75rem 0.95rem',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? '700' : '500',
                      color: isActive ? '#0284C7' : '#64748B',
                      background: 'none',
                      border: 'none',
                      borderBottom: isActive ? '2px solid #0284C7' : '2px solid transparent',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleCreateProductSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>

                {/* ---------------- TAB 1: HOMEPAGE & BRANDING ---------------- */}
                {modalActiveTab === 'general' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                          Product Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProductForm.name}
                          onChange={e => setNewProductForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. White Mist Ocean Fresh Liquid Detergent"
                          style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                          SKU Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProductForm.sku}
                          onChange={e => setNewProductForm(prev => ({ ...prev, sku: e.target.value.toUpperCase() }))}
                          placeholder="e.g. WM-LD-2L-NEW"
                          style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                          Storefront Category *
                        </label>
                        <select
                          value={newProductForm.category}
                          onChange={e => setNewProductForm(prev => ({ ...prev, category: e.target.value }))}
                          style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#FFFFFF' }}
                        >
                          <option value="bottles">Ergonomic Bottles (2L)</option>
                          <option value="pouches">Eco Spout Refill Pouches</option>
                          <option value="funwash">Fun Wash™ Value Packs</option>
                          <option value="combos">Super Saver Combos</option>
                          <option value="Daily Wash Liquid">Daily Wash Liquid</option>
                          <option value="Premium Fabric Care">Premium Fabric Care</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                          Homepage Card Badge
                        </label>
                        <select
                          value={newProductForm.badge}
                          onChange={e => setNewProductForm(prev => ({ ...prev, badge: e.target.value }))}
                          style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#FFFFFF' }}
                        >
                          <option value="Bestseller">Bestseller</option>
                          <option value="Top Rated">Top Rated</option>
                          <option value="New Launch">New Launch</option>
                          <option value="Commercial Grade">Commercial Grade</option>
                          <option value="Gentle Care">Gentle Care</option>
                          <option value="Super Saver">Super Saver</option>
                          <option value="Eco Friendly">Eco Friendly</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                        Homepage Tagline / Highlight Subtitle *
                      </label>
                      <input
                        type="text"
                        required
                        value={newProductForm.tagline}
                        onChange={e => setNewProductForm(prev => ({ ...prev, tagline: e.target.value }))}
                        placeholder="e.g. Deep Bio-Clean & 48-Hour Sea Breeze Scent Lock"
                        style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '3px', display: 'block' }}>
                        This bold tagline is shown right below the product title on the homepage cards.
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                          Fragrance Profile
                        </label>
                        <input
                          type="text"
                          value={newProductForm.fragrance}
                          onChange={e => setNewProductForm(prev => ({ ...prev, fragrance: e.target.value }))}
                          placeholder="e.g. Cool Ocean & Crisp Cotton"
                          style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                          Machine Compatibility Pill
                        </label>
                        <select
                          value={newProductForm.machineType}
                          onChange={e => setNewProductForm(prev => ({ ...prev, machineType: e.target.value }))}
                          style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#FFFFFF' }}
                        >
                          <option value="Front & Top Load">Front & Top Load</option>
                          <option value="Front Load Special">Front Load Special</option>
                          <option value="Top Load & Bucket Wash">Top Load & Bucket Wash</option>
                          <option value="Delicates & Woollens">Delicates & Woollens</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                        Homepage Card Theme Color & Gradient
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {[
                          { name: 'Ocean Blue', color: '#0084FF' },
                          { name: 'Floral Pink', color: '#F01262' },
                          { name: 'Citrus Yellow', color: '#D97706' },
                          { name: 'Emerald Mint', color: '#10B981' },
                          { name: 'Royal Violet', color: '#8B5CF6' }
                        ].map(c => (
                          <button
                            key={c.color}
                            type="button"
                            onClick={() => setNewProductForm(prev => ({ ...prev, accentColor: c.color }))}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              padding: '0.4rem 0.75rem',
                              borderRadius: '999px',
                              border: newProductForm.accentColor === c.color ? `2px solid ${c.color}` : '1px solid #E2E8F0',
                              backgroundColor: newProductForm.accentColor === c.color ? `${c.color}15` : '#FFFFFF',
                              cursor: 'pointer',
                              fontSize: '0.78rem',
                              fontWeight: '600',
                              color: '#1E293B'
                            }}
                          >
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: c.color }} />
                            <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', padding: '0.85rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#1E293B', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={newProductForm.isFeatured}
                          onChange={e => setNewProductForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                          style={{ width: '17px', height: '17px', accentColor: '#0284C7' }}
                        />
                        <span>Feature in Homepage Showcase</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#1E293B', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={newProductForm.isActive}
                          onChange={e => setNewProductForm(prev => ({ ...prev, isActive: e.target.checked }))}
                          style={{ width: '17px', height: '17px', accentColor: '#0284C7' }}
                        />
                        <span>Publish Active in Storefront</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* ---------------- TAB 2: PRODUCT IMAGES & MEDIA ---------------- */}
                {modalActiveTab === 'images' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* File Upload Box */}
                    <div style={{
                      border: '2px dashed #CBD5E1',
                      borderRadius: '12px',
                      padding: '1.75rem',
                      textAlign: 'center',
                      backgroundColor: '#F8FAFC',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease'
                    }}>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        id="prodImgFileInput"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="prodImgFileInput" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: '#E0F2FE',
                          color: '#0284C7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Upload size={22} />
                        </div>
                        <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A' }}>
                          {isUploadingImage ? 'Uploading Image...' : 'Click to Upload Product Image from Device'}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                          Supports PNG, JPG, WEBP, SVG transparent bottles (Max 10MB)
                        </span>
                      </label>

                      {imageUploadSuccess && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.75rem', padding: '0.3rem 0.75rem', backgroundColor: '#DCFCE7', color: '#166534', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '700' }}>
                          <Check size={14} />
                          <span>Image uploaded & linked to product</span>
                        </div>
                      )}
                    </div>

                    {/* Manual Image URL Input */}
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                        Image Asset URL / Path
                      </label>
                      <input
                        type="text"
                        value={newProductForm.image}
                        onChange={e => setNewProductForm(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="/assets/images/bottle_blue.png or /uploads/..."
                        style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem' }}
                      />
                    </div>

                    {/* One-Click Brand Presets */}
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                        Or Choose from Verified White Mist Brand Bottles & Pouches:
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                        {[
                          { label: 'Ocean Blue Bottle', path: '/assets/images/bottle_blue.png' },
                          { label: 'Floral Pink Bottle', path: '/assets/images/bottle_pink.png' },
                          { label: 'Citrus Yellow Bottle', path: '/assets/images/bottle_yellow.png' },
                          { label: 'Ocean Blue Pouch', path: '/assets/images/pouch_blue.png' },
                          { label: 'Floral Pink Pouch', path: '/assets/images/pouch_pink.png' },
                          { label: 'Citrus Yellow Pouch', path: '/assets/images/pouch_yellow.png' }
                        ].map(preset => (
                          <button
                            key={preset.path}
                            type="button"
                            onClick={() => setNewProductForm(prev => ({ ...prev, image: preset.path }))}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              padding: '0.65rem 0.5rem',
                              border: newProductForm.image === preset.path ? '2px solid #0284C7' : '1px solid #E2E8F0',
                              borderRadius: '8px',
                              backgroundColor: newProductForm.image === preset.path ? '#F0F9FF' : '#FFFFFF',
                              cursor: 'pointer',
                              gap: '0.4rem',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <img src={preset.path} alt={preset.label} style={{ height: '55px', objectFit: 'contain' }} />
                            <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#334155', textAlign: 'center' }}>
                              {preset.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Image Preview Stage */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      padding: '1rem',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0'
                    }}>
                      <div style={{
                        width: '100px',
                        height: '110px',
                        background: `linear-gradient(135deg, ${newProductForm.accentColor}25 0%, #FFFFFF 100%)`,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #E2E8F0'
                      }}>
                        <img
                          src={newProductForm.image || '/assets/images/bottle_blue.png'}
                          alt="Product Preview"
                          style={{ maxHeight: '90px', maxWidth: '85px', objectFit: 'contain', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.15))' }}
                          onError={(e) => { e.currentTarget.src = '/assets/images/bottle_blue.png'; }}
                        />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A', margin: '0 0 0.25rem 0' }}>
                          Live Image Showcase Preview
                        </h4>
                        <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
                          Rendered on responsive card canvas with theme drop-shadow and gradient backdrop.
                        </p>
                      </div>
                    </div>

                  </div>
                )}

                {/* ---------------- TAB 3: PACK SIZES & PRICING ---------------- */}
                {modalActiveTab === 'pricing' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* Primary Variant Box */}
                    <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.75rem' }}>
                        Primary Variant: 2L Ergonomic Handle Bottle
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                            Selling Price (₹) *
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={newProductForm.price}
                            onChange={e => setNewProductForm(prev => ({ ...prev, price: e.target.value }))}
                            style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                            MRP (₹) *
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={newProductForm.mrp}
                            onChange={e => setNewProductForm(prev => ({ ...prev, mrp: e.target.value }))}
                            style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                            Initial Stock Inventory (Units) *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={newProductForm.stock}
                            onChange={e => setNewProductForm(prev => ({ ...prev, stock: e.target.value }))}
                            style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem' }}
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#166534', fontWeight: '700' }}>
                        Customer Discount: {Math.max(0, Math.round((((Number(newProductForm.mrp) || 1) - (Number(newProductForm.price) || 0)) / (Number(newProductForm.mrp) || 1)) * 100))}% OFF
                      </div>
                    </div>

                    {/* Secondary Variant Checkbox & Inputs */}
                    <div style={{ padding: '1rem', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: '#0F172A', cursor: 'pointer', marginBottom: newProductForm.hasPouchVariant ? '0.85rem' : '0' }}>
                        <input
                          type="checkbox"
                          checked={newProductForm.hasPouchVariant}
                          onChange={e => setNewProductForm(prev => ({ ...prev, hasPouchVariant: e.target.checked }))}
                          style={{ width: '17px', height: '17px', accentColor: '#0284C7' }}
                        />
                        <span>Include Secondary Refill Variant (e.g. 2kg Eco Spout Refill Pouch)</span>
                      </label>

                      {newProductForm.hasPouchVariant && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', paddingTop: '0.5rem' }}>
                          <div>
                            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                              Refill Pouch Selling Price (₹)
                            </label>
                            <input
                              type="number"
                              value={newProductForm.pouchPrice}
                              onChange={e => setNewProductForm(prev => ({ ...prev, pouchPrice: e.target.value }))}
                              style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem' }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                              Refill Pouch MRP (₹)
                            </label>
                            <input
                              type="number"
                              value={newProductForm.pouchMrp}
                              onChange={e => setNewProductForm(prev => ({ ...prev, pouchMrp: e.target.value }))}
                              style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem' }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                              Pouch Image Asset
                            </label>
                            <input
                              type="text"
                              value={newProductForm.pouchImage}
                              onChange={e => setNewProductForm(prev => ({ ...prev, pouchImage: e.target.value }))}
                              style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* ---------------- TAB 4: DESCRIPTION & FEATURES ---------------- */}
                {modalActiveTab === 'details' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                        Product Description (Homepage Quick View & Details)
                      </label>
                      <textarea
                        rows={3}
                        value={newProductForm.shortDesc}
                        onChange={e => setNewProductForm(prev => ({ ...prev, shortDesc: e.target.value }))}
                        placeholder="Comprehensive description of bio-active stain lifting action..."
                        style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                        Key Highlights / Bullet Features (One feature per line)
                      </label>
                      <textarea
                        rows={4}
                        value={newProductForm.features}
                        onChange={e => setNewProductForm(prev => ({ ...prev, features: e.target.value }))}
                        placeholder="10x Bio-Enzyme Stain Action&#10;Front Load & Top Load Safe&#10;48-Hour Fragrance Lock&#10;Color Guard Technology"
                        style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '3px', display: 'block' }}>
                        These highlights appear in the interactive Quick View drawer and product specification sheets.
                      </span>
                    </div>
                  </div>
                )}

                {/* ---------------- TAB 5: LIVE HOMEPAGE CARD PREVIEW ---------------- */}
                {modalActiveTab === 'preview' && (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{
                      width: '100%',
                      maxWidth: '360px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      padding: '1.5rem',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      {/* Top Badges */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{
                          backgroundColor: newProductForm.accentColor,
                          color: '#FFFFFF',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: '700'
                        }}>
                          {newProductForm.badge}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '6px' }}>
                          {newProductForm.machineType}
                        </span>
                      </div>

                      {/* Image Stage */}
                      <div style={{
                        height: '200px',
                        background: `linear-gradient(135deg, ${newProductForm.accentColor}22 0%, #FFFFFF 100%)`,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        position: 'relative'
                      }}>
                        <img
                          src={newProductForm.image || '/assets/images/bottle_blue.png'}
                          alt={newProductForm.name}
                          style={{ maxHeight: '165px', maxWidth: '85%', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.12))' }}
                          onError={(e) => { e.currentTarget.src = '/assets/images/bottle_blue.png'; }}
                        />
                      </div>

                      {/* Rating */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem', color: '#FFB800', fontSize: '0.8rem', fontWeight: '800' }}>
                        <span>★★★★★</span>
                        <span style={{ color: '#0F172A', marginLeft: '4px' }}>4.9</span>
                        <span style={{ color: '#64748B', fontWeight: '500' }}>(120 reviews)</span>
                      </div>

                      {/* Name & Tagline */}
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', margin: '0 0 0.25rem 0', lineHeight: 1.3 }}>
                        {newProductForm.name}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 0.85rem 0', lineHeight: 1.4 }}>
                        {newProductForm.tagline}
                      </p>

                      {/* Price Section */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                        <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0F172A' }}>₹{newProductForm.price}</span>
                        <span style={{ fontSize: '0.9rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{newProductForm.mrp}</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 6px', borderRadius: '4px' }}>
                          {Math.max(0, Math.round((((Number(newProductForm.mrp) || 1) - (Number(newProductForm.price) || 0)) / (Number(newProductForm.mrp) || 1)) * 100))}% OFF
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.5rem',
                borderTop: '1px solid #E2E8F0',
                backgroundColor: '#FAFCFF',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  style={{
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    border: '1px solid #CBD5E1',
                    padding: '0.55rem 1.15rem',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {modalActiveTab !== 'preview' ? (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs = ['general', 'images', 'pricing', 'details', 'preview'];
                        const nextIdx = (tabs.indexOf(modalActiveTab) + 1) % tabs.length;
                        setModalActiveTab(tabs[nextIdx]);
                      }}
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#0284C7',
                        border: '1px solid #BAE6FD',
                        padding: '0.55rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Next Step →
                    </button>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmittingProduct}
                    style={{
                      backgroundColor: '#0284C7',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.55rem 1.35rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: isSubmittingProduct ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem'
                    }}
                  >
                    {isSubmittingProduct ? (
                      <>
                        <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#FFF', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        <span>Publish Product to Store & Homepage</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          ADD CATEGORY MODAL
          ===================================================================== */}
      {isAddCategoryModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            maxWidth: '520px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #E2E8F0',
              backgroundColor: '#FAFCFF'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={18} color="#0284C7" />
                  <span>Create New Product Category</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                  Define a new detergent taxonomy for storefront navigation and catalog filtering.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCategoryModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCategorySubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fabric Softeners & Conditioners"
                  value={newCategoryForm.name}
                  onChange={e => setNewCategoryForm(prev => ({
                    ...prev,
                    name: e.target.value,
                    slug: prev.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                  }))}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="e.g. fabric-softeners"
                  value={newCategoryForm.slug}
                  onChange={e => setNewCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                />
                <span style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '3px', display: 'block' }}>
                  Will be accessible at <code>/category/{newCategoryForm.slug || 'category-slug'}</code>
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of products in this category..."
                  value={newCategoryForm.description}
                  onChange={e => setNewCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  style={{
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    border: '1px solid #CBD5E1',
                    padding: '0.55rem 1.15rem',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCategory}
                  style={{
                    backgroundColor: '#0284C7',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.55rem 1.35rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: isSubmittingCategory ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  {isSubmittingCategory ? 'Saving...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

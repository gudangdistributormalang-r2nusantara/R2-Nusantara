/**
 * Configuration - R2-Nusantara
 * Global configuration constants
 */

export const CONFIG = {
  // Pagination
  ITEMS_PER_PAGE: 12,
  MAX_ITEMS_PER_PAGE: 100,

  // Product
  DEFAULT_PRODUCT_IMAGE: 'https://via.placeholder.com/400x300?text=Product',
  PRODUCT_IMAGE_SIZES: {
    thumbnail: { width: 150, height: 150 },
    card: { width: 300, height: 300 },
    detail: { width: 600, height: 600 },
  },

  // Cart
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 999,
  CART_STORAGE_KEY: 'r2_cart',
  CHECKOUT_STORAGE_KEY: 'r2_checkout',

  // Wishlist
  WISHLIST_STORAGE_KEY: 'r2_wishlist',
  WISHLIST_MAX_ITEMS: 100,

  // Recently Viewed
  RECENTLY_VIEWED_STORAGE_KEY: 'r2_recently_viewed',
  RECENTLY_VIEWED_MAX_ITEMS: 10,

  // Theme
  THEME_STORAGE_KEY: 'r2_theme',
  THEME_DEFAULT: 'light',
  THEMES: ['light', 'dark'],

  // Currency
  CURRENCY: 'IDR',
  CURRENCY_SYMBOL: 'Rp',

  // API
  API_BASE_URL: process.env.REACT_APP_API_URL || 'https://api.example.com',
  API_TIMEOUT: 30000,

  // Search
  SEARCH_MIN_CHARS: 2,
  SEARCH_DEBOUNCE_MS: 300,

  // Form Validation
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

  // Tax & Shipping
  TAX_RATE: 0.1, // 10%
  FREE_SHIPPING_THRESHOLD: 100000, // Rp 100,000
  SHIPPING_COST: 10000, // Rp 10,000

  // Feature Flags
  FEATURES: {
    WISHLIST: true,
    RECENTLY_VIEWED: true,
    SEARCH_AUTOCOMPLETE: true,
    DARK_MODE: true,
    QUICK_VIEW: true,
    PRODUCT_REVIEWS: true,
  },

  // Toast Notifications
  TOAST_DURATION: 3000,
  TOAST_TYPES: {
    success: 'success',
    error: 'danger',
    warning: 'warning',
    info: 'info',
  },

  // Date Format
  DATE_FORMAT: 'dd/MM/yyyy',
  TIME_FORMAT: 'HH:mm:ss',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm:ss',

  // Analytics
  ENABLE_ANALYTICS: true,
  ANALYTICS_SAMPLE_RATE: 0.1,

  // Performance
  IMAGE_LAZY_LOAD: true,
  IMAGE_LAZY_LOAD_OFFSET: '50px',
  PREFETCH_PAGES: true,

  // Social Links
  SOCIAL_LINKS: {
    facebook: 'https://facebook.com/gudangdistributormalang',
    instagram: 'https://instagram.com/gudangdistributormalang',
    twitter: 'https://twitter.com/r2nusantara',
    whatsapp: 'https://wa.me/6281234567890',
  },

  // Contact Information
  CONTACT: {
    phone: '+62 812 3456 7890',
    email: 'support@r2nusantara.com',
    address: 'Jl. Contoh No. 123, Malang, Jawa Timur 65000, Indonesia',
  },
};

export default CONFIG;

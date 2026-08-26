/**
 * Main Application Entry Point - R2-Nusantara
 * Initializes all modules and event listeners
 */

import { CONFIG } from './modules/config.js';
import { cartManager } from './modules/cart.js';
import { wishlistManager } from './modules/wishlist.js';
import { productsManager } from './modules/products.js';
import { checkoutManager } from './modules/checkout.js';
import { LocalStorage, showToast, debounce } from './modules/utils.js';

// Application state
const app = {
  initialized: false,
  isDarkMode: false,
};

// Initialize application
async function initApp() {
  console.log('Initializing R2-Nusantara...');

  try {
    // Initialize modules
    await productsManager.init();
    cartManager.loadCart();
    wishlistManager.loadWishlist();

    // Setup dark mode
    setupDarkMode();

    // Setup event listeners
    setupEventListeners();

    // Render initial content
    renderHomepage();

    app.initialized = true;
    console.log('R2-Nusantara initialized successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);
    showToast('Failed to initialize application', 'danger');
  }
}

// Setup dark mode
function setupDarkMode() {
  const savedTheme = LocalStorage.get(CONFIG.THEME_STORAGE_KEY, CONFIG.THEME_DEFAULT);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

  app.isDarkMode = isDark;
  applyTheme(isDark ? 'dark' : 'light');

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    updateThemeButton();
  }
}

// Apply theme
function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.style.colorScheme = 'dark';
    document.body.classList.add('dark-mode');
  } else {
    html.style.colorScheme = 'light';
    document.body.classList.remove('dark-mode');
  }
  LocalStorage.set(CONFIG.THEME_STORAGE_KEY, theme);
}

// Toggle theme
function toggleTheme() {
  const newTheme = app.isDarkMode ? 'light' : 'dark';
  app.isDarkMode = !app.isDarkMode;
  applyTheme(newTheme);
  updateThemeButton();
  showToast(`Switched to ${newTheme} mode`, 'info');
}

// Update theme button
function updateThemeButton() {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.textContent = app.isDarkMode ? '☀️' : '🌙';
  }
}

// Setup event listeners
function setupEventListeners() {
  // Cart button
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      window.location.href = '/cart.html';
    });
  }

  // Wishlist button
  const wishlistBtn = document.getElementById('wishlistBtn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      window.location.href = '/wishlist.html';
    });
  }

  // Search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener(
      'input',
      debounce((e) => {
        productsManager.search(e.target.value);
        productsManager.renderProductList('productsContainer');
      }, CONFIG.SEARCH_DEBOUNCE_MS),
    );
  }

  // Product wishlist buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('wishlist-btn')) {
      e.preventDefault();
      const productId = parseInt(e.target.dataset.productId);
      const product = productsManager.getProductById(productId);
      if (product) {
        if (wishlistManager.isInWishlist(productId)) {
          wishlistManager.removeItem(productId);
        } else {
          wishlistManager.addItem(product);
        }
      }
    }

    // Add to cart from quick view
    if (e.target.classList.contains('add-to-cart-btn')) {
      const productId = parseInt(e.target.dataset.productId);
      const product = productsManager.getProductById(productId);
      if (product) {
        cartManager.addItem(product);
      }
    }

    // Add to cart from wishlist
    if (e.target.classList.contains('add-to-cart-from-wishlist')) {
      const productId = parseInt(e.target.dataset.productId);
      const product = productsManager.getProductById(productId);
      if (product) {
        cartManager.addItem(product);
      }
    }
  });

  // Close modal with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.modal.show');
      modals.forEach((modal) => modal.classList.remove('show'));
    }
  });
}

// Render homepage
function renderHomepage() {
  const container = document.getElementById('productsContainer');
  if (container) {
    productsManager.renderProductList('productsContainer');
  }
}

// Service Worker registration
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
    registerServiceWorker();
  });
} else {
  initApp();
  registerServiceWorker();
}

// Export for global access
window.app = {
  cartManager,
  wishlistManager,
  productsManager,
  checkoutManager,
};

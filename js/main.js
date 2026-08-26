// ============================================
// MAIN ENTRY — Inisialisasi Semua Modul
// ============================================

// Impor data & konfigurasi
import { CONFIG } from './modules/config.js';
import { allProducts, productsR2, productsResmi } from './modules/data.js';
import {
  switchCatalog,
  buildFilterChips,
  renderProductDisplay,
  applyFilter,
  applySort,
  goToPage,
  updateCatalogInfoBanner,
} from './modules/products.js';
import { addToCart, updateQty, toggleCart, updateCartUI, cart } from './modules/cart.js';
import {
  openCheckoutModal,
  closeCheckoutModal,
  submitOrder,
  validateCheckoutForm,
} from './modules/checkout.js';
import { initTestimonialSlider } from './modules/testimonials.js';
import { toggleWishlist, updateWishlistUI } from './modules/wishlist.js'; // Opsional
import { showToast, formatRupiah, getR2Tier, escapeHtml } from './modules/utils.js';

// ============================================
// EXPOSE KE WINDOW UNTUK HTML ONCLICK
// ============================================
window.switchCatalog = switchCatalog;
window.applyFilter = applyFilter;
window.applySort = applySort;
window.__goToPage = goToPage;
window.__addCart = addToCart;
window.__updateQty = updateQty;
window.toggleCart = toggleCart;
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
window.submitOrder = submitOrder;
window.validateCheckoutForm = validateCheckoutForm;
window.toggleWishlistItem = toggleWishlist;
window.showToast = showToast;
window.formatRupiah = formatRupiah;
window.getR2Tier = getR2Tier;
window.escapeHtml = escapeHtml;
window.allProducts = allProducts; // Untuk modul wishlist

// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Hilangkan loader
  const loader = document.getElementById('loader');
  if (loader) {
    if (window.__clearLoader) window.__clearLoader();
    loader.style.opacity = '0';
    setTimeout(() => (loader.style.display = 'none'), 700);
  }

  // Inisialisasi Katalog
  buildFilterChips();
  updateCatalogInfoBanner();
  renderProductDisplay();

  // Update counter merek
  const countR2 = document.getElementById('countR2');
  const countResmi = document.getElementById('countResmi');
  const totalCount = document.getElementById('totalBrandCount');
  if (countR2) countR2.textContent = productsR2.length;
  if (countResmi) countResmi.textContent = productsResmi.length;
  if (totalCount) totalCount.textContent = allProducts.length;

  // Scroll Reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll('.fade-on-scroll').forEach((el) => observer.observe(el));

  // Header scroll effect
  const header = document.getElementById('headerInner');
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('py-2', 'shadow-lg');
        header.classList.remove('py-3');
      } else {
        header.classList.add('py-3');
        header.classList.remove('py-2', 'shadow-lg');
      }
    }

    const btt = document.getElementById('backToTop');
    if (btt) {
      if (window.scrollY > 500) btt.classList.add('visible');
      else btt.classList.remove('visible');
    }
  });

  // Search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    let timer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // Import searchTerm dari products.js? Kita perlu set state di products.js
        // Solusi: kita panggil fungsi dari products.js untuk update searchTerm
        // Karena tidak di-export, kita akan trigger event atau buat fungsi baru.
        // Untuk kemudahan, kita akses langsung melalui window.searchTerm? 
        // Sebaiknya kita tambahkan fungsi setSearch di products.js.
        // Saya tambahkan fungsi setSearchTerm di products.js dan export.
        // Di sini kita panggil.
        import('./modules/products.js').then(({ setSearchTerm }) => {
          setSearchTerm(e.target.value);
        });
      }, 200);
    });
  }

  // Testimonial Slider
  initTestimonialSlider();

  // Checkout form validation awal
  validateCheckoutForm();

  // Wishlist (opsional)
  updateWishlistUI();

  // Chatling (lazy load)
  setTimeout(() => {
    const script = document.createElement('script');
    script.async = true;
    script.dataset.id = '4136889914';
    script.id = 'chtl-script';
    script.type = 'text/javascript';
    script.src = 'https://chatling.ai/js/embed.js';
    document.body.appendChild(script);
  }, 3000);
});

// ============================================
// FUNGSI TAMBAHAN: SET SEARCH TERM (di products.js)
// ============================================
// Tambahkan di products.js:
// export function setSearchTerm(term) { searchTerm = term; currentPage = 1; renderProductDisplay(); }
// lalu import di sini.
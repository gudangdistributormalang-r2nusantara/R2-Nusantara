import { allProducts } from './data.js';
import { formatRupiah, escapeHtml, showToast } from './utils.js';
import { renderProductDisplay } from './products.js';

// State
let cart = [];
window.__cart = cart; // Untuk akses global (Chatling)

// DOM References
const cartBadge = document.getElementById('cartBadge');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartSummary = document.getElementById('cartSummary');
const totalItemsDisplay = document.getElementById('totalItemsDisplay');
const totalPriceDisplay = document.getElementById('totalPriceDisplay');
const modalTotalPrice = document.getElementById('modalTotalPrice');
const bannerQty = document.getElementById('bannerQty');
const progressFill = document.getElementById('progressFill');
const bannerTitle = document.getElementById('bannerTitle');
const bannerSubtitle = document.getElementById('bannerSubtitle');
const shippingBanner = document.getElementById('shippingProgressBanner');

// ========== Add to Cart ==========
export function addToCart(id) {
  const product = allProducts.find((p) => p.id === id);
  if (!product) return;

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      category: product.category,
    });
  }

  updateCartUI();
  showToast('Berhasil ditambahkan');
}

// ========== Update Quantity ==========
export function updateQty(id, change) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  item.qty += change;
  if (item.qty < 1) {
    cart = cart.filter((i) => i.id !== id);
  }

  updateCartUI();
}

// ========== Get Cart Qty for a Product ==========
export function getCartQty(id) {
  const item = cart.find((i) => i.id === id);
  return item ? item.qty : 0;
}

// ========== Update Cart UI ==========
export function updateCartUI() {
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Badge
  if (cartBadge) {
    cartBadge.innerText = totalItems;
    cartBadge.classList.toggle('scale-0', totalItems === 0);
  }

  // Banner Progress
  if (bannerQty) bannerQty.innerText = totalItems;
  if (progressFill) {
    progressFill.style.width = `${Math.min((totalItems / 20) * 100, 100)}%`;
  }

  if (totalItems >= 20) {
    if (bannerTitle) bannerTitle.innerText = '🎉 Target Tercapai';
    if (bannerSubtitle) bannerSubtitle.innerHTML = 'Anda mendapat <b class="text-emerald-300">GRATIS ONGKIR</b>';
    if (shippingBanner) {
      shippingBanner.classList.add('bg-emerald-600');
      shippingBanner.classList.remove('bg-brand-900');
    }
  } else {
    if (bannerTitle) bannerTitle.innerText = 'Target Gratis Ongkir';
    if (bannerSubtitle)
      bannerSubtitle.innerHTML = `Pilih <b class="text-emerald-300">${20 - totalItems} slop</b> lagi untuk subsidi.`;
    if (shippingBanner) {
      shippingBanner.classList.remove('bg-emerald-600');
      shippingBanner.classList.add('bg-brand-900');
    }
  }

  // Cart Items
  if (!cart.length) {
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML =
        '<div class="h-full flex flex-col items-center justify-center text-center opacity-50"><i class="fa-solid fa-cart-shopping text-6xl text-slate-300 mb-4"></i><p class="font-bold text-slate-600">Keranjang Kosong</p></div>';
    }
    if (cartSummary) cartSummary.classList.add('hidden');
  } else {
    if (cartSummary) cartSummary.classList.remove('hidden');
    if (totalItemsDisplay) totalItemsDisplay.innerText = totalItems;
    if (totalPriceDisplay) totalPriceDisplay.innerText = formatRupiah(totalPrice);

    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = cart
        .map((item) => {
          const catBadge =
            item.category === 'resmi'
              ? '<span class="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200"><i class="fa-solid fa-certificate text-[8px]"></i> RESMI</span>'
              : '<span class="inline-flex items-center gap-1 text-[9px] font-bold text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200"><i class="fa-solid fa-fire-flame-curved text-[8px]"></i> R2</span>';

          return `<div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-sm text-brand-900 truncate">${escapeHtml(item.name)}</span>
                ${catBadge}
              </div>
              <div class="text-brand-500 font-bold font-mono text-sm">${formatRupiah(item.price)}</div>
            </div>
            <div class="flex items-center border border-slate-200 rounded-lg h-9 shrink-0">
              <button onclick="window.__updateQty('${item.id}',-1)" class="w-9 h-full font-bold text-slate-500 hover:bg-slate-50 transition-colors">-</button>
              <span class="w-8 text-center text-xs font-bold font-mono">${item.qty}</span>
              <button onclick="window.__updateQty('${item.id}',1)" class="w-9 h-full font-bold text-brand-500 hover:bg-slate-50 transition-colors">+</button>
            </div>
          </div>`;
        })
        .join('');
    }
  }

  // Modal Total
  if (modalTotalPrice) modalTotalPrice.innerText = formatRupiah(totalPrice);

  // Render ulang produk grid untuk update tombol +/-
  renderProductDisplay();
}

// ========== Toggle Cart Sidebar ==========
export function toggleCart() {
  const overlay = document.getElementById('cartOverlay');
  const sidebar = document.getElementById('cartSidebar');
  if (!overlay || !sidebar) return;

  if (sidebar.classList.contains('translate-x-full')) {
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    sidebar.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
  } else {
    overlay.classList.add('opacity-0');
    sidebar.classList.add('translate-x-full');
    setTimeout(() => overlay.classList.add('hidden'), 300);
    document.body.style.overflow = '';
  }
}

// ========== Expose ke window ==========
window.__addCart = addToCart;
window.__updateQty = updateQty;
window.toggleCart = toggleCart;
window.__cart = cart;

export { cart };
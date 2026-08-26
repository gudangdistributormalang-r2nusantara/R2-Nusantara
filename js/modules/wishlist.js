// ========== Wishlist Logic ==========
let wishlist = JSON.parse(localStorage.getItem('r2_wishlist')) || [];

export function toggleWishlist(id, event) {
  if (event) event.stopPropagation();

  const index = wishlist.indexOf(id);
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast('Dihapus dari Wishlist', 'info');
  } else {
    wishlist.push(id);
    showToast('Ditambahkan ke Wishlist', 'success');
  }
  localStorage.setItem('r2_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
  renderProductDisplay(); // Perlu import dari products.js
}

export function updateWishlistUI() {
  const badge = document.getElementById('wishlistBadge');
  if (badge) {
    badge.innerText = wishlist.length;
    badge.classList.toggle('scale-0', wishlist.length === 0);
  }

  const container = document.getElementById('wishlistItemsContainer');
  if (!container) return;

  if (!wishlist.length) {
    container.innerHTML =
      '<div class="text-center py-10 text-slate-400"><i class="fa-regular fa-heart text-4xl mb-3"></i><p class="text-sm font-bold">Wishlist kosong</p></div>';
    return;
  }

  container.innerHTML = wishlist
    .map((id) => {
      const p = allProducts.find((x) => x.id === id);
      if (!p) return '';
      return `
        <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-700 p-3 rounded-xl border border-slate-100 dark:border-slate-600">
          <div class="flex-1 min-w-0">
            <div class="font-bold text-sm text-brand-900 dark:text-white truncate">${escapeHtml(p.name)}</div>
            <div class="text-brand-500 font-mono text-xs font-bold">${formatRupiah(p.price)}</div>
          </div>
          <button onclick="window.__addCart('${p.id}'); toggleWishlistItem('${p.id}');" class="w-8 h-8 rounded-lg bg-brand-900 dark:bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 dark:hover:bg-brand-500 transition-colors" title="Pindah ke Keranjang">
            <i class="fa-solid fa-cart-plus text-xs"></i>
          </button>
          <button onclick="toggleWishlistItem('${p.id}')" class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
            <i class="fa-solid fa-trash text-xs"></i>
          </button>
        </div>
      `;
    })
    .join('');
}

// Expose ke window
window.toggleWishlistItem = toggleWishlist;
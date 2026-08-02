/* ============================================
   R2 NUSANTARA - FINAL APP LOGIC
   ============================================ */
'use strict';

// 1. DARK MODE TOGGLE
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('r2_dark_mode', isDark);
}

// Init Dark Mode
if (localStorage.getItem('r2_dark_mode') === 'true' || (!('r2_dark_mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
}

// 2. LIVE VISITOR COUNTER (Trust Signal)
function initVisitorCounter() {
    const el = document.getElementById('visitorCount');
    if (!el) return;
    let count = Math.floor(Math.random() * (45 - 18 + 1)) + 18;
    el.textContent = count;
    
    setInterval(() => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        count = Math.max(15, Math.min(60, count + change));
        el.textContent = count;
    }, 4000);
}

// 3. WISHLIST SYSTEM
let wishlist = JSON.parse(localStorage.getItem('r2_wishlist')) || [];

function toggleWishlistItem(id, event) {
    if(event) event.stopPropagation(); // Prevent card click
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
    renderProductDisplay(); // Re-render to update heart icons
}

function updateWishlistUI() {
    const badge = document.getElementById('wishlistBadge');
    if (badge) {
        badge.innerText = wishlist.length;
        badge.classList.toggle('scale-0', wishlist.length === 0);
    }
    
    const container = document.getElementById('wishlistItemsContainer');
    if (!container) return;
    
    if (wishlist.length === 0) {
        container.innerHTML = '<div class="text-center py-10 text-slate-400"><i class="fa-regular fa-heart text-4xl mb-3"></i><p class="text-sm font-bold">Wishlist kosong</p></div>';
        return;
    }
    
    container.innerHTML = wishlist.map(id => {
        const p = allProducts.find(x => x.id === id);
        if (!p) return '';
        return `
        <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-700 p-3 rounded-xl border border-slate-100 dark:border-slate-600">
            <div class="flex-1 min-w-0">
                <div class="font-bold text-sm text-brand-900 dark:text-white truncate">${escapeHtml(p.name)}</div>
                <div class="text-brand-500 font-mono text-xs font-bold">${formatRupiah(p.price)}</div>
            </div>
            <button onclick="window.__addCart('${p.id}'); toggleWishlistItem('${p.id}');" class="w-8 h-8 rounded-lg bg-brand-900 text-white flex items-center justify-center hover:bg-brand-700 transition-colors" title="Pindah ke Keranjang">
                <i class="fa-solid fa-cart-plus text-xs"></i>
            </button>
            <button onclick="toggleWishlistItem('${p.id}')" class="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                <i class="fa-solid fa-trash text-xs"></i>
            </button>
        </div>`;
    }).join('');
}

function toggleWishlistSidebar() {
    const overlay = document.getElementById('wishlistOverlay');
    const sidebar = document.getElementById('wishlistSidebar');
    if (sidebar.classList.contains('translate-x-full')) {
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.add('overlay-enter'), 10);
        sidebar.classList.remove('translate-x-full');
        document.body.style.overflow = 'hidden';
    } else {
        overlay.classList.remove('overlay-enter');
        sidebar.classList.add('translate-x-full');
        setTimeout(() => overlay.classList.add('hidden'), 300);
        document.body.style.overflow = '';
    }
}

// 4. QUICK VIEW MODAL
function openQuickView(id) {
    const p = allProducts.find(x => x.id === id);
    if (!p) return;
    
    document.getElementById('qvTitle').textContent = p.name;
    document.getElementById('qvPrice').textContent = formatRupiah(p.price);
    
    const badge = document.getElementById('qvBadge');
    if (p.category === 'resmi') {
        badge.className = 'inline-block px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
        badge.innerHTML = '<i class="fa-solid fa-certificate mr-1"></i> RESMI';
    } else {
        const tier = getR2Tier(p.price);
        badge.className = `inline-block px-3 py-1 rounded-lg text-xs font-bold tier-${tier}`;
        badge.innerHTML = `<i class="fa-solid fa-fire mr-1"></i> ${tier.toUpperCase()}`;
    }
    
    document.getElementById('qvAddToCartBtn').onclick = function() {
        window.__addCart(p.id);
        closeQuickView();
    };
    
    const overlay = document.getElementById('quickViewOverlay');
    const modal = document.getElementById('quickViewModal');
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.add('overlay-enter');
        modal.classList.add('modal-enter');
    }, 10);
}

function closeQuickView() {
    const overlay = document.getElementById('quickViewOverlay');
    const modal = document.getElementById('quickViewModal');
    overlay.classList.remove('overlay-enter');
    modal.classList.remove('modal-enter');
    setTimeout(() => overlay.classList.add('hidden'), 300);
}

// 5. ADVANCED SEARCH AUTOCOMPLETE
let searchTimeout;
const searchInput = document.getElementById('searchInput');
const suggestionsBox = document.getElementById('searchSuggestions');

if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            suggestionsBox.classList.add('hidden');
            searchTerm = '';
            currentPage = 1;
            renderProductDisplay();
            return;
        }
        
        searchTimeout = setTimeout(() => {
            searchTerm = query;
            currentPage = 1;
            renderProductDisplay();
            
            // Autocomplete logic
            const matches = allProducts.filter(p => p.name.toLowerCase().includes(query)).slice(0, 5);
            if (matches.length > 0) {
                suggestionsBox.innerHTML = matches.map(p => `
                    <div onclick="document.getElementById('searchInput').value='${p.name}'; searchTerm='${p.name.toLowerCase()}'; renderProductDisplay(); document.getElementById('searchSuggestions').classList.add('hidden');" 
                         class="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-0 flex items-center gap-3 transition-colors">
                        <i class="fa-solid fa-magnifying-glass text-slate-400 text-xs"></i>
                        <div>
                            <div class="text-sm font-bold text-brand-900 dark:text-white">${p.name.replace(new RegExp(query, 'gi'), match => `<span class="text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-900/50 px-0.5 rounded">${match}</span>`)}</div>
                            <div class="text-xs text-slate-500 font-mono">${formatRupiah(p.price)}</div>
                        </div>
                    </div>
                `).join('');
                suggestionsBox.classList.remove('hidden');
            } else {
                suggestionsBox.classList.add('hidden');
            }
        }, 300);
    });
    
    // Close suggestions on outside click
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.classList.add('hidden');
        }
    });
}

// 6. INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 800);
    
    initVisitorCounter();
    updateWishlistUI();
    
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
    
    // Initial render
    renderProductDisplay();
});
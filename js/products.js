import { CONFIG } from './config.js';
import { allProducts, productsR2, productsResmi } from './data.js';
import { formatRupiah, getR2Tier, escapeHtml, showToast } from './utils.js';
import { getCartQty, updateCartUI } from './cart.js';

// State
let activeCatalog = CONFIG.DEFAULT_CATALOG;
let currentPage = 1;
let itemsPerPage = CONFIG.ITEMS_PER_PAGE;
let activeFilter = CONFIG.DEFAULT_FILTER;
let activeSort = CONFIG.DEFAULT_SORT;
let searchTerm = '';

// DOM References
const productGrid = document.getElementById('productGrid');
const noProductFound = document.getElementById('noProductFound');
const paginationContainer = document.getElementById('paginationContainer');

// ========== Catalog Switching ==========
export function switchCatalog(cat) {
  if (cat !== 'r2' && cat !== 'resmi') return;
  activeCatalog = cat;
  activeFilter = 'all';
  currentPage = 1;
  searchTerm = '';
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';

  document.querySelectorAll('.catalog-tab').forEach((tab) => {
    const isActive = tab.dataset.tab === cat;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  updateCatalogInfoBanner();
  buildFilterChips();
  document.getElementById('activeFilterIndicator')?.classList.add('hidden');
  renderProductDisplay();
}

// ========== Filter Chips ==========
export function buildFilterChips() {
  const container = document.getElementById('filterChipsContainer');
  if (!container) return;

  if (activeCatalog === 'r2') {
    container.innerHTML = `
      <button onclick="window.applyFilter('all')" id="chip-all" class="filter-chip px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-brand-900 text-white shadow-md">Semua</button>
      <button onclick="window.applyFilter('hemat')" id="chip-hemat" class="filter-chip px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600"><i class="fa-solid fa-piggy-bank text-[10px]"></i> Hemat</button>
      <button onclick="window.applyFilter('populer')" id="chip-populer" class="filter-chip px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-600"><i class="fa-solid fa-fire text-[10px]"></i> Populer</button>
      <button onclick="window.applyFilter('premium')" id="chip-premium" class="filter-chip px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-white text-slate-600 border border-slate-200 hover:border-violet-300 hover:text-violet-600"><i class="fa-solid fa-crown text-[10px]"></i> Premium</button>
    `;
  } else {
    container.innerHTML = `
      <button onclick="window.applyFilter('all')" id="chip-all" class="filter-chip px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-brand-900 text-white shadow-md">Semua</button>
      <button onclick="window.applyFilter('segA')" id="chip-segA" class="filter-chip filter-chip-resmi px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-white text-slate-600 border border-slate-200 hover:border-amber-300 hover:text-amber-700"><i class="fa-solid fa-gem text-[10px]"></i> Segmen A</button>
      <button onclick="window.applyFilter('segB')" id="chip-segB" class="filter-chip filter-chip-resmi px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-700"><i class="fa-solid fa-star text-[10px]"></i> Segmen B</button>
      <button onclick="window.applyFilter('segC')" id="chip-segC" class="filter-chip filter-chip-resmi px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700"><i class="fa-solid fa-leaf text-[10px]"></i> Segmen C</button>
      <button onclick="window.applyFilter('segD')" id="chip-segD" class="filter-chip filter-chip-resmi px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-white text-slate-600 border border-slate-200 hover:border-pink-300 hover:text-pink-700"><i class="fa-solid fa-globe text-[10px]"></i> Segmen D</button>
      <button onclick="window.applyFilter('segE')" id="chip-segE" class="filter-chip filter-chip-resmi px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-700"><i class="fa-solid fa-hand-holding-heart text-[10px]"></i> Segmen E</button>
    `;
  }
}

// ========== Filter & Sort ==========
export function applyFilter(filter) {
  activeFilter = filter;
  currentPage = 1;
  document.querySelectorAll('.filter-chip').forEach((c) => {
    if (c.classList.contains('filter-chip-resmi')) {
      c.classList.remove('filter-chip-resmi', 'segment-active');
      c.classList.add('bg-white', 'text-slate-600', 'border', 'border-slate-200');
    } else {
      c.classList.remove('bg-brand-900', 'text-white', 'shadow-md');
      c.classList.add('bg-white', 'text-slate-600', 'border', 'border-slate-200');
    }
  });
  const active = document.getElementById(`chip-${filter}`);
  if (active) {
    if (active.classList.contains('filter-chip-resmi') || filter.startsWith('seg')) {
      active.classList.add('segment-active');
      active.classList.remove('bg-white', 'text-slate-600');
    } else {
      active.classList.add('bg-brand-900', 'text-white', 'shadow-md');
      active.classList.remove('bg-white', 'text-slate-600');
    }
  }
  renderProductDisplay();
}

export function applySort(sort) {
  activeSort = sort;
  currentPage = 1;
  renderProductDisplay();
}

// ========== Get Processed Products ==========
function getProcessedProducts() {
  const source = activeCatalog === 'r2' ? productsR2 : productsResmi;
  let result = source.slice();

  if (searchTerm) {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (activeFilter !== 'all') {
    if (activeCatalog === 'r2') {
      result = result.filter((p) => getR2Tier(p.price) === activeFilter);
    } else {
      const seg = activeFilter.replace('seg', '');
      result = result.filter((p) => p.segment === seg);
    }
  }

  result.sort((a, b) => {
    if (activeSort === 'price-asc') return a.price - b.price;
    if (activeSort === 'price-desc') return b.price - a.price;
    return a.name.localeCompare(b.name);
  });

  return result;
}

// ========== Render Products ==========
export function renderProductDisplay() {
  const processed = getProcessedProducts();
  const totalPages = Math.ceil(processed.length / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const pageItems = processed.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  productGrid.innerHTML = '';

  if (!pageItems.length) {
    noProductFound?.classList.remove('hidden');
    renderPagination(totalPages);
    return;
  }
  noProductFound?.classList.add('hidden');

  pageItems.forEach((p, idx) => {
    const card = document.createElement('div');
    const isResmi = p.category === 'resmi';

    card.className =
      'product-card bg-white rounded-2xl p-4 border border-slate-200 card-premium card-glow relative overflow-hidden flex flex-col justify-between group card-enter' +
      (isResmi ? ' product-card-resmi' : '');
    card.style.animationDelay = `${idx * 40}ms`;

    // Mouse move untuk glow
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });

    // Badge
    let badge = '';
    if (isResmi) {
      const seg = p.segment;
      const segLabels = { A: 'PREMIUM', B: 'REGULER', C: 'MILD', D: 'INTERNATIONAL', E: 'LEGACY' };
      const segIcons = { A: 'gem', B: 'star', C: 'leaf', D: 'globe', E: 'hand-holding-heart' };
      badge = `<span class="segment-badge segment-${seg}"><i class="fa-solid fa-${segIcons[seg]}"></i> SEG ${seg} · ${segLabels[seg]}</span>`;
    } else {
      const tier = getR2Tier(p.price);
      if (tier === 'hemat')
        badge = '<span class="segment-badge tier-hemat"><i class="fa-solid fa-piggy-bank"></i> HEMAT</span>';
      else if (tier === 'premium')
        badge = '<span class="segment-badge tier-premium"><i class="fa-solid fa-crown"></i> PREMIUM</span>';
      else
        badge = '<span class="segment-badge tier-populer"><i class="fa-solid fa-fire"></i> POPULER</span>';
    }

    const qty = getCartQty(p.id);
    const btn =
      qty > 0
        ? `<div class="flex items-center justify-between border-2 border-brand-500 rounded-lg bg-brand-50 p-0.5 mt-3 stepper-enter">
            <button onclick="window.__updateQty('${p.id}',-1)" class="w-8 h-8 rounded-lg bg-white text-brand-600 font-bold shadow-sm hover:bg-slate-50 active:scale-95 transition-transform">-</button>
            <span class="font-bold text-brand-900">${qty}</span>
            <button onclick="window.__updateQty('${p.id}',1)" class="w-8 h-8 rounded-lg bg-brand-500 text-white font-bold shadow-sm hover:bg-brand-600 active:scale-95 transition-transform">+</button>
          </div>`
        : `<button onclick="window.__addCart('${p.id}')" class="w-full mt-3 py-2 bg-slate-100 text-brand-900 font-bold rounded-lg hover:bg-brand-900 hover:text-white transition-colors text-xs flex items-center justify-center gap-1">
            <i class="fa-solid fa-plus text-[10px]"></i> Tambah
          </button>`;

    const catIndicator = isResmi
      ? '<span class="inline-flex items-center gap-1 text-[8px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200"><i class="fa-solid fa-certificate text-[7px]"></i> RESMI</span>'
      : '<span class="inline-flex items-center gap-1 text-[8px] font-bold text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200"><i class="fa-solid fa-fire-flame-curved text-[7px]"></i> R2</span>';

    card.innerHTML = `
      <div class="relative z-10">
        <div class="flex justify-between items-start mb-2 gap-2">
          ${badge}
          <div class="flex flex-col items-end gap-0.5 shrink-0">
            ${catIndicator}
            <span class="text-slate-300 text-[8px] font-mono font-bold">${p.id.toUpperCase()}</span>
          </div>
        </div>
        <h3 class="product-name text-sm font-extrabold text-brand-900 leading-tight mb-0.5 group-hover:text-brand-500 transition-colors">${escapeHtml(p.name)}</h3>
        ${isResmi ? `<p class="text-[8px] text-slate-500 font-medium mb-1 italic">${escapeHtml(p.segmentName)}</p>` : ''}
        <p class="product-price text-lg font-black text-brand-900 font-mono tracking-tighter">${formatRupiah(p.price)}<span class="text-[8px] text-slate-400 font-sans font-medium ml-0.5">/slop</span></p>
      </div>
      <div class="relative z-10">${btn}</div>
    `;

    productGrid.appendChild(card);
  });

  renderPagination(totalPages);
  updateActiveFilterIndicator();
}

// ========== Pagination ==========
function renderPagination(totalPages) {
  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }

  let html = '';
  for (let i = 1; i <= totalPages; i++) {
    html += `<button onclick="window.__goToPage(${i})" class="w-10 h-10 rounded-xl text-sm font-bold transition-all ${
      i === currentPage
        ? 'bg-brand-900 text-white shadow-md'
        : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-400'
    }">${i}</button>`;
  }
  paginationContainer.innerHTML = html;
}

export function goToPage(page) {
  currentPage = page;
  renderProductDisplay();
  document.getElementById('produk')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ========== Helper: Update Filter Indicator ==========
function updateActiveFilterIndicator() {
  const indicator = document.getElementById('activeFilterIndicator');
  const text = document.getElementById('activeFilterText');
  if (!indicator || !text) return;

  if (activeFilter === 'all') {
    indicator.classList.add('hidden');
    return;
  }
  indicator.classList.remove('hidden');

  const labels = {
    hemat: 'Hemat (≤ Rp 76.000)',
    populer: 'Populer (Rp 77.000 - 89.000)',
    premium: 'Premium (≥ Rp 90.000)',
    segA: 'Segmen A — Kretek Filter Premium',
    segB: 'Segmen B — Kretek Filter Reguler',
    segC: 'Segmen C — Mild/ Rendah Tar',
    segD: 'Segmen D — SPM Internasional',
    segE: 'Segmen E — Kretek Tangan/ Legacy',
  };
  text.textContent = `Filter: ${labels[activeFilter] || activeFilter}`;
}

// ========== Catalog Info Banner ==========
function updateCatalogInfoBanner() {
  const banner = document.getElementById('catalogInfoBanner');
  const icon = document.getElementById('catalogInfoIcon');
  const title = document.getElementById('catalogInfoTitle');
  const desc = document.getElementById('catalogInfoDesc');
  if (!banner) return;

  if (activeCatalog === 'r2') {
    banner.classList.remove('resmi');
    if (icon) icon.className = 'fa-solid fa-fire-flame-curved text-lg';
    if (title) title.textContent = 'Katalog R2 Nusantara';
    if (desc) desc.textContent = '167 merek lokal pilihan dengan harga kompetitif untuk margin maksimal.';
  } else {
    banner.classList.add('resmi');
    if (icon) icon.className = 'fa-solid fa-certificate text-lg';
    if (title) title.textContent = 'Katalog Resmi — Brand Nasional & Internasional';
    if (desc) desc.textContent = '66 merek resmi terbagi dalam 5 segmen. Harga grosir per slop.';
  }
}

// ========== Expose ke window untuk HTML onclick ==========
window.switchCatalog = switchCatalog;
window.applyFilter = applyFilter;
window.applySort = applySort;
window.__goToPage = goToPage;

// Ekspor untuk digunakan di modul lain
export {
  activeCatalog,
  currentPage,
  itemsPerPage,
  activeFilter,
  activeSort,
  searchTerm,
  renderProductDisplay,
  buildFilterChips,
  updateCatalogInfoBanner,
  getProcessedProducts,
};
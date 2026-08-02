// assets/js/app.js

// Product dataset (expandable) - in production this comes from API
const products = [
  {id:'p-001',name:'Minuman Energi — Sample',price:25000,image:'/assets/images/products/sample.jpg',stock:12,desc:'Contoh produk.'}
];

// Dark mode toggle
const darkToggle = document.getElementById('darkToggle');
function setDarkMode(isDark){
  if(isDark) document.body.classList.add('dark-mode');
  else document.body.classList.remove('dark-mode');
  localStorage.setItem('darkMode', isDark);
}

darkToggle && darkToggle.addEventListener('click', ()=>{
  const isDark = !document.body.classList.contains('dark-mode');
  setDarkMode(isDark);
});

// Load preference
if(localStorage.getItem('darkMode') === 'true'){
  setDarkMode(true);
}

// Quick View modal scaffold
function quickView(productId){
  const product = products.find(p=>p.id===productId);
  const modal = document.getElementById('quickViewModal');
  if(!product || !modal) return;
  modal.innerHTML = `
    <div class="quick-view-content" role="document">
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        <img src="${product.image}" alt="${product.name}" style="max-width:320px;width:100%;border-radius:8px">
        <div>
          <h2 id="quickViewTitle">${product.name}</h2>
          <p class="product-price">Rp ${product.price.toLocaleString()}</p>
          <p>${product.desc}</p>
          <div class="stock-indicator" data-stock="${product.stock}"></div>
          <div style="margin-top:12px">
            <button class="btn" onclick="addToCart('${product.id}')">Tambah ke Keranjang</button>
          </div>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden','false');
  updateStockIndicator();

  // focus trap simple
  modal.querySelector('.quick-view-content').focus();

  // track recently viewed
  trackRecentlyViewed(product.id);
}
function closeQuickView(){
  const modal = document.getElementById('quickViewModal');
  if(modal){modal.classList.remove('active');modal.setAttribute('aria-hidden','true');}
}

// close modal on ESC or click outside
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeQuickView(); });

// Recently viewed (localStorage)
function trackRecentlyViewed(productId){
  const key = 'r2_recent_views';
  let list = JSON.parse(localStorage.getItem(key) || '[]');
  list = list.filter(id=>id!==productId);
  list.unshift(productId);
  if(list.length>12) list = list.slice(0,12);
  localStorage.setItem(key, JSON.stringify(list));
  renderRecentlyViewed();
}

function renderRecentlyViewed(){
  const key = 'r2_recent_views';
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  const root = document.getElementById('recentList');
  if(!root) return;
  if(list.length===0){ document.getElementById('recentlyViewed').classList.add('hidden'); return; }
  document.getElementById('recentlyViewed').classList.remove('hidden');
  root.innerHTML = '';
  list.forEach(id=>{
    const p = products.find(x=>x.id===id);
    if(!p) return;
    const article = document.createElement('article');
    article.className = 'product-card';
    article.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="product-body">
        <h4>${p.name}</h4>
        <p class="product-price">Rp ${p.price.toLocaleString()}</p>
        <div class="product-actions"><button class="btn" onclick="quickView('${p.id}')">Quick View</button></div>
      </div>
    `;
    root.appendChild(article);
  });
}

// Stock indicator updater
function updateStockIndicator(){
  const els = document.querySelectorAll('.stock-indicator');
  els.forEach(el=>{
    const stock = parseInt(el.dataset.stock||0,10);
    if(isNaN(stock)) return;
    if(stock<=10){
      el.innerHTML = `<span class="badge" style="background:#ffb020">⚠️ Stok Menipis! (${stock})</span>`;
    } else {
      el.innerHTML = `<span class="badge" style="background:#10b981">✅ Stok Tersedia: ${stock}</span>`;
    }
  });
}

// Run initial updates
document.addEventListener('DOMContentLoaded', ()=>{
  updateStockIndicator();
  renderRecentlyViewed();
  initFavButtons();
  updateCartCountUI();
});

// Simple addToCart placeholder
function addToCart(productId){
  let count = parseInt(localStorage.getItem('r2_cart_count')||'0',10);
  count++;
  localStorage.setItem('r2_cart_count',count);
  updateCartCountUI();
}
function updateCartCountUI(){
  const cartCountEl = document.getElementById('cartCount');
  if(cartCountEl) cartCountEl.textContent = localStorage.getItem('r2_cart_count')||'0';
}

// Favorite buttons initializer (connects to wishlist.js)
function initFavButtons(){
  const favs = document.querySelectorAll('.btn-fav');
  favs.forEach(btn=>{
    const id = btn.dataset.id;
    btn.addEventListener('click', ()=>{ toggleWishlist(id); updateFavUI(btn,id); });
    updateFavUI(btn, id);
  });
}
function updateFavUI(btn,id){
  const list = JSON.parse(localStorage.getItem('r2_wishlist')||'[]');
  if(list.includes(id)) btn.textContent = '♥'; else btn.textContent = '♡';
}

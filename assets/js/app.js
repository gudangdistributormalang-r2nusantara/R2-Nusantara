// assets/js/app.js

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
const products = [
  {id:'p-001',name:'Minuman Energi — Sample',price:25000,image:'/assets/images/products/sample.jpg',stock:12,desc:'Contoh produk.'}
];

function quickView(productId){
  const product = products.find(p=>p.id===productId);
  const modal = document.getElementById('quickViewModal');
  if(!product || !modal) return;
  modal.innerHTML = `
    <div class="quick-view-content">
      <button class="btn btn-ghost" onclick="closeQuickView()">✕</button>
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        <img src="${product.image}" alt="${product.name}" style="max-width:320px;width:100%;border-radius:8px">
        <div>
          <h2>${product.name}</h2>
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

  // track recently viewed
  trackRecentlyViewed(product.id);
}
function closeQuickView(){
  const modal = document.getElementById('quickViewModal');
  if(modal){modal.classList.remove('active');modal.setAttribute('aria-hidden','true');}
}

// Recently viewed (localStorage)
function trackRecentlyViewed(productId){
  const key = 'r2_recent_views';
  let list = JSON.parse(localStorage.getItem(key) || '[]');
  list = list.filter(id=>id!==productId);
  list.unshift(productId);
  if(list.length>12) list = list.slice(0,12);
  localStorage.setItem(key, JSON.stringify(list));
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
});

// Simple addToCart placeholder
function addToCart(productId){
  let count = parseInt(localStorage.getItem('r2_cart_count')||'0',10);
  count++;
  localStorage.setItem('r2_cart_count',count);
  const cartCountEl = document.getElementById('cartCount');
  if(cartCountEl) cartCountEl.textContent = count;
}

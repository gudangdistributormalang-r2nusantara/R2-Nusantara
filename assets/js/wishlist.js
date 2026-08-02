// assets/js/wishlist.js

const WISH_KEY = 'r2_wishlist';
const wishlistToggle = document.getElementById('wishlistToggle');
const wishCountEl = document.getElementById('wishCount');

function getWishlist(){
  return JSON.parse(localStorage.getItem(WISH_KEY) || '[]');
}
function setWishlist(list){
  localStorage.setItem(WISH_KEY, JSON.stringify(list));
  renderWishlistPanel();
  updateWishCount();
}

function toggleWishlist(id){
  if(!id) return;
  const list = getWishlist();
  const idx = list.indexOf(id);
  if(idx===-1) list.push(id); else list.splice(idx,1);
  setWishlist(list);
}

function updateWishCount(){
  const count = getWishlist().length;
  if(wishCountEl) wishCountEl.textContent = count;
}

function toggleWishlistPanel(show){
  const panel = document.getElementById('wishlistPanel');
  const btn = document.getElementById('wishlistToggle');
  if(!panel) return;
  if(show===undefined) show = panel.classList.contains('hidden');
  if(show){ panel.classList.remove('hidden'); btn.setAttribute('aria-expanded','true'); } else { panel.classList.add('hidden'); btn.setAttribute('aria-expanded','false'); }
}

function renderWishlistPanel(){
  const root = document.getElementById('wishlistContent');
  const list = getWishlist();
  if(!root) return;
  if(list.length===0){ root.innerHTML = '<p>Belum ada wishlist</p>'; return; }
  root.innerHTML = '';
  list.forEach(id=>{
    const p = products.find(x=>x.id===id);
    const el = document.createElement('div');
    el.className = 'wishlist-item';
    el.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center">
        <img src="${p ? p.image : '/assets/images/products/sample.jpg'}" alt="${p? p.name : 'item'}" style="width:64px;height:64px;object-fit:cover;border-radius:8px">
        <div>
          <div>${p? p.name : id}</div>
          <div style="font-weight:700">Rp ${p? p.price.toLocaleString() : '-'}</div>
        </div>
        <div style="margin-left:auto"><button class="btn btn-ghost" onclick="removeFromWishlist('${id}')">Hapus</button></div>
      </div>
    `;
    root.appendChild(el);
  });
}

function removeFromWishlist(id){
  const list = getWishlist();
  const idx = list.indexOf(id);
  if(idx>-1) list.splice(idx,1);
  setWishlist(list);
}

// init
document.addEventListener('DOMContentLoaded', ()=>{
  updateWishCount();
  renderWishlistPanel();
  const btn = document.getElementById('wishlistToggle');
  if(btn) btn.addEventListener('click', ()=> toggleWishlistPanel());
});

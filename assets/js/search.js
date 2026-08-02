// assets/js/search.js

// Basic client-side autocomplete for demo purposes
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

function renderSearchResults(matches, highlightIndex=0){
  if(!searchResults) return;
  searchResults.innerHTML = '';
  if(matches.length===0) return;
  matches.forEach((m, idx)=>{
    const li = document.createElement('li');
    li.setAttribute('role','option');
    li.setAttribute('data-id', m.id);
    if(idx===highlightIndex) li.setAttribute('aria-selected','true'); else li.setAttribute('aria-selected','false');
    li.innerHTML = `<strong>${m.name}</strong><div style="font-size:0.85rem;color:var(--muted)">Rp ${m.price.toLocaleString()}</div>`;
    li.addEventListener('click', ()=>{ quickView(m.id); clearSearch(); });
    searchResults.appendChild(li);
  });
}

function clearSearch(){ if(searchResults) searchResults.innerHTML=''; if(searchInput) searchInput.value=''; }

if(searchInput){
  let highlighted = 0;
  searchInput.addEventListener('input', (e)=>{
    const q = e.target.value.trim().toLowerCase();
    if(q.length===0){ searchResults.innerHTML=''; return; }
    const matches = products.filter(p => p.name.toLowerCase().includes(q)).slice(0,8);
    highlighted = 0;
    renderSearchResults(matches, highlighted);
  });

  searchInput.addEventListener('keydown', (e)=>{
    const items = searchResults.querySelectorAll('li');
    if(!items || items.length===0) return;
    if(e.key==='ArrowDown'){ e.preventDefault(); highlighted = Math.min(highlighted+1, items.length-1); items.forEach((it,i)=>it.setAttribute('aria-selected', i===highlighted)); }
    if(e.key==='ArrowUp'){ e.preventDefault(); highlighted = Math.max(highlighted-1, 0); items.forEach((it,i)=>it.setAttribute('aria-selected', i===highlighted)); }
    if(e.key==='Enter'){ e.preventDefault(); const id = items[highlighted].dataset.id; quickView(id); clearSearch(); }
    if(e.key==='Escape'){ clearSearch(); }
  });
}

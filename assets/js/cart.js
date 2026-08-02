// assets/js/cart.js

// Sticky add to cart (mobile) - placeholder
(function(){
  // This is a scaffold where later we can render product-specific sticky CTA
  function createSticky(){
    const exist = document.getElementById('stickyAdd');
    if(exist) return;
    const el = document.createElement('div');
    el.id = 'stickyAdd';
    el.style.position = 'fixed';
    el.style.bottom = '80px';
    el.style.left = '12px';
    el.style.right = '12px';
    el.style.display = 'none';
    el.style.justifyContent = 'center';
    el.innerHTML = `<button class="btn btn-primary" onclick="addToCart('p-001')">Tambah ke Keranjang</button>`;
    document.body.appendChild(el);

    // show on mobile
    function toggle(){
      if(window.innerWidth<=768) el.style.display = 'flex'; else el.style.display = 'none';
    }
    toggle();
    window.addEventListener('resize', toggle);
  }
  document.addEventListener('DOMContentLoaded', createSticky);
})();

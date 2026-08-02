R2-Nusantara — UI/UX Upgrade (branch: upgrade/ui-ux)

Ringkasan perubahan awal (Phase 1 skeleton):

- index.html: hero, sample product card, quick view modal scaffold, bottom mobile nav
- assets/css/main.css, components.css: color tokens, dark-mode vars, responsive layout, component styles
- assets/js/app.js: dark-mode toggle (localStorage), quick view modal, recently viewed scaffold, stock indicator, addToCart placeholder
- assets/js/cart.js: sticky add-to-cart scaffold for mobile
- manifest.json, sw.js: minimal PWA files

Next steps I will take after you review or request changes:
- Add more product cards & real assets
- Replace placeholder images with optimized WebP versions
- Add autocomplete search & wishlist persistence
- Prepare PR with checklist and screenshots

Testing locally:
- Run a simple static server (e.g. `npx serve .`) and open http://localhost:5000
- Verify dark mode toggle and quick view modal


/**
 * Wishlist Module - R2-Nusantara
 * Handles wishlist operations with localStorage persistence
 */

import { CONFIG } from './config.js';
import { LocalStorage, showToast } from './utils.js';

class WishlistManager {
  constructor() {
    this.items = [];
    this.loadWishlist();
  }

  // Load wishlist from localStorage
  loadWishlist() {
    const saved = LocalStorage.get(CONFIG.WISHLIST_STORAGE_KEY, []);
    this.items = saved;
    this.updateUI();
  }

  // Save wishlist to localStorage
  saveWishlist() {
    LocalStorage.set(CONFIG.WISHLIST_STORAGE_KEY, this.items);
    this.updateUI();
  }

  // Add item to wishlist
  addItem(product) {
    if (this.items.find((item) => item.id === product.id)) {
      showToast('Already in your wishlist', 'info');
      return false;
    }

    if (this.items.length >= CONFIG.WISHLIST_MAX_ITEMS) {
      showToast('Wishlist is full', 'warning');
      return false;
    }

    this.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      addedAt: new Date().toISOString(),
    });

    this.saveWishlist();
    showToast(`${product.name} added to wishlist`, 'success');
    return true;
  }

  // Remove item from wishlist
  removeItem(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.saveWishlist();
    showToast('Removed from wishlist', 'info');
  }

  // Check if product is in wishlist
  isInWishlist(productId) {
    return this.items.some((item) => item.id === productId);
  }

  // Get wishlist items count
  getItemCount() {
    return this.items.length;
  }

  // Clear wishlist
  clearWishlist() {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      this.items = [];
      this.saveWishlist();
      showToast('Wishlist cleared', 'info');
    }
  }

  // Update UI
  updateUI() {
    const badge = document.getElementById('wishlistBadge');
    if (badge) {
      const count = this.getItemCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }

    // Update wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach((btn) => {
      const productId = parseInt(btn.dataset.productId);
      const isInWishlist = this.isInWishlist(productId);
      btn.classList.toggle('active', isInWishlist);
      btn.textContent = isInWishlist ? '♥' : '♡';
    });
  }

  // Render wishlist items
  renderWishlistItems(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (this.items.length === 0) {
      container.innerHTML = `
        <div class="text-center py-lg">
          <p class="text-muted">Your wishlist is empty</p>
          <a href="/" class="btn btn-primary">Continue Shopping</a>
        </div>
      `;
      return;
    }

    container.innerHTML = this.items
      .map(
        (item) => `
      <div class="card mb-md" data-product-id="${item.id}">
        <div style="display: flex; gap: 1rem; padding: 1rem;">
          <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 0.5rem;">
          <div style="flex: 1;">
            <h4>${item.name}</h4>
            <p style="color: var(--color-primary); font-weight: bold;">Rp ${item.price.toLocaleString('id-ID')}</p>
            <small style="color: var(--color-text-light);">Added ${new Date(item.addedAt).toLocaleDateString('id-ID')}</small>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <button class="btn btn-sm btn-primary add-to-cart-from-wishlist" data-product-id="${item.id}">
              Add to Cart
            </button>
            <button class="btn btn-sm btn-danger remove-wishlist-btn" data-product-id="${item.id}">
              Remove
            </button>
          </div>
        </div>
      </div>
    `,
      )
      .join('');

    this.attachWishlistListeners();
  }

  // Attach event listeners
  attachWishlistListeners() {
    document.querySelectorAll('.remove-wishlist-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.productId);
        this.removeItem(productId);
      });
    });
  }
}

export const wishlistManager = new WishlistManager();

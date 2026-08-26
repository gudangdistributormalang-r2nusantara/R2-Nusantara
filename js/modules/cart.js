/**
 * Cart Module - R2-Nusantara
 * Handles shopping cart operations
 */

import { CONFIG } from './config.js';
import { LocalStorage, formatRupiah, showToast } from './utils.js';

class CartManager {
  constructor() {
    this.items = [];
    this.loadCart();
  }

  // Load cart from localStorage
  loadCart() {
    const saved = LocalStorage.get(CONFIG.CART_STORAGE_KEY, []);
    this.items = saved;
    this.updateUI();
  }

  // Save cart to localStorage
  saveCart() {
    LocalStorage.set(CONFIG.CART_STORAGE_KEY, this.items);
    this.updateUI();
  }

  // Add item to cart
  addItem(product, quantity = 1) {
    const existing = this.items.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity = Math.min(
        existing.quantity + quantity,
        CONFIG.MAX_QUANTITY,
      );
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: Math.min(quantity, CONFIG.MAX_QUANTITY),
      });
    }

    this.saveCart();
    showToast(`${product.name} added to cart`, 'success');
  }

  // Update item quantity
  updateQuantity(productId, quantity) {
    const item = this.items.find((item) => item.id === productId);
    if (!item) return;

    if (quantity < CONFIG.MIN_QUANTITY) {
      this.removeItem(productId);
    } else if (quantity <= CONFIG.MAX_QUANTITY) {
      item.quantity = quantity;
      this.saveCart();
    }
  }

  // Remove item from cart
  removeItem(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.saveCart();
    showToast('Item removed from cart', 'info');
  }

  // Clear cart
  clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
      this.items = [];
      this.saveCart();
      showToast('Cart cleared', 'info');
    }
  }

  // Get cart total
  getTotal() {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Get item count
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  // Get unique items count
  getUniqueItemCount() {
    return this.items.length;
  }

  // Calculate subtotal, tax, and total
  getCalculations() {
    const subtotal = this.getTotal();
    const tax = subtotal * CONFIG.TAX_RATE;
    const shippingCost =
      subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : CONFIG.SHIPPING_COST;
    const total = subtotal + tax + shippingCost;

    return {
      subtotal,
      tax,
      shippingCost,
      total,
      freeShipping: subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD,
    };
  }

  // Update cart UI
  updateUI() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
      const count = this.getItemCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  // Render cart items
  renderCartItems(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (this.items.length === 0) {
      container.innerHTML = `
        <div class="text-center py-lg">
          <p class="text-muted">Your cart is empty</p>
          <a href="/" class="btn btn-primary">Continue Shopping</a>
        </div>
      `;
      return;
    }

    container.innerHTML = this.items
      .map(
        (item) => `
      <div class="card cart-item mb-md" data-product-id="${item.id}">
        <div class="row cols-4" style="gap: 1rem; align-items: center; padding: 1rem;">
          <div>
            <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 0.5rem;">
          </div>
          <div>
            <h4 class="mb-sm">${item.name}</h4>
            <p class="text-muted">${formatRupiah(item.price)}</p>
          </div>
          <div>
            <input type="number" min="${CONFIG.MIN_QUANTITY}" max="${CONFIG.MAX_QUANTITY}" value="${item.quantity}" class="quantity-input" data-product-id="${item.id}" style="width: 80px; padding: 0.5rem;">
          </div>
          <div class="text-right">
            <p class="font-weight-bold mb-md">${formatRupiah(item.price * item.quantity)}</p>
            <button class="btn btn-sm btn-danger remove-item-btn" data-product-id="${item.id}">Remove</button>
          </div>
        </div>
      </div>
    `,
      )
      .join('');

    this.attachCartListeners();
  }

  // Attach event listeners for cart
  attachCartListeners() {
    document.querySelectorAll('.quantity-input').forEach((input) => {
      input.addEventListener('change', (e) => {
        const productId = parseInt(e.target.dataset.productId);
        const quantity = parseInt(e.target.value);
        this.updateQuantity(productId, quantity);
      });
    });

    document.querySelectorAll('.remove-item-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.productId);
        this.removeItem(productId);
      });
    });
  }

  // Render cart summary
  renderSummary(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { subtotal, tax, shippingCost, total, freeShipping } =
      this.getCalculations();

    container.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h3 class="card-title mb-lg">Order Summary</h3>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Subtotal</span>
            <span>${formatRupiah(subtotal)}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Tax (10%)</span>
            <span>${formatRupiah(tax)}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-border);">
            <span>Shipping ${freeShipping ? '(FREE)' : ''}</span>
            <span>${formatRupiah(shippingCost)}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.25rem; margin-bottom: 1rem;">
            <span>Total</span>
            <span>${formatRupiah(total)}</span>
          </div>
          
          ${
            freeShipping
              ? '<div class="alert alert-success">Congratulations! Free Shipping</div>'
              : `<div class="alert alert-info">Spend ${formatRupiah(CONFIG.FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping</div>`
          }
          
          <button class="btn btn-primary btn-block btn-lg mb-md" onclick="window.location.href='/checkout'">
            Proceed to Checkout
          </button>
          
          <button class="btn btn-secondary btn-block" onclick="window.location.href='/'">
            Continue Shopping
          </button>
        </div>
      </div>
    `;
  }
}

export const cartManager = new CartManager();

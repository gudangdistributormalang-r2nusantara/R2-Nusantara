/**
 * Products Module - R2-Nusantara
 * Handles product data and rendering
 */

import { CONFIG } from './config.js';
import { formatRupiah, formatNumber, deepClone } from './utils.js';

class ProductsManager {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.currentPage = 1;
    this.totalPages = 1;
    this.filters = {
      search: '',
      category: '',
      minPrice: 0,
      maxPrice: Infinity,
      sortBy: 'newest',
    };
  }

  // Initialize with sample data
  async init() {
    this.products = this.getSampleProducts();
    this.applyFilters();
  }

  // Get sample products
  getSampleProducts() {
    return [
      {
        id: 1,
        name: 'Produk Premium A',
        category: 'electronics',
        price: 150000,
        originalPrice: 200000,
        image: 'https://via.placeholder.com/400x300?text=Product+1',
        rating: 4.5,
        reviews: 128,
        inStock: true,
        description: 'Produk berkualitas tinggi dengan spesifikasi terbaik',
        badge: 'Sale',
      },
      {
        id: 2,
        name: 'Produk Standard B',
        category: 'apparel',
        price: 75000,
        originalPrice: 0,
        image: 'https://via.placeholder.com/400x300?text=Product+2',
        rating: 4,
        reviews: 95,
        inStock: true,
        description: 'Produk standar dengan harga terjangkau',
        badge: '',
      },
      {
        id: 3,
        name: 'Produk Eksklusif C',
        category: 'electronics',
        price: 250000,
        originalPrice: 0,
        image: 'https://via.placeholder.com/400x300?text=Product+3',
        rating: 5,
        reviews: 234,
        inStock: true,
        description: 'Produk eksklusif dengan fitur lengkap',
        badge: 'New',
      },
      {
        id: 4,
        name: 'Produk Hemat D',
        category: 'apparel',
        price: 45000,
        originalPrice: 65000,
        image: 'https://via.placeholder.com/400x300?text=Product+4',
        rating: 3.5,
        reviews: 42,
        inStock: false,
        description: 'Produk hemat dengan kualitas baik',
        badge: 'Sale',
      },
      {
        id: 5,
        name: 'Produk Populer E',
        category: 'accessories',
        price: 89000,
        originalPrice: 0,
        image: 'https://via.placeholder.com/400x300?text=Product+5',
        rating: 4.7,
        reviews: 315,
        inStock: true,
        description: 'Produk paling diminati pelanggan',
        badge: 'Hot',
      },
    ];
  }

  // Apply filters and search
  applyFilters() {
    let filtered = this.products;

    // Search filter
    if (this.filters.search) {
      const searchLower = this.filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower),
      );
    }

    // Category filter
    if (this.filters.category) {
      filtered = filtered.filter((p) => p.category === this.filters.category);
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= this.filters.minPrice && p.price <= this.filters.maxPrice,
    );

    // Sort
    filtered = this.sortProducts(filtered, this.filters.sortBy);

    this.filteredProducts = filtered;
    this.calculatePagination();
  }

  // Sort products
  sortProducts(products, sortBy) {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'reviews':
        return sorted.sort((a, b) => b.reviews - a.reviews);
      case 'newest':
      default:
        return sorted.reverse();
    }
  }

  // Calculate pagination
  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / CONFIG.ITEMS_PER_PAGE);
    this.currentPage = 1;
  }

  // Get current page products
  getPageProducts() {
    const start = (this.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
    const end = start + CONFIG.ITEMS_PER_PAGE;
    return this.filteredProducts.slice(start, end);
  }

  // Get product by ID
  getProductById(id) {
    return this.products.find((p) => p.id === id);
  }

  // Search products
  search(query) {
    this.filters.search = query;
    this.applyFilters();
  }

  // Filter by category
  filterByCategory(category) {
    this.filters.category = category;
    this.applyFilters();
  }

  // Filter by price
  filterByPrice(minPrice, maxPrice) {
    this.filters.minPrice = minPrice;
    this.filters.maxPrice = maxPrice;
    this.applyFilters();
  }

  // Sort products
  sort(sortBy) {
    this.filters.sortBy = sortBy;
    this.applyFilters();
  }

  // Get unique categories
  getCategories() {
    return [...new Set(this.products.map((p) => p.category))];
  }

  // Render product card HTML
  renderProductCard(product) {
    const discount = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

    return `
      <div class="card card-product" data-product-id="${product.id}">
        <div class="card-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          ${
            product.badge
              ? `<div class="card-badge">${product.badge}</div>`
              : ''
          }
        </div>
        <div class="card-body">
          <h3 class="card-title">${product.name}</h3>
          <p class="card-text">${product.description}</p>
          
          <div class="card-rating">
            <span class="stars">${this.renderStars(product.rating)}</span>
            <span class="count">(${formatNumber(product.reviews)})</span>
          </div>
          
          <div class="card-price">
            <span class="price-current">${formatRupiah(product.price)}</span>
            ${
              product.originalPrice
                ? `<span class="price-original">${formatRupiah(product.originalPrice)}</span>`
                : ''
            }
          </div>
          
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-primary btn-block quick-view-btn" data-product-id="${product.id}">
              Quick View
            </button>
            <button class="btn btn-secondary btn-icon wishlist-btn" data-product-id="${product.id}" title="Add to wishlist">
              ♡
            </button>
          </div>
          
          ${
            !product.inStock
              ? `<div class="alert alert-warning" style="margin-top: 0.5rem; padding: 0.5rem;">Out of Stock</div>`
              : ''
          }
        </div>
      </div>
    `;
  }

  // Render star rating
  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '½';
    stars += '☆'.repeat(5 - Math.ceil(rating));
    return stars;
  }

  // Render product list
  renderProductList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const products = this.getPageProducts();
    container.innerHTML = products.map((p) => this.renderProductCard(p)).join('');

    this.attachEventListeners();
  }

  // Attach event listeners
  attachEventListeners() {
    document.querySelectorAll('.quick-view-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.productId);
        this.openQuickView(productId);
      });
    });
  }

  // Open quick view modal
  openQuickView(productId) {
    const product = this.getProductById(productId);
    if (!product) return;

    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

    modal.querySelector('.modal-body').innerHTML = `
      <div class="row cols-2">
        <div>
          <img src="${product.image}" alt="${product.name}" class="rounded" style="width: 100%;">
        </div>
        <div>
          <h2>${product.name}</h2>
          <div class="card-rating mb-md">
            <span class="stars">${this.renderStars(product.rating)}</span>
            <span class="count">(${formatNumber(product.reviews)} reviews)</span>
          </div>
          <div class="card-price mb-md">
            <span class="price-current">${formatRupiah(product.price)}</span>
            ${
              product.originalPrice
                ? `<span class="price-original">${formatRupiah(product.originalPrice)}</span>`
                : ''
            }
          </div>
          <p>${product.description}</p>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
              Add to Cart
            </button>
            <button class="btn btn-secondary" onclick="document.getElementById('quickViewModal').classList.remove('show')">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('show');
  }
}

export const productsManager = new ProductsManager();

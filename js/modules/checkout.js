/**
 * Checkout Module - R2-Nusantara
 * Handles checkout form validation and order submission
 */

import { CONFIG } from './config.js';
import { LocalStorage, validateEmail, validatePhone, showToast } from './utils.js';

class CheckoutManager {
  constructor() {
    this.formData = this.loadFormData();
  }

  // Load form data from localStorage
  loadFormData() {
    return LocalStorage.get(CONFIG.CHECKOUT_STORAGE_KEY, {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      zipCode: '',
      paymentMethod: 'bank-transfer',
      agreeToTerms: false,
    });
  }

  // Save form data to localStorage
  saveFormData() {
    LocalStorage.set(CONFIG.CHECKOUT_STORAGE_KEY, this.formData);
  }

  // Validate form
  validateForm() {
    const errors = {};

    // First name validation
    if (!this.formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    // Last name validation
    if (!this.formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    // Email validation
    if (!this.formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(this.formData.email)) {
      errors.email = 'Invalid email address';
    }

    // Phone validation
    if (!this.formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(this.formData.phone)) {
      errors.phone = 'Invalid phone number';
    }

    // Address validation
    if (!this.formData.address.trim()) {
      errors.address = 'Address is required';
    }

    // City validation
    if (!this.formData.city.trim()) {
      errors.city = 'City is required';
    }

    // Province validation
    if (!this.formData.province.trim()) {
      errors.province = 'Province is required';
    }

    // Zip code validation
    if (!this.formData.zipCode.trim()) {
      errors.zipCode = 'Zip code is required';
    } else if (!/^\d{5}$/.test(this.formData.zipCode)) {
      errors.zipCode = 'Invalid zip code (5 digits required)';
    }

    // Terms agreement validation
    if (!this.formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // Submit checkout form
  async submitCheckout() {
    const validation = this.validateForm();

    if (!validation.valid) {
      this.displayErrors(validation.errors);
      showToast('Please fix the errors in the form', 'danger');
      return false;
    }

    this.saveFormData();

    // Simulate API call
    try {
      const response = await this.simulateOrderSubmission();
      if (response.success) {
        showToast('Order placed successfully!', 'success');
        this.clearFormData();
        return true;
      } else {
        showToast('Order submission failed. Please try again.', 'danger');
        return false;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showToast('An error occurred during checkout', 'danger');
      return false;
    }
  }

  // Simulate order submission
  async simulateOrderSubmission() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          orderId: `ORD-${Date.now()}`,
          message: 'Order has been placed',
        });
      }, 2000);
    });
  }

  // Display validation errors
  displayErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.form-error').forEach((el) => el.remove());

    for (const [field, message] of Object.entries(errors)) {
      const input = document.querySelector(`[name="${field}"]`);
      if (input) {
        input.classList.add('error');
        const errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        errorEl.style.cssText = 'color: var(--color-danger); font-size: 0.875rem; margin-top: 0.25rem;';
        errorEl.textContent = message;
        input.parentElement.appendChild(errorEl);
      }
    }
  }

  // Clear form data
  clearFormData() {
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      zipCode: '',
      paymentMethod: 'bank-transfer',
      agreeToTerms: false,
    };
    LocalStorage.remove(CONFIG.CHECKOUT_STORAGE_KEY);
  }

  // Get saved form data
  getFormData() {
    return this.formData;
  }

  // Update form field
  updateField(field, value) {
    this.formData[field] = value;
  }

  // Render checkout form
  renderCheckoutForm(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <form id="checkoutForm" class="checkout-form">
        <div class="row cols-2">
          <div>
            <label for="firstName">First Name *</label>
            <input type="text" id="firstName" name="firstName" value="${this.formData.firstName}" required>
          </div>
          <div>
            <label for="lastName">Last Name *</label>
            <input type="text" id="lastName" name="lastName" value="${this.formData.lastName}" required>
          </div>
        </div>

        <div>
          <label for="email">Email Address *</label>
          <input type="email" id="email" name="email" value="${this.formData.email}" required>
        </div>

        <div>
          <label for="phone">Phone Number *</label>
          <input type="tel" id="phone" name="phone" value="${this.formData.phone}" placeholder="+62..." required>
        </div>

        <div>
          <label for="address">Street Address *</label>
          <input type="text" id="address" name="address" value="${this.formData.address}" required>
        </div>

        <div class="row cols-2">
          <div>
            <label for="city">City *</label>
            <input type="text" id="city" name="city" value="${this.formData.city}" required>
          </div>
          <div>
            <label for="province">Province *</label>
            <input type="text" id="province" name="province" value="${this.formData.province}" required>
          </div>
        </div>

        <div>
          <label for="zipCode">Zip Code *</label>
          <input type="text" id="zipCode" name="zipCode" value="${this.formData.zipCode}" maxlength="5" required>
        </div>

        <div class="mb-lg">
          <label for="paymentMethod">Payment Method *</label>
          <select id="paymentMethod" name="paymentMethod" required>
            <option value="bank-transfer" ${this.formData.paymentMethod === 'bank-transfer' ? 'selected' : ''}>Bank Transfer</option>
            <option value="e-wallet" ${this.formData.paymentMethod === 'e-wallet' ? 'selected' : ''}>E-Wallet</option>
            <option value="cash-on-delivery" ${this.formData.paymentMethod === 'cash-on-delivery' ? 'selected' : ''}>Cash on Delivery</option>
          </select>
        </div>

        <div class="mb-lg">
          <label>
            <input type="checkbox" id="agreeToTerms" name="agreeToTerms" ${this.formData.agreeToTerms ? 'checked' : ''}>
            <span>I agree to the <a href="#terms">Terms and Conditions</a> *</span>
          </label>
        </div>

        <button type="submit" class="btn btn-primary btn-lg btn-block">Complete Order</button>
        <button type="reset" class="btn btn-secondary btn-block" style="margin-top: 0.5rem;">Clear Form</button>
      </form>
    `;

    this.attachFormListeners();
  }

  // Attach form listeners
  attachFormListeners() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;

    // Auto-save form fields
    form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('change', (e) => {
        const fieldName = e.target.name;
        const value =
          e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.updateField(fieldName, value);
        this.saveFormData();
      });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.submitCheckout();
    });
  }
}

export const checkoutManager = new CheckoutManager();

import { cart, updateCartUI } from './cart.js';
import { showToast } from './utils.js';

// ========== Open Checkout Modal ==========
export function openCheckoutModal() {
  window.toggleCart(); // Tutup cart sidebar
  setTimeout(() => {
    const overlay = document.getElementById('checkoutModalOverlay');
    const modal = document.getElementById('checkoutModal');
    if (overlay) overlay.classList.add('overlay-enter');
    if (modal) modal.classList.add('modal-enter');
    document.body.style.overflow = 'hidden';
    updateProgressStep(1);
    setTimeout(() => {
      document.getElementById('newCustName')?.focus();
      validateCheckoutForm();
    }, 300);
  }, 300);
}

// ========== Close Checkout Modal ==========
export function closeCheckoutModal() {
  const overlay = document.getElementById('checkoutModalOverlay');
  const modal = document.getElementById('checkoutModal');
  if (overlay) overlay.classList.remove('overlay-enter');
  if (modal) modal.classList.remove('modal-enter');
  document.body.style.overflow = '';
}

// ========== Progress Step ==========
function updateProgressStep(step) {
  const indicators = [
    document.getElementById('step1Indicator'),
    document.getElementById('step2Indicator'),
    document.getElementById('step3Indicator'),
  ];
  const line = document.getElementById('stepProgressLine');

  indicators.forEach((ind, idx) => {
    if (!ind) return;
    const numCircle = ind.querySelector('div');
    const textSpan = ind.querySelector('span');
    numCircle.className =
      'w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors duration-300 border-2 border-white ring-2 ring-slate-100 step-indicator' +
      (idx + 1 === step
        ? ' active shadow-sm'
        : idx + 1 < step
        ? ' completed shadow-sm'
        : ' bg-slate-100 text-slate-400');
    textSpan.className =
      'text-[9px] font-bold uppercase tracking-widest' +
      (idx + 1 === step
        ? ' text-brand-900'
        : idx + 1 < step
        ? ' text-emerald-500'
        : ' text-slate-400');
  });

  const width = step === 1 ? 0 : step === 2 ? 50 : 100;
  if (line) line.style.width = width + '%';
}

// ========== Form Validation ==========
function showError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) {
    field.classList.add('form-field-error');
    field.classList.remove('field-valid');
  }
  if (error) {
    const span = error.querySelector('span');
    if (span) span.textContent = message;
    error.classList.add('show');
  }
}

function clearError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) {
    field.classList.remove('form-field-error');
    field.classList.add('field-valid');
  }
  if (error) error.classList.remove('show');
}

export function validateCheckoutForm() {
  let isValid = true;

  const name = document.getElementById('newCustName');
  if (name && name.value.trim().length >= 2) {
    clearError('newCustName', 'newErrName');
  } else {
    if (name && name.value.trim().length > 0) {
      showError('newCustName', 'newErrName', 'Minimal 2 karakter');
    }
    isValid = false;
  }

  const phone = document.getElementById('newCustPhone');
  const phoneClean = phone ? phone.value.replace(/\D/g, '') : '';
  if (phoneClean && /^8[1-9]\d{6,11}$/.test(phoneClean)) {
    clearError('newCustPhone', 'newErrPhone');
  } else {
    if (phoneClean) showError('newCustPhone', 'newErrPhone', 'Nomor tidak valid');
    isValid = false;
  }

  const alamat = document.getElementById('newAlamat');
  if (alamat && alamat.value.trim().length >= 20) {
    clearError('newAlamat', 'newErrAlamat');
  } else {
    if (alamat && alamat.value.trim().length > 0) {
      showError('newAlamat', 'newErrAlamat', 'Minimal 20 karakter');
    }
    isValid = false;
  }

  const required = [
    'newProvinsi',
    'newKota',
    'newKecamatan',
    'newKelurahan',
    'newKodePos',
    'newEkspedisi',
    'newMetode',
    'newAdmin',
  ];
  required.forEach((id) => {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) isValid = false;
  });

  const btn = document.getElementById('finalCheckoutBtn');
  if (btn) {
    if (isValid) {
      btn.removeAttribute('disabled');
    } else {
      btn.setAttribute('disabled', 'true');
    }
  }

  return isValid;
}

// ========== Submit Order ==========
export function submitOrder() {
  if (!validateCheckoutForm()) {
    showToast('Lengkapi formulir dengan benar', 'error');
    return;
  }

  const name = document.getElementById('newCustName');
  const phone = document.getElementById('newCustPhone');
  const provinsi = document.getElementById('newProvinsi');
  const kota = document.getElementById('newKota');
  const kecamatan = document.getElementById('newKecamatan');
  const kelurahan = document.getElementById('newKelurahan');
  const kodePos = document.getElementById('newKodePos');
  const alamat = document.getElementById('newAlamat');
  const patokan = document.getElementById('newPatokan');
  const ekspedisi = document.getElementById('newEkspedisi');
  const metode = document.getElementById('newMetode');
  const admin = document.getElementById('newAdmin');

  const btn = document.getElementById('finalCheckoutBtn');
  const btnText = document.getElementById('finalBtnText');
  const btnIcon = document.getElementById('finalBtnIcon');

  btn.classList.add('checkout-btn-loading');
  btnText.textContent = 'Memproses...';
  btnIcon.style.display = 'none';

  setTimeout(() => {
    btn.classList.remove('checkout-btn-loading');
    btn.classList.add('checkout-success');
    btnText.textContent = 'Membuka WhatsApp...';
    btnIcon.className = 'fa-solid fa-check text-lg';
    btnIcon.style.display = '';

    const waNumber = admin.value;
    const totalSlop = cart.reduce((sum, i) => sum + i.qty, 0);

    const r2Items = cart.filter((i) => i.category === 'r2');
    const resmiItems = cart.filter((i) => i.category === 'resmi');

    const fullAddress =
      alamat.value.trim() +
      ` (Patokan: ${patokan.value.trim() || '-'})\n` +
      `Kel: ${kelurahan.value.trim()}, Kec: ${kecamatan.value.trim()}\n` +
      `${kota.value.trim()}, ${provinsi.value.trim()} - ${kodePos.value.trim()}`;

    let message = '📝 *ORDER R2 NUSANTARA (ENTERPRISE)*\n\n';
    message += `👤 *Nama:* ${name.value.trim()}\n`;
    message += `📱 *No. HP:* +62 ${phone.value.trim()}\n`;
    message += `📍 *Alamat Pengiriman:*\n${fullAddress}\n\n`;
    message += `🚚 *Ekspedisi:* ${ekspedisi.value}\n`;
    message += `💳 *Pembayaran:* ${metode.value}\n\n`;

    if (r2Items.length) {
      message += '*🔥 KATALOG R2:*\n';
      r2Items.forEach((i) => {
        message += `• ${i.name} — ${i.qty} slop\n`;
      });
      message += '\n';
    }
    if (resmiItems.length) {
      message += '*🏅 KATALOG RESMI:*\n';
      resmiItems.forEach((i) => {
        message += `• ${i.name} — ${i.qty} slop\n`;
      });
      message += '\n';
    }

    message += `*Total Order:* ${totalSlop} Slop\n`;
    message += `*Status Ongkir:* ${totalSlop >= 20 ? '✅ Gratis Ongkir' : 'Reguler'}`;

    setTimeout(() => {
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
      // Reset cart
      cart.length = 0;
      window.__cart = cart;
      updateCartUI();
      closeCheckoutModal();
      document.getElementById('checkoutFormFull').reset();

      btn.classList.remove('checkout-success');
      btnText.textContent = 'Konfirmasi Pesanan';
      btnIcon.className = 'fa-brands fa-whatsapp text-lg';
      btnIcon.style.display = '';
      validateCheckoutForm();
      showToast('Pesanan berhasil dilanjutkan! 🎉');
    }, 800);
  }, 1500);
}

// ========== Expose ke window ==========
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
window.submitOrder = submitOrder;
window.validateCheckoutForm = validateCheckoutForm;
/* ============================================
   R2 NUSANTARA - MAIN APPLICATION
   Initialization, modals, events & chatbot
   ============================================ */

'use strict';

// Smart Context for Chatling Bot
window.R2Context = {
  init: function() {
    this.device = /Mobile|Android|iP(hone|od|ad)/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
    this.language = navigator.language || navigator.userLanguage;
    this.referrer = document.referrer || 'Direct';
    this.isReturning = localStorage.getItem('r2_visited') ? true : false;
    localStorage.setItem('r2_visited', 'true');
  },
  getCartSummary: function() {
    if (!window.__cart) return 'Keranjang Kosong';
    var total = window.__cart.reduce(function(s, i) { return s + i.qty; }, 0);
    return total + ' Slop';
  }
};

window.R2Context.init();

// Chatling Config
window.chtlConfig = { chatbotId: "4136889914" };

// Lazy load Chatling
window.addEventListener('load', function() {
  setTimeout(function() {
    var script = document.createElement('script');
    script.async = true;
    script.dataset.id = "4136889914";
    script.id = "chtl-script";
    script.type = "text/javascript";
    script.src = "https://chatling.ai/js/embed.js";
    document.body.appendChild(script);
  }, 3000);
});

// Loader
(function() {
  var ft = setTimeout(function() {
    var l = document.getElementById('loader');
    if (l) {
      l.style.opacity = '0';
      setTimeout(function() { l.style.display = 'none'; }, 500);
    }
  }, 4000);
  
  window.__clearLoader = function() { clearTimeout(ft); };
})();

// Modal Checkout Logic
window.openCheckoutModal = function() {
  toggleCart();
  setTimeout(function() {
    var o = document.getElementById('checkoutModalOverlay');
    var m = document.getElementById('checkoutModal');
    if (o) o.classList.add('overlay-enter');
    if (m) m.classList.add('modal-enter');
    document.body.style.overflow = 'hidden';
    updateProgressStep(1);
    setTimeout(function() {
      var n = document.getElementById('newCustName');
      if (n) n.focus();
      validateCheckoutForm();
    }, 300);
  }, 300);
};

window.closeCheckoutModal = function() {
  var o = document.getElementById('checkoutModalOverlay');
  var m = document.getElementById('checkoutModal');
  if (o) o.classList.remove('overlay-enter');
  if (m) m.classList.remove('modal-enter');
  document.body.style.overflow = '';
};

// Escape key handler
document.addEventListener('keydown', function(e) {
  var m = document.getElementById('checkoutModal');
  var r = document.getElementById('reviewModal');
  if (m && m.classList.contains('modal-enter') && e.key === 'Escape') closeCheckoutModal();
  if (r && r.classList.contains('modal-enter') && e.key === 'Escape') closeReviewModal();
});

// Form input handlers
const formInputs = document.querySelectorAll('#checkoutFormFull input, #checkoutFormFull textarea, #checkoutFormFull select');
formInputs.forEach(function(input, index) {
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && input.tagName !== 'TEXTAREA') {
      e.preventDefault();
      if (index < formInputs.length - 1) formInputs[index + 1].focus();
    }
  });
  
  input.addEventListener('focus', function() {
    var stepGroup = input.closest('[data-step]');
    if (stepGroup) updateProgressStep(parseInt(stepGroup.getAttribute('data-step')));
  });
  
  input.addEventListener('input', validateCheckoutForm);
  input.addEventListener('change', validateCheckoutForm);
  input.addEventListener('blur', validateCheckoutForm);
});

// Update Progress Step
function updateProgressStep(stepNum) {
  var indicators = [
    document.getElementById('step1Indicator'),
    document.getElementById('step2Indicator'),
    document.getElementById('step3Indicator')
  ];
  
  var line = document.getElementById('stepProgressLine');
  
  indicators.forEach(function(ind, idx) {
    if (!ind) return;
    var numCircle = ind.querySelector('div');
    var textSpan = ind.querySelector('span');
    
    numCircle.className = "w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors duration-300 border-2 border-white ring-2 ring-slate-100 step-indicator" + 
      (idx + 1 === stepNum ? " active shadow-sm" : (idx + 1 < stepNum ? " completed shadow-sm" : " bg-slate-100 text-slate-400"));
    
    textSpan.className = "text-[9px] font-bold uppercase tracking-widest" + 
      (idx + 1 === stepNum ? " text-brand-900" : (idx + 1 < stepNum ? " text-emerald-500" : " text-slate-400"));
  });
  
  var widthPercentage = stepNum === 1 ? 0 : stepNum === 2 ? 50 : 100;
  if (line) line.style.width = widthPercentage + "%";
}

// Phone input formatter
var phoneInput = document.getElementById('newCustPhone');
if (phoneInput) {
  phoneInput.addEventListener('input', function(e) {
    var v = e.target.value.replace(/\D/g, '');
    if (v.startsWith('62')) v = v.substring(2);
    if (v.startsWith('0')) v = v.substring(1);
    
    var match = v.match(/(\d{0,3})(\d{0,4})(\d{0,5})/);
    if (match) {
      var formatted = !match[2] ? match[1] : match[1] + ' ' + match[2] + (match[3] ? ' ' + match[3] : '');
      e.target.value = formatted.substring(0, 15);
    } else {
      e.target.value = v;
    }
  });
}

// Form validation
function showError(fieldId, errorId, message) {
  var f = document.getElementById(fieldId);
  var e = document.getElementById(errorId);
  if (f) {
    f.classList.add('form-field-error');
    f.classList.remove('field-valid');
  }
  if (e) {
    if (message) {
      var s = e.querySelector('span');
      if (s) s.textContent = message;
    }
    e.classList.add('show');
  }
}

function clearError(fieldId, errorId) {
  var f = document.getElementById(fieldId);
  var e = document.getElementById(errorId);
  if (f) {
    f.classList.remove('form-field-error');
    f.classList.add('field-valid');
  }
  if (e) e.classList.remove('show');
}

function validateCheckoutForm() {
  var isValid = true;
  
  var name = document.getElementById('newCustName');
  if (name && name.value.trim().length >= 2) {
    clearError('newCustName', 'newErrName');
  } else {
    if (name && name.value.trim().length > 0) showError('newCustName', 'newErrName', 'Minimal 2 karakter');
    isValid = false;
  }
  
  var phone = document.getElementById('newCustPhone');
  var phoneClean = phone ? phone.value.replace(/\D/g, '') : '';
  if (phoneClean && /^8[1-9]\d{6,11}$/.test(phoneClean)) {
    clearError('newCustPhone', 'newErrPhone');
  } else {
    if (phoneClean) showError('newCustPhone', 'newErrPhone', 'Nomor tidak valid');
    isValid = false;
  }
  
  var alamat = document.getElementById('newAlamat');
  if (alamat && alamat.value.trim().length >= 20) {
    clearError('newAlamat', 'newErrAlamat');
  } else {
    if (alamat && alamat.value.trim().length > 0) showError('newAlamat', 'newErrAlamat', 'Minimal 20 karakter');
    isValid = false;
  }
  
  var reqFields = ['newProvinsi', 'newKota', 'newKecamatan', 'newKelurahan', 'newKodePos', 'newEkspedisi', 'newMetode', 'newAdmin'];
  reqFields.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el || !el.value.trim()) isValid = false;
  });
  
  var btn = document.getElementById('finalCheckoutBtn');
  if (btn) {
    if (isValid) {
      btn.removeAttribute('disabled');
    } else {
      btn.setAttribute('disabled', 'true');
    }
  }
  
  return isValid;
}

// Submit Order
window.submitOrder = function() {
  if (!validateCheckoutForm()) {
    showToast('Lengkapi formulir dengan benar', 'error');
    return;
  }
  
  var fName = document.getElementById('newCustName');
  var fPhone = document.getElementById('newCustPhone');
  var fProvinsi = document.getElementById('newProvinsi');
  var fKota = document.getElementById('newKota');
  var fKec = document.getElementById('newKecamatan');
  var fKel = document.getElementById('newKelurahan');
  var fPos = document.getElementById('newKodePos');
  var fAlamat = document.getElementById('newAlamat');
  var fPatokan = document.getElementById('newPatokan');
  var fEkspedisi = document.getElementById('newEkspedisi');
  var fMetode = document.getElementById('newMetode');
  var fAdmin = document.getElementById('newAdmin');
  
  var btn = document.getElementById('finalCheckoutBtn');
  var btnText = document.getElementById('finalBtnText');
  var btnIcon = document.getElementById('finalBtnIcon');
  
  btn.classList.add('checkout-btn-loading');
  btnText.textContent = 'Memproses...';
  btnIcon.style.display = 'none';
  
  setTimeout(function() {
    btn.classList.remove('checkout-btn-loading');
    btn.classList.add('checkout-success');
    btnText.textContent = 'Membuka WhatsApp...';
    btnIcon.className = 'fa-solid fa-check text-lg';
    btnIcon.style.display = '';
    
    var phoneClean = fPhone.value.replace(/\D/g, '');
    var waNumber = fAdmin.value;
    var total = cart.reduce(function(s, i) { return s + i.qty; }, 0);
    var r2Items = cart.filter(function(i) { return i.category === 'r2'; });
    var resmiItems = cart.filter(function(i) { return i.category === 'resmi'; });
    
    var fullAddress = fAlamat.value.trim() + ' (Patokan: ' + (fPatokan.value.trim() || '-') + ')\n' +
      'Kel: ' + fKel.value.trim() + ', Kec: ' + fKec.value.trim() + '\n' +
      fKota.value.trim() + ', ' + fProvinsi.value.trim() + ' - ' + fPos.value.trim();
    
    var m = '📝*ORDER R2 NUSANTARA(ENTERPRISE)*\n\n';
    m += '*Nama:* ' + fName.value.trim() + '\n';
    m += '📱*No. HP:* +62 ' + fPhone.value.trim() + '\n';
    m += '*Alamat Pengiriman:*\n' + fullAddress + '\n\n';
    m += '🚚*Ekspedisi:* ' + fEkspedisi.value + '\n';
    m += '💳*Pembayaran:* ' + fMetode.value + '\n\n';
    
    if (r2Items.length > 0) {
      m += '*🔥 KATALOG R2:*\n';
      r2Items.forEach(function(i) { m += '• ' + i.name + ' — ' + i.qty + ' slop\n'; });
      m += '\n';
    }
    
    if (resmiItems.length > 0) {
      m += '*🏅 KATALOG RESMI:*\n';
      resmiItems.forEach(function(i) { m += '• ' + i.name + ' — ' + i.qty + ' slop\n'; });
      m += '\n';
    }
    
    m += '*Total Order:* ' + total + ' Slop\n';
    m += '*Status Ongkir:* ' + (total >= 20 ? '✅ Gratis Ongkir' : 'Reguler');
    
    setTimeout(function() {
      window.open('https://wa.me/' + waNumber + '?text=' + encodeURIComponent(m), '_blank');
      cart = [];
      window.__cart = cart;
      updateCartUI();
      closeCheckoutModal();
      document.getElementById('checkoutFormFull').reset();
      btn.classList.remove('checkout-success');
      btnText.textContent = 'Konfirmasi Pesanan';
      btnIcon.className = 'fa-brands fa-whatsapp text-lg';
      validateCheckoutForm();
      showToast('Pesanan berhasil dilanjutkan! 🎉');
    }, 800);
  }, 1500);
};

// Testimonial Slider
var slider = document.getElementById('testimonialSlider');
var prevBtn = document.getElementById('sliderPrevBtn');
var nextBtn = document.getElementById('sliderNextBtn');

if (slider && prevBtn && nextBtn) {
  var isDown = false;
  var startX;
  var scrollLeft;
  
  slider.addEventListener('mousedown', function(e) {
    isDown = true;
    slider.style.scrollSnapType = 'none';
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  
  slider.addEventListener('mouseleave', function() {
    isDown = false;
    slider.style.scrollSnapType = 'x mandatory';
  });
  
  slider.addEventListener('mouseup', function() {
    isDown = false;
    slider.style.scrollSnapType = 'x mandatory';
  });
  
  slider.addEventListener('mousemove', function(e) {
    if (!isDown) return;
    e.preventDefault();
    var x = e.pageX - slider.offsetLeft;
    var walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });
  
  var scrollAmount = 0;
  
  function getScrollAmount() {
    var card = slider.querySelector('.testimonial-card-slide');
    return card ? card.offsetWidth + 24 : 350;
  }
  
  nextBtn.addEventListener('click', function() {
    slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });
  
  prevBtn.addEventListener('click', function() {
    slider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });
  
  var autoSlide = setInterval(function() {
    if (!isDown) {
      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      }
    }
  }, 4000);
  
  slider.addEventListener('mouseenter', function() { clearInterval(autoSlide); });
}

// Review Modal
window.openReviewModal = function() {
  var o = document.getElementById('reviewModalOverlay');
  var m = document.getElementById('reviewModal');
  if (o) o.classList.add('overlay-enter');
  if (m) m.classList.add('modal-enter');
  document.body.style.overflow = 'hidden';
};

window.closeReviewModal = function() {
  var o = document.getElementById('reviewModalOverlay');
  var m = document.getElementById('reviewModal');
  if (o) o.classList.remove('overlay-enter');
  if (m) m.classList.remove('modal-enter');
  document.body.style.overflow = '';
  setTimeout(function() {
    document.getElementById('reviewForm').reset();
    setRating(5);
  }, 300);
};

window.setRating = function(val) {
  document.getElementById('reviewRating').value = val;
  var stars = document.querySelectorAll('#starRatingSelector i');
  stars.forEach(function(s) {
    if (parseInt(s.getAttribute('data-rating')) <= val) {
      s.classList.add('text-amber-400');
      s.classList.remove('text-slate-200');
    } else {
      s.classList.remove('text-amber-400');
      s.classList.add('text-slate-200');
    }
  });
};

window.submitReview = function() {
  var btn = document.getElementById('submitReviewBtn');
  var name = document.getElementById('reviewName').value;
  var store = document.getElementById('reviewStore').value;
  var text = document.getElementById('reviewText').value;
  var rating = document.getElementById('reviewRating').value;
  
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
  btn.classList.add('opacity-80', 'pointer-events-none');
  
  setTimeout(function() {
    var starsHtml = '';
    for (var i = 0; i < 5; i++) {
      starsHtml += i < rating ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-solid fa-star text-slate-200"></i>';
    }
    
    var initial = name.charAt(0).toUpperCase();
    var newCard = document.createElement('div');
    newCard.className = 'testimonial-card-slide bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative flex flex-col justify-between';
    newCard.innerHTML = '<div><div class="flex items-center gap-4 mb-5"><div class="w-14 h-14 rounded-full avatar-gradient-9 shrink-0"><span class="avatar-initial">' + initial + '</span></div><div><h4 class="font-extrabold text-brand-900 text-base">' + escapeHtml(name) + '</h4><p class="text-xs text-slate-500 font-medium">' + escapeHtml(store) + '</p></div></div><div class="flex gap-0.5 mb-4 text-amber-400 text-sm">' + starsHtml + '</div><p class="text-slate-600 text-sm leading-relaxed">"' + escapeHtml(text) + '"</p></div><div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400"><span><i class="fa-solid fa-calendar-days mr-1"></i> Baru saja</span><span class="text-slate-400 font-bold"><i class="fa-solid fa-clock"></i> Pending Review</span></div>';
    
    if (slider) {
      slider.insertBefore(newCard, slider.firstChild);
      slider.scrollTo({ left: 0, behavior: 'smooth' });
    }
    
    showToast('Terima kasih! Ulasan Anda berhasil dikirim.');
    closeReviewModal();
    btn.innerHTML = 'Kirim Ulasan';
    btn.classList.remove('opacity-80', 'pointer-events-none');
  }, 1000);
};

// Newsletter
window.handleNewsletterSubmit = function(form) {
  var input = form.querySelector('input[type="email"]');
  if (input && input.value) {
    showToast('Terima kasih! Anda telah berlangganan newsletter.');
    input.value = '';
  }
};

// Initialization
document.addEventListener('DOMContentLoaded', function() {
  var loader = document.getElementById('loader');
  if (loader) {
    if (window.__clearLoader) window.__clearLoader();
    loader.style.opacity = '0';
    setTimeout(function() { loader.style.display = 'none'; }, 700);
  }
  
  buildFilterChips();
  updateCatalogInfoBanner();
  renderProductDisplay();
  
  var countR2 = document.getElementById('countR2');
  var countResmi = document.getElementById('countResmi');
  var totalCount = document.getElementById('totalBrandCount');
  
  if (countR2) countR2.textContent = productsR2.length;
  if (countResmi) countResmi.textContent = productsResmi.length;
  if (totalCount) totalCount.textContent = allProducts.length;
  
  // Intersection Observer for fade animations
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(en) {
      if (en.isIntersecting) en.target.classList.add('is-visible');
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.fade-on-scroll').forEach(function(el) {
    obs.observe(el);
  });
  
  // Scroll handlers
  window.addEventListener('scroll', function() {
    var h = document.getElementById('headerInner');
    var btt = document.getElementById('backToTop');
    
    if (h) {
      if (window.scrollY > 50) {
        h.classList.add('py-2', 'shadow-lg');
        h.classList.remove('py-3');
      } else {
        h.classList.add('py-3');
        h.classList.remove('py-2', 'shadow-lg');
      }
    }
    
    if (btt) {
      if (window.scrollY > 500) btt.classList.add('visible');
      else btt.classList.remove('visible');
    }
  });
  
  // Search input
  var searchInput = document.getElementById('searchInput');
  if (searchInput) {
    var searchTimer;
    searchInput.addEventListener('input', function(e) {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function() {
        searchTerm = e.target.value;
        currentPage = 1;
        renderProductDisplay();
      }, 200);
    });
  }
  
  validateCheckoutForm();
});
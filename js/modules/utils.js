// Utilitas Umum
export function formatRupiah(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);
}

export function getR2Tier(price) {
  if (price <= 76000) return 'hemat';
  if (price >= 90000) return 'premium';
  return 'populer';
}

export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const iconClass =
    type === 'success'
      ? 'fa-check-circle text-emerald-400'
      : type === 'error'
      ? 'fa-circle-exclamation text-red-400'
      : 'fa-circle-info text-brand-400';

  toast.className =
    'bg-brand-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 transform translate-x-full transition-transform duration-300 border border-white/10';
  toast.innerHTML =
    `<i class="fa-solid ${iconClass}"></i><span class="font-bold text-xs">${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => toast.classList.remove('translate-x-full'), 10);
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
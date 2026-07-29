const CACHE_NAME = 'r2-nusantara-v2';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/logo-r2.webp',
  './assets/hero-r2.webp',
  './assets/watermark-r2.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

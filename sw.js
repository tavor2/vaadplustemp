const CACHE_NAME = 'vaad-bait-plus-v1';
const ASSETS = [
  '/vaadplustemp/',
  '/vaadplustemp/index.html',
  '/vaadplustemp/manifest.json',
  '/vaadplustemp/icon-192.png',
  '/vaadplustemp/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Firebase requests — always network
  if (e.request.url.includes('firestore') || e.request.url.includes('firebase')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

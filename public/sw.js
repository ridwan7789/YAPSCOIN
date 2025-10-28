// public/sw.js

const CACHE_NAME = 'app-v1';
const DYNAMIC_CACHE_NAME = 'dynamic-v1';
const STATIC_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'favicon.ico',
  // Assets akan ditambahkan secara dinamis dalam build process
];

// Event install - caching aset statis
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Event activate - membersihkan cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Event fetch - strategi cache-first untuk aset statis, network-first untuk API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Jika request adalah untuk aset statis (CSS, JS, gambar)
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request)
            .then((networkResponse) => {
              return caches.open(DYNAMIC_CACHE_NAME)
                .then((cache) => {
                  // Hanya cache response yang sukses
                  if (networkResponse && networkResponse.status === 200) {
                    cache.put(request, networkResponse.clone());
                  }
                  return networkResponse;
                });
            });
        })
    );
  } else {
    // Untuk API dan sumber daya lainnya, gunakan network-first
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Jika network request berhasil, simpan di cache dinamis
          if (networkResponse && networkResponse.status === 200) {
            return caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(request, networkResponse.clone());
                return networkResponse;
              });
          }
          return networkResponse;
        })
        .catch(() => {
          // Jika network gagal, coba dari cache
          return caches.match(request);
        })
    );
  }
});

// Fungsi helper untuk menentukan apakah URL adalah aset statis
function isStaticAsset(url) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}
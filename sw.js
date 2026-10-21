// Service Worker for Chennai AC Local Train Tracker (v24.0 Live GPS & Serverless NTES Live)
// Strategy: Network-First with Cache Fallback & Instant Auto-Purge of Old Caches
const CACHE_NAME = 'cgl-ms-tracker-v24-gps-live';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css?v=24.0',
  './threeui-engine.js?v=24.0',
  './app.js?v=24.0',
  './data/trains.js?v=24.0',
  './audio/chime.js?v=24.0',
  './icon.jpg',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Purging old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First: Always try network to get freshest data and code
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request, { cache: 'no-cache' })
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache if offline (ignoring query strings)
        return caches.match(event.request, { ignoreSearch: true });
      })
  );
});

// Background push notification handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});

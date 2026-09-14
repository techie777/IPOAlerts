// Firebase Cloud Messaging & Progressive Web App Service Worker
// Placed at /public/firebase-messaging-sw.js so it is served at domain root with scope '/'

importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Parse query params if provided during registration (/firebase-messaging-sw.js?apiKey=...&projectId=...)
var urlParams = new URLSearchParams(self.location.search);

var firebaseConfig = {
  apiKey: urlParams.get('apiKey') || 'AIzaSyBMSfpQrEIkzzcUh2FJiGOLAWa0bu7jgD8',
  authDomain: urlParams.get('authDomain') || 'ipoalerts-bef3d.firebaseapp.com',
  projectId: urlParams.get('projectId') || 'ipoalerts-bef3d',
  storageBucket: urlParams.get('storageBucket') || 'ipoalerts-bef3d.firebasestorage.app',
  messagingSenderId: urlParams.get('messagingSenderId') || '283694036955',
  appId: urlParams.get('appId') || '1:283694036955:web:dc28877b199196a28cd9fe',
};

// Initialize Firebase in Service Worker context if valid config exists
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY') {
  try {
    firebase.initializeApp(firebaseConfig);
    var messaging = firebase.messaging();

    // Background push message listener
    messaging.onBackgroundMessage(function (payload) {
      console.log('[firebase-messaging-sw.js] Background message received:', payload);

      var notificationTitle =
        payload.notification?.title || payload.data?.title || '🔔 IPO Alert';
      var notificationOptions = {
        body: payload.notification?.body || payload.data?.body || 'New IPO update available.',
        icon: payload.notification?.icon || payload.data?.icon || '/icons/icon-192x192.png',
        badge: payload.notification?.badge || '/icons/badge-72x72.png',
        tag: payload.data?.tag || ('ipo-alert-' + Date.now()),
        renotify: true,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        data: {
          url: payload.data?.url || payload.notification?.click_action || '/',
          timestamp: Date.now(),
        },
      };

      return self.registration.showNotification(notificationTitle, notificationOptions);
    });
  } catch (err) {
    console.warn('[firebase-messaging-sw.js] Firebase init skipped or failed:', err);
  }
}

// Notification Click Handler: Open or focus application window
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var destinationUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (windowClients) {
      // Check if there is already an open window
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          if ('navigate' in client && destinationUrl !== '/') {
            client.navigate(destinationUrl);
          }
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(destinationUrl);
      }
    })
  );
});

// ============================================================================
// PWA Service Worker Lifecycle & Offline Caching
// Satisfies Progressive Web App installability criteria across all browsers
// ============================================================================
var PWA_CACHE_NAME = 'ipoalerts-pwa-v1';
var PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/badge-72x72.png',
  '/logo.png',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches
      .open(PWA_CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(function () {
        return self.skipWaiting();
      })
      .catch(function (err) {
        console.warn('[PWA-SW] Precaching skipped:', err);
      })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheName !== PWA_CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', function (event) {
  // Skip non-GET requests or Firebase/API calls from caching
  if (event.request.method !== 'GET') return;
  var requestUrl = new URL(event.request.url);

  // Exclude API routes and Firebase endpoints
  if (
    requestUrl.pathname.startsWith('/api/') ||
    requestUrl.hostname.includes('googleapis.com') ||
    requestUrl.hostname.includes('gstatic.com')
  ) {
    return;
  }

  // Handle navigation requests (Network first, fall back to cached shell)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(function () {
        return caches.match('/') || caches.match(event.request);
      })
    );
    return;
  }

  // Static assets: Cache first, then network
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(function (networkResponse) {
        // Cache icons and logos
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (requestUrl.pathname.startsWith('/icons/') || requestUrl.pathname.endsWith('.png'))
        ) {
          var responseClone = networkResponse.clone();
          caches.open(PWA_CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      });
    })
  );
});

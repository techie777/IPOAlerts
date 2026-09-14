// Firebase Cloud Messaging Service Worker
// Placed at /public/firebase-messaging-sw.js so it is served at the domain root

importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Parse query params if provided during registration (/firebase-messaging-sw.js?apiKey=...&projectId=...)
// This allows dynamic runtime configuration directly from NEXT_PUBLIC_FIREBASE_* variables!
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
        icon: payload.notification?.icon || payload.data?.icon || '/favicon.ico',
        badge: '/favicon.ico',
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
      // Check if there is already a window open with the app
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

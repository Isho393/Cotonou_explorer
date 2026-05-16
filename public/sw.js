// Service Worker pour Cotonou Explorer
// Version 1.0.0

const CACHE_NAME = 'cotonou-explorer-v1';
const RUNTIME_CACHE = 'cotonou-runtime-v1';

// Ressources à mettre en cache lors de l'installation
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Mise en cache des ressources essentielles');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Supprimer les anciens caches
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie de cache pour les requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Ignorer les requêtes vers Supabase (toujours en ligne)
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ 
            error: 'Vous êtes hors ligne. Cette fonctionnalité nécessite une connexion internet.' 
          }),
          { 
            headers: { 'Content-Type': 'application/json' },
            status: 503
          }
        );
      })
    );
    return;
  }

  // Stratégie: Cache First pour les ressources statiques
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    request.destination === 'image'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          // Ne pas mettre en cache les réponses non-OK
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Cloner la réponse
          const responseToCache = response.clone();

          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        });
      })
    );
    return;
  }

  // Stratégie: Network First pour les pages HTML
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Mettre en cache la réponse
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Si hors ligne, retourner la version en cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Retourner la page d'accueil en cache
            return caches.match('/');
          });
        })
    );
    return;
  }

  // Pour tout le reste: Network First, puis Cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      })
    );
  }
});

// Synchronisation en arrière-plan (optionnel)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

async function syncFavorites() {
  // Logique de synchronisation des favoris
  console.log('[SW] Synchronisation des favoris...');
  // À implémenter si nécessaire
}

// Notification de mise à jour disponible
self.addEventListener('controllerchange', () => {
  console.log('[SW] Nouvelle version disponible');
});

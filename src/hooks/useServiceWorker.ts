import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isInstalled: boolean;
  isUpdateAvailable: boolean;
  isOffline: boolean;
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isInstalled: false,
    isUpdateAvailable: false,
    isOffline: !navigator.onLine,
  });

  useEffect(() => {
    if (!state.isSupported) {
      console.log('[PWA] Service Worker non supporté');
      return;
    }

    // Enregistrer le Service Worker
    registerServiceWorker();

    // Écouter les changements de connexion
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOffline: false }));
      console.log('[PWA] Connexion rétablie');
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOffline: true }));
      console.log('[PWA] Hors ligne');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [state.isSupported]);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('[PWA] Service Worker enregistré:', registration.scope);

      setState(prev => ({ ...prev, isInstalled: true }));

      // Vérifier les mises à jour
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nouvelle version disponible
              setState(prev => ({ ...prev, isUpdateAvailable: true }));
              console.log('[PWA] Mise à jour disponible');
            }
          });
        }
      });

      // Vérifier les mises à jour périodiquement
      setInterval(() => {
        registration.update();
      }, 60000); // Toutes les minutes

    } catch (error) {
      console.error('[PWA] Erreur enregistrement Service Worker:', error);
    }
  };

  const updateServiceWorker = () => {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    });
  };

  const clearCache = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.active) {
        const messageChannel = new MessageChannel();
        
        return new Promise((resolve) => {
          messageChannel.port1.onmessage = (event) => {
            resolve(event.data.success);
          };
          
          registration.active.postMessage(
            { type: 'CLEAR_CACHE' },
            [messageChannel.port2]
          );
        });
      }
    } catch (error) {
      console.error('[PWA] Erreur suppression cache:', error);
      return false;
    }
  };

  return {
    ...state,
    updateServiceWorker,
    clearCache,
  };
}

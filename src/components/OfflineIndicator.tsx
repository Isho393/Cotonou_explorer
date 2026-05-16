import { useTranslation } from 'react-i18next';
import { WifiOff, Wifi } from 'lucide-react';
import { useServiceWorker } from '../hooks/useServiceWorker';

export default function OfflineIndicator() {
  const { t } = useTranslation();
  const { isOffline } = useServiceWorker();

  if (!isOffline) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="glass rounded-full px-4 py-2 border border-orange-900/30 bg-orange-900/20 shadow-lg">
        <div className="flex items-center gap-2">
          <WifiOff size={16} className="text-orange-400" />
          <span className="text-orange-300 text-sm font-medium">
            {t('pwa.offline')}
          </span>
        </div>
      </div>
    </div>
  );
}

export function OnlineIndicator() {
  const { t } = useTranslation();
  const { isOffline } = useServiceWorker();
  const [showOnline, setShowOnline] = React.useState(false);

  React.useEffect(() => {
    if (!isOffline && showOnline) {
      // Afficher pendant 3 secondes puis masquer
      const timer = setTimeout(() => {
        setShowOnline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    
    if (!isOffline) {
      setShowOnline(true);
    }
  }, [isOffline]);

  if (isOffline || !showOnline) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="glass rounded-full px-4 py-2 border border-green-900/30 bg-green-900/20 shadow-lg">
        <div className="flex items-center gap-2">
          <Wifi size={16} className="text-green-400" />
          <span className="text-green-300 text-sm font-medium">
            {t('pwa.online')}
          </span>
        </div>
      </div>
    </div>
  );
}

// Fix: Import React
import * as React from 'react';

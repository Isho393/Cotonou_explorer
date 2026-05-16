import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Empêcher le prompt automatique
      e.preventDefault();
      
      // Sauvegarder l'événement pour l'utiliser plus tard
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Vérifier si l'utilisateur a déjà refusé
      const hasDeclined = localStorage.getItem('pwa_install_declined');
      if (!hasDeclined) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Vérifier si déjà installé
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('[PWA] Application déjà installée');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Afficher le prompt d'installation
    deferredPrompt.prompt();

    // Attendre la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`[PWA] Installation ${outcome}`);

    if (outcome === 'accepted') {
      console.log('[PWA] Application installée');
    } else {
      // Sauvegarder le refus (ne pas redemander pendant 7 jours)
      localStorage.setItem('pwa_install_declined', Date.now().toString());
    }

    // Réinitialiser
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Ne pas redemander pendant 7 jours
    localStorage.setItem('pwa_install_declined', Date.now().toString());
  };

  // Vérifier si le délai de 7 jours est passé
  useEffect(() => {
    const declined = localStorage.getItem('pwa_install_declined');
    if (declined) {
      const declinedDate = parseInt(declined);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      
      if (Date.now() - declinedDate > sevenDays) {
        localStorage.removeItem('pwa_install_declined');
      }
    }
  }, []);

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-fade-in-up">
      <div className="glass rounded-2xl p-5 border border-amber-900/30 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-800/50 flex items-center justify-center">
            <Download size={20} className="text-amber-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm mb-1">
              {t('pwa.installTitle')}
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              {t('pwa.installDesc')}
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-medium transition-all"
                style={{ background: 'linear-gradient(135deg, #d4af37, #c9922a)', color: '#07070f' }}
              >
                {t('pwa.install')}
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                {t('pwa.later')}
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

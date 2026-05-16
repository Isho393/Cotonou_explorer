import { useTranslation } from 'react-i18next';
import { X, Volume2, Gauge, Mic } from 'lucide-react';
import type { SpeechSettings } from '../utils/speech';

interface AudioSettingsProps {
  settings: SpeechSettings;
  voices: SpeechSynthesisVoice[];
  onSettingsChange: (settings: Partial<SpeechSettings>) => void;
  onClose: () => void;
}

export default function AudioSettings({
  settings,
  voices,
  onSettingsChange,
  onClose,
}: AudioSettingsProps) {
  const { t } = useTranslation();

  // Filtrer les voix pour la langue actuelle
  const langPrefix = settings.lang.split('-')[0];
  const availableVoices = voices.filter(v => v.lang.startsWith(langPrefix));

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ rate: parseFloat(e.target.value) });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ volume: parseFloat(e.target.value) });
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({ voice: e.target.value });
  };

  return (
    <div className="fixed top-20 right-4 w-80 max-w-[calc(100vw-2rem)] z-50 animate-fade-in">
      <div className="glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <Volume2 size={16} className="text-amber-400" />
            {t('audio.settings')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-5">
          {/* Voix */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-2">
              <Mic size={12} />
              {t('audio.voice')}
            </label>
            <select
              value={settings.voice}
              onChange={handleVoiceChange}
              className="w-full px-3 py-2 rounded-xl glass border border-white/10 text-white text-sm bg-transparent focus:outline-none focus:border-amber-800/50"
            >
              <option value="" className="bg-gray-900">
                {t('audio.defaultVoice')}
              </option>
              {availableVoices.map(voice => (
                <option key={voice.name} value={voice.name} className="bg-gray-900">
                  {voice.name} {voice.localService ? '(Local)' : ''}
                </option>
              ))}
            </select>
            {availableVoices.length === 0 && (
              <p className="text-xs text-gray-600 mt-1">
                {t('audio.noVoicesAvailable')}
              </p>
            )}
          </div>

          {/* Vitesse */}
          <div>
            <label className="flex items-center justify-between text-xs font-medium text-gray-400 mb-2">
              <span className="flex items-center gap-2">
                <Gauge size={12} />
                {t('audio.speed')}
              </span>
              <span className="text-white">{settings.rate.toFixed(1)}x</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.rate}
              onChange={handleRateChange}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${((settings.rate - 0.5) / 1.5) * 100}%, rgba(255,255,255,0.1) ${((settings.rate - 0.5) / 1.5) * 100}%, rgba(255,255,255,0.1) 100%)`,
              }}
            />
            <div className="flex justify-between text-[10px] text-gray-600 mt-1">
              <span>0.5x</span>
              <span>1.0x</span>
              <span>1.5x</span>
              <span>2.0x</span>
            </div>
          </div>

          {/* Volume */}
          <div>
            <label className="flex items-center justify-between text-xs font-medium text-gray-400 mb-2">
              <span className="flex items-center gap-2">
                <Volume2 size={12} />
                {t('audio.volume')}
              </span>
              <span className="text-white">{Math.round(settings.volume * 100)}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={handleVolumeChange}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${settings.volume * 100}%, rgba(255,255,255,0.1) ${settings.volume * 100}%, rgba(255,255,255,0.1) 100%)`,
              }}
            />
            <div className="flex justify-between text-[10px] text-gray-600 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 rounded-xl bg-blue-900/20 border border-blue-800/30">
            <p className="text-xs text-blue-400 leading-relaxed">
              {t('audio.settingsInfo')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

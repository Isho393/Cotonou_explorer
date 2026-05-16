import { useTranslation } from 'react-i18next';
import { Play, Pause, Square, Settings } from 'lucide-react';

interface AudioControlsProps {
  isSpeaking: boolean;
  isPaused: boolean;
  hasResults: boolean;
  onPlayAll: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onOpenSettings: () => void;
}

export default function AudioControls({
  isSpeaking,
  isPaused,
  hasResults,
  onPlayAll,
  onPause,
  onResume,
  onStop,
  onOpenSettings,
}: AudioControlsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      {/* Play All / Resume */}
      {!isSpeaking || isPaused ? (
        <button
          onClick={isPaused ? onResume : onPlayAll}
          disabled={!hasResults}
          className="flex items-center justify-center w-9 h-9 rounded-xl glass border border-white/10 transition-all hover:border-amber-800/30 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label={isPaused ? t('audio.resume') : t('audio.playAll')}
          title={isPaused ? t('audio.resume') : t('audio.playAll')}
        >
          <Play size={16} className="text-amber-400" />
        </button>
      ) : null}

      {/* Pause */}
      {isSpeaking && !isPaused ? (
        <button
          onClick={onPause}
          className="flex items-center justify-center w-9 h-9 rounded-xl glass border border-white/10 transition-all hover:border-amber-800/30 hover:bg-white/5"
          aria-label={t('audio.pause')}
          title={t('audio.pause')}
        >
          <Pause size={16} className="text-amber-400" />
        </button>
      ) : null}

      {/* Stop */}
      {isSpeaking ? (
        <button
          onClick={onStop}
          className="flex items-center justify-center w-9 h-9 rounded-xl glass border border-white/10 transition-all hover:border-red-800/30 hover:bg-white/5"
          aria-label={t('audio.stop')}
          title={t('audio.stop')}
        >
          <Square size={16} className="text-red-400" />
        </button>
      ) : null}

      {/* Settings */}
      <button
        onClick={onOpenSettings}
        className="flex items-center justify-center w-9 h-9 rounded-xl glass border border-white/10 transition-all hover:border-amber-800/30 hover:bg-white/5"
        aria-label={t('audio.settings')}
        title={t('audio.settings')}
      >
        <Settings size={16} className="text-gray-400" />
      </button>
    </div>
  );
}

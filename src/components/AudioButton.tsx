import { Volume2, VolumeX } from 'lucide-react';
import type { Place } from '../types';

interface AudioButtonProps {
  place: Place;
  index: number;
  isSpeaking: boolean;
  isCurrentPlace: boolean;
  onSpeak: (place: Place, index: number) => void;
  onStop: () => void;
}

export default function AudioButton({
  place,
  index,
  isSpeaking,
  isCurrentPlace,
  onSpeak,
  onStop,
}: AudioButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isCurrentPlace && isSpeaking) {
      onStop();
    } else {
      onSpeak(place, index);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-9 h-9 rounded-xl backdrop-blur-md flex items-center justify-center transition-all ${
        isCurrentPlace && isSpeaking
          ? 'bg-amber-500/90 hover:bg-amber-600 animate-pulse-glow'
          : 'bg-black/40 hover:bg-black/60'
      }`}
      aria-label={isCurrentPlace && isSpeaking ? 'Arrêter la lecture' : 'Lire à voix haute'}
      title={isCurrentPlace && isSpeaking ? 'Arrêter la lecture' : 'Lire à voix haute'}
    >
      {isCurrentPlace && isSpeaking ? (
        <VolumeX size={16} className="text-white" />
      ) : (
        <Volume2 size={16} className="text-white" />
      )}
    </button>
  );
}

import type { Place } from '../types';

export interface SpeechSettings {
  rate: number;      // Vitesse (0.5 - 2.0)
  pitch: number;     // Tonalité (0.0 - 2.0)
  volume: number;    // Volume (0.0 - 1.0)
  voice: string;     // ID de la voix
  lang: string;      // Langue (fr-FR, en-US)
}

export const DEFAULT_SPEECH_SETTINGS: SpeechSettings = {
  rate: 1.0,
  pitch: 1.0,
  volume: 0.8,
  voice: '',
  lang: 'fr-FR',
};

export const SETTINGS_KEY = 'cotonou_explorer_speech_settings';

// Vérifier si le navigateur supporte le TTS
export const isSpeechSupported = (): boolean => {
  return 'speechSynthesis' in window;
};

// Obtenir toutes les voix disponibles
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (!isSpeechSupported()) return [];
  return window.speechSynthesis.getVoices();
};

// Obtenir les voix pour une langue spécifique
export const getVoicesForLang = (lang: string): SpeechSynthesisVoice[] => {
  const voices = getAvailableVoices();
  return voices.filter(voice => voice.lang.startsWith(lang.split('-')[0]));
};

// Obtenir la meilleure voix pour une langue
export const getBestVoiceForLang = (lang: string): SpeechSynthesisVoice | null => {
  const voices = getVoicesForLang(lang);
  if (voices.length === 0) return null;
  
  // Préférer les voix locales
  const localVoice = voices.find(v => v.localService);
  if (localVoice) return localVoice;
  
  // Sinon prendre la première
  return voices[0];
};

// Générer le texte à lire pour un lieu
export const generatePlaceText = (place: Place, lang: string): string => {
  const isFrench = lang.startsWith('fr');
  
  const parts: string[] = [];
  
  // Nom
  parts.push(place.name);
  
  // Catégorie
  if (isFrench) {
    parts.push(`Catégorie: ${place.category}`);
  } else {
    parts.push(`Category: ${place.category}`);
  }
  
  // Note
  if (isFrench) {
    parts.push(`Note: ${place.rating.toFixed(1)} étoiles sur 5`);
  } else {
    parts.push(`Rating: ${place.rating.toFixed(1)} stars out of 5`);
  }
  
  // Description
  if (place.description) {
    if (isFrench) {
      parts.push(`Description: ${place.description}`);
    } else {
      parts.push(`Description: ${place.description}`);
    }
  }
  
  // Adresse
  if (place.address) {
    if (isFrench) {
      parts.push(`Adresse: ${place.address}`);
    } else {
      parts.push(`Address: ${place.address}`);
    }
  }
  
  // Téléphone
  if (place.phone) {
    if (isFrench) {
      parts.push(`Téléphone: ${place.phone}`);
    } else {
      parts.push(`Phone: ${place.phone}`);
    }
  }
  
  // Horaires
  if (place.hours) {
    if (isFrench) {
      parts.push(`Horaires: ${place.hours}`);
    } else {
      parts.push(`Hours: ${place.hours}`);
    }
  }
  
  // Distance
  if (place.distance !== undefined) {
    if (isFrench) {
      parts.push(`Distance: ${place.distance.toFixed(1)} kilomètres`);
    } else {
      parts.push(`Distance: ${place.distance.toFixed(1)} kilometers`);
    }
  }
  
  return parts.join('. ') + '.';
};

// Générer le texte d'introduction pour la lecture globale
export const generateIntroText = (count: number, lang: string): string => {
  const isFrench = lang.startsWith('fr');
  
  if (isFrench) {
    return count === 1
      ? `1 résultat trouvé.`
      : `${count} résultats trouvés.`;
  } else {
    return count === 1
      ? `1 result found.`
      : `${count} results found.`;
  }
};

// Générer le texte de numérotation pour la lecture globale
export const generatePlaceNumberText = (index: number, lang: string): string => {
  const isFrench = lang.startsWith('fr');
  
  if (isFrench) {
    return `Résultat ${index + 1}.`;
  } else {
    return `Result ${index + 1}.`;
  }
};

// Charger les paramètres depuis localStorage
export const loadSpeechSettings = (): SpeechSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SPEECH_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres audio:', error);
  }
  return DEFAULT_SPEECH_SETTINGS;
};

// Sauvegarder les paramètres dans localStorage
export const saveSpeechSettings = (settings: SpeechSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres audio:', error);
  }
};

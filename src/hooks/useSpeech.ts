import { useState, useEffect, useCallback, useRef } from 'react';
import type { Place } from '../types';
import {
  isSpeechSupported,
  getAvailableVoices,
  getBestVoiceForLang,
  generatePlaceText,
  generateIntroText,
  generatePlaceNumberText,
  loadSpeechSettings,
  saveSpeechSettings,
  type SpeechSettings,
  DEFAULT_SPEECH_SETTINGS,
} from '../utils/speech';

export function useSpeech(lang: string = 'fr-FR') {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState<number | null>(null);
  const [settings, setSettings] = useState<SpeechSettings>(DEFAULT_SPEECH_SETTINGS);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const queueRef = useRef<Place[]>([]);

  // Initialisation
  useEffect(() => {
    const supported = isSpeechSupported();
    setIsSupported(supported);

    if (supported) {
      // Charger les paramètres
      const savedSettings = loadSpeechSettings();
      setSettings({ ...savedSettings, lang });

      // Charger les voix
      const loadVoices = () => {
        const availableVoices = getAvailableVoices();
        setVoices(availableVoices);
      };

      loadVoices();

      // Les voix peuvent se charger de manière asynchrone
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (supported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [lang]);

  // Mettre à jour la langue dans les paramètres
  useEffect(() => {
    setSettings(prev => ({ ...prev, lang }));
  }, [lang]);

  // Créer une utterance avec les paramètres actuels
  const createUtterance = useCallback((text: string): SpeechSynthesisUtterance => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;
    utterance.lang = settings.lang;

    // Sélectionner la voix
    if (settings.voice) {
      const voice = voices.find(v => v.name === settings.voice);
      if (voice) {
        utterance.voice = voice;
      }
    } else {
      // Utiliser la meilleure voix pour la langue
      const bestVoice = getBestVoiceForLang(settings.lang);
      if (bestVoice) {
        utterance.voice = bestVoice;
      }
    }

    return utterance;
  }, [settings, voices]);

  // Lire un lieu
  const speakPlace = useCallback((place: Place, index?: number) => {
    if (!isSupported) return;

    // Arrêter toute lecture en cours
    window.speechSynthesis.cancel();
    
    // Petit délai pour éviter l'erreur "interrupted"
    setTimeout(() => {
      const text = generatePlaceText(place, settings.lang);
      const utterance = createUtterance(text);

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        if (index !== undefined) {
          setCurrentPlaceIndex(index);
        }
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentPlaceIndex(null);
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        // Ignorer l'erreur "interrupted" car elle est normale lors du changement de lecture
        if (event.error !== 'interrupted') {
          console.error('Erreur de lecture audio:', event);
        }
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentPlaceIndex(null);
        utteranceRef.current = null;
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }, 100);
  }, [isSupported, settings.lang, createUtterance]);

  // Lire tous les lieux
  const speakAllPlaces = useCallback((places: Place[]) => {
    if (!isSupported || places.length === 0) return;

    // Arrêter toute lecture en cours
    window.speechSynthesis.cancel();
    
    // Petit délai pour éviter l'erreur "interrupted"
    setTimeout(() => {
      queueRef.current = [...places];

      // Introduction
      const introText = generateIntroText(places.length, settings.lang);
      const introUtterance = createUtterance(introText);

      introUtterance.onend = () => {
        // Commencer la lecture du premier lieu
        speakNextInQueue();
      };

      introUtterance.onerror = (event) => {
        if (event.error !== 'interrupted') {
          console.error('Erreur de lecture audio:', event);
        }
        setIsSpeaking(false);
        setCurrentPlaceIndex(null);
        queueRef.current = [];
      };

      setIsSpeaking(true);
      setCurrentPlaceIndex(0);
      window.speechSynthesis.speak(introUtterance);
    }, 100);
  }, [isSupported, settings.lang, createUtterance]);

  // Lire le prochain lieu dans la queue
  const speakNextInQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      setIsSpeaking(false);
      setCurrentPlaceIndex(null);
      return;
    }

    const place = queueRef.current.shift()!;
    const index = currentPlaceIndex !== null ? currentPlaceIndex + 1 : 0;

    // Numérotation
    const numberText = generatePlaceNumberText(index, settings.lang);
    const placeText = generatePlaceText(place, settings.lang);
    const fullText = `${numberText} ${placeText}`;

    const utterance = createUtterance(fullText);

    utterance.onstart = () => {
      setCurrentPlaceIndex(index);
    };

    utterance.onend = () => {
      if (queueRef.current.length > 0) {
        // Continuer avec le prochain
        speakNextInQueue();
      } else {
        // Terminé
        setIsSpeaking(false);
        setCurrentPlaceIndex(null);
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentPlaceIndex(null);
      queueRef.current = [];
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [currentPlaceIndex, settings.lang, createUtterance]);

  // Pause
  const pause = useCallback(() => {
    if (!isSupported || !isSpeaking) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported, isSpeaking]);

  // Reprendre
  const resume = useCallback(() => {
    if (!isSupported || !isPaused) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported, isPaused]);

  // Arrêter
  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentPlaceIndex(null);
    queueRef.current = [];
    utteranceRef.current = null;
  }, [isSupported]);

  // Mettre à jour les paramètres
  const updateSettings = useCallback((newSettings: Partial<SpeechSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveSpeechSettings(updated);
      return updated;
    });
  }, []);

  return {
    isSupported,
    isSpeaking,
    isPaused,
    currentPlaceIndex,
    settings,
    voices,
    speakPlace,
    speakAllPlaces,
    pause,
    resume,
    stop,
    updateSettings,
  };
}

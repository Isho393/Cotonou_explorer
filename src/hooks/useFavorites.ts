import { useState, useEffect } from 'react';
import type { Place } from '../types';

const FAVORITES_KEY = 'cotonou_explorer_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Place[]>([]);

  // Charger les favoris depuis localStorage au montage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    }
  }, []);

  // Sauvegarder les favoris dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris:', error);
    }
  }, [favorites]);

  const addFavorite = (place: Place) => {
    setFavorites(prev => {
      // Éviter les doublons (comparer par nom et coordonnées)
      const exists = prev.some(
        fav => fav.name === place.name && fav.lat === place.lat && fav.lng === place.lng
      );
      if (exists) return prev;
      return [...prev, place];
    });
  };

  const removeFavorite = (place: Place) => {
    setFavorites(prev =>
      prev.filter(
        fav => !(fav.name === place.name && fav.lat === place.lat && fav.lng === place.lng)
      )
    );
  };

  const toggleFavorite = (place: Place) => {
    if (isFavorite(place)) {
      removeFavorite(place);
    } else {
      addFavorite(place);
    }
  };

  const isFavorite = (place: Place): boolean => {
    return favorites.some(
      fav => fav.name === place.name && fav.lat === place.lat && fav.lng === place.lng
    );
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };
}

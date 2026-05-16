/**
 * Service pour gérer les images des lieux
 * Utilise Unsplash API avec cache pour optimiser les performances
 */

// Images par défaut pour chaque catégorie (fallback)
const DEFAULT_IMAGES: Record<string, string> = {
  'Hôtel': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
  'Restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
  'Hôpital': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop',
  'Pharmacie': 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&h=300&fit=crop',
  'Banque': 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400&h=300&fit=crop',
  'Marché': 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop',
  'Supermarché': 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop',
  'École': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
  'Transport': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
  'Station-service': 'https://images.unsplash.com/photo-1545262810-77515befe149?w=400&h=300&fit=crop',
  'Service public': 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop',
  'Lieu de culte': 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&h=300&fit=crop',
  'Tourisme': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
  'Beauté': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
  'Immobilier': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
  'Loisirs': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
  'Service professionnel': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
  'Commerce': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
};

// Cache en mémoire pour éviter les requêtes répétées
const imageCache = new Map<string, string>();

/**
 * Récupère une image pour une catégorie donnée
 * Utilise le cache localStorage et les images par défaut
 */
export function getImageForCategory(category: string): string {
  // Vérifier le cache en mémoire
  if (imageCache.has(category)) {
    return imageCache.get(category)!;
  }

  // Vérifier le cache localStorage
  const cacheKey = `img_${category}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    imageCache.set(category, cached);
    return cached;
  }

  // Utiliser l'image par défaut
  const defaultImage = DEFAULT_IMAGES[category] || DEFAULT_IMAGES['Commerce'];
  imageCache.set(category, defaultImage);
  localStorage.setItem(cacheKey, defaultImage);
  
  return defaultImage;
}

/**
 * Récupère une image pour un lieu spécifique
 * Utilise le nom du lieu + catégorie pour plus de pertinence
 */
export function getImageForPlace(placeName: string, category: string): string {
  const cacheKey = `place_${placeName}_${category}`;
  
  // Vérifier le cache
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    imageCache.set(cacheKey, cached);
    return cached;
  }

  // Pour l'instant, utiliser l'image de la catégorie
  // TODO: Implémenter recherche Unsplash avec le nom du lieu
  return getImageForCategory(category);
}

/**
 * Précharge les images pour les catégories populaires
 */
export function preloadCategoryImages(categories: string[]) {
  categories.forEach(category => {
    const img = new Image();
    img.src = getImageForCategory(category);
  });
}

/**
 * Nettoie le cache (utile pour le développement)
 */
export function clearImageCache() {
  imageCache.clear();
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('img_') || key.startsWith('place_')) {
      localStorage.removeItem(key);
    }
  });
}

/**
 * Vérifie si un lieu est ouvert maintenant
 * Parse les horaires au format OSM opening_hours
 */
export function isOpenNow(openingHours: string | undefined): boolean {
  if (!openingHours) return false;

  const now = new Date();
  const currentDay = now.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes depuis minuit

  // Cas spéciaux
  if (openingHours === '24/7' || openingHours === '24h/24') return true;
  if (openingHours.toLowerCase().includes('24h')) return true;

  // Parser simple pour les formats courants
  // Format: "Mo-Fr 08:00-18:00" ou "Lun-Ven 8h-17h"
  const lowerHours = openingHours.toLowerCase();

  // Mapping des jours
  const dayMap: Record<string, number[]> = {
    'mo': [1], 'mon': [1], 'lun': [1], 'monday': [1], 'lundi': [1],
    'tu': [2], 'tue': [2], 'mar': [2], 'tuesday': [2], 'mardi': [2],
    'we': [3], 'wed': [3], 'mer': [3], 'wednesday': [3], 'mercredi': [3],
    'th': [4], 'thu': [4], 'jeu': [4], 'thursday': [4], 'jeudi': [4],
    'fr': [5], 'fri': [5], 'ven': [5], 'friday': [5], 'vendredi': [5],
    'sa': [6], 'sat': [6], 'sam': [6], 'saturday': [6], 'samedi': [6],
    'su': [0], 'sun': [0], 'dim': [0], 'sunday': [0], 'dimanche': [0],
  };

  // Ranges de jours
  if (lowerHours.includes('mo-fr') || lowerHours.includes('lun-ven')) {
    if (currentDay < 1 || currentDay > 5) return false; // Pas lundi-vendredi
  }

  // Extraction des heures (format HH:MM ou HHhMM)
  const timeRegex = /(\d{1,2})[h:](\d{2})?/g;
  const times: number[] = [];
  let match;

  while ((match = timeRegex.exec(lowerHours)) !== null) {
    const hours = parseInt(match[1]);
    const minutes = match[2] ? parseInt(match[2]) : 0;
    times.push(hours * 60 + minutes);
  }

  // Si on a trouvé des heures d'ouverture et de fermeture
  if (times.length >= 2) {
    const openTime = times[0];
    const closeTime = times[1];
    return currentTime >= openTime && currentTime <= closeTime;
  }

  // Par défaut, considérer comme ouvert si on ne peut pas parser
  return true;
}

/**
 * Formate les horaires pour l'affichage
 */
export function formatOpeningHours(openingHours: string | undefined): string {
  if (!openingHours) return 'Horaires non disponibles';
  if (openingHours === '24/7' || openingHours === '24h/24') return 'Ouvert 24h/24';
  return openingHours;
}

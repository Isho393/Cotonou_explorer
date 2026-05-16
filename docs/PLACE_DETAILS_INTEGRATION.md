# Intégration du Modal PlaceDetails

## Modifications à apporter dans App.tsx

### 1. Ajouter l'import
```typescript
import PlaceDetails from './components/PlaceDetails';
```

### 2. Ajouter l'état pour le lieu sélectionné
```typescript
const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
```

### 3. Ajouter les handlers
```typescript
// Handler pour ouvrir les détails d'un lieu
const handlePlaceClick = (place: Place) => {
  setSelectedPlace(place);
};

// Handler pour fermer les détails
const handleClosePlaceDetails = () => {
  setSelectedPlace(null);
};
```

### 4. Modifier la signature de PlaceCard pour ajouter onClick
```typescript
function PlaceCard({ 
  place, 
  index, 
  onToggleFavorite, 
  isFavorite, 
  onSpeak, 
  isSpeaking, 
  isCurrentPlace, 
  onStopSpeech,
  onClick  // ← AJOUTER
}: { 
  place: Place; 
  index: number;
  onToggleFavorite: (place: Place) => void;
  isFavorite: boolean;
  onSpeak: (place: Place, index: number) => void;
  isSpeaking: boolean;
  isCurrentPlace: boolean;
  onStopSpeech: () => void;
  onClick: (place: Place) => void;  // ← AJOUTER
})
```

### 5. Rendre la carte cliquable
Dans le return de PlaceCard, modifier la div principale :
```typescript
return (
  <div 
    className={`animate-fade-in-up ${staggerClass} card-hover glass rounded-2xl overflow-hidden border border-white/5 group relative ${
      isCurrentPlace ? 'ring-2 ring-amber-500/50' : ''
    } cursor-pointer`}  // ← AJOUTER cursor-pointer
    onClick={() => onClick(place)}  // ← AJOUTER onClick
  >
```

### 6. Empêcher la propagation sur les boutons
Dans les boutons audio et favori, ajouter `e.stopPropagation()` :
```typescript
// Déjà présent pour le bouton favori, vérifier pour le bouton audio
```

### 7. Passer onClick aux PlaceCard dans la vue Liste
```typescript
<PlaceCard 
  key={`${place.name}-${i}`} 
  place={place} 
  index={i}
  onToggleFavorite={handleToggleFavorite}
  isFavorite={isFavorite(place)}
  onSpeak={handleSpeakPlace}
  isSpeaking={isSpeaking}
  isCurrentPlace={currentPlaceIndex === i}
  onStopSpeech={stopSpeech}
  onClick={handlePlaceClick}  // ← AJOUTER
/>
```

### 8. Passer onClick aux PlaceCard dans la vue Favoris
```typescript
<PlaceCard 
  key={`fav-${place.name}-${i}`} 
  place={place} 
  index={i}
  onToggleFavorite={handleToggleFavorite}
  isFavorite={true}
  onSpeak={handleSpeakPlace}
  isSpeaking={isSpeaking}
  isCurrentPlace={currentPlaceIndex === i}
  onStopSpeech={stopSpeech}
  onClick={handlePlaceClick}  // ← AJOUTER
/>
```

### 9. Ajouter le modal PlaceDetails avant la fermeture du div principal
```typescript
{/* Modal PlaceDetails */}
{selectedPlace && (
  <PlaceDetails
    place={selectedPlace}
    onClose={handleClosePlaceDetails}
    onToggleFavorite={handleToggleFavorite}
    isFavorite={isFavorite(selectedPlace)}
    onSpeak={handleSpeakPlace}
    isSpeaking={isSpeaking}
    isCurrentPlace={currentPlaceIndex === paginatedResults.findIndex(p => p.name === selectedPlace.name)}
    onStopSpeech={stopSpeech}
  />
)}
```

## Résultat Attendu

- Cliquer sur une carte ouvre le modal avec tous les détails
- Le modal affiche :
  - Photo en grand
  - Toutes les informations
  - Mini carte Leaflet
  - 3 boutons d'action (Itinéraire, Partager, Appeler)
- Les boutons audio et favori fonctionnent sans ouvrir le modal
- Fermer le modal avec X ou en cliquant en dehors

## Build

Après les modifications, lancer :
```bash
npm run build
```

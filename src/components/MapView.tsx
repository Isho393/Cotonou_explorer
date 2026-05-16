import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Place } from '../types';
import { Star, MapPin, Phone, Clock } from 'lucide-react';

// Fix pour les icônes Leaflet avec Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Composant pour ajuster la vue de la carte
function MapBounds({ places }: { places: Place[] }) {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) return;

    if (places.length === 1) {
      // Un seul lieu : centrer dessus
      map.setView([places[0].lat, places[0].lng], 15);
    } else {
      // Plusieurs lieux : ajuster pour tous les voir
      const bounds = L.latLngBounds(places.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [places, map]);

  return null;
}

// Icône personnalisée par catégorie
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Hôtel': '#d97706',
    'Restaurant': '#ea580c',
    'Hôpital': '#dc2626',
    'Pharmacie': '#14b8a6',
    'Banque': '#3b82f6',
    'Marché': '#eab308',
    'Supermarché': '#22c55e',
    'École': '#06b6d4',
    'Transport': '#6366f1',
    'Station-service': '#a855f7',
    'Service public': '#64748b',
    'Lieu de culte': '#8b5cf6',
    'Tourisme': '#f43f5e',
    'Beauté': '#d946ef',
    'Immobilier': '#10b981',
    'Loisirs': '#84cc16',
    'Service professionnel': '#0ea5e9',
    'Commerce': '#f97316',
  };
  return colors[category] || '#6b7280';
}

function createCustomIcon(category: string) {
  const color = getCategoryColor(category);
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(45deg);
          color: white;
          font-size: 14px;
          font-weight: bold;
        ">📍</div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
}

interface MapViewProps {
  places: Place[];
}

export default function MapView({ places }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Centre par défaut : Cotonou
  const defaultCenter: [number, number] = [6.3654, 2.4195];
  const defaultZoom = 13;

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="w-full h-full"
        ref={mapRef}
      >
        {/* Tiles OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Ajuster la vue selon les résultats */}
        <MapBounds places={places} />

        {/* Markers pour chaque lieu */}
        {places.map((place, index) => (
          <Marker
            key={`${place.name}-${index}`}
            position={[place.lat, place.lng]}
            icon={createCustomIcon(place.category)}
          >
            <Popup className="custom-popup" maxWidth={300}>
              <div className="p-2">
                {/* Catégorie */}
                <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-400 border border-amber-800/40 mb-2">
                  {place.category}
                </span>

                {/* Nom */}
                <h3 className="font-semibold text-base mb-2 text-gray-900">
                  {place.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {place.description}
                </p>

                {/* Note */}
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      size={12}
                      className={i <= Math.round(place.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-1">{place.rating.toFixed(1)}</span>
                </div>

                {/* Adresse */}
                <div className="flex items-start gap-1.5 text-gray-600 text-xs mb-1">
                  <MapPin size={11} className="flex-shrink-0 mt-0.5 text-amber-600" />
                  <span className="line-clamp-2">{place.address}</span>
                </div>

                {/* Téléphone */}
                {place.phone && (
                  <div className="flex items-center gap-1.5 text-gray-600 text-xs mb-1">
                    <Phone size={11} className="flex-shrink-0" />
                    <span>{place.phone}</span>
                  </div>
                )}

                {/* Horaires */}
                {place.hours && (
                  <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                    <Clock size={11} className="flex-shrink-0" />
                    <span>{place.hours}</span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

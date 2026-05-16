import { useTranslation } from 'react-i18next';
import { X, MapPin, Phone, Clock, Star, Navigation, Share2, Heart, Volume2, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Place } from '../types';
import { getImageForCategory } from '../services/imageService';
import LazyImage from './LazyImage';
import AudioButton from './AudioButton';
import 'leaflet/dist/leaflet.css';

interface PlaceDetailsProps {
  place: Place;
  onClose: () => void;
  onToggleFavorite: (place: Place) => void;
  isFavorite: boolean;
  onSpeak: (place: Place, index: number) => void;
  isSpeaking: boolean;
  isCurrentPlace: boolean;
  onStopSpeech: () => void;
}

export default function PlaceDetails({
  place,
  onClose,
  onToggleFavorite,
  isFavorite,
  onSpeak,
  isSpeaking,
  isCurrentPlace,
  onStopSpeech,
}: PlaceDetailsProps) {
  const { t } = useTranslation();
  const imageUrl = place.imageUrl || getImageForCategory(place.category);

  // Ouvrir Google Maps avec itinéraire
  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
    window.open(url, '_blank');
  };

  // Partager le lieu
  const handleShare = async () => {
    const shareData = {
      title: place.name,
      text: `${place.name} - ${place.description}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copier le lien
        await navigator.clipboard.writeText(window.location.href);
        alert(t('placeDetails.linkCopied'));
      }
    } catch (error) {
      console.error('Erreur de partage:', error);
    }
  };

  // Appeler le lieu
  const handleCall = () => {
    if (place.phone) {
      window.location.href = `tel:${place.phone}`;
    }
  };

  // Vérifier si ouvert maintenant (simplifié)
  const isOpenNow = () => {
    if (!place.hours) return null;
    const hours = place.hours.toLowerCase();
    if (hours.includes('24h') || hours.includes('24/7')) return true;
    // Logique simplifiée - peut être améliorée
    return null;
  };

  const openStatus = isOpenNow();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-2xl border border-white/10 shadow-2xl">
        {/* Header avec image */}
        <div className="relative">
          <LazyImage
            src={imageUrl}
            alt={place.name}
            className="w-full h-64 object-cover"
            placeholderClassName="w-full h-64"
          />
          
          {/* Boutons en overlay */}
          <div className="absolute top-4 right-4 flex gap-2">
            {/* Bouton Audio */}
            <AudioButton
              place={place}
              index={0}
              isSpeaking={isSpeaking}
              isCurrentPlace={isCurrentPlace}
              onSpeak={onSpeak}
              onStop={onStopSpeech}
            />
            
            {/* Bouton Favori */}
            <button
              onClick={() => onToggleFavorite(place)}
              className={`w-10 h-10 rounded-xl backdrop-blur-md flex items-center justify-center transition-all ${
                isFavorite
                  ? 'bg-red-500/90 hover:bg-red-600'
                  : 'bg-black/40 hover:bg-black/60'
              }`}
              aria-label={isFavorite ? t('favorites.removeFromFavorites') : t('favorites.addToFavorites')}
            >
              <Heart
                size={18}
                className={`transition-all ${
                  isFavorite ? 'fill-white text-white' : 'text-white'
                }`}
              />
            </button>
            
            {/* Bouton Fermer */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl backdrop-blur-md bg-black/40 hover:bg-black/60 flex items-center justify-center transition-all"
              aria-label={t('placeDetails.close')}
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Titre et note */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white leading-tight">
                {place.name}
              </h2>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    size={16}
                    className={i <= Math.round(place.rating) ? 'rating-star fill-current text-amber-400' : 'text-gray-600'}
                  />
                ))}
              </div>
              <span className="text-white font-semibold">{place.rating.toFixed(1)}</span>
              <span className="text-gray-500 text-sm">• {place.category}</span>
            </div>

            {/* Statut ouvert/fermé */}
            {openStatus !== null && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800/40">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {openStatus ? t('placeDetails.openNow') : t('placeDetails.closed')}
              </div>
            )}
          </div>

          {/* Informations de contact */}
          <div className="space-y-3">
            {/* Adresse */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-900/30 border border-amber-800/40 flex items-center justify-center">
                <MapPin size={18} className="text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">{t('placeDetails.address')}</p>
                <p className="text-white text-sm">{place.address}</p>
              </div>
            </div>

            {/* Téléphone */}
            {place.phone && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-900/30 border border-blue-800/40 flex items-center justify-center">
                  <Phone size={18} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">{t('placeDetails.phone')}</p>
                  <a
                    href={`tel:${place.phone}`}
                    className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                  >
                    {place.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Horaires */}
            {place.hours && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-800/40 flex items-center justify-center">
                  <Clock size={18} className="text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">{t('placeDetails.hours')}</p>
                  <p className="text-white text-sm">{place.hours}</p>
                </div>
              </div>
            )}

            {/* Distance */}
            {place.distance !== undefined && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-900/30 border border-green-800/40 flex items-center justify-center">
                  <Navigation size={18} className="text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">{t('placeDetails.distance')}</p>
                  <p className="text-white text-sm">{place.distance.toFixed(1)} km</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {place.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                {t('placeDetails.description')}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {place.description}
              </p>
            </div>
          )}

          {/* Mini carte */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              {t('placeDetails.location')}
            </h3>
            <div className="h-48 rounded-xl overflow-hidden border border-white/10">
              <MapContainer
                center={[place.lat, place.lng]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker position={[place.lat, place.lng]}>
                  <Popup>{place.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Itinéraire */}
            <button
              onClick={handleGetDirections}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #d4af37, #c9922a)', color: '#07070f' }}
            >
              <Navigation size={18} />
              <span>{t('placeDetails.directions')}</span>
            </button>

            {/* Partager */}
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass border border-white/10 text-white font-medium text-sm hover:bg-white/5 transition-all"
            >
              <Share2 size={18} />
              <span>{t('placeDetails.share')}</span>
            </button>

            {/* Appeler */}
            {place.phone && (
              <button
                onClick={handleCall}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass border border-white/10 text-white font-medium text-sm hover:bg-white/5 transition-all"
              >
                <Phone size={18} />
                <span>{t('placeDetails.call')}</span>
              </button>
            )}

            {/* Ouvrir dans Google Maps (si pas de téléphone) */}
            {!place.phone && (
              <button
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`, '_blank')}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass border border-white/10 text-white font-medium text-sm hover:bg-white/5 transition-all"
              >
                <ExternalLink size={18} />
                <span>{t('placeDetails.openInMaps')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

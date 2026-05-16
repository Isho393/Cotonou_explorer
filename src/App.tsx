import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, MapPin, Star, Phone, Clock, Sparkles,
  Hotel, UtensilsCrossed, HeartPulse, ShoppingBag,
  Building2, GraduationCap, ShoppingCart, Music,
  ChevronRight, X, ArrowRight, Pill, Bus, Landmark,
  Church, Camera, Scissors, Fuel, Home, Smartphone,
  Trees, Briefcase, Map, List, Heart
} from 'lucide-react';
import { supabase } from './lib/supabase';
import type { Place, SearchResponse } from './types';
import LanguageSwitcher from './components/LanguageSwitcher';
import LazyImage from './components/LazyImage';
import MapView from './components/MapView';
import Pagination from './components/Pagination';
import Filters, { type FilterOptions } from './components/Filters';
import InstallPWA from './components/InstallPWA';
import OfflineIndicator from './components/OfflineIndicator';
import { getImageForCategory } from './services/imageService';
import { calculateDistance, formatDistance } from './utils/distance';
import { isOpenNow } from './utils/openingHours';
import { useFavorites } from './hooks/useFavorites';
import { useServiceWorker } from './hooks/useServiceWorker';
import { useNotifications } from './hooks/useNotifications';
import { useSpeech } from './hooks/useSpeech';
import NotificationBell from './components/NotificationBell';
import NotificationCenter from './components/NotificationCenter';
import AudioButton from './components/AudioButton';
import AudioControls from './components/AudioControls';
import AudioSettings from './components/AudioSettings';
import PlaceDetails from './components/PlaceDetails';
import ThemeToggle from './components/ThemeToggle';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          className={i <= Math.round(rating) ? 'rating-star fill-current' : 'text-gray-600'}
        />
      ))}
      <span className="text-xs text-gray-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function PlaceCard({ place, index, onToggleFavorite, isFavorite, onSpeak, isSpeaking, isCurrentPlace, onStopSpeech, onClick }: { 
  place: Place; 
  index: number;
  onToggleFavorite: (place: Place) => void;
  isFavorite: boolean;
  onSpeak: (place: Place, index: number) => void;
  isSpeaking: boolean;
  isCurrentPlace: boolean;
  onStopSpeech: () => void;
  onClick: (place: Place) => void;
}) {
  const staggerClass = `stagger-${Math.min(index + 1, 8)}`;
  const imageUrl = place.imageUrl || getImageForCategory(place.category);

  const categoryColors: Record<string, string> = {
    'Hôtel': 'bg-amber-900/30 text-amber-400 border-amber-800/40',
    'Restaurant': 'bg-orange-900/30 text-orange-400 border-orange-800/40',
    'Restaurant / Maquis': 'bg-orange-900/30 text-orange-400 border-orange-800/40',
    'Restaurant / Brasserie': 'bg-orange-900/30 text-orange-400 border-orange-800/40',
    'Hôpital': 'bg-red-900/30 text-red-400 border-red-800/40',
    'Clinique': 'bg-red-900/30 text-red-400 border-red-800/40',
    'Polyclinique': 'bg-red-900/30 text-red-400 border-red-800/40',
    'Hôpital de zone': 'bg-red-900/30 text-red-400 border-red-800/40',
    'Centre de santé': 'bg-red-900/30 text-red-400 border-red-800/40',
    'Pharmacie': 'bg-teal-900/30 text-teal-400 border-teal-800/40',
    'Pharmacie de garde': 'bg-teal-900/30 text-teal-400 border-teal-800/40',
    'Banque': 'bg-blue-900/30 text-blue-400 border-blue-800/40',
    'Marché': 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40',
    'Marché de quartier': 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40',
    'Université': 'bg-cyan-900/30 text-cyan-400 border-cyan-800/40',
    'École internationale': 'bg-cyan-900/30 text-cyan-400 border-cyan-800/40',
    'Lycée': 'bg-cyan-900/30 text-cyan-400 border-cyan-800/40',
    'Supermarché': 'bg-green-900/30 text-green-400 border-green-800/40',
    'Bar / Lounge': 'bg-pink-900/30 text-pink-400 border-pink-800/40',
    'Cinéma': 'bg-pink-900/30 text-pink-400 border-pink-800/40',
    'Sport': 'bg-lime-900/30 text-lime-400 border-lime-800/40',
    'Transport': 'bg-indigo-900/30 text-indigo-400 border-indigo-800/40',
    'Station-service': 'bg-purple-900/30 text-purple-400 border-purple-800/40',
    'Service public': 'bg-slate-900/30 text-slate-400 border-slate-800/40',
    'Lieu de culte': 'bg-violet-900/30 text-violet-400 border-violet-800/40',
    'Tourisme': 'bg-rose-900/30 text-rose-400 border-rose-800/40',
    'Beauté': 'bg-fuchsia-900/30 text-fuchsia-400 border-fuchsia-800/40',
    'Immobilier': 'bg-emerald-900/30 text-emerald-400 border-emerald-800/40',
    'Loisirs': 'bg-lime-900/30 text-lime-400 border-lime-800/40',
    'Service professionnel': 'bg-sky-900/30 text-sky-400 border-sky-800/40',
    'Commerce': 'bg-orange-900/30 text-orange-400 border-orange-800/40',
  };

  const colorClass = categoryColors[place.category] ?? 'bg-gray-800/40 text-gray-400 border-gray-700/40';

  return (
    <div 
      className={`animate-fade-in-up ${staggerClass} card-hover glass rounded-2xl overflow-hidden border border-white/5 group relative cursor-pointer ${
        isCurrentPlace ? 'ring-2 ring-amber-500/50' : ''
      }`}
      onClick={() => onClick(place)}
    >
      {/* Image avec boutons favori et audio */}
      <div className="relative">
        <LazyImage
          src={imageUrl}
          alt={place.name}
          className="w-full h-40 object-cover"
          placeholderClassName="w-full h-40"
        />
        {/* Boutons en haut à droite */}
        <div className="absolute top-3 right-3 flex gap-2">
          {/* Bouton Audio */}
          <AudioButton
            place={place}
            index={index}
            isSpeaking={isSpeaking}
            isCurrentPlace={isCurrentPlace}
            onSpeak={onSpeak}
            onStop={onStopSpeech}
          />
          {/* Bouton Favori */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(place);
            }}
            className={`w-9 h-9 rounded-xl backdrop-blur-md flex items-center justify-center transition-all ${
              isFavorite
                ? 'bg-red-500/90 hover:bg-red-600'
                : 'bg-black/40 hover:bg-black/60'
            }`}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart
              size={16}
              className={`transition-all ${
                isFavorite ? 'fill-white text-white' : 'text-white'
              }`}
            />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border mb-2 ${colorClass}`}>
              {place.category}
            </span>
            <h3 className="font-semibold text-white text-base leading-snug group-hover:text-amber-300 transition-colors">
              {place.name}
            </h3>
          </div>
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-amber-900/30 transition-colors">
            <ChevronRight size={16} className="text-gray-500 group-hover:text-amber-400 transition-colors" />
          </div>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{place.description}</p>

        <div className="space-y-2">
          <StarRating rating={place.rating} />
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <MapPin size={11} className="flex-shrink-0 text-amber-600" />
            <span className="truncate">{place.address}</span>
          </div>
          {place.phone && (
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Phone size={11} className="flex-shrink-0 text-gray-600" />
              <span>{place.phone}</span>
            </div>
          )}
          {place.hours && (
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Clock size={11} className="flex-shrink-0 text-gray-600" />
              <span>{place.hours}</span>
            </div>
          )}
          {place.distance !== undefined && (
            <div className="flex items-center gap-1.5 text-amber-600 text-xs font-medium">
              <MapPin size={11} className="flex-shrink-0" />
              <span>{formatDistance(place.distance)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 border border-white/5">
      <div className="skeleton h-5 w-20 mb-2" />
      <div className="skeleton h-5 w-3/4 mb-3" />
      <div className="skeleton h-4 w-full mb-1.5" />
      <div className="skeleton h-4 w-5/6 mb-4" />
      <div className="skeleton h-3 w-24 mb-2" />
      <div className="skeleton h-3 w-40 mb-2" />
      <div className="skeleton h-3 w-32" />
    </div>
  );
}

function AIMessage({ message, isVisible }: { message: string; isVisible: boolean }) {
  const { t } = useTranslation();
  if (!isVisible || !message) return null;
  return (
    <div className="animate-fade-in-up mb-6">
      <div className="glass rounded-2xl p-5 border border-amber-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 to-transparent pointer-events-none" />
        <div className="relative flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-amber-900/40 border border-amber-800/50 flex items-center justify-center animate-pulse-glow">
            <Sparkles size={15} className="text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-amber-500 mb-1 uppercase tracking-wider">{t('ai.label')}</p>
            <p className="text-gray-200 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: message.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [aiMessage, setAiMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'favorites'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    minRating: 0,
    maxDistance: null,
    openNow: false,
    sortBy: 'relevance',
  });
  const [sessionId] = useState(() => Math.random().toString(36).slice(2));
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Hook des favoris
  const { favorites, toggleFavorite, isFavorite, favoritesCount } = useFavorites();

  // Hook des notifications
  const {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    unreadCount,
  } = useNotifications();

  const [showNotifications, setShowNotifications] = useState(false);

  // Hook audio TTS
  const speechLang = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
  const {
    isSupported: isSpeechSupported,
    isSpeaking,
    isPaused,
    currentPlaceIndex,
    settings: speechSettings,
    voices,
    speakPlace,
    speakAllPlaces,
    pause: pauseSpeech,
    resume: resumeSpeech,
    stop: stopSpeech,
    updateSettings: updateSpeechSettings,
  } = useSpeech(speechLang);

  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Wrapper pour toggleFavorite avec notifications
  const handleToggleFavorite = (place: Place) => {
    const wasAlreadyFavorite = isFavorite(place);
    toggleFavorite(place);
    
    // Ajouter une notification
    if (!wasAlreadyFavorite) {
      addNotification({
        type: 'favorite_update',
        title: t('notifications.favoriteAdded'),
        message: t('notifications.favoriteAddedDesc', { name: place.name }),
        icon: '❤️',
        placeId: `${place.name}-${place.lat}-${place.lng}`,
      });
    } else {
      addNotification({
        type: 'favorite_update',
        title: t('notifications.favoriteRemoved'),
        message: t('notifications.favoriteRemovedDesc', { name: place.name }),
        icon: '💔',
        placeId: `${place.name}-${place.lat}-${place.lng}`,
      });
    }
  };

  // Handlers audio
  const handlePlayAll = () => {
    speakAllPlaces(paginatedResults);
  };

  const handleSpeakPlace = (place: Place, index: number) => {
    speakPlace(place, index);
  };

  // Handler pour ouvrir les détails d'un lieu
  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
  };

  // Handler pour fermer les détails
  const handleClosePlaceDetails = () => {
    setSelectedPlace(null);
  };

  const CATEGORIES = [
    { label: t('categories.hotels'), query: 'hôtel', icon: Hotel },
    { label: t('categories.restaurants'), query: 'restaurant', icon: UtensilsCrossed },
    { label: t('categories.hospitals'), query: 'hôpital', icon: HeartPulse },
    { label: t('categories.pharmacies'), query: 'pharmacie', icon: Pill },
    { label: t('categories.banks'), query: 'banque', icon: Building2 },
    { label: t('categories.markets'), query: 'marché', icon: ShoppingBag },
    { label: t('categories.schools'), query: 'école', icon: GraduationCap },
    { label: t('categories.supermarkets'), query: 'supermarché', icon: ShoppingCart },
    { label: t('categories.transport'), query: 'transport gare', icon: Bus },
    { label: t('categories.publicServices'), query: 'mairie commissariat', icon: Landmark },
    { label: t('categories.worship'), query: 'église mosquée', icon: Church },
    { label: t('categories.tourism'), query: 'monument musée plage', icon: Camera },
    { label: t('categories.beauty'), query: 'salon coiffure spa', icon: Scissors },
    { label: t('categories.fuel'), query: 'station service', icon: Fuel },
    { label: t('categories.realEstate'), query: 'agence immobilière', icon: Home },
    { label: t('categories.telecom'), query: 'mtn moov', icon: Smartphone },
    { label: t('categories.leisure'), query: 'parc jardin', icon: Trees },
    { label: t('categories.professional'), query: 'avocat comptable', icon: Briefcase },
    { label: t('categories.entertainment'), query: 'bar lounge', icon: Music },
  ];

  const SUGGESTIONS = [
    t('suggestions.bestHotel'),
    t('suggestions.traditionalRestaurant'),
    t('suggestions.emergency'),
    t('suggestions.pharmacy'),
    t('suggestions.market'),
    t('suggestions.bankAtm'),
  ];

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    setResults([]);
    setAiMessage('');
    setCurrentPage(1); // Réinitialiser à la page 1

    try {
      // Cache key
      const cacheKey = `search_${searchQuery.toLowerCase()}`;
      const cached = sessionStorage.getItem(cacheKey);
      
      // Use cache if available (valid for 5 minutes)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          setResults(data.results ?? []);
          setAiMessage(data.aiMessage ?? '');
          setLoading(false);
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
          return;
        }
      }

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-places`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data: SearchResponse = await res.json();
      setResults(data.results ?? []);
      setAiMessage(data.aiMessage ?? '');
      
      // Cache the results
      sessionStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));

      await supabase.from('search_history').insert({
        query: searchQuery,
        results_count: data.total ?? 0,
        session_id: sessionId,
      });

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setAiMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setActiveCategory(null);
      performSearch(query);
    }
  };

  const handleCategory = (cat: typeof CATEGORIES[0]) => {
    setActiveCategory(cat.label);
    setQuery(cat.query);
    performSearch(cat.query);
  };

  const handleSuggestion = (s: string) => {
    setQuery(s);
    setActiveCategory(null);
    performSearch(s);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setAiMessage('');
    setHasSearched(false);
    setActiveCategory(null);
    setCurrentPage(1);
    inputRef.current?.focus();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll vers le haut des résultats
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const requestUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          alert('Impossible d\'obtenir votre position. Vérifiez les autorisations.');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
  };

  // Appliquer les filtres et le tri
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results];

    // Calculer les distances si position utilisateur disponible
    if (userLocation) {
      filtered = filtered.map(place => ({
        ...place,
        distance: calculateDistance(userLocation.lat, userLocation.lng, place.lat, place.lng),
      }));
    }

    // Filtre par note
    if (filters.minRating > 0) {
      filtered = filtered.filter(place => place.rating >= filters.minRating);
    }

    // Filtre par distance
    if (filters.maxDistance !== null && userLocation) {
      filtered = filtered.filter(place => (place.distance || 0) <= filters.maxDistance!);
    }

    // Filtre "Ouvert maintenant"
    if (filters.openNow) {
      filtered = filtered.filter(place => isOpenNow(place.hours));
    }

    // Tri
    if (filters.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'distance' && userLocation) {
      filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
    // 'relevance' garde l'ordre original

    return filtered;
  }, [results, filters, userLocation]);

  // Calculer les résultats paginés
  const totalPages = Math.ceil(filteredAndSortedResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = filteredAndSortedResults.slice(startIndex, endIndex);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at 50% 0%, #1a1206 0%, #07070f 60%)' }}>
      {/* PWA Components */}
      <OfflineIndicator />
      <InstallPWA />
      
      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onDelete={deleteNotification}
          onClearAll={clearAll}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {/* Audio Settings */}
      {showAudioSettings && isSpeechSupported && (
        <AudioSettings
          settings={speechSettings}
          voices={voices}
          onSettingsChange={updateSpeechSettings}
          onClose={() => setShowAudioSettings(false)}
        />
      )}
      
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)' }} />
        <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #c9922a 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 pb-20">

        {/* Header */}
        <header className="text-center mb-10 pt-6">
          <div className="flex justify-between items-start mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-amber-900/30 text-amber-500 text-xs font-medium tracking-wider uppercase">
              <MapPin size={11} />
              <span>{t('app.location')}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Contrôles Audio */}
              {isSpeechSupported && hasSearched && results.length > 0 && (
                <AudioControls
                  isSpeaking={isSpeaking}
                  isPaused={isPaused}
                  hasResults={paginatedResults.length > 0}
                  onPlayAll={handlePlayAll}
                  onPause={pauseSpeech}
                  onResume={resumeSpeech}
                  onStop={stopSpeech}
                  onOpenSettings={() => setShowAudioSettings(!showAudioSettings)}
                />
              )}
              <NotificationBell
                unreadCount={unreadCount}
                onClick={() => setShowNotifications(!showNotifications)}
                isOpen={showNotifications}
              />
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-semibold text-white mb-3 leading-tight">
            {t('app.title')} <span className="gold-text">{t('app.titleHighlight')}</span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-md mx-auto leading-relaxed">
            {t('app.subtitle')}
          </p>
        </header>

        {/* Search bar */}
        <div className="mb-6">
          <form onSubmit={handleSubmit}>
            <div className="search-bar glass rounded-2xl border border-white/8 flex items-center gap-3 px-5 py-4">
              <Search size={20} className="text-amber-600 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="flex-1 bg-transparent text-white placeholder-gray-600 text-base outline-none"
              />
              {query && (
                <button type="button" onClick={clearSearch}
                  className="text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0">
                  <X size={18} />
                </button>
              )}
              <button
                type="submit"
                disabled={!query.trim() || loading}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #d4af37, #c9922a)', color: '#07070f' }}
              >
                {loading ? (
                  <div className="dot-loader flex gap-1.5 items-center h-5">
                    <span /><span /><span />
                  </div>
                ) : (
                  <>
                    <span className="hidden sm:inline">{t('search.button')}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.label}
                onClick={() => handleCategory(cat)}
                className={`chip-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium glass border-white/10 text-gray-400 ${activeCategory === cat.label ? 'active' : ''}`}
              >
                <Icon size={13} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Suggestions (only before first search) */}
        {!hasSearched && (
          <div className="animate-fade-in mb-10">
            <p className="text-gray-600 text-xs uppercase tracking-wider font-medium mb-3">{t('suggestions.title')}</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="chip-btn text-sm text-gray-400 glass border border-white/6 px-3.5 py-2 rounded-xl hover:text-gray-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hero image (only before search) */}
        {!hasSearched && (
          <div className="animate-fade-in-up stagger-2">
            <div className="relative rounded-3xl overflow-hidden h-56 md:h-72">
              <img
                src="https://images.pexels.com/photos/3799832/pexels-photo-3799832.jpeg"
                alt="Cotonou city"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white font-semibold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('hero.title')}
                </p>
                <p className="text-gray-400 text-sm">{t('hero.subtitle')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div ref={resultsRef}>
          {/* Loading skeletons */}
          {loading && (
            <div>
              <div className="skeleton h-24 rounded-2xl mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            </div>
          )}

          {/* AI message */}
          {!loading && hasSearched && (
            <AIMessage message={aiMessage} isVisible={true} />
          )}

          {/* Results grid */}
          {!loading && results.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-500 text-sm">
                  <span className="gold-text font-semibold text-base">{filteredAndSortedResults.length}</span>
                  {' '}{filteredAndSortedResults.length > 1 ? t('search.resultsCountPlural') : t('search.resultsCount')}{' '}
                  {filteredAndSortedResults.length > 1 ? t('search.foundPlural') : t('search.found')}
                </p>
                
                {/* Filtres et Toggle Vue Liste / Carte */}
                <div className="flex items-center gap-3">
                  {/* Filtres */}
                  <Filters
                    filters={filters}
                    onFiltersChange={setFilters}
                    userLocation={userLocation}
                    onRequestLocation={requestUserLocation}
                    resultsCount={filteredAndSortedResults.length}
                  />
                  
                  {/* Toggle Vue Liste / Carte / Favoris */}
                  <div className="flex glass border border-white/10 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${
                        viewMode === 'list'
                          ? 'bg-amber-900/40 text-amber-400'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      <List size={14} />
                      <span>{t('filters.listView')}</span>
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${
                        viewMode === 'map'
                          ? 'bg-amber-900/40 text-amber-400'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      <Map size={14} />
                      <span>{t('filters.mapView')}</span>
                    </button>
                    <button
                      onClick={() => setViewMode('favorites')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all relative ${
                        viewMode === 'favorites'
                          ? 'bg-amber-900/40 text-amber-400'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      <Heart size={14} className={viewMode === 'favorites' ? 'fill-current' : ''} />
                      <span>{t('favorites.title')}</span>
                      {favoritesCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {favoritesCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Vue Liste */}
              {viewMode === 'list' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paginatedResults.map((place, i) => (
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
                        onClick={handlePlaceClick}
                      />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={results.length}
                    itemsPerPage={itemsPerPage}
                  />
                </>
              )}
              
              {/* Vue Carte */}
              {viewMode === 'map' && (
                <div className="h-[600px] animate-fade-in">
                  <MapView places={filteredAndSortedResults} />
                </div>
              )}
              
              {/* Vue Favoris */}
              {viewMode === 'favorites' && (
                <div className="animate-fade-in">
                  {favorites.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 rounded-2xl glass border border-white/6 flex items-center justify-center mx-auto mb-4">
                        <Heart size={24} className="text-gray-600" />
                      </div>
                      <p className="text-gray-400 font-medium mb-1">{t('favorites.empty')}</p>
                      <p className="text-gray-600 text-sm">{t('favorites.emptyDesc')}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favorites.map((place, i) => (
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
                          onClick={handlePlaceClick}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* No results */}
          {!loading && hasSearched && results.length === 0 && (
            <div className="animate-fade-in text-center py-16">
              <div className="w-16 h-16 rounded-2xl glass border border-white/6 flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-600" />
              </div>
              <p className="text-gray-400 font-medium mb-1">{t('search.noResults')}</p>
              <p className="text-gray-600 text-sm">{t('search.noResultsDesc')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 text-center py-3 pointer-events-none">
        <div className="inline-flex items-center gap-2 glass border border-white/5 px-4 py-2 rounded-full text-xs text-gray-600">
          <MapPin size={10} className="text-amber-800" />
          <span>{t('app.poweredBy')}</span>
        </div>
      </footer>

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
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Star, Clock, SlidersHorizontal, X } from 'lucide-react';

export interface FilterOptions {
  minRating: number;
  maxDistance: number | null;
  openNow: boolean;
  sortBy: 'relevance' | 'distance' | 'rating';
}

interface FiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  userLocation: { lat: number; lng: number } | null;
  onRequestLocation: () => void;
  resultsCount: number;
}

export default function Filters({
  filters,
  onFiltersChange,
  userLocation,
  onRequestLocation,
  resultsCount,
}: FiltersProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      minRating: 0,
      maxDistance: null,
      openNow: false,
      sortBy: 'relevance',
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const activeFiltersCount = [
    localFilters.minRating > 0,
    localFilters.maxDistance !== null,
    localFilters.openNow,
    localFilters.sortBy !== 'relevance',
  ].filter(Boolean).length;

  return (
    <div className="relative">
      {/* Bouton Filtres */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
      >
        <SlidersHorizontal size={16} />
        <span>{t('filters.title')}</span>
        {activeFiltersCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-900/40 text-amber-400 text-xs font-bold border border-amber-800/50">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Panel de filtres */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 glass rounded-2xl border border-white/10 p-6 z-50 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <SlidersHorizontal size={18} />
                {t('filters.title')}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filtre Note minimale */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {t('filters.minRating')}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={localFilters.minRating}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, minRating: Number(e.target.value) })
                  }
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex items-center gap-1 min-w-[60px]">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-white font-medium">
                    {localFilters.minRating === 0 ? t('filters.allRatings') : localFilters.minRating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Filtre Distance */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {t('filters.maxDistance')}
              </label>
              
              {!userLocation ? (
                <button
                  onClick={onRequestLocation}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-900/20 border border-amber-800/40 text-amber-400 hover:bg-amber-900/30 transition-all"
                >
                  <MapPin size={16} />
                  <span className="text-sm font-medium">{t('filters.enableLocation')}</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={localFilters.maxDistance || 50}
                      onChange={(e) =>
                        setLocalFilters({ ...localFilters, maxDistance: Number(e.target.value) })
                      }
                      className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <span className="text-white font-medium min-w-[60px]">
                      {localFilters.maxDistance || 50} km
                    </span>
                  </div>
                  <button
                    onClick={() => setLocalFilters({ ...localFilters, maxDistance: null })}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {t('filters.disableDistance')}
                  </button>
                </div>
              )}
            </div>

            {/* Filtre Ouvert maintenant */}
            <div className="mb-6">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Clock size={16} />
                  {t('filters.openNow')}
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={localFilters.openNow}
                    onChange={(e) =>
                      setLocalFilters({ ...localFilters, openNow: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-amber-600 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
              </label>
            </div>

            {/* Tri */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {t('filters.sortBy')}
              </label>
              <div className="space-y-2">
                {[
                  { value: 'relevance', label: t('filters.sortRelevance') },
                  { value: 'rating', label: t('filters.sortRating') },
                  { value: 'distance', label: t('filters.sortDistance'), disabled: !userLocation },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      localFilters.sortBy === option.value
                        ? 'bg-amber-900/20 border-amber-800/40 text-amber-400'
                        : 'border-white/10 text-gray-400 hover:bg-white/5'
                    } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio"
                      name="sortBy"
                      value={option.value}
                      checked={localFilters.sortBy === option.value}
                      onChange={(e) =>
                        setLocalFilters({ ...localFilters, sortBy: e.target.value as any })
                      }
                      disabled={option.disabled}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span className="text-sm font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 rounded-xl border border-white/10 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                {t('filters.reset')}
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'linear-gradient(135deg, #d4af37, #c9922a)', color: '#07070f' }}
              >
                {t('filters.apply')} ({resultsCount})
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

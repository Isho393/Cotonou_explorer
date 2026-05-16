import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Nombre max de pages visibles

    if (totalPages <= maxVisible) {
      // Afficher toutes les pages si peu nombreuses
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher ... entre les pages
      if (currentPage <= 3) {
        // Début : 1 2 3 4 ... 10
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Fin : 1 ... 7 8 9 10
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        // Milieu : 1 ... 4 5 6 ... 10
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5">
      {/* Info */}
      <p className="text-sm text-gray-500">
        Affichage de <span className="text-amber-400 font-medium">{startItem}</span> à{' '}
        <span className="text-amber-400 font-medium">{endItem}</span> sur{' '}
        <span className="text-amber-400 font-medium">{totalItems}</span> résultats
      </p>

      {/* Pagination */}
      <div className="flex items-center gap-2">
        {/* Bouton Précédent */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 rounded-xl glass border border-white/10 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Précédent</span>
        </button>

        {/* Numéros de page */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-600">
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-900/40 text-amber-400 border border-amber-800/50'
                    : 'glass border border-white/10 text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Bouton Suivant */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 rounded-xl glass border border-white/10 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5"
        >
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

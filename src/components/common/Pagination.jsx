import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  return (
    <div className="flex items-center justify-end gap-1.5 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${
          currentPage === 1
            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
            : 'border-[#DCE7EA] text-[#64748B] hover:bg-[#E8F4F3]'
        }`}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
              isActive
                ? 'bg-[#E8F4F3] text-[#008F83] border border-[#008F83] shadow-xs font-black'
                : 'border border-[#DCE7EA] text-[#64748B] hover:bg-[#E8F4F3]'
            }`}
          >
            {p}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${
          currentPage === totalPages
            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
            : 'border-[#DCE7EA] text-[#64748B] hover:bg-[#E8F4F3]'
        }`}
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

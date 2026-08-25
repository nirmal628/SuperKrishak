import React, { useState } from 'react';
import { Info } from 'lucide-react';

export default function InfoTooltip({ text, label = 'More information', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className={`inline-flex group ${className}`}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
        onBlur={() => setIsOpen(false)}
        className="w-5 h-5 rounded-full border border-current/30 text-current/70 inline-flex items-center justify-center hover:text-current hover:bg-current/10 focus:outline-none focus:ring-2 focus:ring-current/30 transition"
      >
        <Info className="w-3 h-3" />
      </button>
      <span
        role="tooltip"
        className={`absolute z-30 right-0 top-7 w-64 rounded-lg bg-gray-900 px-3 py-2 text-left text-xs font-medium leading-relaxed text-white shadow-lg transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'}`}
      >
        {text}
      </span>
    </span>
  );
}

import React from 'react';
import { useData } from '../../context/DataContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 p-4 bg-gray-900/95 text-white rounded-xl shadow-xl text-sm border border-gray-800 backdrop-blur-md transition-all duration-300 transform translate-y-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />}
              {!isSuccess && !isWarning && <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />}
              <span className="font-medium text-xs sm:text-sm truncate">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

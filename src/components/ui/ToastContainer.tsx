import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useWorkspace } from '../../hooks/useWorkspace';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useWorkspace();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.variant === 'success'
            ? CheckCircle2
            : toast.variant === 'warning'
              ? AlertTriangle
              : toast.variant === 'error'
                ? AlertCircle
                : Info;

        const iconColor =
          toast.variant === 'success'
            ? 'text-emerald-600 dark:text-emerald-400'
            : toast.variant === 'warning'
              ? 'text-amber-600 dark:text-amber-400'
              : toast.variant === 'error'
                ? 'text-red-600 dark:text-red-400'
                : 'text-blue-600 dark:text-blue-400';

        return (
          <div
            key={toast.id}
            role="status"
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconColor}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {toast.title}
              </p>
              {toast.description && (
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

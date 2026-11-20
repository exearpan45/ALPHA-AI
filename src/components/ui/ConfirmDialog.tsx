import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { Button } from './Button';

export const ConfirmDialog: React.FC = () => {
  const { confirmDialog, closeConfirm } = useWorkspace();

  useEffect(() => {
    if (!confirmDialog) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeConfirm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmDialog, closeConfirm]);

  if (!confirmDialog) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {confirmDialog.destructive && (
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
            )}
            <div>
              <h3
                id="confirm-dialog-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                {confirmDialog.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {confirmDialog.message}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeConfirm}
            aria-label="Close confirmation dialog"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={closeConfirm}>
            {confirmDialog.cancelLabel ?? 'Cancel'}
          </Button>
          <Button
            variant={confirmDialog.destructive ? 'danger' : 'primary'}
            onClick={() => {
              confirmDialog.onConfirm();
              closeConfirm();
            }}
          >
            {confirmDialog.confirmLabel ?? 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
};

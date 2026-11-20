import React from 'react';
import { AlertCircle, LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/70 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-1.5 max-w-md text-sm text-slate-600 dark:text-slate-400">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  onDismiss,
}) => {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-red-900/60 dark:bg-red-950/30"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
        <div>
          <p className="text-sm font-semibold text-red-900 dark:text-red-200">
            {title}
          </p>
          <p className="mt-0.5 text-xs text-red-700 dark:text-red-300">{message}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            Dismiss
          </Button>
        )}
      </div>
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading view">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          />
        ))}
      </div>
      <div className="space-y-2.5 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className="h-10 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800"
          />
        ))}
      </div>
    </div>
  );
};

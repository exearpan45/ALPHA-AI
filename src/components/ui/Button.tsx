import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 border border-transparent shadow-xs',
  secondary:
    'bg-white text-slate-900 hover:bg-slate-50 active:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-transparent shadow-xs',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[36px] px-3 py-1.5 text-xs',
  md: 'min-h-[40px] px-4 py-2 text-sm',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

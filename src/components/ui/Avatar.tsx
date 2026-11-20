import React, { useState } from 'react';
import { OWNER_AVATAR_PATH } from '../../data/demoData';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
};

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'sm' }) => {
  const [imgError, setImgError] = useState(false);

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  if (imgError) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 ${sizeMap[size]}`}
        aria-label={name}
      >
        {initials || 'AG'}
      </div>
    );
  }

  return (
    <img
      src={OWNER_AVATAR_PATH}
      alt={name}
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
      className={`shrink-0 rounded-full border border-slate-200 object-cover dark:border-slate-700 ${sizeMap[size]}`}
    />
  );
};

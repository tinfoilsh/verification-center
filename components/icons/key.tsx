import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
}

export const KeyIcon: React.FC<IconProps> = ({ size, className = '' }) => {
  return (
    <img
      src="/icons/key.svg"
      alt="Key"
      {...(size && {
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      })}
      className={className}
      style={{ display: 'inline-block', aspectRatio: '1', color: 'inherit' }}
    />
  );
};

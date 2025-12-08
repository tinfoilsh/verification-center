import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
}

export const SigstoreIcon: React.FC<IconProps> = ({ size = 28, className = '' }) => {
  const sizeValue = typeof size === 'number' ? `${size}px` : size;

  return (
    <img
      src="/icons/sigstore.svg"
      alt="Sigstore"
      width={sizeValue}
      height={sizeValue}
      className={className}
      style={{ display: 'inline-block', aspectRatio: '1', color: 'inherit' }}
    />
  );
};

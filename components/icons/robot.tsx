import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
}

export const RobotIcon: React.FC<IconProps> = ({ size, className = '' }) => {
  const sizeValue = size ? (typeof size === 'number' ? `${size}px` : size) : undefined;

  return (
    <div
      className={className}
      style={{
        display: 'inline-block',
        ...(sizeValue && { width: sizeValue, height: sizeValue }),
        backgroundColor: 'currentColor',
        maskImage: 'url(/icons/robot.svg)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: 'url(/icons/robot.svg)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
      role="img"
      aria-label="Robot"
    />
  );
};

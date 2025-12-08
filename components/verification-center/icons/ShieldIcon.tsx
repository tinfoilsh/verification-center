import type { IconProps } from './types'

export function ShieldIcon({
  className,
  style,
  color,
  size = 24,
}: IconProps) {
  const iconColor = color || style?.color || 'currentColor'
  const iconSize = typeof size === 'number' ? `${size}px` : size

  return (
    <svg
      className={className}
      style={{ width: iconSize, height: iconSize, ...style }}
      viewBox="0 0 445 445"
      fill={iconColor}
    >
      <rect x="-38.31" y="162.22" width="169.14" height="20.29" transform="translate(218.62 126.11) rotate(90)"/>
      <rect x="15.74" y="295.44" width="132.38" height="20.29" transform="translate(287.49 65.08) rotate(55.53)"/>
      <rect x="106.39" y="382.73" width="130.92" height="20.29" transform="translate(239.33 -30.6) rotate(32.68)"/>
      <rect x="312.84" y="162.22" width="169.14" height="20.29" transform="translate(569.78 -225.04) rotate(90)"/>
      <rect x="295.53" y="295.45" width="132.38" height="20.29" transform="translate(818.39 180.35) rotate(124.47)"/>
      <rect x="206.35" y="382.74" width="130.92" height="20.29" transform="translate(712.73 576.81) rotate(147.32)"/>
      <rect x="131.92" y="259.04" width="71.76" height="20.29" transform="translate(239.49 -39.81) rotate(45)"/>
      <rect x="166.34" y="204.65" width="182.87" height="20.29" transform="translate(-76.38 245.19) rotate(-45)"/>
      <rect x="36.11" y="74.51" width="93.92" height="20.29" transform="translate(166.14 169.3) rotate(180)"/>
      <rect x="311.66" y="74.51" width="95.9" height="20.29" transform="translate(719.21 169.3) rotate(180)"/>
      <rect x="190.72" y="28.53" width="20.29" height="20.29" transform="translate(401.74 77.34) rotate(180)"/>
      <rect x="231.12" y="28.53" width="20.29" height="20.29" transform="translate(482.54 77.34) rotate(180)"/>
      <rect x="211.02" y="8.23" width="20.29" height="20.29" transform="translate(442.32 36.76) rotate(180)"/>
      <rect x="237.98" y="51.64" width="87.13" height="20.29" transform="translate(478.68 272.07) rotate(-145.53)"/>
      <rect x="116.83" y="51.64" width="87.13" height="20.29" transform="translate(-6.81 101.63) rotate(-34.47)"/>
    </svg>
  )
}

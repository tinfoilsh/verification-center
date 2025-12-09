/**
 * Global color definitions for consistent theming across the application
 *
 * Tinfoil Brand Colors:
 * - tinfoil-dark: #061820 (primary dark background)
 * - tinfoil-light: #EEF3F3 (light background)
 * - tinfoil-accent-dark: #004444 (primary brand color)
 * - tinfoil-accent-light: #68C7AC (accent/success color)
 */

export const colors = {
  // Tinfoil dark - used for dark backgrounds, headers, text
  'tinfoil-dark': {
    DEFAULT: '#061820',
    hover: '#0A2230',
  },

  // Tinfoil light - used for light backgrounds, cards
  'tinfoil-light': {
    DEFAULT: '#EEF3F3',
    hover: '#E5EFEF',
  },

  // Tinfoil accent dark - used for buttons, links, primary actions
  'tinfoil-accent-dark': {
    DEFAULT: '#004444',
    hover: '#005555',
    darker: '#003333',
  },

  // Tinfoil accent light - used for success states, checkmarks, accents
  'tinfoil-accent-light': {
    DEFAULT: '#68C7AC',
    hover: '#7FD4BB',
    darker: '#5AB39A',
  },

  // Legacy gray colors for general use
  gray: {
    light: '#EEF3F3',
    DEFAULT: '#D1D5DB',
    hover: '#9CA3AF',
  },
  // Alias for legacy references in diagrams/components
  mint: {
    dark: '#004444',
  },
} as const

// Export individual colors for convenience
export const TINFOIL_DARK = colors['tinfoil-dark'].DEFAULT
export const TINFOIL_DARK_HOVER = colors['tinfoil-dark'].hover
export const TINFOIL_LIGHT = colors['tinfoil-light'].DEFAULT
export const TINFOIL_LIGHT_HOVER = colors['tinfoil-light'].hover
export const TINFOIL_ACCENT_DARK = colors['tinfoil-accent-dark'].DEFAULT
export const TINFOIL_ACCENT_DARK_HOVER = colors['tinfoil-accent-dark'].hover
export const TINFOIL_ACCENT_DARK_DARKER = colors['tinfoil-accent-dark'].darker
export const TINFOIL_ACCENT_LIGHT = colors['tinfoil-accent-light'].DEFAULT
export const TINFOIL_ACCENT_LIGHT_HOVER = colors['tinfoil-accent-light'].hover
export const TINFOIL_ACCENT_LIGHT_DARKER = colors['tinfoil-accent-light'].darker

// Legacy exports for backward compatibility (will be phased out)
export const EMERALD_500 = colors['tinfoil-accent-light'].DEFAULT
export const EMERALD_600 = colors['tinfoil-accent-light'].darker

// Tailwind class names for when inline styles aren't suitable
export const colorClasses = {
  'tinfoil-dark': {
    bg: 'bg-tinfoil-dark',
    bgHover: 'hover:bg-tinfoil-dark/90',
    text: 'text-tinfoil-dark',
    textHover: 'hover:text-tinfoil-dark/90',
    border: 'border-tinfoil-dark',
    borderHover: 'hover:border-tinfoil-dark/90',
  },
  'tinfoil-light': {
    bg: 'bg-tinfoil-light',
    bgHover: 'hover:bg-tinfoil-light/90',
    text: 'text-tinfoil-light',
    textHover: 'hover:text-tinfoil-light/90',
    border: 'border-tinfoil-light',
    borderHover: 'hover:border-tinfoil-light/90',
  },
  'tinfoil-accent-dark': {
    bg: 'bg-tinfoil-accent-dark',
    bgHover: 'hover:bg-tinfoil-accent-dark/90',
    bgDarker: 'bg-tinfoil-accent-dark-darker',
    text: 'text-tinfoil-accent-dark',
    textHover: 'hover:text-tinfoil-accent-dark/90',
    border: 'border-tinfoil-accent-dark',
    borderHover: 'hover:border-tinfoil-accent-dark/90',
    ring: 'ring-tinfoil-accent-dark',
  },
  'tinfoil-accent-light': {
    bg: 'bg-tinfoil-accent-light',
    bgHover: 'hover:bg-tinfoil-accent-light/90',
    bgDarker: 'bg-tinfoil-accent-light-darker',
    text: 'text-tinfoil-accent-light',
    textHover: 'hover:text-tinfoil-accent-light/90',
    border: 'border-tinfoil-accent-light',
    borderHover: 'hover:border-tinfoil-accent-light/90',
    ring: 'ring-tinfoil-accent-light',
  },
  // Alias for legacy "teal" references — maps to tinfoil-accent-dark
  teal: {
    bg: 'bg-tinfoil-accent-dark',
    bgHover: 'hover:bg-tinfoil-accent-dark/90',
    text: 'text-tinfoil-accent-dark',
    textHover: 'hover:text-tinfoil-accent-dark/90',
    border: 'border-tinfoil-accent-dark',
    borderHover: 'hover:border-tinfoil-accent-dark/90',
    ring: 'ring-tinfoil-accent-dark',
  },
  // Legacy class names for backward compatibility
  emerald: {
    text500: 'text-tinfoil-accent-light',
    text600: 'text-tinfoil-accent-light-darker',
    bg500: 'bg-tinfoil-accent-light',
    bg600: 'bg-tinfoil-accent-light-darker',
    border500: 'border-tinfoil-accent-light',
    border600: 'border-tinfoil-accent-light-darker',
  },
} as const

/**
 * Theme utility functions to reduce duplication of dark/light mode styling patterns
 */

/**
 * Get card/container classes based on dark mode
 */
export const getCardClasses = (isDarkMode: boolean, withOpacity = false) => {
  const baseClasses = 'border-border-subtle bg-surface-card'
  return withOpacity && isDarkMode
    ? `${baseClasses}/80`
    : baseClasses
}

/**
 * Get hover state classes
 */
export const getHoverClasses = (isDarkMode: boolean) =>
  isDarkMode ? 'hover:bg-surface-card/70' : 'hover:bg-surface-card/80'

/**
 * Get invert class for icons/images
 */
export const getInvertClass = (isDarkMode: boolean, invertInLight = false) =>
  (invertInLight ? !isDarkMode : isDarkMode) ? 'invert' : ''

/**
 * Get measurement block border classes based on verification status
 */
export const getMeasurementBorderClasses = (isDarkMode: boolean, isVerified?: boolean) => {
  const baseClasses = isDarkMode
    ? 'border-border-subtle bg-surface-chat text-content-primary'
    : 'border-border-subtle bg-surface-card text-content-primary'

  const statusBorder = isVerified === true
    ? 'border-emerald-500/50'
    : isVerified === false
    ? 'border-red-400/50'
    : ''

  return `${baseClasses} ${statusBorder}`.trim()
}

/**
 * Get attestation provider card classes
 */
export const getAttestationCardClasses = (isDarkMode: boolean) =>
  isDarkMode
    ? 'border border-gray-600 bg-surface-card/70 hover:bg-surface-card/50 hover:border-gray-500'
    : 'border border-gray-300 bg-surface-card/70 hover:bg-surface-card/50 hover:border-gray-400'

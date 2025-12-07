import { FONT_FAMILIES } from './constants'

/**
 * VerifierFooter - Footer component for the Verification Center
 *
 * Displays "Powered by Tinfoil" at the bottom.
 */
export function VerifierFooter({
  isDarkMode = true,
  className = '',
}: { isDarkMode?: boolean; className?: string }) {
  return (
    <div
      className={`px-4 py-3 ${
        isDarkMode
          ? 'bg-surface-card'
          : 'bg-white'
      } ${className}`}
    >
      <div className="flex items-center justify-center gap-2">
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: FONT_FAMILIES.AEONIK }}>
          Powered by
        </span>
        <a
          href="https://tinfoil.sh"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:opacity-70"
        >
          <img
            src={isDarkMode ? '/icons/logo-white.svg' : '/icons/logo-green.svg'}
            alt="Tinfoil"
            width={50}
            height={22}
            className={isDarkMode ? '' : 'opacity-80'}
          />
        </a>
      </div>
    </div>
  )
}

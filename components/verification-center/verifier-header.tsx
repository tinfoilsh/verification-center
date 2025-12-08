import { LuX } from 'react-icons/lu'
import { FONT_FAMILIES } from './constants'

type VerifierHeaderProps = {
  isDarkMode?: boolean
  onClose: () => void
  className?: string
}

/**
 * VerifierHeader - Shared header component for the Verification Center
 *
 * Displays "Verification Center" title on the left and close button on the right.
 * Used in the verification center web component.
 */
export function VerifierHeader({
  isDarkMode = true,
  onClose,
  className = '',
}: VerifierHeaderProps) {
  return (
    <div
      className={`relative flex items-center justify-center px-4 bg-surface-card ${className}`}
      style={{
        minHeight: '72px',
        paddingTop: '12px',
        paddingBottom: '12px',
        borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      }}
    >
      {/* Left side - Tin icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <img
          src="/icons/tin.svg"
          alt="Tinfoil"
          className={`h-10 w-10 ${isDarkMode ? 'brightness-0 invert' : ''}`}
        />
      </div>

      {/* Center - Title and Powered by */}
      <div className="flex flex-col items-center">
        <span
          className={`text-xl font-medium ${
            isDarkMode ? 'text-white' : 'text-content-primary'
          }`}
          style={{
            fontFamily: FONT_FAMILIES.AEONIK,
          }}
        >
          Verification Center
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            style={{ fontFamily: FONT_FAMILIES.AEONIK }}
          >
            Powered by
          </span>
          <a
            href="https://tinfoil.sh"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={isDarkMode ? '/icons/logo-white.svg' : '/icons/logo-green.svg'}
              alt="Tinfoil"
              width={45}
              height={20}
              className={`${isDarkMode ? '' : 'opacity-80'} hover:opacity-70 transition-opacity`}
            />
          </a>
        </div>
      </div>

      {/* Right side - Close button */}
      <button
        className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-lg p-2 transition-colors ${
          isDarkMode
            ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        onClick={onClose}
        style={{
          color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)'
        }}
      >
        <LuX className="h-5 w-5" style={{ color: 'inherit' }} />
      </button>
    </div>
  )
}

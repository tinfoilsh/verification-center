import { FONT_FAMILIES } from '../constants'

type OtherTabProps = {
  isDarkMode?: boolean
  errorMessage?: string
}

export function OtherTab({
  isDarkMode = true,
  errorMessage,
}: OtherTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3
          className={`mb-2 text-lg font-semibold ${
            isDarkMode ? 'text-content-primary' : 'text-gray-900'
          }`}
          style={{ fontFamily: FONT_FAMILIES.AEONIK }}
        >
          Error Details
        </h3>
        <p
          className={`text-sm ${
            isDarkMode ? 'text-content-secondary' : 'text-gray-600'
          }`}
          style={{ fontFamily: FONT_FAMILIES.AEONIK }}
        >
          {errorMessage || 'An unexpected error occurred during verification.'}
        </p>
      </div>
    </div>
  )
}

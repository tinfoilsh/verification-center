import { FONT_FAMILIES } from '@/lib/constants/verification'

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
            isDarkMode ? 'text-red-400' : 'text-red-600'
          }`}
          style={{ fontFamily: FONT_FAMILIES.AEONIK }}
        >
          Error Details
        </h3>
        <p
          className={`text-sm ${
            isDarkMode ? 'text-red-400' : 'text-red-600'
          }`}
          style={{ fontFamily: FONT_FAMILIES.AEONIK }}
        >
          {errorMessage || 'An unexpected error occurred during verification.'}
        </p>
      </div>
    </div>
  )
}

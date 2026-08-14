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
          className={`mb-2 font-semibold ${
            isDarkMode ? 'text-red-400' : 'text-red-600'
          }`}
          style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '14px' }}
        >
          Error details
        </h3>
        <p
          className={
            isDarkMode ? 'text-red-400' : 'text-red-600'
          }
          style={{ fontFamily: FONT_FAMILIES.AEONIK_FONO, fontSize: '14px' }}
        >
          {errorMessage || 'An unexpected error occurred during verification.'}
        </p>
      </div>
    </div>
  )
}

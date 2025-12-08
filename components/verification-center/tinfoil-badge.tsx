'use client'

import { useMemo } from 'react'
import { PiSpinner } from 'react-icons/pi'
import { LockIcon } from './icons'
import type { VerificationDocument } from './types/verification'

type BadgeState = 'idle' | 'loading' | 'success' | 'error'

type TinfoilBadgeProps = {
  verificationDocument?: VerificationDocument
  isDarkMode?: boolean
  compact?: boolean
  onClick?: () => void
}

const TinfoilTextLogo = ({ className, style, isDarkMode }: { className?: string; style?: React.CSSProperties; isDarkMode?: boolean }) => (
  <svg className={className} style={style} viewBox="0 0 3154 813" fill={isDarkMode ? '#fff' : '#000'}>
    <path d="M825.24,610.01l-579.29,176.68L10.37,602.06,235.81,23.4l589.43,586.61ZM146.55,564.75l122.82,96.26,341.7-104.2L278.57,225.89l-132.02,338.86Z"/>
    <path d="M1533.37,723.85v-456.93h111.94v30.2c40.49-32.39,93.12-35.55,141.02-35.55,99.76,0,183.49,53.44,183.49,208.43v253.85h-113.12v-244.94c0-81.05-33.85-122.92-99.76-122.92-72.15,0-110.45,45.43-110.45,127.37v240.49h-113.12Z"/>
    <path d="M3033.88,723.85V100.35h113.12v623.5h-113.12Z"/>
    <path d="M2842.92,723.85v-456.93h113.12v456.93h-113.12ZM2899.05,215.33c-36.52,0-63.24-26.72-63.24-62.35s26.72-62.35,63.24-62.35,63.24,26.72,63.24,62.35-27.61,62.35-63.24,62.35Z"/>
    <path d="M2547.49,729.19c-142.51,0-237.82-93.52-237.82-233.37s95.31-234.26,237.82-234.26,237.82,93.52,237.82,234.26-95.31,233.37-237.82,233.37ZM2547.49,635.67c74.82,0,122.03-57.9,122.03-139.84s-47.21-140.73-122.03-140.73-122.03,57.9-122.03,140.73,47.21,139.84,122.03,139.84Z"/>
    <path d="M2076.52,723.85v-359.85h-77.49v-97.09h77.49v-38.3c0-82.84,42.75-128.26,132.72-128.26h97.98v97.09h-79.27c-27.61,0-40.08,12.47-40.08,40.08v29.39h119.35v97.09h-117.57v359.85h-113.12Z"/>
    <path d="M1342.44,723.85v-456.93h113.12v456.93h-113.12ZM1398.54,215.33c-36.52,0-63.24-26.72-63.24-62.35s26.72-62.35,63.24-62.35,63.24,26.72,63.24,62.35-27.61,62.35-63.24,62.35Z"/>
    <path d="M993.39,723.85V205.46h-186.16v-105.1h491.67v105.1h-185.27v518.39h-120.25Z"/>
  </svg>
)

function getBadgeStatus(
  verificationDocument?: VerificationDocument,
  fallbackState: BadgeState = 'idle'
): { state: BadgeState; label: string } {
  if (!verificationDocument) {
    return { state: fallbackState, label: 'Verify request' }
  }

  const stepValues = Object.values(verificationDocument.steps || {})
  const hasErrors = stepValues.some((step) => step?.status === 'failed')

  if (hasErrors) {
    const errorStep = stepValues.find((step) => step?.status === 'failed')
    return {
      state: 'error',
      label: errorStep?.error || 'Verification failed',
    }
  }

  const allComplete = stepValues.every((step) => step?.status === 'success')

  if (allComplete && verificationDocument.securityVerified) {
    return { state: 'success', label: 'Privacy Verified' }
  }

  return { state: 'loading', label: 'Verifying privacy...' }
}

export function TinfoilBadge({
  verificationDocument,
  isDarkMode = true,
  compact = false,
  onClick,
}: TinfoilBadgeProps) {
  const { computedState, label } = useMemo(() => {
    return getBadgeStatus(verificationDocument)
  }, [verificationDocument])

  const buttonClass = [
    'transition-all duration-500 w-full h-full',
    computedState === 'success' && isDarkMode
      ? 'border-emerald-600/30 bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20'
      : '',
    computedState === 'success' && !isDarkMode
      ? 'border-[#004444] bg-[#004444]/10 text-[#004444] hover:bg-[#004444]/20'
      : '',
    computedState === 'error' && isDarkMode
      ? 'border-red-600/30 bg-red-600/10 text-red-600 hover:bg-red-600/20'
      : '',
    computedState === 'error' && !isDarkMode
      ? 'border-red-500/30 bg-red-500/10 text-red-700 hover:bg-red-500/20'
      : '',
    (computedState === 'idle' || computedState === 'loading') && isDarkMode
      ? 'border-gray-600/30 text-gray-400 hover:bg-gray-600/10'
      : '',
    (computedState === 'idle' || computedState === 'loading') && !isDarkMode
      ? 'border-[#004444] text-[#004444] hover:bg-gray-100'
      : '',
  ]
    .filter(Boolean)
    .join(' ')

  const backgroundColor = isDarkMode ? '#0b0f16' : '#ffffff'

  if (compact) {
    return (
      <button
        type="button"
        className={buttonClass}
        onClick={onClick}
        disabled={computedState === 'loading'}
        style={{
          padding: 0,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'center',
          boxSizing: 'border-box',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 'normal',
          backgroundColor,
          cursor: computedState === 'loading' ? 'default' : 'pointer',
          minHeight: '32px',
        }}
      >
        <div
          style={{
            flex: '0 0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '4px 12px 2px',
            minHeight: '16px',
          }}
        >
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              transition: 'opacity 0.3s ease-in-out',
              opacity: 1,
              lineHeight: 1.2,
              flex: 1,
              minWidth: 0,
              textAlign: 'center',
            }}
          >
            {label}
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '1px',
            backgroundColor:
              computedState === 'error'
                ? isDarkMode
                  ? '#4b5563'
                  : '#d1d5db'
                : 'currentColor',
            opacity: 0.15,
            flex: '0 0 auto',
          }}
        />
        <div
          style={{
            flex: '0 0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            fontSize: '9px',
            padding: '2px 12px 4px',
            minHeight: '11px',
          }}
        >
          <span
            style={{
              opacity: 0.5,
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              lineHeight: 1,
            }}
          >
            Powered by
          </span>
          <TinfoilTextLogo
            isDarkMode={isDarkMode}
            style={{
              width: '30px',
              height: '7px',
              opacity: isDarkMode ? 1 : 0.8,
            }}
          />
        </div>
      </button>
    )
  }

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={onClick}
      disabled={computedState === 'loading'}
      style={{
        padding: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        boxSizing: 'border-box',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 'normal',
        backgroundColor,
        cursor: computedState === 'loading' ? 'default' : 'pointer',
      }}
    >
      <div
        style={{
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 12px',
          position: 'relative',
        }}
      >
        {computedState === 'loading' ? (
          <PiSpinner
            className="animate-spin"
            style={{
              width: '24px',
              height: '24px',
              opacity: isDarkMode ? 0.6 : 1,
              color: 'currentColor',
            }}
          />
        ) : (
          <LockIcon
            size={24}
            color={
              computedState === 'success'
                ? isDarkMode
                  ? '#10b981'
                  : '#059669'
                : computedState === 'error'
                ? '#ef4444'
                : isDarkMode
                ? '#9ca3af'
                : '#6b7280'
            }
          />
        )}
      </div>
      <div
        style={{
          width: '1px',
          height: 'auto',
          backgroundColor:
            computedState === 'error'
              ? isDarkMode
                ? '#4b5563'
                : '#d1d5db'
              : 'currentColor',
          opacity: 0.2,
          flex: '0 0 auto',
        }}
      />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'center',
          minWidth: 0,
        }}
      >
        <div
          style={{
            flex: '0 0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px 12px 2px',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              transition: 'opacity 0.3s ease-in-out',
              opacity: 1,
              fontSize: '12px',
              textAlign: 'center',
            }}
          >
            {label}
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '1px',
            backgroundColor:
              computedState === 'error'
                ? isDarkMode
                  ? '#4b5563'
                  : '#d1d5db'
                : 'currentColor',
            opacity: 0.2,
            flex: '0 0 auto',
          }}
        />
        <div
          style={{
            flex: '0 0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '10px',
            padding: '2px 12px 4px',
          }}
        >
          <span
            style={{
              opacity: 0.6,
              color: isDarkMode ? '#9ca3af' : '#6b7280',
            }}
          >
            Powered by
          </span>
          <TinfoilTextLogo
            isDarkMode={isDarkMode}
            style={{
              width: '36px',
              height: '9px',
              opacity: isDarkMode ? 1 : 0.8,
            }}
          />
        </div>
      </div>
    </button>
  )
}

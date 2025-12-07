/**
 * Utilities for formatting measurement values for display
 */

export interface MeasurementData {
  measurement?: string
  certificate?: string
}

/**
 * Parse measurement data and extract type and registers
 */
export function parseMeasurement(data: MeasurementData | string | undefined): { type: string; registers: string[] } | null {
  if (!data) return null

  if (typeof data === 'string') {
    const cleaned = data.replace(/^"|"$/g, '')

    try {
      const parsed = JSON.parse(cleaned)
      if (parsed.type && parsed.registers && Array.isArray(parsed.registers)) {
        return { type: parsed.type, registers: parsed.registers }
      }
    } catch {
      // Not JSON
    }
    return null
  }

  if (typeof data === 'object' && data?.measurement) {
    try {
      const parsed = JSON.parse(data.measurement)
      if (parsed.type && parsed.registers && Array.isArray(parsed.registers)) {
        return { type: parsed.type, registers: parsed.registers }
      }
    } catch {
      // Not JSON
    }
    return null
  }

  return null
}
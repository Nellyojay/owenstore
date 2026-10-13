import { normalizeCode } from './inputGuards'

export function generateReferenceCode(prefix: string, existingReferences: string[]): string {
  const codePrefix = normalizeCode(prefix)
  const usedReferences = new Set(existingReferences.map(normalizeCode))
  const randomStart = Math.floor(Math.random() * 10_000)

  for (let offset = 0; offset < 10_000; offset += 1) {
    const digits = ((randomStart + offset) % 10_000).toString().padStart(4, '0')
    const reference = `${codePrefix}-${digits}`
    if (!usedReferences.has(normalizeCode(reference))) return reference
  }

  throw new Error(`No available references for ${codePrefix}.`)
}
export function generateReferenceCode(prefix: string, existingReferences: string[]): string {
  const usedReferences = new Set(existingReferences.map((reference) => reference.toUpperCase()))
  const randomStart = Math.floor(Math.random() * 10_000)

  for (let offset = 0; offset < 10_000; offset += 1) {
    const digits = ((randomStart + offset) % 10_000).toString().padStart(4, '0')
    const reference = `${prefix}-${digits}`
    if (!usedReferences.has(reference.toUpperCase())) return reference
  }

  throw new Error(`No available references for ${prefix}.`)
}
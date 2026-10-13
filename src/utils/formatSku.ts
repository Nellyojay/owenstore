export function formatSku(abbreviation: string, existingSkus: string[] = []): string {
  const letters = abbreviation.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3)
  const prefix = (letters || 'COL').padEnd(3, 'X')
  const usedSkus = new Set(existingSkus.map((sku) => sku.toUpperCase()))
  const randomStart = Math.floor(Math.random() * 10_000)

  for (let offset = 0; offset < 10_000; offset += 1) {
    const number = ((randomStart + offset) % 10_000).toString().padStart(4, '0')
    const sku = `${prefix}-${number}`
    if (!usedSkus.has(sku)) return sku
  }

  throw new Error(`No available SKU numbers for ${prefix}.`)
}
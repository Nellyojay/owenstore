export function normalizeNumberInput(value: string): string {
  const [integerPart, decimalPart] = value.split('.')
  const normalizedInteger = integerPart.replace(/^0+(?=\d)/, '')

  return decimalPart === undefined
    ? normalizedInteger
    : `${normalizedInteger}.${decimalPart}`
}
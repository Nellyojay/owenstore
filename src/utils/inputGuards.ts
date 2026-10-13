export function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

export function normalizeDescription(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, '')
}

export function normalizeCode(value: string): string {
  return value.trim().toUpperCase()
}

export function normalizeSearchQuery(value: string): string {
  return normalizeName(value).toLowerCase()
}

export function hasRequiredText(value: string): boolean {
  return normalizeName(value).length > 0
}

export function isValidEmail(value: string): boolean {
  const email = normalizeEmail(value)
  return email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
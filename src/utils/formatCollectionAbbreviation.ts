export function formatCollectionAbbreviation(name: string): string {
  const letters = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 3)

  return (letters || 'COL').padEnd(3, 'X')
}
import type { PurchaseItem, Sale, SaleItem } from '../data/types'

export function calculateSaleTotal(items: SaleItem[]): number {
  return items.reduce((total, item) => total + item.quantity * item.sellingPrice, 0)
}

export function calculateSaleProfit(sale: Sale): number {
  if (sale.status !== 'completed') return 0

  return sale.items.reduce(
    (profit, item) => profit + item.quantity * (item.sellingPrice - item.costPrice),
    0,
  )
}

export function calculateProfit(sales: Sale[]): number {
  return sales.reduce((profit, sale) => profit + calculateSaleProfit(sale), 0)
}

export function calculatePurchaseTotal(items: PurchaseItem[]): number {
  return items.reduce((total, item) => total + item.quantity * item.unitCost, 0)
}
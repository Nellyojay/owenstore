import { store } from '../data/store'
import type { Purchase } from '../data/types'
import { calculatePurchaseTotal } from '../utils/calculations'
import { generateId } from '../utils/generateId'
import { recordStockMovement } from './inventoryService'

export type NewPurchase = {
  productId: string
  quantity: number
  unitCost: number
  date: string
  reference: string
  paymentMethod?: string
}

export function createPurchase(input: NewPurchase): Purchase | null {
  const product = store.products.find((entry) => entry.id === input.productId)
  if (!product || input.quantity <= 0 || input.unitCost < 0) return null

  const items = [
    {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: input.quantity,
      unitCost: input.unitCost,
    },
  ]
  const purchase: Purchase = {
    id: generateId('purchase'),
    date: input.date,
    reference: input.reference,
    supplierId: product.supplierId,
    supplier: product.supplier,
    paymentStatus: 'paid',
    paymentMethod: input.paymentMethod ?? 'cash',
    items,
    total: calculatePurchaseTotal(items),
  }
  store.purchases.unshift(purchase)
  product.quantity += input.quantity
  product.costPrice = input.unitCost
  product.lastRestocked = input.date
  recordStockMovement({
    productId: product.id,
    quantityChange: input.quantity,
    reason: 'purchase',
    reference: purchase.id,
    date: input.date,
  })
  return purchase
}

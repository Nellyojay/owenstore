import { store } from '../data/store'
import type { Product, Purchase, PurchaseItem } from '../data/types'
import { calculatePurchaseTotal } from '../utils/calculations'
import { generateId } from '../utils/generateId'
import { generateReferenceCode } from '../utils/generateReferenceCode'
import { recordStockMovement } from './inventoryService'

export type NewPurchase = {
  items: {
    productId: string
    quantity: number
    unitCost: number
  }[]
  date: string
  paymentMethod?: string
}

export function createPurchase(input: NewPurchase): Purchase | null {
  if (input.items.length === 0) return null

  const productLines: { input: NewPurchase['items'][number]; product: Product }[] = []
  for (const item of input.items) {
    const product = store.products.find((entry) => entry.id === item.productId)
    if (!product || item.quantity <= 0 || item.unitCost < 0) return null
    productLines.push({ input: item, product })
  }

  const supplier = productLines[0].product
  if (productLines.some(({ product }) => product.supplierId !== supplier.supplierId)) return null

  const items: PurchaseItem[] = productLines.map(({ input: item, product }) => ({
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    quantity: item.quantity,
    unitCost: item.unitCost,
  }))

  const purchase: Purchase = {
    id: generateId('purchase'),
    date: input.date,
    reference: generateReferenceCode('STK', store.purchases.map((purchase) => purchase.reference)),
    supplierId: supplier.supplierId,
    supplier: supplier.supplier,
    paymentStatus: 'paid',
    paymentMethod: input.paymentMethod ?? 'cash',
    items,
    total: calculatePurchaseTotal(items),
  }
  store.purchases.unshift(purchase)

  for (const { input: item, product } of productLines) {
    product.quantity += item.quantity
    product.costPrice = item.unitCost
    product.lastRestocked = input.date
    recordStockMovement({
      productId: product.id,
      quantityChange: item.quantity,
      reason: 'purchase',
      reference: purchase.id,
      date: input.date,
    })
  }

  return purchase
}

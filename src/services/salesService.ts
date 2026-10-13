import { store } from '../data/store'
import type { Product, Sale } from '../data/types'
import { calculateSaleTotal } from '../utils/calculations'
import { generateId } from '../utils/generateId'
import { generateReferenceCode } from '../utils/generateReferenceCode'
import { recordStockMovement } from './inventoryService'

export type NewSale = {
  items: {
    productId: string
    quantity: number
    sellingPrice: number
  }[]
  date: string
}

export function createSale(input: NewSale): Sale | null {
  if (input.items.length === 0) return null

  const productLines: { input: NewSale['items'][number]; product: Product }[] = []
  const requestedByProduct = new Map<string, number>()
  for (const item of input.items) {
    const product = store.products.find((entry) => entry.id === item.productId)
    if (!product || item.quantity <= 0 || item.sellingPrice < 0) return null
    const requestedQuantity = (requestedByProduct.get(product.id) ?? 0) + item.quantity
    if (requestedQuantity > product.quantity) return null
    requestedByProduct.set(product.id, requestedQuantity)
    productLines.push({ input: item, product })
  }

  const items = productLines.map(({ input: item, product }) => ({
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    quantity: item.quantity,
    sellingPrice: item.sellingPrice,
    costPrice: product.costPrice,
  }))
  const sale: Sale = {
    id: generateId('sale'),
    date: input.date,
    reference: generateReferenceCode('SALE', store.sales.map((sale) => sale.reference)),
    status: 'completed',
    items,
    total: calculateSaleTotal(items),
  }
  store.sales.unshift(sale)

  for (const { input: item, product } of productLines) {
    product.quantity -= item.quantity
    recordStockMovement({
      productId: product.id,
      quantityChange: -item.quantity,
      reason: 'sale',
      reference: sale.id,
      date: input.date,
    })
  }

  return sale
}

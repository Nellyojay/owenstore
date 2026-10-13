import { store } from '../data/store'
import type { Sale } from '../data/types'
import { calculateSaleTotal } from '../utils/calculations'
import { generateId } from '../utils/generateId'
import { generateReferenceCode } from '../utils/generateReferenceCode'
import { recordStockMovement } from './inventoryService'

export type NewSale = {
  productId: string
  quantity: number
  sellingPrice: number
  date: string
}

export function createSale(input: NewSale): Sale | null {
  const product = store.products.find((entry) => entry.id === input.productId)
  if (
    !product ||
    input.quantity <= 0 ||
    input.quantity > product.quantity ||
    input.sellingPrice < 0
  )
    return null

  const items = [
    {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: input.quantity,
      sellingPrice: input.sellingPrice,
      costPrice: product.costPrice,
    },
  ]
  const sale: Sale = {
    id: generateId('sale'),
    date: input.date,
    reference: generateReferenceCode('SALE', store.sales.map((sale) => sale.reference)),
    status: 'completed',
    items,
    total: calculateSaleTotal(items),
  }
  store.sales.unshift(sale)
  product.quantity -= input.quantity
  recordStockMovement({
    productId: product.id,
    quantityChange: -input.quantity,
    reason: 'sale',
    reference: sale.id,
    date: input.date,
  })
  return sale
}

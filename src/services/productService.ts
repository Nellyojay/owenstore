import { store } from '../data/store'
import type { Product } from '../data/types'
import { formatSku } from '../utils/formatSku'
import { generateId } from '../utils/generateId'
import { recordStockMovement } from './inventoryService'

export type NewProduct = Omit<Product, 'id' | 'sku'>

export function addProduct(input: NewProduct): Product {
  const collection = store.collections.find((entry) => entry.id === input.collectionId)
  const product: Product = {
    ...input,
    id: generateId('product'),
    sku: formatSku(collection?.abbreviation ?? 'COL', store.products.map((existing) => existing.sku)),
  }
  store.products.unshift(product)
  if (product.quantity > 0) {
    recordStockMovement({
      productId: product.id,
      quantityChange: product.quantity,
      reason: 'opening_stock',
      reference: 'Opening stock',
      date: product.lastRestocked,
    })
  }
  return product
}

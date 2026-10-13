import { store } from '../data/store'
import type { Product } from '../data/types'
import { generateId } from '../utils/generateId'
import { recordStockMovement } from './inventoryService'

export type NewProduct = Omit<Product, 'id'>

export function addProduct(input: NewProduct): Product {
  const product: Product = { ...input, id: generateId('product') }
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

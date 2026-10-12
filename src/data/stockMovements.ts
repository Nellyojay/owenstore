import { products } from './products'
import type { StockMovement } from './types'

export const stockMovements: StockMovement[] = products.map((product) => ({
  id: `opening-${product.id}`,
  productId: product.id,
  quantityChange: product.quantity,
  reason: 'opening_stock',
  reference: 'Opening stock',
  date: product.lastRestocked,
}))
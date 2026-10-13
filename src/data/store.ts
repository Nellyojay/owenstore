import { collections } from './collections'
import { products } from './products'
import { purchases } from './purchases'
import { sales } from './sales'
import { stockMovements } from './stockMovements'
import { suppliers } from './suppliers'
import type { Store } from './types'

export const store: Store = {
  collections,
  products,
  suppliers,
  sales,
  purchases,
  stockMovements,
}

import { calculateSaleTotal } from '../utils/calculations'
import type { Sale, SaleItem } from './types'

const initialSaleLines: SaleItem[] = [
  {
    productId: 'part-1',
    productName: 'Oil filter HF-204',
    sku: 'FLT-204',
    quantity: 2,
    sellingPrice: 6500,
    costPrice: 4500,
  },
  {
    productId: 'part-3',
    productName: 'NGK CR8 spark plug',
    sku: 'IGN-CR8',
    quantity: 4,
    sellingPrice: 4500,
    costPrice: 2800,
  },
  {
    productId: 'part-2',
    productName: 'Front brake pads',
    sku: 'BRK-009',
    quantity: 1,
    sellingPrice: 12500,
    costPrice: 8000,
  },
]

export const sales: Sale[] = [
  {
    id: 'sale-1',
    date: '2026-10-11',
    reference: 'SALE-1042',
    status: 'completed',
    items: [initialSaleLines[0]],
    total: calculateSaleTotal([initialSaleLines[0]]),
  },
  {
    id: 'sale-2',
    date: '2026-10-11',
    reference: 'SALE-1041',
    status: 'completed',
    items: [initialSaleLines[1]],
    total: calculateSaleTotal([initialSaleLines[1]]),
  },
  {
    id: 'sale-3',
    date: '2026-10-09',
    reference: 'SALE-1037',
    status: 'completed',
    items: [initialSaleLines[2]],
    total: calculateSaleTotal([initialSaleLines[2]]),
  },
]

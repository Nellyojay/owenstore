import type { Purchase } from './types'

export const purchases: Purchase[] = [
  {
    id: 'restock-1',
    date: '2026-09-28',
    reference: 'INV-4821',
    supplierId: 'supplier-rider-supply',
    supplier: 'Rider Supply Co.',
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    items: [
      {
        productId: 'part-2',
        productName: 'Front brake pads',
        sku: 'BRK-009',
        quantity: 20,
        unitCost: 8000,
      },
    ],
    total: 160000,
  },
  {
    id: 'restock-2',
    date: '2026-10-05',
    reference: 'INV-4893',
    supplierId: 'supplier-motohub',
    supplier: 'MotoHub Wholesale',
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    items: [
      {
        productId: 'part-1',
        productName: 'Oil filter HF-204',
        sku: 'FLT-204',
        quantity: 24,
        unitCost: 4500,
      },
    ],
    total: 108000,
  },
  {
    id: 'restock-3',
    date: '2026-10-08',
    reference: 'INV-4910',
    supplierId: 'supplier-city-moto',
    supplier: 'City Moto Spares',
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    items: [
      {
        productId: 'part-7',
        productName: '12V indicator bulb',
        sku: 'ELC-115',
        quantity: 10,
        unitCost: 900,
      },
    ],
    total: 9000,
  },
]
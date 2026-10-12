import type { Collection, InventoryItem, RestockPurchase, SaleRecord } from '../types'

export const initialCollections: Collection[] = [
  { id: 'collection-engine', name: 'Engine & filters', description: 'Service parts for routine engine maintenance.' },
  { id: 'collection-brakes', name: 'Brakes & drivetrain', description: 'Stopping, chain and transmission components.' },
  { id: 'collection-electrical', name: 'Electrical', description: 'Bulbs, ignition and electrical spares.' },
  { id: 'collection-controls', name: 'Controls & fittings', description: 'Cables, mirrors and rider controls.' },
]

export const initialInventory: InventoryItem[] = [
  { id: 'part-1', sku: 'FLT-204', name: 'Oil filter HF-204', category: 'Filters', collectionId: 'collection-engine', stock: 18, reorderPoint: 12, unitCost: 4500, salePrice: 6500, supplier: 'MotoHub Wholesale', lastRestocked: '2026-10-05' },
  { id: 'part-2', sku: 'BRK-009', name: 'Front brake pads', category: 'Brakes', collectionId: 'collection-brakes', stock: 7, reorderPoint: 10, unitCost: 8000, salePrice: 12500, supplier: 'Rider Supply Co.', lastRestocked: '2026-09-28' },
  { id: 'part-3', sku: 'IGN-CR8', name: 'NGK CR8 spark plug', category: 'Ignition', collectionId: 'collection-electrical', stock: 34, reorderPoint: 12, unitCost: 2800, salePrice: 4500, supplier: 'MotoHub Wholesale', lastRestocked: '2026-10-03' },
  { id: 'part-4', sku: 'DRV-428', name: '428H chain set', category: 'Drivetrain', collectionId: 'collection-brakes', stock: 5, reorderPoint: 8, unitCost: 18500, salePrice: 26000, supplier: 'Torque Parts Ltd.', lastRestocked: '2026-09-20' },
  { id: 'part-5', sku: 'CTL-112', name: 'Universal clutch cable', category: 'Controls', collectionId: 'collection-controls', stock: 14, reorderPoint: 6, unitCost: 5200, salePrice: 8500, supplier: 'Rider Supply Co.', lastRestocked: '2026-09-30' },
  { id: 'part-6', sku: 'FLT-FO1', name: 'Foam air filter', category: 'Filters', collectionId: 'collection-engine', stock: 4, reorderPoint: 8, unitCost: 6500, salePrice: 9500, supplier: 'MotoHub Wholesale', lastRestocked: '2026-09-18' },
  { id: 'part-7', sku: 'ELC-115', name: '12V indicator bulb', category: 'Electrical', collectionId: 'collection-electrical', stock: 2, reorderPoint: 10, unitCost: 900, salePrice: 1600, supplier: 'City Moto Spares', lastRestocked: '2026-09-14' },
  { id: 'part-8', sku: 'CTL-M02', name: 'Universal mirror pair', category: 'Controls', collectionId: 'collection-controls', stock: 11, reorderPoint: 5, unitCost: 7200, salePrice: 11000, supplier: 'Rider Supply Co.', lastRestocked: '2026-10-01' },
]

function createRestockPurchase(
  id: string,
  item: InventoryItem,
  quantity: number,
  unitPrice: number,
  date: string,
  reference: string,
): RestockPurchase {
  return {
    id,
    itemId: item.id,
    itemName: item.name,
    sku: item.sku,
    supplier: item.supplier,
    quantity,
    unitPrice,
    totalPrice: quantity * unitPrice,
    date,
    reference,
  }
}

export const initialRestocks: RestockPurchase[] = [
  createRestockPurchase('restock-1', initialInventory[1], 20, 8000, '2026-09-28', 'INV-4821'),
  createRestockPurchase('restock-2', initialInventory[0], 24, 4500, '2026-10-05', 'INV-4893'),
  createRestockPurchase('restock-3', initialInventory[6], 10, 900, '2026-10-08', 'INV-4910'),
]

function createSale(id: string, item: InventoryItem, quantity: number, unitPrice: number, date: string, reference: string): SaleRecord {
  return {
    id,
    itemId: item.id,
    itemName: item.name,
    sku: item.sku,
    quantity,
    unitPrice,
    totalPrice: quantity * unitPrice,
    date,
    reference,
  }
}

export const initialSales: SaleRecord[] = [
  createSale('sale-1', initialInventory[0], 2, 6500, '2026-10-11', 'SALE-1042'),
  createSale('sale-2', initialInventory[2], 4, 4500, '2026-10-11', 'SALE-1041'),
  createSale('sale-3', initialInventory[1], 1, 12500, '2026-10-09', 'SALE-1037'),
]
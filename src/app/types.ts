import type { Supplier as SupplierRecord } from '../data/types'

export type InventoryItem = {
  id: string
  sku: string
  name: string
  collectionId: string
  supplierId: string
  stock: number
  reorderPoint: number
  unitCost: number
  salePrice: number
  supplier: string
  lastRestocked: string
}

export type InventoryInput = Omit<InventoryItem, 'id' | 'lastRestocked' | 'sku' | 'supplier'> & {
  supplierId: string
  compatibleMotorcycleModels?: string[]
}

export type Collection = {
  id: string
  name: string
  abbreviation: string
  description: string
}

export type CollectionInput = Omit<Collection, 'id' | 'abbreviation'>

export type Supplier = SupplierRecord
export type SupplierInput = Omit<Supplier, 'id'>

export type RestockPurchase = {
  id: string
  itemId: string
  itemName: string
  sku: string
  supplier: string
  quantity: number
  unitPrice: number
  totalPrice: number
  date: string
  reference: string
}

export type RestockLineInput = Pick<RestockPurchase, 'itemId' | 'quantity' | 'unitPrice'>

export type RestockInput = {
  items: RestockLineInput[]
  date: string
}

export type SaleRecord = {
  id: string
  itemId: string
  itemName: string
  sku: string
  quantity: number
  unitPrice: number
  totalPrice: number
  date: string
  reference: string
}

export type SaleLineInput = Pick<SaleRecord, 'itemId' | 'quantity' | 'unitPrice'>

export type SaleInput = {
  items: SaleLineInput[]
  date: string
}

export type AppOutletContext = {
  inventory: InventoryItem[]
  collections: Collection[]
  suppliers: Supplier[]
  restocks: RestockPurchase[]
  sales: SaleRecord[]
  profit: number
  addItem: (item: InventoryInput) => void
  addCollection: (collection: CollectionInput) => void
  addSupplier: (supplier: SupplierInput) => boolean
  receiveRestock: (purchase: RestockInput) => void
  recordSale: (sale: SaleInput) => boolean
}

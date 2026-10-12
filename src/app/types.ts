export type InventoryItem = {
  id: string
  sku: string
  name: string
  category: string
  collectionId: string
  stock: number
  reorderPoint: number
  unitCost: number
  salePrice: number
  supplier: string
  lastRestocked: string
}

export type InventoryInput = Omit<InventoryItem, 'id' | 'lastRestocked'>

export type Collection = {
  id: string
  name: string
  description: string
}

export type CollectionInput = Omit<Collection, 'id'>

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

export type RestockInput = Pick<RestockPurchase, 'itemId' | 'quantity' | 'unitPrice' | 'date' | 'reference'>

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

export type SaleInput = Pick<SaleRecord, 'itemId' | 'quantity' | 'unitPrice' | 'date' | 'reference'>

export type AppOutletContext = {
  inventory: InventoryItem[]
  collections: Collection[]
  restocks: RestockPurchase[]
  sales: SaleRecord[]
  addItem: (item: InventoryInput) => void
  addCollection: (collection: CollectionInput) => void
  receiveRestock: (purchase: RestockInput) => void
  recordSale: (sale: SaleInput) => boolean
}

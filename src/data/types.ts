export type Category = {
  id: string
  name: string
  description: string
}

export type Supplier = {
  id: string
  name: string
  phone: string
  email: string
}

export type Product = {
  id: string
  sku: string
  name: string
  categoryId: string
  category: string
  collectionId: string
  quantity: number
  reorderPoint: number
  costPrice: number
  sellingPrice: number
  supplierId: string
  supplier: string
  compatibleMotorcycleModels: string[]
  lastRestocked: string
}

export type SaleItem = {
  productId: string
  productName: string
  sku: string
  quantity: number
  sellingPrice: number
  costPrice: number
}

export type Sale = {
  id: string
  date: string
  reference: string
  status: 'completed' | 'cancelled'
  items: SaleItem[]
  total: number
}

export type PurchaseItem = {
  productId: string
  productName: string
  sku: string
  quantity: number
  unitCost: number
}

export type Purchase = {
  id: string
  date: string
  reference: string
  supplierId: string
  supplier: string
  paymentStatus: 'paid'
  paymentMethod: string
  items: PurchaseItem[]
  total: number
}

export type StockMovement = {
  id: string
  productId: string
  quantityChange: number
  reason: 'opening_stock' | 'purchase' | 'sale' | 'adjustment'
  reference: string
  date: string
}

export type Store = {
  categories: Category[]
  products: Product[]
  suppliers: Supplier[]
  sales: Sale[]
  purchases: Purchase[]
  stockMovements: StockMovement[]
}
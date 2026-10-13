import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './components/header'
import { store } from '../data/store'
import type { Product, Purchase, Sale } from '../data/types'
import { addProduct } from '../services/productService'
import { createPurchase } from '../services/purchaseService'
import { createSale } from '../services/salesService'
import { calculateProfit } from '../utils/calculations'
import { generateId } from '../utils/generateId'
import type {
  AppOutletContext,
  CollectionInput,
  InventoryInput,
  InventoryItem,
  RestockInput,
  RestockPurchase,
  SaleInput,
  SaleRecord,
} from './types'
import { formatCollectionAbbreviation } from '../utils/formatCollectionAbbreviation'

function toInventoryItem(product: Product): InventoryItem {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    collectionId: product.collectionId,
    stock: product.quantity,
    reorderPoint: product.reorderPoint,
    unitCost: product.costPrice,
    salePrice: product.sellingPrice,
    supplier: product.supplier,
    lastRestocked: product.lastRestocked,
  }
}

function toRestockRecords(purchases: Purchase[]): RestockPurchase[] {
  return purchases.flatMap((purchase) =>
    purchase.items.map((item) => ({
      id: `${purchase.id}-${item.productId}`,
      itemId: item.productId,
      itemName: item.productName,
      sku: item.sku,
      supplier: purchase.supplier,
      quantity: item.quantity,
      unitPrice: item.unitCost,
      totalPrice: item.quantity * item.unitCost,
      date: purchase.date,
      reference: purchase.reference,
    })),
  )
}

function toSaleRecords(sales: Sale[]): SaleRecord[] {
  return sales.flatMap((sale) =>
    sale.items.map((item) => ({
      id: `${sale.id}-${item.productId}`,
      itemId: item.productId,
      itemName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: item.sellingPrice,
      totalPrice: item.quantity * item.sellingPrice,
      date: sale.date,
      reference: sale.reference,
    })),
  )
}

export function App() {
  const location = useLocation()
  const [, setStoreVersion] = useState(0)
  const inventory = store.products.map(toInventoryItem)
  const collections = store.collections
  const restocks = toRestockRecords(store.purchases)
  const sales = toSaleRecords(store.sales)
  const profit = calculateProfit(store.sales)

  function refreshStore() {
    setStoreVersion((version) => version + 1)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  function addItem(item: InventoryInput) {
    let supplier = store.suppliers.find((entry) => entry.name === item.supplier)
    if (!supplier) {
      supplier = { id: generateId('supplier'), name: item.supplier, phone: '', email: '' }
      store.suppliers.unshift(supplier)
    }
    addProduct({
      name: item.name,
      collectionId: item.collectionId,
      quantity: item.stock,
      reorderPoint: item.reorderPoint,
      costPrice: item.unitCost,
      sellingPrice: item.salePrice,
      supplierId: supplier.id,
      supplier: supplier.name,
      compatibleMotorcycleModels: item.compatibleMotorcycleModels ?? [],
      lastRestocked: new Date().toISOString().slice(0, 10),
    })
    refreshStore()
  }

  function addCollection(collection: CollectionInput) {
    store.collections.unshift({
      ...collection,
      id: generateId('collection'),
      abbreviation: formatCollectionAbbreviation(collection.name),
    })
    refreshStore()
  }

  function receiveRestock(input: RestockInput) {
    const purchase = createPurchase({
      productId: input.itemId,
      quantity: input.quantity,
      unitCost: input.unitPrice,
      date: input.date,
    })
    if (purchase) refreshStore()
  }

  function recordSale(input: SaleInput) {
    const sale = createSale({
      productId: input.itemId,
      quantity: input.quantity,
      sellingPrice: input.unitPrice,
      date: input.date,
    })
    if (!sale) return false
    refreshStore()
    return true
  }

  const outletContext: AppOutletContext = {
    inventory,
    collections,
    restocks,
    sales,
    profit,
    addItem,
    addCollection,
    receiveRestock,
    recordSale,
  }

  return (
    <div className="min-h-screen bg-[#f3f4ef] text-[#252e28]">
      <Header />
      <div className="min-h-screen lg:pl-60">
        <Outlet context={outletContext} />
      </div>
    </div>
  )
}

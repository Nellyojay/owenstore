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
import {
  isValidEmail,
  normalizeDescription,
  normalizeEmail,
  normalizeName,
  normalizePhone,
  normalizeSearchQuery,
} from '../utils/inputGuards'
import type {
  AppOutletContext,
  CollectionInput,
  InventoryInput,
  InventoryItem,
  RestockInput,
  RestockPurchase,
  SaleInput,
  SaleRecord,
  SupplierInput,
} from './types'
import { formatCollectionAbbreviation } from '../utils/formatCollectionAbbreviation'

function toInventoryItem(product: Product): InventoryItem {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    collectionId: product.collectionId,
    supplierId: product.supplierId,
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
    purchase.items.map((item, index) => ({
      id: `${purchase.id}-${index}`,
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
    const supplier = store.suppliers.find((entry) => entry.id === item.supplierId)
    if (!supplier || !normalizeName(item.name)) return
    addProduct({
      name: normalizeName(item.name),
      collectionId: item.collectionId,
      quantity: item.stock,
      reorderPoint: item.reorderPoint,
      costPrice: item.unitCost,
      sellingPrice: item.salePrice,
      supplierId: supplier.id,
      supplier: supplier.name,
      compatibleMotorcycleModels: (item.compatibleMotorcycleModels ?? [])
        .map(normalizeName)
        .filter(Boolean),
      lastRestocked: new Date().toISOString().slice(0, 10),
    })
    refreshStore()
  }

  function addCollection(collection: CollectionInput) {
    const name = normalizeName(collection.name)
    if (!name) return
    store.collections.unshift({
      name,
      description: normalizeDescription(collection.description),
      id: generateId('collection'),
      abbreviation: formatCollectionAbbreviation(name),
    })
    refreshStore()
  }

  function addSupplier(input: SupplierInput) {
    const name = normalizeName(input.name)
    const email = normalizeEmail(input.email)
    if (!name || !isValidEmail(email)) return false
    if (
      store.suppliers.some(
        (supplier) => normalizeSearchQuery(supplier.name) === normalizeSearchQuery(name),
      )
    ) {
      return false
    }
    store.suppliers.unshift({
      id: generateId('supplier'),
      name,
      phone: normalizePhone(input.phone),
      email,
    })
    refreshStore()
    return true
  }

  function receiveRestock(input: RestockInput) {
    const purchase = createPurchase({
      items: input.items.map((item) => ({
        productId: item.itemId,
        quantity: item.quantity,
        unitCost: item.unitPrice,
      })),
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
    suppliers: store.suppliers,
    restocks,
    sales,
    profit,
    addItem,
    addCollection,
    addSupplier,
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

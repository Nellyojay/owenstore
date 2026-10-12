import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './components/header'
import { initialCollections, initialInventory, initialRestocks, initialSales } from './data/data'
import type { AppOutletContext, CollectionInput, InventoryInput, RestockInput, SaleInput } from './types'

function readSaved<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T) : fallback
  } catch {
    return fallback
  }
}

export function App() {
  const location = useLocation()
  const [inventory, setInventory] = useState(() => readSaved('owenstore.inventory.v1', initialInventory))
  const [collections, setCollections] = useState(() => readSaved('owenstore.collections.v1', initialCollections))
  const [restocks, setRestocks] = useState(() => readSaved('owenstore.restocks.v1', initialRestocks))
  const [sales, setSales] = useState(() => readSaved('owenstore.sales.v1', initialSales))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  useEffect(() => localStorage.setItem('owenstore.inventory.v1', JSON.stringify(inventory)), [inventory])
  useEffect(() => localStorage.setItem('owenstore.collections.v1', JSON.stringify(collections)), [collections])
  useEffect(() => localStorage.setItem('owenstore.restocks.v1', JSON.stringify(restocks)), [restocks])
  useEffect(() => localStorage.setItem('owenstore.sales.v1', JSON.stringify(sales)), [sales])

  function addItem(item: InventoryInput) {
    setInventory((current) => [{ ...item, id: crypto.randomUUID(), lastRestocked: new Date().toISOString().slice(0, 10) }, ...current])
  }

  function addCollection(collection: CollectionInput) {
    setCollections((current) => [{ ...collection, id: crypto.randomUUID() }, ...current])
  }

  function receiveRestock(input: RestockInput) {
    const item = inventory.find((entry) => entry.id === input.itemId)
    if (!item || input.quantity <= 0 || input.unitPrice < 0) return

    setInventory((current) => current.map((entry) => entry.id === item.id
      ? { ...entry, stock: entry.stock + input.quantity, unitCost: input.unitPrice, lastRestocked: input.date }
      : entry))
    setRestocks((current) => [{
      ...input,
      id: crypto.randomUUID(),
      itemName: item.name,
      sku: item.sku,
      supplier: item.supplier,
      totalPrice: input.quantity * input.unitPrice,
    }, ...current])
  }

  function recordSale(input: SaleInput) {
    const item = inventory.find((entry) => entry.id === input.itemId)
    if (!item || input.quantity <= 0 || input.quantity > item.stock || input.unitPrice < 0) return false

    setInventory((current) => current.map((entry) => entry.id === item.id
      ? { ...entry, stock: entry.stock - input.quantity }
      : entry))
    setSales((current) => [{
      ...input,
      id: crypto.randomUUID(),
      itemName: item.name,
      sku: item.sku,
      totalPrice: input.quantity * input.unitPrice,
    }, ...current])
    return true
  }

  const outletContext: AppOutletContext = {
    inventory,
    collections,
    restocks,
    sales,
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

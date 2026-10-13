import { ArrowDownLeft, PackagePlus, Plus, Search, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import { DataTable, TransactionPageLayout } from '../components/transaction-page'
import { formatAmount, formatDate, todayISO } from '../constants/format'
import type { AppOutletContext, RestockPurchase } from '../types'
import { normalizeNumberInput } from '../../utils/normalizeNumberInput'
import { normalizeSearchQuery } from '../../utils/inputGuards'

const fieldClass =
  'h-10 w-full border border-[#dfe3da] bg-white px-3 text-[12px] text-[#29362d] outline-none focus:border-[#788c68]'
const labelClass = 'mb-1.5 block text-[10px] font-semibold text-[#656e63]'

type PendingRestockItem = {
  productId: string
  productName: string
  sku: string
  supplierId: string
  supplier: string
  quantity: number
  unitPrice: number
}

export function RestocksPage() {
  const { inventory, collections, suppliers, restocks, receiveRestock } =
    useOutletContext<AppOutletContext>()
  const [searchParams] = useSearchParams()
  const requestedItemId = searchParams.get('item')
  const requestedItem = inventory.find((item) => item.id === requestedItemId)
  const initialItemId = requestedItem?.id ?? ''
  const [selectedSupplierId, setSelectedSupplierId] = useState(requestedItem?.supplierId ?? '')
  const [selectedItemId, setSelectedItemId] = useState(initialItemId)
  const [productQuery, setProductQuery] = useState(
    inventory.find((item) => item.id === initialItemId)?.name ?? '',
  )
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false)
  const [activeProductIndex, setActiveProductIndex] = useState(-1)
  const [quantity, setQuantity] = useState('')
  const [unitPrice, setUnitPrice] = useState(() => {
    const price = inventory.find((item) => item.id === initialItemId)?.unitCost ?? 0
    return price > 0 ? String(price) : ''
  })
  const [date, setDate] = useState(todayISO())
  const [notice, setNotice] = useState('')
  const [noticeIsError, setNoticeIsError] = useState(false)
  const [pendingItems, setPendingItems] = useState<PendingRestockItem[]>([])
  const selectedItem = inventory.find((item) => item.id === selectedItemId)
  const selectedSupplier = suppliers.find((supplier) => supplier.id === selectedSupplierId)
  const quantityValue = Number(quantity)
  const unitPriceValue = Number(unitPrice)
  const normalizedProductQuery = normalizeSearchQuery(productQuery)
  const collectionNames = new Map(collections.map((collection) => [collection.id, collection.name]))
  const matchingItems = inventory.filter(
    (item) =>
      item.supplierId === selectedSupplierId &&
      normalizeSearchQuery(
        [item.name, item.sku, collectionNames.get(item.collectionId)].join(' '),
      ).includes(normalizedProductQuery),
  )
  const pendingSupplierId = pendingItems[0]?.supplierId
  const pendingSupplier = suppliers.find((supplier) => supplier.id === pendingSupplierId)
  const hasSupplierMismatch = Boolean(
    pendingSupplierId && selectedItem && pendingSupplierId !== selectedItem.supplierId,
  )
  const totalPrice = pendingItems.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0,
  )
  const totalSpent = restocks.reduce((sum, entry) => sum + entry.totalPrice, 0)

  function selectProduct(itemId: string) {
    const item = inventory.find((inventoryItem) => inventoryItem.id === itemId)
    if (!item || item.supplierId !== selectedSupplierId) return

    setSelectedItemId(item.id)
    setProductQuery(item.name)
    setUnitPrice(item.unitCost > 0 ? String(item.unitCost) : '')
    setIsProductMenuOpen(false)
    setActiveProductIndex(-1)
  }

  function addPendingItem() {
    if (!selectedItem || quantityValue <= 0 || !unitPrice.trim() || unitPriceValue < 0) return
    if (hasSupplierMismatch) {
      setNotice(`Add items from ${pendingSupplier} to this restock.`)
      setNoticeIsError(true)
      return
    }

    setPendingItems((items) => [
      ...items,
      {
        productId: selectedItem.id,
        productName: selectedItem.name,
        sku: selectedItem.sku,
        supplierId: selectedItem.supplierId,
        supplier: selectedItem.supplier,
        quantity: quantityValue,
        unitPrice: unitPriceValue,
      },
    ])
    setQuantity('')
    setProductQuery('')
    setUnitPrice('')
    setNotice('Item added to this restock.')
    setNoticeIsError(false)
  }

  function submitRestock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pendingItems.length === 0) return
    receiveRestock({
      items: pendingItems.map((item) => ({
        itemId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      date,
    })
    setNotice(
      `${pendingItems.length} item${pendingItems.length === 1 ? '' : 's'} restocked. Total: ${formatAmount(totalPrice)}.`,
    )
    setNoticeIsError(false)
    setPendingItems([])
  }

  return (
    <TransactionPageLayout
      eyebrow="Supplier purchases"
      title="Restocks"
      description="Receive stock and keep purchase costs attached to each part."
      formTitle="Receive a purchase"
      formDescription="Stock increases when you save the receipt."
      formContent={
        <form onSubmit={submitRestock} className="space-y-3 p-4">
          <label>
            <span className={labelClass}>Supplier</span>
            <select
              required
              value={selectedSupplierId}
              disabled={pendingItems.length > 0}
              onChange={(event) => {
                setSelectedSupplierId(event.target.value)
                setSelectedItemId('')
                setProductQuery('')
                setUnitPrice('')
                setIsProductMenuOpen(false)
              }}
              className={fieldClass}
            >
              <option value="">Select supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            {pendingItems.length > 0 && selectedSupplier && (
              <span className="mt-1 block text-[10px] text-[#737a70]">
                This restock is for {selectedSupplier.name}.
              </span>
            )}
          </label>
          <div className="relative">
            <label htmlFor="restock-product-search" className={labelClass}>
              Part
            </label>
            <div className="relative">
              <Search
                size={15}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#858b82]"
              />
              <input
                id="restock-product-search"
                type="text"
                role="combobox"
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={isProductMenuOpen}
                aria-controls="restock-product-options"
                aria-activedescendant={
                  matchingItems[activeProductIndex]
                    ? `restock-product-option-${activeProductIndex}`
                    : undefined
                }
                value={productQuery}
                disabled={!selectedSupplierId}
                onFocus={() => {
                  setIsProductMenuOpen(true)
                  setActiveProductIndex(matchingItems.length > 0 ? 0 : -1)
                }}
                onBlur={() => setIsProductMenuOpen(false)}
                onChange={(event) => {
                  setProductQuery(event.target.value)
                  setSelectedItemId('')
                  setUnitPrice('')
                  setIsProductMenuOpen(true)
                  setActiveProductIndex(0)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown' && matchingItems.length > 0) {
                    event.preventDefault()
                    setIsProductMenuOpen(true)
                    setActiveProductIndex((index) =>
                      index < 0 ? 0 : Math.min(index + 1, matchingItems.length - 1),
                    )
                  }
                  if (event.key === 'ArrowUp' && matchingItems.length > 0) {
                    event.preventDefault()
                    setIsProductMenuOpen(true)
                    setActiveProductIndex((index) =>
                      index < 0 ? matchingItems.length - 1 : Math.max(index - 1, 0),
                    )
                  }
                  if (event.key === 'Enter' && isProductMenuOpen && matchingItems.length > 0) {
                    event.preventDefault()
                    selectProduct(matchingItems[Math.max(activeProductIndex, 0)].id)
                  }
                  if (event.key === 'Escape') {
                    setIsProductMenuOpen(false)
                    setActiveProductIndex(-1)
                  }
                }}
                placeholder={
                  selectedSupplier ? `Search ${selectedSupplier.name} items` : 'Select a supplier first'
                }
                className={`${fieldClass} pl-9`}
              />
            </div>
            {isProductMenuOpen && (
              <ul
                id="restock-product-options"
                role="listbox"
                className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto border border-[#dfe3da] bg-white py-1 shadow-lg"
              >
                {!selectedSupplierId ? (
                  <li className="px-3 py-3 text-[11px] text-[#737a70]" role="option" aria-selected="false">
                    Select a supplier to see its items.
                  </li>
                ) : matchingItems.length > 0 ? (
                  matchingItems.map((item, index) => (
                    <li key={item.id} role="presentation">
                      <button
                        id={`restock-product-option-${index}`}
                        type="button"
                        role="option"
                        aria-selected={activeProductIndex === index}
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseEnter={() => setActiveProductIndex(index)}
                        onClick={() => selectProduct(item.id)}
                        className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-[#f3f5ef] ${activeProductIndex === index ? 'bg-[#f3f5ef]' : ''}`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[11px] font-medium text-[#364137]">
                            {item.name}
                          </span>
                          <span className="mt-0.5 block truncate font-mono text-[9px] text-[#858b82]">
                            {item.sku} · {collectionNames.get(item.collectionId) ?? 'Unassigned'}
                          </span>
                        </span>
                        <span className="shrink-0 text-[10px] tabular-nums text-[#737a70]">
                          {item.stock} in stock
                        </span>
                      </button>
                    </li>
                  ))
                ) : (
                  <li
                    className="px-3 py-3 text-[11px] text-[#737a70]"
                    role="option"
                    aria-selected="false"
                  >
                    No matching items for {selectedSupplier?.name}.
                  </li>
                )}
              </ul>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className={labelClass}>Quantity received</span>
              <input
                min="1"
                step="1"
                type="number"
                value={quantity}
                placeholder="1"
                onChange={(event) => setQuantity(normalizeNumberInput(event.target.value))}
                className={fieldClass}
              />
            </label>
            <label>
              <span className={labelClass}>Unit purchase cost</span>
              <input
                min="0"
                step="any"
                type="number"
                value={unitPrice}
                placeholder="0.00"
                onChange={(event) => setUnitPrice(normalizeNumberInput(event.target.value))}
                className={fieldClass}
              />
            </label>
          </div>
          <button
            type="button"
            onClick={addPendingItem}
            disabled={!selectedSupplierId || !selectedItem || quantityValue < 1 || !unitPrice.trim() || unitPriceValue < 0 || hasSupplierMismatch}
            className="flex h-9 w-full items-center justify-center gap-2 border border-[#dfe3da] text-[11px] font-semibold text-[#526b45] hover:bg-[#f3f5ef] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Plus size={14} /> Add item to restock
          </button>
          {pendingItems.length > 0 && (
            <section className="border border-[#e2e5dc] bg-white">
              <div className="flex items-center justify-between border-b border-[#eceee8] px-3 py-2">
                <div>
                  <h3 className="text-[11px] font-semibold text-[#364137]">Items to record</h3>
                  <p className="mt-0.5 text-[10px] text-[#737a70]">
                    Supplier: {pendingSupplier?.name}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#737a70]">{pendingItems.length} items</span>
                  <button
                    type="button"
                    onClick={() => setPendingItems([])}
                    className="inline-flex h-7 items-center gap-1.5 px-2 text-[10px] font-semibold text-[#a85c39] hover:bg-[#fbf0ea]"
                  >
                    <Trash2 size={12} /> Clear items
                  </button>
                </div>
              </div>
              <ul className="divide-y divide-[#eceee8]">
                {pendingItems.map((item, index) => (
                  <li key={`${item.productId}-${index}`} className="flex items-center gap-3 px-3 py-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-medium text-[#364137]">{item.productName}</p>
                      <p className="mt-0.5 font-mono text-[9px] text-[#858b82]">
                        {item.sku} · {item.quantity} × {formatAmount(item.unitPrice)}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] font-semibold tabular-nums text-[#364137]">
                      {formatAmount(item.quantity * item.unitPrice)}
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${item.productName}`}
                      onClick={() => setPendingItems((items) => items.filter((_, i) => i !== index))}
                      className="flex h-7 w-7 shrink-0 items-center justify-center text-[#858b82] hover:bg-[#f3f5ef] hover:text-[#a85c39]"
                    >
                      <Trash2 size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <div className="grid gap-3">
            <label>
              <span className={labelClass}>Date received</span>
              <input
                required
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className={fieldClass}
              />
            </label>
          </div>
          <div className="flex items-end justify-between border-t border-[#eceee8] pt-3">
            <div>
              <p className="text-[10px] text-[#737a70]">Purchase total</p>
              <p className="mt-1 text-[22px] font-semibold tabular-nums text-[#29362d]">
                {formatAmount(totalPrice)}
              </p>
            </div>
            <p className="pb-1 text-[10px] text-[#858b82]">{selectedItem?.supplier}</p>
          </div>
          <button
            disabled={pendingItems.length === 0}
            type="submit"
            className="flex h-10 w-full items-center justify-center gap-2 bg-[#344a35] text-[11px] font-semibold text-white hover:bg-[#293c2b] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <PackagePlus size={15} /> Record restock
          </button>
          {notice && (
            <p
              role="status"
              className={`border px-3 py-2 text-[11px] ${noticeIsError ? 'border-[#e7c8b7] bg-[#fbf0ea] text-[#975334]' : 'border-[#d5e2cb] bg-[#edf3e8] text-[#435b3d]'}`}
            >
              {notice}
            </p>
          )}
        </form>
      }
      historyTitle="Purchase history"
      historySummary={`${restocks.length} supplier receipts · total spend ${formatAmount(totalSpent)}`}
      historyIcon={<ArrowDownLeft size={17} className="text-[#75816f]" />}
      historyContent={
        <DataTable<RestockPurchase>
          rows={restocks}
          getRowKey={(entry: RestockPurchase) => entry.id}
          emptyMessage="No purchases recorded yet."
          minWidthClassName="min-w-170"
          columns={[
            {
              key: 'date',
              label: 'Received',
              headerClassName: 'px-4',
              cellClassName: 'whitespace-nowrap px-4 text-[10px] text-[#737a70]',
              render: (entry: RestockPurchase) => formatDate(entry.date),
            },
            {
              key: 'part',
              label: 'Part',
              render: (entry: RestockPurchase) => (
                <>
                  <p className="text-[11px] font-medium text-[#364137]">{entry.itemName}</p>
                  <p className="mt-1 font-mono text-[9px] text-[#858b82]">{entry.sku}</p>
                </>
              ),
            },
            {
              key: 'supplier-invoice',
              label: 'Supplier / invoice',
              render: (entry: RestockPurchase) => (
                <>
                  <p className="text-[10px] text-[#626b61]">{entry.supplier}</p>
                  <p className="mt-1 text-[9px] text-[#92988e]">{entry.reference}</p>
                </>
              ),
            },
            {
              key: 'quantity',
              label: 'Qty',
              headerClassName: 'text-right',
              cellClassName: 'text-right text-[11px] tabular-nums',
              render: (entry: RestockPurchase) => entry.quantity,
            },
            {
              key: 'unit-cost',
              label: 'Unit cost',
              headerClassName: 'text-right',
              cellClassName: 'text-right text-[11px] tabular-nums',
              render: (entry: RestockPurchase) => formatAmount(entry.unitPrice),
            },
            {
              key: 'total',
              label: 'Total',
              headerClassName: 'px-4 text-right',
              cellClassName: 'px-4 text-right text-[11px] font-semibold tabular-nums',
              render: (entry: RestockPurchase) => formatAmount(entry.totalPrice),
            },
          ]}
        />
      }
    />
  )
}

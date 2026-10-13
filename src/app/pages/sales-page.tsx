import { ArrowUpRight, ReceiptText, Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import { DataTable, TransactionPageLayout } from '../components/transaction-page'
import { formatAmount, formatDate, todayISO } from '../constants/format'
import type { AppOutletContext, SaleRecord } from '../types'
import { normalizeNumberInput } from '../../utils/normalizeNumberInput'

const fieldClass =
  'h-10 w-full border border-[#dfe3da] bg-white px-3 text-[12px] text-[#29362d] outline-none focus:border-[#788c68]'
const labelClass = 'mb-1.5 block text-[10px] font-semibold text-[#656e63]'

export function SalesPage() {
  const { inventory, collections, sales, recordSale } = useOutletContext<AppOutletContext>()
  const [searchParams] = useSearchParams()
  const requestedItemId = searchParams.get('item')
  const initialItemId = inventory.some((item) => item.id === requestedItemId)
    ? (requestedItemId ?? '')
    : (inventory[0]?.id ?? '')
  const [selectedItemId, setSelectedItemId] = useState(initialItemId)
  const [productQuery, setProductQuery] = useState(
    inventory.find((item) => item.id === initialItemId)?.name ?? '',
  )
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false)
  const [activeProductIndex, setActiveProductIndex] = useState(-1)
  const [quantity, setQuantity] = useState('')
  const [unitPrice, setUnitPrice] = useState(() => {
    const price = inventory.find((item) => item.id === initialItemId)?.salePrice ?? 0
    return price > 0 ? String(price) : ''
  })
  const [date, setDate] = useState(todayISO())
  const [reference, setReference] = useState('')
  const [notice, setNotice] = useState('')
  const [noticeIsError, setNoticeIsError] = useState(false)
  const selectedItem = inventory.find((item) => item.id === selectedItemId)
  const quantityValue = Number(quantity)
  const unitPriceValue = Number(unitPrice)
  const normalizedProductQuery = productQuery.trim().toLowerCase()
  const collectionNames = new Map(collections.map((collection) => [collection.id, collection.name]))
  const matchingItems = inventory.filter((item) =>
    [item.name, item.sku, collectionNames.get(item.collectionId), item.supplier]
      .join(' ')
      .toLowerCase()
      .includes(normalizedProductQuery),
  )
  const totalPrice = quantityValue * unitPriceValue
  const salesTotal = sales.reduce((sum, sale) => sum + sale.totalPrice, 0)

  function selectProduct(itemId: string) {
    const item = inventory.find((inventoryItem) => inventoryItem.id === itemId)
    if (!item) return

    setSelectedItemId(item.id)
    setProductQuery(item.name)
    setUnitPrice(item.salePrice > 0 ? String(item.salePrice) : '')
    setIsProductMenuOpen(false)
    setActiveProductIndex(-1)
  }

  function submitSale(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedItem) return
    if (quantityValue <= 0 || quantityValue > selectedItem.stock) {
      setNotice(`Only ${selectedItem.stock} units are available.`)
      setNoticeIsError(true)
      return
    }
    const saved = recordSale({
      itemId: selectedItem.id,
      quantity: quantityValue,
      unitPrice: unitPriceValue,
      date,
      reference: reference.trim() || 'Counter sale',
    })
    if (!saved) return
    setNotice(`${quantityValue} × ${selectedItem.name} recorded. Total: ${formatAmount(totalPrice)}.`)
    setNoticeIsError(false)
    setQuantity('')
    setReference('')
  }

  return (
    <TransactionPageLayout
      eyebrow="Counter transactions"
      title="Sales"
      description="Record a sale, update stock, and keep a searchable paper trail."
      formTitle="Record a sale"
      formDescription="Sold quantity is deducted from available stock."
      formContent={
        <form onSubmit={submitSale} className="space-y-3 p-4">
          <div className="relative">
            <label htmlFor="sale-product-search" className={labelClass}>
              Part sold
            </label>
            <div className="relative">
              <Search
                size={15}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#858b82]"
              />
              <input
                id="sale-product-search"
                type="text"
                required
                role="combobox"
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={isProductMenuOpen}
                aria-controls="sale-product-options"
                aria-activedescendant={
                  matchingItems[activeProductIndex]
                    ? `sale-product-option-${activeProductIndex}`
                    : undefined
                }
                value={productQuery}
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
                placeholder="Search by name, SKU, collection, or supplier"
                className={`${fieldClass} pl-9`}
              />
            </div>
            {isProductMenuOpen && (
              <ul
                id="sale-product-options"
                role="listbox"
                className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto border border-[#dfe3da] bg-white py-1 shadow-lg"
              >
                {matchingItems.length > 0 ? (
                  matchingItems.map((item, index) => (
                    <li key={item.id} role="presentation">
                      <button
                        id={`sale-product-option-${index}`}
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
                    No matching products
                  </li>
                )}
              </ul>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className={labelClass}>Quantity sold</span>
              <input
                required
                min="1"
                max={selectedItem?.stock ?? 0}
                step="1"
                type="number"
                value={quantity}
                placeholder="1"
                onChange={(event) => setQuantity(normalizeNumberInput(event.target.value))}
                className={fieldClass}
              />
            </label>
            <label>
              <span className={labelClass}>Unit sale price</span>
              <input
                required
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
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className={labelClass}>Sale date</span>
              <input
                required
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className={fieldClass}
              />
            </label>
            <label>
              <span className={labelClass}>Receipt reference</span>
              <input
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder="Optional"
                className={fieldClass}
              />
            </label>
          </div>
          <div className="flex items-end justify-between border-t border-[#eceee8] pt-3">
            <div>
              <p className="text-[10px] text-[#737a70]">Sale total</p>
              <p className="mt-1 text-[22px] font-semibold tabular-nums text-[#29362d]">
                {formatAmount(totalPrice)}
              </p>
            </div>
            <p className="pb-1 text-[10px] text-[#858b82]">{selectedItem?.stock ?? 0} available</p>
          </div>
          <button
            disabled={
              !selectedItem ||
              quantityValue < 1 ||
              quantityValue > (selectedItem?.stock ?? 0) ||
              unitPriceValue < 0
            }
            type="submit"
            className="flex h-10 w-full items-center justify-center gap-2 bg-[#344a35] text-[11px] font-semibold text-white hover:bg-[#293c2b] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ArrowUpRight size={15} /> Save sale
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
      historyTitle="Sales history"
      historySummary={`${sales.length} transactions · total sales ${formatAmount(salesTotal)}`}
      historyIcon={<ReceiptText size={17} className="text-[#75816f]" />}
      historyContent={
        <DataTable<SaleRecord>
          rows={sales}
          getRowKey={(sale: SaleRecord) => sale.id}
          emptyMessage="No sales recorded yet."
          minWidthClassName="min-w-152.5"
          columns={[
            {
              key: 'date',
              label: 'Date',
              headerClassName: 'px-4',
              cellClassName: 'whitespace-nowrap px-4 text-[10px] text-[#737a70]',
              render: (sale: SaleRecord) => formatDate(sale.date),
            },
            {
              key: 'part',
              label: 'Part',
              render: (sale: SaleRecord) => (
                <>
                  <p className="text-[11px] font-medium text-[#364137]">{sale.itemName}</p>
                  <p className="mt-1 font-mono text-[9px] text-[#858b82]">{sale.sku}</p>
                </>
              ),
            },
            {
              key: 'receipt',
              label: 'Receipt',
              cellClassName: 'text-[10px] text-[#737a70]',
              render: (sale: SaleRecord) => sale.reference,
            },
            {
              key: 'quantity',
              label: 'Qty',
              headerClassName: 'text-right',
              cellClassName: 'text-right text-[11px] tabular-nums',
              render: (sale: SaleRecord) => sale.quantity,
            },
            {
              key: 'unit-price',
              label: 'Unit price',
              headerClassName: 'text-right',
              cellClassName: 'text-right text-[11px] tabular-nums',
              render: (sale: SaleRecord) => formatAmount(sale.unitPrice),
            },
            {
              key: 'total',
              label: 'Total',
              headerClassName: 'px-4 text-right',
              cellClassName: 'px-4 text-right text-[11px] font-semibold tabular-nums',
              render: (sale: SaleRecord) => formatAmount(sale.totalPrice),
            },
          ]}
        />
      }
    />
  )
}

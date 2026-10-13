import { ArrowDownLeft, PackagePlus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import { formatAmount, formatDate, todayISO } from '../constants/format'
import type { AppOutletContext } from '../types'

const fieldClass =
  'h-10 w-full border border-[#dfe3da] bg-white px-3 text-[12px] text-[#29362d] outline-none focus:border-[#788c68]'
const labelClass = 'mb-1.5 block text-[10px] font-semibold text-[#656e63]'

export function RestocksPage() {
  const { inventory, restocks, receiveRestock } = useOutletContext<AppOutletContext>()
  const [searchParams] = useSearchParams()
  const [selectedItemId, setSelectedItemId] = useState(
    searchParams.get('item') ?? inventory[0]?.id ?? '',
  )
  const [quantity, setQuantity] = useState(1)
  const [unitPrice, setUnitPrice] = useState(
    inventory.find((item) => item.id === (searchParams.get('item') ?? inventory[0]?.id))
      ?.unitCost ?? 0,
  )
  const [date, setDate] = useState(todayISO())
  const [reference, setReference] = useState('')
  const [notice, setNotice] = useState('')
  const selectedItem = inventory.find((item) => item.id === selectedItemId)
  const totalPrice = quantity * unitPrice
  const totalSpent = restocks.reduce((sum, entry) => sum + entry.totalPrice, 0)

  function submitRestock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedItem || quantity <= 0 || unitPrice < 0) return
    receiveRestock({
      itemId: selectedItem.id,
      quantity,
      unitPrice,
      date,
      reference: reference.trim() || 'Stock receipt',
    })
    setNotice(
      `${quantity} units of ${selectedItem.name} received. Total: ${formatAmount(totalPrice)}.`,
    )
    setQuantity(1)
    setReference('')
  }

  return (
    <main className="mx-auto max-w-360 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#75816f]">
          Supplier purchases
        </p>
        <h1 className="mt-1 text-[27px] font-semibold tracking-tight text-[#26342b] sm:text-[32px]">
          Restocks
        </h1>
        <p className="mt-1 text-[13px] text-[#737a70]">
          Receive stock and keep purchase costs attached to each part.
        </p>
      </div>

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.5fr)]">
        <section className="min-w-0 border border-[#e2e5dc] bg-[#fbfcf8]">
          <div className="border-b border-[#e2e5dc] px-4 py-4">
            <h2 className="text-[14px] font-semibold text-[#29362d]">Receive a purchase</h2>
            <p className="mt-1 text-[11px] text-[#858b82]">
              Stock increases when you save the receipt.
            </p>
          </div>
          <form onSubmit={submitRestock} className="space-y-3 p-4">
            <label className="block">
              <span className={labelClass}>Part</span>
              <select
                required
                value={selectedItemId}
                onChange={(event) => {
                  const nextId = event.target.value
                  setSelectedItemId(nextId)
                  setUnitPrice(inventory.find((item) => item.id === nextId)?.unitCost ?? 0)
                }}
                className={fieldClass}
              >
                {inventory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.sku}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label>
                <span className={labelClass}>Quantity received</span>
                <input
                  required
                  min="1"
                  step="1"
                  type="number"
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value))}
                  className={fieldClass}
                />
              </label>
              <label>
                <span className={labelClass}>Unit purchase cost</span>
                <input
                  required
                  min="0"
                  step="any"
                  type="number"
                  value={unitPrice}
                  onChange={(event) => setUnitPrice(Number(event.target.value))}
                  className={fieldClass}
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
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
              <label>
                <span className={labelClass}>Invoice reference</span>
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
                <p className="text-[10px] text-[#737a70]">Purchase total</p>
                <p className="mt-1 text-[22px] font-semibold tabular-nums text-[#29362d]">
                  {formatAmount(totalPrice)}
                </p>
              </div>
              <p className="pb-1 text-[10px] text-[#858b82]">{selectedItem?.supplier}</p>
            </div>
            <button
              disabled={!selectedItem || quantity < 1 || unitPrice < 0}
              type="submit"
              className="flex h-10 w-full items-center justify-center gap-2 bg-[#344a35] text-[11px] font-semibold text-white hover:bg-[#293c2b] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <PackagePlus size={15} /> Save restock
            </button>
            {notice && (
              <p
                role="status"
                className="border border-[#d5e2cb] bg-[#edf3e8] px-3 py-2 text-[11px] text-[#435b3d]"
              >
                {notice}
              </p>
            )}
          </form>
        </section>

        <section className="min-w-0 border border-[#e2e5dc] bg-[#fbfcf8]">
          <div className="flex items-center justify-between border-b border-[#e2e5dc] px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-[14px] font-semibold text-[#29362d]">Purchase history</h2>
              <p className="mt-1 text-[11px] text-[#858b82]">
                {restocks.length} supplier receipts · total spend {formatAmount(totalSpent)}
              </p>
            </div>
            <ArrowDownLeft size={17} className="text-[#75816f]" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-170 text-left">
              <thead className="bg-[#f6f7f3] text-[9px] font-semibold uppercase tracking-widest text-[#838a80]">
                <tr>
                  <th className="px-4 py-3">Received</th>
                  <th className="px-3 py-3">Part</th>
                  <th className="px-3 py-3">Supplier / invoice</th>
                  <th className="px-3 py-3 text-right">Qty</th>
                  <th className="px-3 py-3 text-right">Unit cost</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {restocks.map((entry) => (
                  <tr key={entry.id} className="border-t border-[#eceee8]">
                    <td className="whitespace-nowrap px-4 py-3 text-[10px] text-[#737a70]">
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-[11px] font-medium text-[#364137]">{entry.itemName}</p>
                      <p className="mt-1 font-mono text-[9px] text-[#858b82]">{entry.sku}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-[10px] text-[#626b61]">{entry.supplier}</p>
                      <p className="mt-1 text-[9px] text-[#92988e]">{entry.reference}</p>
                    </td>
                    <td className="px-3 py-3 text-right text-[11px] tabular-nums">
                      {entry.quantity}
                    </td>
                    <td className="px-3 py-3 text-right text-[11px] tabular-nums">
                      {formatAmount(entry.unitPrice)}
                    </td>
                    <td className="px-4 py-3 text-right text-[11px] font-semibold tabular-nums">
                      {formatAmount(entry.totalPrice)}
                    </td>
                  </tr>
                ))}
                {restocks.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-[12px] text-[#7a8177]">
                      No purchases recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

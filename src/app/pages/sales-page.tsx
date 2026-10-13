import { ArrowUpRight, ReceiptText } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import { formatAmount, formatDate, todayISO } from '../constants/format'
import type { AppOutletContext } from '../types'

const fieldClass =
  'h-10 w-full border border-[#dfe3da] bg-white px-3 text-[12px] text-[#29362d] outline-none focus:border-[#788c68]'
const labelClass = 'mb-1.5 block text-[10px] font-semibold text-[#656e63]'

export function SalesPage() {
  const { inventory, sales, recordSale } = useOutletContext<AppOutletContext>()
  const [searchParams] = useSearchParams()
  const requestedItemId = searchParams.get('item')
  const initialItemId = inventory.some((item) => item.id === requestedItemId)
    ? (requestedItemId ?? '')
    : (inventory[0]?.id ?? '')
  const [selectedItemId, setSelectedItemId] = useState(initialItemId)
  const [quantity, setQuantity] = useState(1)
  const [unitPrice, setUnitPrice] = useState(
    inventory.find((item) => item.id === initialItemId)?.salePrice ?? 0,
  )
  const [date, setDate] = useState(todayISO())
  const [reference, setReference] = useState('')
  const [notice, setNotice] = useState('')
  const [noticeIsError, setNoticeIsError] = useState(false)
  const selectedItem = inventory.find((item) => item.id === selectedItemId)
  const totalPrice = quantity * unitPrice
  const salesTotal = sales.reduce((sum, sale) => sum + sale.totalPrice, 0)

  function submitSale(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedItem) return
    if (quantity <= 0 || quantity > selectedItem.stock) {
      setNotice(`Only ${selectedItem.stock} units are available.`)
      setNoticeIsError(true)
      return
    }
    const saved = recordSale({
      itemId: selectedItem.id,
      quantity,
      unitPrice,
      date,
      reference: reference.trim() || 'Counter sale',
    })
    if (!saved) return
    setNotice(`${quantity} × ${selectedItem.name} recorded. Total: ${formatAmount(totalPrice)}.`)
    setNoticeIsError(false)
    setQuantity(1)
    setReference('')
  }

  return (
    <main className="mx-auto max-w-360 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#75816f]">
          Counter transactions
        </p>
        <h1 className="mt-1 text-[27px] font-semibold tracking-tight text-[#26342b] sm:text-[32px]">
          Sales
        </h1>
        <p className="mt-1 text-[13px] text-[#737a70]">
          Record a sale, update stock, and keep a searchable paper trail.
        </p>
      </div>

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.5fr)]">
        <section className="min-w-0 border border-[#e2e5dc] bg-[#fbfcf8]">
          <div className="border-b border-[#e2e5dc] px-4 py-4">
            <h2 className="text-[14px] font-semibold text-[#29362d]">Record a sale</h2>
            <p className="mt-1 text-[11px] text-[#858b82]">
              Sold quantity is deducted from available stock.
            </p>
          </div>
          <form onSubmit={submitSale} className="space-y-3 p-4">
            <label className="block">
              <span className={labelClass}>Part sold</span>
              <select
                required
                value={selectedItemId}
                onChange={(event) => {
                  const nextId = event.target.value
                  setSelectedItemId(nextId)
                  setUnitPrice(inventory.find((item) => item.id === nextId)?.salePrice ?? 0)
                }}
                className={fieldClass}
              >
                {inventory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.stock} in stock
                  </option>
                ))}
              </select>
            </label>
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
                  onChange={(event) => setQuantity(Number(event.target.value))}
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
                  onChange={(event) => setUnitPrice(Number(event.target.value))}
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
              <p className="pb-1 text-[10px] text-[#858b82]">
                {selectedItem?.stock ?? 0} available
              </p>
            </div>
            <button
              disabled={
                !selectedItem ||
                quantity < 1 ||
                quantity > (selectedItem?.stock ?? 0) ||
                unitPrice < 0
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
        </section>

        <section className="min-w-0 border border-[#e2e5dc] bg-[#fbfcf8]">
          <div className="flex items-center justify-between border-b border-[#e2e5dc] px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-[14px] font-semibold text-[#29362d]">Sales history</h2>
              <p className="mt-1 text-[11px] text-[#858b82]">
                {sales.length} transactions · total sales {formatAmount(salesTotal)}
              </p>
            </div>
            <ReceiptText size={17} className="text-[#75816f]" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-152.5 text-left">
              <thead className="bg-[#f6f7f3] text-[9px] font-semibold uppercase tracking-widest text-[#838a80]">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-3 py-3">Part</th>
                  <th className="px-3 py-3">Receipt</th>
                  <th className="px-3 py-3 text-right">Qty</th>
                  <th className="px-3 py-3 text-right">Unit price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-t border-[#eceee8]">
                    <td className="whitespace-nowrap px-4 py-3 text-[10px] text-[#737a70]">
                      {formatDate(sale.date)}
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-[11px] font-medium text-[#364137]">{sale.itemName}</p>
                      <p className="mt-1 font-mono text-[9px] text-[#858b82]">{sale.sku}</p>
                    </td>
                    <td className="px-3 py-3 text-[10px] text-[#737a70]">{sale.reference}</td>
                    <td className="px-3 py-3 text-right text-[11px] tabular-nums">
                      {sale.quantity}
                    </td>
                    <td className="px-3 py-3 text-right text-[11px] tabular-nums">
                      {formatAmount(sale.unitPrice)}
                    </td>
                    <td className="px-4 py-3 text-right text-[11px] font-semibold tabular-nums">
                      {formatAmount(sale.totalPrice)}
                    </td>
                  </tr>
                ))}
                {sales.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-[12px] text-[#7a8177]">
                      No sales recorded yet.
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

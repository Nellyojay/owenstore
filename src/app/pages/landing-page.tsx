import { ArrowDownLeft, ArrowRight, ArrowUpRight, Boxes, CircleAlert, PackagePlus, Plus, ReceiptText } from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'
import type { AppOutletContext } from '../types'

const formatAmount = (amount: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount)
const formatDate = (date: string) => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${date}T00:00:00`))
const todayLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())

export function LandingPage() {
  const { inventory, restocks, sales } = useOutletContext<AppOutletContext>()
  const lowStockItems = inventory.filter((item) => item.stock <= item.reorderPoint)
  const unitsOnHand = inventory.reduce((total, item) => total + item.stock, 0)
  const stockValue = inventory.reduce((total, item) => total + item.stock * item.unitCost, 0)
  const salesValue = sales.reduce((total, sale) => total + sale.totalPrice, 0)
  const recentActivity = [
    ...restocks.map((entry) => ({ ...entry, kind: 'restock' as const })),
    ...sales.map((entry) => ({ ...entry, kind: 'sale' as const })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  const metrics = [
    { label: 'Parts in catalog', value: inventory.length, note: `${unitsOnHand} units on hand`, icon: Boxes },
    { label: 'Reorder needed', value: lowStockItems.length, note: 'At or below minimum', icon: CircleAlert, alert: lowStockItems.length > 0 },
    { label: 'Stock at cost', value: formatAmount(stockValue), note: 'Current inventory value', icon: ArrowDownLeft },
    { label: 'Recorded sales', value: formatAmount(salesValue), note: `${sales.length} transactions`, icon: ArrowUpRight },
  ]

  return (
    <main className="mx-auto max-w-360 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#75816f]">Stockroom overview</p>
          <h1 className="mt-1 text-[27px] font-semibold tracking-tight text-[#26342b] sm:text-[32px]">Good morning</h1>
          <p className="mt-1 text-[13px] text-[#737a70]">A clear picture of parts, stock and shop activity.</p>
        </div>
        <p className="text-[12px] font-medium text-[#737a70]">{todayLabel}</p>
      </div>

      <section aria-label="Shop summary" className="mt-7 grid border border-[#e2e5dc] bg-[#fbfcf8] sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, note, icon: Icon, alert }) => (
          <div key={label} className="flex min-h-29 items-start justify-between border-b border-[#e2e5dc] p-4 last:border-b-0 sm:p-5 xl:border-b-0 xl:border-r xl:last:border-r-0">
            <div>
              <p className="text-[11px] font-medium text-[#737a70]">{label}</p>
              <p className={`mt-2 text-[27px] font-semibold tabular-nums tracking-[-0.03em] ${alert ? 'text-[#a85c39]' : 'text-[#26342b]'}`}>{value}</p>
              <p className="mt-1 text-[10px] text-[#8a9087]">{note}</p>
            </div>
            <Icon size={17} strokeWidth={1.7} className={alert ? 'text-[#a85c39]' : 'text-[#75816f]'} />
          </div>
        ))}
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Link to="/sales" className="inline-flex h-10 items-center gap-2 bg-[#344a35] px-4 text-[12px] font-semibold text-white transition-colors hover:bg-[#293c2b]"><Plus size={15} /> Record a sale</Link>
        <Link to="/restocks" className="inline-flex h-10 items-center gap-2 border border-[#d6dbd0] bg-[#fbfcf8] px-4 text-[12px] font-semibold text-[#39463a] transition-colors hover:bg-[#eef1e9]"><PackagePlus size={15} /> Receive stock</Link>
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="min-w-0 border border-[#e2e5dc] bg-[#fbfcf8]">
          <div className="flex items-center justify-between border-b border-[#e2e5dc] px-4 py-4 sm:px-5">
            <div><h2 className="text-[14px] font-semibold text-[#29362d]">Needs attention</h2><p className="mt-1 text-[11px] text-[#858b82]">Parts at or below their reorder point</p></div>
            <Link to="/inventory" aria-label="View all inventory" className="flex h-8 w-8 items-center justify-center text-[#626e5e] hover:bg-[#edf0e8]"><ArrowRight size={16} /></Link>
          </div>
          {lowStockItems.length === 0 ? (
            <p className="px-5 py-8 text-[12px] text-[#737a70]">Every part is above its reorder point.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-135 text-left">
                <thead className="bg-[#f6f7f3] text-[9px] font-semibold uppercase tracking-widest text-[#838a80]"><tr><th className="px-5 py-3">Part</th><th className="px-4 py-3">SKU</th><th className="px-4 py-3">On hand</th><th className="px-4 py-3">Minimum</th><th className="px-5 py-3"></th></tr></thead>
                <tbody>
                  {lowStockItems.slice(0, 5).map((item) => (
                    <tr key={item.id} className="border-t border-[#eceee8]">
                      <td className="px-5 py-3 text-[12px] font-medium text-[#364137]">{item.name}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-[#7e857b]">{item.sku}</td>
                      <td className="px-4 py-3"><span className="font-semibold tabular-nums text-[#a85c39]">{item.stock}</span></td>
                      <td className="px-4 py-3 text-[11px] tabular-nums text-[#737a70]">{item.reorderPoint}</td>
                      <td className="px-5 py-3 text-right"><Link to={`/restocks?item=${item.id}`} className="text-[10px] font-semibold text-[#526b45] hover:underline">Restock</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="min-w-0 border border-[#e2e5dc] bg-[#fbfcf8]">
          <div className="flex items-center justify-between border-b border-[#e2e5dc] px-4 py-4 sm:px-5">
            <div><h2 className="text-[14px] font-semibold text-[#29362d]">Recent activity</h2><p className="mt-1 text-[11px] text-[#858b82]">Latest sales and supplier receipts</p></div>
            <ReceiptText size={17} className="text-[#75816f]" />
          </div>
          <div className="divide-y divide-[#eceee8]">
            {recentActivity.map((entry) => (
              <div key={`${entry.kind}-${entry.id}`} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center ${entry.kind === 'sale' ? 'bg-[#f5ece5] text-[#a45b3a]' : 'bg-[#e8eddf] text-[#526b45]'}`}>
                  {entry.kind === 'sale' ? <ArrowUpRight size={15} /> : <ArrowDownLeft size={15} />}
                </span>
                <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-medium text-[#3a443b]">{entry.kind === 'sale' ? 'Sale' : 'Restock'} · {entry.itemName}</p><p className="mt-1 text-[10px] text-[#858b82]">{entry.quantity} units · {formatDate(entry.date)} · {entry.reference}</p></div>
                <span className="shrink-0 text-[11px] font-semibold tabular-nums text-[#3b453d]">{formatAmount(entry.totalPrice)}</span>
              </div>
            ))}
            {recentActivity.length === 0 && <p className="px-5 py-8 text-[12px] text-[#737a70]">No activity recorded yet.</p>}
          </div>
          <div className="flex border-t border-[#eceee8]">
            <Link to="/sales" className="flex flex-1 items-center justify-between px-5 py-3 text-[10px] font-semibold text-[#526b45] hover:bg-[#f5f6f1]">Sales history <ArrowRight size={14} /></Link>
            <Link to="/restocks" className="flex flex-1 items-center justify-between border-l border-[#eceee8] px-5 py-3 text-[10px] font-semibold text-[#526b45] hover:bg-[#f5f6f1]">Restock history <ArrowRight size={14} /></Link>
          </div>
        </section>
      </div>
    </main>
  )
}

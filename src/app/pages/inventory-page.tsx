import { ArrowDownToLine, ArrowUpRight, Plus, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import { formatAmount, formatDate } from '../constants/format'
import type { AppOutletContext, InventoryInput } from '../types'
import { normalizeNumberInput } from '../../utils/normalizeNumberInput'
import { hasRequiredText, normalizeName, normalizeSearchQuery } from '../../utils/inputGuards'

const fieldClass =
  'h-10 w-full border border-[#dfe3da] bg-white px-3 text-[12px] text-[#29362d] outline-none focus:border-[#788c68]'
const labelClass = 'mb-1.5 block text-[10px] font-semibold text-[#656e63]'

type InventoryDraft = Omit<InventoryInput, 'stock' | 'reorderPoint' | 'unitCost' | 'salePrice'> & {
  stock: string
  reorderPoint: string
  unitCost: string
  salePrice: string
}

export function InventoryPage() {
  const { inventory, collections, suppliers, addItem } = useOutletContext<AppOutletContext>()
  const [searchParams] = useSearchParams()
  const requestedCollectionId = searchParams.get('collection')
  const collectionFromLink = collections.find(
    (collection) => collection.id === requestedCollectionId,
  )?.id
  const defaultCollectionId = collectionFromLink ?? collections[0]?.id ?? ''
  const [search, setSearch] = useState('')
  const [collectionFilter, setCollectionFilter] = useState(() => collectionFromLink ?? 'all')
  const [showForm, setShowForm] = useState(false)
  const [notice, setNotice] = useState('')
  const [modelsText, setModelsText] = useState('')
  const [draft, setDraft] = useState<InventoryDraft>({
    name: '',
    collectionId: defaultCollectionId,
    supplierId: suppliers[0]?.id ?? '',
    stock: '',
    reorderPoint: '',
    unitCost: '',
    salePrice: '',
  })

  const visibleItems = useMemo(
    () =>
      inventory.filter((item) => {
        const query = normalizeSearchQuery(search)
        const matchesSearch =
          !query || normalizeSearchQuery(`${item.name} ${item.sku} ${item.supplier}`).includes(query)
        return (
          matchesSearch && (collectionFilter === 'all' || item.collectionId === collectionFilter)
        )
      }),
    [inventory, search, collectionFilter],
  )

  function submitItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!hasRequiredText(draft.name)) {
      setNotice('Part name is required.')
      return
    }
    addItem({
      ...draft,
      stock: Number(draft.stock),
      reorderPoint: Number(draft.reorderPoint),
      unitCost: Number(draft.unitCost),
      salePrice: Number(draft.salePrice),
      name: draft.name,
      compatibleMotorcycleModels: modelsText
        .split(',')
        .map(normalizeName)
        .filter(Boolean),
    })
    setDraft({
      name: '',
      collectionId: defaultCollectionId,
      supplierId: suppliers[0]?.id ?? '',
      stock: '',
      reorderPoint: '',
      unitCost: '',
      salePrice: '',
    })
    setModelsText('')
    setNotice('Part added to inventory.')
    setShowForm(false)
  }

  return (
    <main className="mx-auto max-w-360 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#75816f]">
            Parts and quantities
          </p>
          <h1 className="mt-1 text-[27px] font-semibold tracking-tight text-[#26342b] sm:text-[32px]">
            Inventory
          </h1>
          <p className="mt-1 text-[13px] text-[#737a70]">
            {inventory.length} parts · {inventory.reduce((sum, item) => sum + item.stock, 0)} units
            on hand
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm((visible) => !visible)
            setNotice('')
          }}
          className="inline-flex h-10 items-center gap-2 bg-[#344a35] px-4 text-[12px] font-semibold text-white hover:bg-[#293c2b]"
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? 'Close form' : 'Add part'}
        </button>
      </div>

      {notice && (
        <p
          role="status"
          className="mt-4 border border-[#d5e2cb] bg-[#edf3e8] px-4 py-3 text-[12px] text-[#435b3d]"
        >
          {notice}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={submitItem}
          className="mt-5 border border-[#e2e5dc] bg-[#fbfcf8] p-4 sm:p-5"
        >
          <div className="mb-4">
            <h2 className="text-[14px] font-semibold text-[#29362d]">New part</h2>
            <p className="mt-1 text-[11px] text-[#858b82]">
              Add the part, supplier and current stock details.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <label>
              <span className={labelClass}>Part name</span>
              <input
                required
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                placeholder="e.g. Rear brake shoes"
                className={fieldClass}
              />
            </label>
            <label>
              <span className={labelClass}>Collection</span>
              <select
                required
                value={draft.collectionId}
                onChange={(event) => setDraft({ ...draft, collectionId: event.target.value })}
                className={fieldClass}
              >
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelClass}>Opening stock</span>
              <input
                required
                min="0"
                type="number"
                value={draft.stock}
                placeholder="0"
                onChange={(event) =>
                  setDraft({ ...draft, stock: normalizeNumberInput(event.target.value) })
                }
                className={fieldClass}
              />
            </label>
            <label>
              <span className={labelClass}>Reorder point</span>
              <input
                required
                min="0"
                type="number"
                value={draft.reorderPoint}
                placeholder="5"
                onChange={(event) =>
                  setDraft({ ...draft, reorderPoint: normalizeNumberInput(event.target.value) })
                }
                className={fieldClass}
              />
            </label>
            <label>
              <span className={labelClass}>Unit cost</span>
              <input
                required
                min="0"
                type="number"
                value={draft.unitCost}
                placeholder="0"
                onChange={(event) =>
                  setDraft({ ...draft, unitCost: normalizeNumberInput(event.target.value) })
                }
                className={fieldClass}
              />
            </label>
            <label>
              <span className={labelClass}>Selling price</span>
              <input
                required
                min="0"
                type="number"
                value={draft.salePrice}
                placeholder="0"
                onChange={(event) =>
                  setDraft({ ...draft, salePrice: normalizeNumberInput(event.target.value) })
                }
                className={fieldClass}
              />
            </label>
            <label className="sm:col-span-2">
              <span className={labelClass}>Supplier</span>
              <select
                required
                value={draft.supplierId}
                onChange={(event) => setDraft({ ...draft, supplierId: event.target.value })}
                className={fieldClass}
              >
                <option value="">Select supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              {suppliers.length === 0 && (
                <span className="mt-1 block text-[10px] text-[#a85c39]">
                  Create a supplier before adding a part.
                </span>
              )}
            </label>
            <label className="sm:col-span-2">
              <span className={labelClass}>Compatible motorcycle models</span>
              <input
                value={modelsText}
                onChange={(event) => setModelsText(event.target.value)}
                placeholder="e.g. Honda CG125, Yamaha YBR125"
                className={fieldClass}
              />
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="h-10 bg-[#344a35] px-5 text-[11px] font-semibold text-white hover:bg-[#293c2b]"
            >
              Save Item
            </button>
          </div>
        </form>
      )}

      <section className="mt-6 border border-[#e2e5dc] bg-[#fbfcf8]">
        <div className="flex flex-col gap-3 border-b border-[#e2e5dc] p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <label className="flex h-9 min-w-0 items-center gap-2 border border-[#e2e5dc] bg-white px-3 sm:w-80">
            <Search size={15} className="shrink-0 text-[#858b82]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search parts, SKU or supplier"
              className="min-w-0 flex-1 bg-transparent text-[11px] outline-none placeholder:text-[#9a9f97]"
            />
          </label>
          <div className="flex items-center gap-3">
            <label htmlFor="collection-filter" className="text-[10px] font-medium text-[#737a70]">
              Collection
            </label>
            <select
              id="collection-filter"
              value={collectionFilter}
              onChange={(event) => setCollectionFilter(event.target.value)}
              className="h-9 border border-[#e2e5dc] bg-white px-2 text-[11px] text-[#445044]"
            >
              <option value="all">All collections</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-230 text-left">
            <thead className="bg-[#f6f7f3] text-[9px] font-semibold uppercase tracking-widest text-[#838a80]">
              <tr>
                <th className="px-4 py-3">Part</th>
                <th className="px-3 py-3">SKU</th>
                <th className="px-3 py-3">Collection</th>
                <th className="px-3 py-3 text-right">On hand</th>
                <th className="px-3 py-3 text-right">Reorder at</th>
                <th className="px-3 py-3 text-right">Unit cost</th>
                <th className="px-3 py-3 text-right">Sale price</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((item) => {
                const collection = collections.find((entry) => entry.id === item.collectionId)
                const needsRestock = item.stock <= item.reorderPoint
                return (
                  <tr key={item.id} className="border-t border-[#eceee8] hover:bg-[#f8f9f5]">
                    <td className="px-4 py-3">
                      <p className="text-[12px] font-medium text-[#364137]">{item.name}</p>
                      <p className="mt-1 text-[10px] text-[#858b82]">
                        Updated {formatDate(item.lastRestocked)}
                      </p>
                    </td>
                    <td className="px-3 py-3 font-mono text-[10px] text-[#7e857b]">{item.sku}</td>
                    <td className="px-3 py-3 text-[10px] text-[#737a70]">
                      {collection?.name ?? 'Unassigned'}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span
                        className={`text-[12px] font-semibold tabular-nums ${needsRestock ? 'text-[#a85c39]' : 'text-[#364137]'}`}
                      >
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-[11px] tabular-nums text-[#737a70]">
                      {item.reorderPoint}
                    </td>
                    <td className="px-3 py-3 text-right text-[11px] tabular-nums text-[#737a70]">
                      {formatAmount(item.unitCost)}
                    </td>
                    <td className="px-3 py-3 text-right text-[11px] tabular-nums text-[#737a70]">
                      {formatAmount(item.salePrice)}
                    </td>
                    <td className="px-4 py-3 text-[10px] text-[#737a70]">{item.supplier}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        aria-label={`Restock ${item.name}`}
                        to={`/restocks?item=${item.id}`}
                        className="inline-flex h-8 items-center gap-1 text-[10px] font-semibold text-[#526b45] hover:underline"
                      >
                        <ArrowUpRight size={13} /> Restock
                      </Link>
                    </td>
                  </tr>
                )
              })}
              {visibleItems.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-[12px] text-[#7a8177]">
                    No parts match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#eceee8] px-4 py-3 text-[10px] text-[#858b82]">
          <span>
            Showing {visibleItems.length} of {inventory.length} parts
          </span>
          <span className="inline-flex items-center gap-1">
            <ArrowDownToLine size={13} /> Local records
          </span>
        </div>
      </section>
    </main>
  )
}

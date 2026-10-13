import { ArrowUpRight, CircleAlert, Package, Search, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { store } from '../../data/store'
import { formatAmount, formatDate } from '../constants/format'

const detailLabel = 'text-[9px] font-semibold uppercase tracking-[0.12em] text-[#858b82]'
const detailValue = 'mt-1 text-[12px] font-medium text-[#344137]'

export function ProductSearchSection() {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const soldQuantities = new Map<string, number>()

  for (const sale of store.sales) {
    if (sale.status !== 'completed') continue

    for (const item of sale.items) {
      soldQuantities.set(item.productId, (soldQuantities.get(item.productId) ?? 0) + item.quantity)
    }
  }

  const products = store.products
    .map((product) => ({ product, quantitySold: soldQuantities.get(product.id) ?? 0 }))
    .filter(({ product }) => {
      const collection = store.collections.find((entry) => entry.id === product.collectionId)?.name ?? ''
      const searchableContent = [
        product.name,
        product.sku,
        collection,
        product.supplier,
        ...product.compatibleMotorcycleModels,
      ]
        .join(' ')
        .toLowerCase()

      return searchableContent.includes(normalizedQuery)
    })
    .sort((first, second) => second.quantitySold - first.quantitySold)

  return (
    <section aria-label="Search products" className="mt-7">
      <label className="mt-6 flex h-12 items-center gap-3 border border-[#dfe3da] bg-[#fbfcf8] px-4 focus-within:border-[#788c68]">
        <Search size={17} className="shrink-0 text-[#75816f]" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, SKU, collection, supplier, or motorcycle model"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-[#29362d] outline-none placeholder:text-[#9a9f97]"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery('')}
            className="flex h-8 w-8 items-center justify-center text-[#737a70] hover:bg-[#eef1e9]"
          >
            <X size={15} />
          </button>
        )}
      </label>

      <div className="mt-5 flex items-center justify-between border-b border-[#e2e5dc] pb-3">
        <p className="text-[11px] font-medium text-[#737a70]">
          {products.length} {products.length === 1 ? 'product' : 'products'}
          {normalizedQuery && ' found'}
        </p>
        {normalizedQuery && (
          <p className="max-w-[60%] truncate text-[11px] text-[#858b82]">“{query.trim()}”</p>
        )}
      </div>

      {products.length > 0 ? (
        <section
          aria-label="Product search results"
          className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {products.slice(0, 2).map(({ product, quantitySold }, index) => {
            const collection = store.collections.find((entry) => entry.id === product.collectionId)
            const lowStock = product.quantity <= product.reorderPoint
            const isBestSeller = index === 0 && quantitySold > 0

            return (
              <article
                key={product.id}
                className="flex min-w-0 flex-col border border-[#e2e5dc] bg-[#fbfcf8]"
              >
                <header className="flex items-start justify-between gap-3 border-b border-[#e2e5dc] p-4">
                  <div className="min-w-0">
                    <h2 className="text-[15px] font-semibold text-[#29362d]">{product.name}</h2>
                    <p className="mt-1 font-mono text-[10px] text-[#858b82]">{product.sku}</p>
                    <p className="mt-2 text-[10px] font-medium text-[#737a70]">
                      {isBestSeller && (
                        <span className="mr-1.5 font-semibold text-[#526b45]">Best seller ·</span>
                      )}
                      {quantitySold} sold
                    </p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 text-[10px] font-semibold ${lowStock ? 'text-[#a85c39]' : 'text-[#526b45]'}`}
                  >
                    {lowStock ? <CircleAlert size={14} /> : <Package size={14} />}
                    {product.quantity} in stock
                  </span>
                </header>

                <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-4 p-4">
                  <div>
                    <p className={detailLabel}>Collection</p>
                    <p className={detailValue}>{collection?.name ?? 'Unassigned'}</p>
                  </div>
                  <div>
                    <p className={detailLabel}>Cost price</p>
                    <p className={detailValue}>{formatAmount(product.costPrice)}</p>
                  </div>
                  <div>
                    <p className={detailLabel}>Selling price</p>
                    <p className={detailValue}>{formatAmount(product.sellingPrice)}</p>
                  </div>
                  <div>
                    <p className={detailLabel}>Unit margin</p>
                    <p className={detailValue}>
                      {formatAmount(product.sellingPrice - product.costPrice)}
                    </p>
                  </div>
                  <div>
                    <p className={detailLabel}>Reorder point</p>
                    <p className={detailValue}>{product.reorderPoint} units</p>
                  </div>
                  <div className="col-span-2">
                    <p className={detailLabel}>Supplier</p>
                    <p className={detailValue}>{product.supplier}</p>
                  </div>
                  <div className="col-span-2">
                    <p className={detailLabel}>Compatible motorcycle models</p>
                    {product.compatibleMotorcycleModels.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {product.compatibleMotorcycleModels.map((model) => (
                          <span
                            key={model}
                            className="border border-[#dfe3da] bg-white px-2 py-1 text-[10px] text-[#526052]"
                          >
                            {model}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className={detailValue}>Not specified</p>
                    )}
                  </div>
                  <div>
                    <p className={detailLabel}>Last restocked</p>
                    <p className={detailValue}>{formatDate(product.lastRestocked)}</p>
                  </div>
                  <div>
                    <p className={detailLabel}>Product ID</p>
                    <p
                      className={`${detailValue} truncate font-mono text-[10px]`}
                      title={product.id}
                    >
                      {product.id}
                    </p>
                  </div>
                </div>

                <footer className="flex items-center gap-3 border-t border-[#e2e5dc] px-4 py-2">
                  <Link
                    to={`/sales?item=${product.id}`}
                    className="inline-flex h-8 items-center gap-1 bg-[#344a35] px-3 text-[10px] font-semibold text-white hover:bg-[#293c2b]"
                  >
                    Make sale <ArrowUpRight size={13} />
                  </Link>
                  <Link
                    to={`/restocks?item=${product.id}`}
                    className="inline-flex h-8 items-center gap-1 text-[10px] font-semibold text-[#526b45] hover:underline"
                  >
                    Restock product <ArrowUpRight size={13} />
                  </Link>
                </footer>
              </article>
            )
          })}
        </section>
      ) : (
        <div className="mt-4 border border-dashed border-[#d5dbd0] px-5 py-14 text-center">
          <Search size={20} className="mx-auto text-[#899285]" />
          <p className="mt-3 text-[13px] font-medium text-[#364137]">No products found</p>
          <p className="mt-1 text-[11px] text-[#858b82]">
            Try a different name, SKU, supplier, or model.
          </p>
        </div>
      )}
    </section>
  )
}

export function ProductSearchPage() {
  return (
    <main className="mx-auto max-w-360 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#75816f]">
          Product catalog
        </p>
        <h1 className="mt-1 text-[27px] font-semibold tracking-tight text-[#26342b] sm:text-[32px]">
          Product search
        </h1>
      </div>
      <ProductSearchSection />
    </main>
  )
}

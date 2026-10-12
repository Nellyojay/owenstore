import { ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { products } from '../data/data'
import type { AppOutletContext } from '../types'

const filters = ['Everything', 'Apparel', 'Objects']

export function ShopPage() {
  const { onAddToBag, searchTerm } = useOutletContext<AppOutletContext>()
  const [activeFilter, setActiveFilter] = useState('Everything')
  const visibleProducts = products.filter((product) => {
    const matchesCategory = activeFilter === 'Everything' || product.category === activeFilter
    return matchesCategory && product.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <main id="top" className="mx-auto max-w-360 px-5 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.19em] text-[#789044]">Picked for right now</p>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6 sm:mb-10">
        <h1 className="font-display text-4xl leading-none tracking-[-0.04em] sm:text-5xl">The whole collection</h1>
        <div className="flex gap-5 text-[10px] font-bold uppercase tracking-[0.12em] sm:gap-7">
          {filters.map((filter) => (
            <button
              key={filter}
              aria-pressed={activeFilter === filter}
              className={`shrink-0 border-b pb-2 transition-colors ${activeFilter === filter ? 'border-[#193128] text-[#193128]' : 'border-transparent text-[#193128]/45 hover:text-[#193128]'}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6">
        {visibleProducts.map((product, index) => (
          <article key={product.name} className="group">
            <div className={`relative aspect-[0.79] overflow-hidden ${product.tone}`}>
              <img
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                loading="lazy"
                src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=900&q=80`}
              />
              {index === 0 && <span className="absolute left-3 top-3 bg-[#d4f268] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] sm:left-4 sm:top-4 sm:px-3 sm:py-1.5">A favorite</span>}
              <button
                aria-label={`Add ${product.name} to bag`}
                className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center bg-[#f8f8f3] transition-colors hover:bg-[#d4f268] sm:bottom-4 sm:right-4"
                onClick={onAddToBag}
              >
                <ShoppingBag size={17} strokeWidth={1.7} />
              </button>
            </div>
            <div className="flex items-start justify-between gap-2 pt-3 sm:pt-4">
              <div>
                <h2 className="text-[11px] font-semibold sm:text-[13px]">{product.name}</h2>
                <p className="mt-1 text-[9px] text-[#193128]/55 sm:text-[11px]">{product.color}</p>
              </div>
              <span className="pt-0.5 text-[10px] font-semibold sm:text-[12px]">{product.price}</span>
            </div>
          </article>
        ))}
        {visibleProducts.length === 0 && <p className="col-span-full py-12 text-sm text-[#193128]/60">No pieces match that search. Try another name.</p>}
      </div>
    </main>
  )
}

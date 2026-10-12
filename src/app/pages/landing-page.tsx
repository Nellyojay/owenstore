import { ArrowDown, ArrowRight, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { products } from "../data/data";
import type { AppOutletContext } from "../types";

const filters = ['Everything', 'Apparel', 'Objects']

export function LandingPage() {
  const [activeFilter, setActiveFilter] = useState('Everything')
  const { onAddToBag, searchTerm } = useOutletContext<AppOutletContext>()

  const visibleProducts = products.filter((product) => {
    const matchesCategory = activeFilter === 'Everything' || product.category === activeFilter
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <main id="top">
      <section className="mx-auto grid max-w-360 gap-8 px-5 pb-16 pt-7 sm:px-8 sm:pb-20 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-14 lg:px-14 lg:pb-24 lg:pt-9">
        <div className="relative z-1 order-2 max-w-135 pb-2 lg:order-1 lg:pb-0">
          <p className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] sm:text-[11px]">
            <span className="h-2 w-2 rounded-full bg-[#a4bf42]" />
            Small things, well made
          </p>
          <h1 className="font-display text-[clamp(3.5rem,7vw,6.8rem)] leading-[0.91] tracking-[-0.055em]">
            Make room<br />for <span className="italic text-[#789044]">everyday.</span>
          </h1>
          <p className="mt-6 max-w-91.25 text-[14px] leading-7 text-[#193128]/70 sm:text-[15px]">
            Thoughtful clothes and useful objects for the little rituals that make a life.
          </p>
          <Link to="/shop" className="mt-8 inline-flex items-center gap-4 border-b border-[#193128] pb-2 text-[11px] font-bold uppercase tracking-[0.15em] transition-all hover:gap-6">
            Explore the collection <ArrowRight size={16} strokeWidth={1.8} />
          </Link>
          <div className="mt-12 hidden items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#193128]/55 lg:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#193128]/20"><ArrowDown size={15} /></span>
            Made to stay awhile
          </div>
        </div>
        <div className="relative order-1 h-[56vw] min-h-72.5 max-h-165 lg:order-2 lg:h-[min(57vw,660px)]">
          <img
            alt="Sunlit, quiet everyday wardrobe in natural fabrics"
            className="h-full w-full object-cover object-center"
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85"
          />
          <div className="absolute bottom-4 left-4 bg-[#f8f8f3] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.15em] sm:bottom-6 sm:left-6 sm:px-5 sm:py-4 sm:text-[10px]">
            <span className="mb-1 block font-normal tracking-[0.08em] text-[#193128]/60">The new collection</span>
            Made for slower mornings
          </div>
          <span className="absolute right-4 top-4 flex h-14 w-14 rotate-12 items-center justify-center rounded-full bg-[#d4f268] text-center text-[8px] font-bold uppercase leading-[1.3] tracking-widest sm:right-6 sm:top-6 sm:h-17 sm:w-17 sm:text-[9px]">New<br />season<br />2026</span>
        </div>
      </section>

      <section className="border-y border-[#193128]/15 bg-[#eff0e9] px-5 py-4 sm:px-8 lg:px-14">
        <div className="mx-auto flex max-w-360 flex-wrap items-center justify-between gap-x-8 gap-y-3 text-[9px] font-bold uppercase tracking-[0.16em] sm:text-[10px]">
          <span>Good materials, no fuss</span><span className="hidden text-[#193128]/35 sm:inline">/</span>
          <span>Made with intention</span><span className="hidden text-[#193128]/35 sm:inline">/</span>
          <span>Things you'll reach for</span><span className="hidden text-[#193128]/35 sm:inline">/</span>
          <span>Less, but better</span>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-360 px-5 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6 sm:mb-10">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.19em] text-[#789044]">Picked for right now</p>
            <h2 className="font-display text-4xl leading-none tracking-[-0.04em] sm:text-5xl">The good stuff</h2>
          </div>
          <div className="flex gap-5 overflow-x-auto text-[10px] font-bold uppercase tracking-[0.12em] sm:gap-7">
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
                  <h3 className="text-[11px] font-semibold sm:text-[13px]">{product.name}</h3>
                  <p className="mt-1 text-[9px] text-[#193128]/55 sm:text-[11px]">{product.color}</p>
                </div>
                <span className="pt-0.5 text-[10px] font-semibold sm:text-[12px]">{product.price}</span>
              </div>
            </article>
          ))}
          {visibleProducts.length === 0 && <p className="col-span-full py-12 text-sm text-[#193128]/60">No pieces match that search. Try another name.</p>}
        </div>
        <div className="mt-12 text-center sm:mt-16">
          <Link to="/shop" className="inline-flex items-center gap-3 border border-[#193128]/25 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors hover:border-[#193128] hover:bg-[#193128] hover:text-[#f8f8f3]">
            Shop all pieces <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section id="story" className="grid bg-[#193128] text-[#f8f8f3] lg:grid-cols-2">
        <div className="flex min-h-95 flex-col justify-center px-6 py-16 sm:px-12 lg:px-[12%] lg:py-24">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4f268]">A note from us</p>
          <h2 className="max-w-125 font-display text-4xl leading-[1.08] tracking-[-0.035em] sm:text-5xl">Buy fewer things.<br /><span className="italic text-[#d4f268]">Love them longer.</span></h2>
          <p className="mt-6 max-w-97.5 text-[13px] leading-7 text-white/65">We make small-run pieces with good materials and thoughtful details. No big promises. Just useful things, made to become part of your day.</p>
          <Link to="/story" className="mt-8 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#d4f268]">A little about Owenstore <ArrowRight size={15} /></Link>
        </div>
        <div className="min-h-75 lg:min-h-140">
          <img
            alt="Natural materials and everyday objects arranged in a calm studio"
            className="h-full min-h-75 w-full object-cover"
            loading="lazy"
            src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=1400&q=85"
          />
        </div>
      </section>
    </main>
  )
}
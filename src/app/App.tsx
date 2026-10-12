import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Header } from './components/header'
import type { AppOutletContext } from './types'

export function App() {
  const location = useLocation()
  const [bagCount, setBagCount] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const outletContext: AppOutletContext = {
    bagCount,
    onAddToBag: () => setBagCount((count) => count + 1),
    searchTerm,
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8f8f3] text-[#193128]">
      <div className="bg-[#d4f268] px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.16em] sm:text-[11px]">
        A little more considered. Free shipping over $100.
      </div>
      <Header
        bagCount={bagCount}
        searchOpen={searchOpen}
        onToggleSearch={() => setSearchOpen((open) => !open)}
      />
      {searchOpen && (
        <div className="mx-auto max-w-360 px-5 pb-4 sm:px-8 lg:px-14">
          <label className="flex items-center gap-3 border-b border-[#193128]/25 py-3">
            <input
              autoFocus
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#193128]/45"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search the collection"
              value={searchTerm}
            />
          </label>
        </div>
      )}
      <Outlet context={outletContext} />
      <footer className="mx-auto flex max-w-360 flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-14 lg:py-14">
        <div>
          <Link to="/" className="font-display text-3xl font-semibold tracking-[-0.04em]">
            owen<span className="text-[#789044]">store</span>
          </Link>
          <p className="mt-2 text-[11px] text-[#193128]/60">Good things for the everyday.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-[9px] font-bold uppercase tracking-[0.12em]">
          <Link className="hover:opacity-60" to="/shop">Shop</Link>
          <Link className="hover:opacity-60" to="/story">Our story</Link>
          <Link className="hover:opacity-60" to="/journal">Journal</Link>
          <a className="hover:opacity-60" href="mailto:hello@owenstore.com">Contact</a>
          <span className="font-normal normal-case tracking-normal text-[#193128]/50">© 2026 Owenstore</span>
        </div>
      </footer>
    </div>
  )
}

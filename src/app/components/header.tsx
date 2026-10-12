import { Menu, Search, ShoppingBag, X } from "lucide-react"
import { useState } from "react"
import { Link, NavLink } from "react-router-dom"

function navigationClass({ isActive }: { isActive: boolean }) {
  return `transition-opacity hover:opacity-55 ${isActive ? 'text-[#789044]' : ''}`
}

type HeaderProps = {
  bagCount: number
  searchOpen: boolean
  onToggleSearch: () => void
}

export function Header({ bagCount, searchOpen, onToggleSearch }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="relative z-10 mx-auto flex max-w-360 items-center justify-between px-5 py-5 sm:px-8 lg:px-14">
      <button
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        className="flex h-10 w-10 items-center justify-center lg:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav className="hidden items-center gap-8 text-[12px] font-semibold uppercase tracking-[0.12em] lg:flex">
        <NavLink className={navigationClass} to="/shop">Shop</NavLink>
        <NavLink className={navigationClass} to="/story">Our story</NavLink>
        <NavLink className={navigationClass} to="/journal">Journal</NavLink>
      </nav>
      <Link to="/" className="absolute left-1/2 -translate-x-1/2 font-display text-[30px] font-semibold leading-none tracking-[-0.04em]">
        owen<span className="text-[#789044]">store</span>
      </Link>
      <div className="ml-auto flex items-center gap-1 sm:gap-3">
        <button
          aria-label={searchOpen ? 'Close search' : 'Open search'}
          className="flex h-10 w-10 items-center justify-center"
          onClick={onToggleSearch}
        >
          {searchOpen ? <X size={19} strokeWidth={1.7} /> : <Search size={19} strokeWidth={1.7} />}
        </button>
        <button aria-label={`Shopping bag, ${bagCount} items`} className="flex h-10 items-center gap-2 px-2 text-[12px] font-semibold uppercase tracking-[0.12em]">
          <ShoppingBag size={19} strokeWidth={1.7} />
          <span className="hidden sm:inline">Bag ({bagCount})</span>
          <span className="sm:hidden">{bagCount}</span>
        </button>
      </div>
      {menuOpen && (
        <nav className="absolute left-0 right-0 top-full flex flex-col gap-4 border-t border-[#193128]/10 bg-[#f8f8f3] px-6 py-5 text-[12px] font-semibold uppercase tracking-[0.12em] lg:hidden">
          <NavLink className={navigationClass} to="/shop" onClick={() => setMenuOpen(false)}>Shop</NavLink>
          <NavLink className={navigationClass} to="/story" onClick={() => setMenuOpen(false)}>Our story</NavLink>
          <NavLink className={navigationClass} to="/journal" onClick={() => setMenuOpen(false)}>Journal</NavLink>
        </nav>
      )}
    </header>
  )
}
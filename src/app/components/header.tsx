import {
  Boxes,
  ClipboardList,
  Gauge,
  Menu,
  PackagePlus,
  Search,
  Tags,
  Wrench,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navigation = [
  { to: '/', label: 'Overview', icon: Gauge, end: true },
  { to: '/inventory', label: 'Inventory', icon: Boxes },
  { to: '/products', label: 'Product search', icon: Search },
  { to: '/collections', label: 'Collections', icon: Tags },
  { to: '/sales', label: 'Sales', icon: ClipboardList },
  { to: '/restocks', label: 'Restocks', icon: PackagePlus },
]

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  return navigation.map(({ to, label, icon: Icon, end }) => (
    <NavLink
      key={to}
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex min-h-10 items-center gap-3 px-3 text-[13px] font-medium transition-colors ${isActive ? 'bg-[#e8eddf] text-[#344a35]' : 'text-[#646c63] hover:bg-[#f0f1ec] hover:text-[#26352a]'}`
      }
    >
      <Icon size={17} strokeWidth={1.8} />
      {label}
    </NavLink>
  ))
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-[#e2e5dc] bg-[#fbfcf8] px-5 py-6 lg:flex">
        <Link to="/" className="flex items-center gap-3 px-2">
          <span className="flex h-9 w-9 items-center justify-center bg-[#344a35] text-[#e2efaa]">
            <Wrench size={19} strokeWidth={1.8} />
          </span>
          <span>
            <span className="block text-[15px] font-bold text-[#29362d]">Owenstore</span>
            <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.15em] text-[#7a8177]">
              Motorcycle parts
            </span>
          </span>
        </Link>
        <p className="mb-2 mt-10 px-3 text-[9px] font-bold uppercase tracking-[0.15em] text-[#92988e]">
          Stockroom
        </p>
        <nav className="flex flex-col gap-1">
          <NavigationLinks />
        </nav>
        <div className="mt-auto border-t border-[#e2e5dc] px-3 pt-4">
          <div className="flex items-center gap-2 text-[11px] font-medium text-[#626b61]">
            <span className="h-2 w-2 rounded-full bg-[#8ca25c]" />
            Local inventory
          </div>
          <p className="mt-2 text-[10px] leading-5 text-[#92988e]">Changes save in this browser.</p>
        </div>
      </aside>
      <header className="sticky top-0 z-20 flex h-14 gap-4 items-center border-b border-[#e2e5dc] bg-[#fbfcf8] px-4 lg:hidden">
        <button
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          className="flex h-10 w-10 items-center justify-center bg-[#f0f1ec] rounded-sm"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={19} strokeWidth={1.8} /> : <Menu size={19} strokeWidth={1.8} />}
        </button>
        <Link to="/" className="flex items-center gap-2 text-[14px] font-bold text-[#29362d]">
          <Wrench size={18} className="text-[#526b45]" /> Owenstore
        </Link>
        {menuOpen && (
          <nav className="absolute left-0 right-0 top-full border-b border-[#e2e5dc] bg-[#fbfcf8] p-3 shadow-sm">
            <NavigationLinks onNavigate={() => setMenuOpen(false)} />
          </nav>
        )}
      </header>
    </>
  )
}

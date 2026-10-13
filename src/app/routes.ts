import { createHashRouter } from 'react-router-dom'
import { App } from './App'
import { CollectionsPage } from './pages/collections-page'
import { InventoryPage } from './pages/inventory-page'
import { LandingPage } from './pages/landing-page'
import { NotFoundPage } from './pages/not-found-page'
import { ProductSearchPage } from './pages/product-search-page'
import { RestocksPage } from './pages/restocks-page'
import { SalesPage } from './pages/sales-page'
import { SuppliersPage } from './pages/suppliers-page'

export const router = createHashRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: LandingPage },
      { path: 'inventory', Component: InventoryPage },
      { path: 'products', Component: ProductSearchPage },
      { path: 'collections', Component: CollectionsPage },
      { path: 'suppliers', Component: SuppliersPage },
      { path: 'sales', Component: SalesPage },
      { path: 'restocks', Component: RestocksPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])

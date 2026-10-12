import { createHashRouter } from 'react-router-dom'
import { App } from './App'
import { JournalPage } from './pages/journal-page'
import { LandingPage } from './pages/landing-page'
import { NotFoundPage } from './pages/not-found-page'
import { ShopPage } from './pages/shop-page'
import { StoryPage } from './pages/story-page'

export const router = createHashRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: LandingPage },
      { path: 'shop', Component: ShopPage },
      { path: 'story', Component: StoryPage },
      { path: 'journal', Component: JournalPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
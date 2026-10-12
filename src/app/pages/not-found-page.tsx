import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main id="top" className="mx-auto min-h-96 max-w-360 px-5 py-24 text-center">
      <h1 className="font-display text-5xl">That page isn't here.</h1>
      <Link to="/" className="mt-6 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.14em]">
        Back to the home page <ArrowRight size={15} />
      </Link>
    </main>
  )
}

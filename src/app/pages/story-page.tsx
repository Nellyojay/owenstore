import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function StoryPage() {
  return (
    <main id="top" className="grid bg-[#193128] text-[#f8f8f3] lg:grid-cols-2">
      <div className="flex min-h-95 flex-col justify-center px-6 py-16 sm:px-12 lg:px-[12%] lg:py-24">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4f268]">A note from us</p>
        <h1 className="max-w-125 font-display text-4xl leading-[1.08] tracking-[-0.035em] sm:text-5xl">Buy fewer things.<br /><span className="italic text-[#d4f268]">Love them longer.</span></h1>
        <p className="mt-6 max-w-97.5 text-[13px] leading-7 text-white/65">We started Owenstore with a simple idea: everyday things deserve a little more thought. We look for honest materials, useful shapes, and details that make a piece feel right in your hands.</p>
        <p className="mt-4 max-w-97.5 text-[13px] leading-7 text-white/65">We make small runs, work with independent makers, and choose pieces we hope you will keep close for years. No big promises. Just useful things, made to become part of your day.</p>
        <Link to="/shop" className="mt-8 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#d4f268]">Meet the collection <ArrowRight size={15} /></Link>
      </div>
      <div className="min-h-75 lg:min-h-140">
        <img
          alt="Natural materials and everyday objects arranged in a calm studio"
          className="h-full min-h-75 w-full object-cover"
          src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=1400&q=85"
        />
      </div>
    </main>
  )
}

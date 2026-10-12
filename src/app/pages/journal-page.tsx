export function JournalPage() {
  const stories = [
    { category: 'Materials', title: 'A softer kind of everyday', image: 'photo-1490481651871-ab68de25d43d' },
    { category: 'At home', title: 'The Sunday table', image: 'photo-1490312278390-ab64016e0aa9' },
    { category: 'People', title: 'Made slowly, used often', image: 'photo-1449247709967-d4461a6a6103' },
  ]

  return (
    <main id="top" className="mx-auto max-w-360 px-5 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.19em] text-[#789044]">Notes from Owenstore</p>
      <h1 className="font-display text-5xl leading-none tracking-[-0.04em] sm:text-6xl">The journal</h1>
      <p className="mt-5 max-w-97.5 text-[14px] leading-7 text-[#193128]/65">A few things we are thinking about: good materials, familiar rituals, and the people who make what we love.</p>
      <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <article key={story.title}>
            <img alt="" className="aspect-[1.2] w-full object-cover" loading="lazy" src={`https://images.unsplash.com/${story.image}?auto=format&fit=crop&w=900&q=80`} />
            <p className="mb-2 mt-4 text-[9px] font-bold uppercase tracking-[0.16em] text-[#789044]">{story.category}</p>
            <h2 className="font-display text-2xl tracking-tight">{story.title}</h2>
          </article>
        ))}
      </div>
    </main>
  )
}

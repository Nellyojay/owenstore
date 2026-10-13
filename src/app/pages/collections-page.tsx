import { ArrowRight, Boxes, Plus, Tags, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import type { AppOutletContext } from '../types'

export function CollectionsPage() {
  const { inventory, collections, addCollection } = useOutletContext<AppOutletContext>()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [notice, setNotice] = useState('')

  function submitCollection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    addCollection({ name: name.trim(), description: description.trim() })
    setName('')
    setDescription('')
    setShowForm(false)
    setNotice('Collection created.')
  }

  return (
    <main className="mx-auto max-w-360 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#75816f]">
            Organize parts
          </p>
          <h1 className="mt-1 text-[27px] font-semibold tracking-tight text-[#26342b] sm:text-[32px]">
            Collections
          </h1>
          <p className="mt-1 text-[13px] text-[#737a70]">
            Group related parts so stock is easier to scan.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm((visible) => !visible)
            setNotice('')
          }}
          className="inline-flex h-10 items-center gap-2 bg-[#344a35] px-4 text-[12px] font-semibold text-white hover:bg-[#293c2b]"
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? 'Close form' : 'Create collection'}
        </button>
      </div>
      {notice && (
        <p
          role="status"
          className="mt-4 border border-[#d5e2cb] bg-[#edf3e8] px-4 py-3 text-[12px] text-[#435b3d]"
        >
          {notice}
        </p>
      )}
      {showForm && (
        <form
          onSubmit={submitCollection}
          className="mt-5 grid gap-3 border border-[#e2e5dc] bg-[#fbfcf8] p-4 sm:grid-cols-[1fr_2fr_auto] sm:items-end sm:p-5"
        >
          <label>
            <span className="mb-1.5 block text-[10px] font-semibold text-[#656e63]">
              Collection name
            </span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Suspension"
              className="h-10 w-full border border-[#dfe3da] bg-white px-3 text-[12px] outline-none focus:border-[#788c68]"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-[10px] font-semibold text-[#656e63]">
              Description
            </span>
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional notes about this group"
              className="h-10 w-full border border-[#dfe3da] bg-white px-3 text-[12px] outline-none focus:border-[#788c68]"
            />
          </label>
          <button
            type="submit"
            className="h-10 bg-[#344a35] px-5 text-[11px] font-semibold text-white hover:bg-[#293c2b]"
          >
            Save collection
          </button>
        </form>
      )}
      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {collections.map((collection) => {
          const parts = inventory.filter((item) => item.collectionId === collection.id)
          const lowStock = parts.filter((item) => item.stock <= item.reorderPoint).length
          const units = parts.reduce((sum, item) => sum + item.stock, 0)
          return (
            <article
              key={collection.id}
              className="border border-[#e2e5dc] bg-[#fbfcf8] p-4 sm:p-5"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-9 w-9 items-center justify-center bg-[#edf0e8] text-[#526b45]">
                  <Tags size={17} />
                </span>
                <span className="text-[10px] text-[#858b82]">
                  {parts.length} {parts.length === 1 ? 'part' : 'parts'}
                </span>
              </div>
              <h2 className="mt-4 text-[15px] font-semibold text-[#303b32]">{collection.name}</h2>
              <p className="mt-1 min-h-10 text-[11px] leading-5 text-[#7b8278]">
                {collection.description || 'No description added.'}
              </p>
              <div className="mt-4 flex items-center gap-5 border-t border-[#eceee8] pt-3 text-[10px] text-[#737a70]">
                <span className="inline-flex items-center gap-1.5">
                  <Boxes size={13} /> {units} units
                </span>
                <span className={lowStock ? 'font-semibold text-[#a85c39]' : ''}>
                  {lowStock} low stock
                </span>
              </div>
              <Link
                to="/inventory"
                className="mt-4 flex items-center justify-between border-t border-[#eceee8] pt-3 text-[10px] font-semibold text-[#526b45] hover:text-[#344a35]"
              >
                View inventory <ArrowRight size={14} />
              </Link>
            </article>
          )
        })}
      </section>
    </main>
  )
}

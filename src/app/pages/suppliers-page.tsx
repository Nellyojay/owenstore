import { Plus, Truck, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { AppOutletContext } from '../types'

const fieldClass =
  'h-10 w-full border border-[#dfe3da] bg-white px-3 text-[12px] text-[#29362d] outline-none focus:border-[#788c68]'
const labelClass = 'mb-1.5 block text-[10px] font-semibold text-[#656e63]'

export function SuppliersPage() {
  const { suppliers, inventory, addSupplier } = useOutletContext<AppOutletContext>()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notice, setNotice] = useState('')
  const [noticeIsError, setNoticeIsError] = useState(false)

  function submitSupplier(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const added = addSupplier({ name: name.trim(), phone: phone.trim(), email: email.trim() })
    if (!added) {
      setNotice('A supplier with that name already exists.')
      setNoticeIsError(true)
      return
    }

    setName('')
    setPhone('')
    setEmail('')
    setShowForm(false)
    setNotice('Supplier created.')
    setNoticeIsError(false)
  }

  return (
    <main className="mx-auto max-w-360 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#75816f]">
            Purchasing contacts
          </p>
          <h1 className="mt-1 text-[27px] font-semibold tracking-tight text-[#26342b] sm:text-[32px]">
            Suppliers
          </h1>
          <p className="mt-1 text-[13px] text-[#737a70]">{suppliers.length} suppliers</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowForm((visible) => !visible)
            setNotice('')
          }}
          className="inline-flex h-10 items-center gap-2 bg-[#344a35] px-4 text-[12px] font-semibold text-white hover:bg-[#293c2b]"
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? 'Close form' : 'Add supplier'}
        </button>
      </div>

      {notice && (
        <p
          role="status"
          className={`mt-4 border px-4 py-3 text-[12px] ${noticeIsError ? 'border-[#e7c8b7] bg-[#fbf0ea] text-[#975334]' : 'border-[#d5e2cb] bg-[#edf3e8] text-[#435b3d]'}`}
        >
          {notice}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={submitSupplier}
          className="mt-5 grid gap-3 border border-[#e2e5dc] bg-[#fbfcf8] p-4 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.5fr_auto] lg:items-end sm:p-5"
        >
          <label>
            <span className={labelClass}>Supplier name</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Northside Parts"
              className={fieldClass}
            />
          </label>
          <label>
            <span className={labelClass}>Phone</span>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Optional"
              className={fieldClass}
            />
          </label>
          <label>
            <span className={labelClass}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Optional"
              className={fieldClass}
            />
          </label>
          <button
            type="submit"
            className="h-10 bg-[#344a35] px-5 text-[11px] font-semibold text-white hover:bg-[#293c2b]"
          >
            Save supplier
          </button>
        </form>
      )}

      <section className="mt-6 border border-[#e2e5dc] bg-[#fbfcf8]">
        <div className="flex items-center justify-between border-b border-[#e2e5dc] px-4 py-3">
          <h2 className="text-[12px] font-semibold text-[#364137]">Supplier directory</h2>
          <span className="text-[10px] text-[#858b82]">{suppliers.length} records</span>
        </div>
        {suppliers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-120 text-left">
              <thead className="bg-[#f6f7f3] text-[9px] font-semibold uppercase tracking-widest text-[#838a80]">
                <tr>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-3 py-3">Phone</th>
                  <th className="px-3 py-3">Email</th>
                  <th className="px-4 py-3 text-right">Parts</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => {
                  const partCount = inventory.filter((item) => item.supplier === supplier.name).length
                  return (
                    <tr key={supplier.id} className="border-t border-[#eceee8]">
                      <td className="px-4 py-3 text-[11px] font-medium text-[#364137]">
                        <span className="inline-flex items-center gap-2">
                          <Truck size={14} className="text-[#75816f]" /> {supplier.name}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[10px] text-[#737a70]">
                        {supplier.phone || '—'}
                      </td>
                      <td className="px-3 py-3 text-[10px] text-[#737a70]">
                        {supplier.email || '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-[10px] tabular-nums text-[#737a70]">
                        {partCount}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-4 py-12 text-center">
            <Truck size={20} className="mx-auto text-[#899285]" />
            <p className="mt-3 text-[12px] font-medium text-[#364137]">No suppliers added</p>
          </div>
        )}
      </section>
    </main>
  )
}
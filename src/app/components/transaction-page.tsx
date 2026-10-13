import type { ReactNode } from 'react'

type DataTableColumn<Row> = {
  key: string
  label: string
  headerClassName?: string
  cellClassName?: string
  render: (row: Row) => ReactNode
}

type DataTableProps<Row> = {
  rows: Row[]
  columns: DataTableColumn<Row>[]
  getRowKey: (row: Row) => string
  emptyMessage: string
  minWidthClassName: string
}

export function DataTable<Row>({
  rows,
  columns,
  getRowKey,
  emptyMessage,
  minWidthClassName,
}: DataTableProps<Row>) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${minWidthClassName} text-left`}>
        <thead className="bg-[#f6f7f3] text-[9px] font-semibold uppercase tracking-widest text-[#838a80]">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`px-3 py-3 ${column.headerClassName ?? ''}`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="border-t border-[#eceee8]">
              {columns.map((column) => (
                <td key={column.key} className={`px-3 py-3 ${column.cellClassName ?? ''}`}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-[12px] text-[#7a8177]"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

type TransactionPageLayoutProps = {
  eyebrow: string
  title: string
  description: string
  formTitle: string
  formDescription: string
  formContent: ReactNode
  historyTitle: string
  historySummary: ReactNode
  historyIcon: ReactNode
  historyContent: ReactNode
}

export function TransactionPageLayout({
  eyebrow,
  title,
  description,
  formTitle,
  formDescription,
  formContent,
  historyTitle,
  historySummary,
  historyIcon,
  historyContent,
}: TransactionPageLayoutProps) {
  return (
    <main className="mx-auto max-w-360 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#75816f]">
          {eyebrow}
        </p>
        <h1 className="mt-1 text-[27px] font-semibold tracking-tight text-[#26342b] sm:text-[32px]">
          {title}
        </h1>
        <p className="mt-1 text-[13px] text-[#737a70]">{description}</p>
      </div>

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.5fr)]">
        <section className="min-w-0 border border-[#e2e5dc] bg-[#fbfcf8]">
          <div className="border-b border-[#e2e5dc] px-4 py-4">
            <h2 className="text-[14px] font-semibold text-[#29362d]">{formTitle}</h2>
            <p className="mt-1 text-[11px] text-[#858b82]">{formDescription}</p>
          </div>
          {formContent}
        </section>

        <section className="min-w-0 border border-[#e2e5dc] bg-[#fbfcf8]">
          <div className="flex items-center justify-between border-b border-[#e2e5dc] px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-[14px] font-semibold text-[#29362d]">{historyTitle}</h2>
              <p className="mt-1 text-[11px] text-[#858b82]">{historySummary}</p>
            </div>
            {historyIcon}
          </div>
          {historyContent}
        </section>
      </div>
    </main>
  )
}

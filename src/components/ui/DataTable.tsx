import { useMemo, useState } from 'react'

export type Column<T> = { key: keyof T; header: string };

export function DataTable<T extends Record<string, any>>({ data, columns, pageSize = 10 }: { data: T[]; columns: Column<T>[]; pageSize?: number }) {
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<{ key: keyof T; dir: 'asc'|'desc' } | null>(null)

  const sorted = useMemo(() => {
    if (!sort) return data
    return [...data].sort((a,b)=>{
      const av = a[sort.key]; const bv = b[sort.key]
      if (av < bv) return sort.dir==='asc' ? -1 : 1
      if (av > bv) return sort.dir==='asc' ? 1 : -1
      return 0
    })
  }, [data, sort])

  const start = (page-1)*pageSize
  const pageData = sorted.slice(start, start + pageSize)
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize))

  const toggleSort = (key: keyof T) => setSort(prev => !prev || prev.key!==key ? { key, dir:'asc' } : { key, dir: prev.dir==='asc'?'desc':'asc' })

  return (
    <div className="border border-brand-border rounded-xl overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map(c => (
              <th key={String(c.key)} className="px-4 py-3 text-start font-semibold cursor-pointer" onClick={()=>toggleSort(c.key)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border">
          {pageData.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              {columns.map(c => (
                <td key={String(c.key)} className="px-4 py-3">{String(row[c.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between p-3 text-sm">
        <div>Page {page} / {pages}</div>
        <div className="flex items-center gap-2">
          <button className="px-3 h-8 border rounded-md" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Prev</button>
          <button className="px-3 h-8 border rounded-md" onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages}>Next</button>
        </div>
      </div>
    </div>
  )
}

export default DataTable;


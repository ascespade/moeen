import { useMemo, useState } from "react";

export type Column<T> = { key: keyof T; header: string };

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  pageSize = 10,
}: {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
}) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{
    key: keyof T;
    dir: "asc" | "desc";
  } | null>(null);

  const sorted = useMemo(() => {
    if (!sort) return data;
    return [...data].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sort]);

  const start = (page - 1) * pageSize;
  const pageData = sorted.slice(start, start + pageSize);
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));

  const toggleSort = (key: keyof T) =>
    setSort((prev) =>
      !prev || prev.key !== key
        ? { key, dir: "asc" }
        : { key, dir: prev.dir === "asc" ? "desc" : "asc" },
    );

  return (
    <div className="border border-brand-border rounded-xl overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-surface dark:bg-gray-800">
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} className="px-4 py-3 text-start">
                <button
                  onClick={() => toggleSort(c.key)}
                  className="flex items-center gap-1 hover:text-brand-primary"
                >
                  {c.header}
                  {sort?.key === c.key && (sort.dir === "asc" ? "↑" : "↓")}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.map((row, i) => (
            <tr
              key={i}
              className="border-t border-brand-border hover:bg-surface dark:hover:bg-gray-800"
            >
              {columns.map((c) => (
                <td key={String(c.key)} className="px-4 py-3">
                  {String(row[c.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-3 bg-surface dark:bg-gray-800 flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {start + 1}-{Math.min(start + pageSize, sorted.length)} من{" "}
          {sorted.length}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-2 py-1 text-sm border rounded disabled:opacity-50"
          >
            «
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 py-1 text-sm border rounded disabled:opacity-50"
          >
            ‹
          </button>
          <span className="px-2 py-1 text-sm">
            {page} / {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-2 py-1 text-sm border rounded disabled:opacity-50"
          >
            ›
          </button>
          <button
            onClick={() => setPage(pages)}
            disabled={page === pages}
            className="px-2 py-1 text-sm border rounded disabled:opacity-50"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );

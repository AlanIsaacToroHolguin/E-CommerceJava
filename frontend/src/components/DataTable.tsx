import { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  emptyMessage?: string;
}

export default function DataTable<T>({ columns, data, rowKey, emptyMessage = 'No records' }: Props<T>) {
  return (
    <div className="overflow-hidden border border-ink-700 bg-ink-900">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-ink-700 bg-ink-800">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest text-ink-400 ${c.className ?? ''}`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-ink-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="border-b border-ink-700/60 transition hover:bg-ink-800/60"
                >
                  {columns.map((c) => (
                    <td key={c.key} className={`px-5 py-4 text-sm text-neutral-200 ${c.className ?? ''}`}>
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

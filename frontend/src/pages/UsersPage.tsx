import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable, { Column } from '../components/DataTable';
import { usersApi } from '../api/endpoints';
import { User } from '../types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    usersApi.all(page, 20).then((d) => {
      setUsers(d.content);
      setTotalPages(d.totalPages);
      setLoading(false);
    });
  }, [page]);

  const columns: Column<User>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (u) => <span className="font-mono text-[11px] text-ink-400">#{String(u.id).padStart(4, '0')}</span>
    },
    {
      key: 'name',
      header: 'User',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-blood-500 text-xs font-bold text-white">
            {u.firstName[0]}{u.lastName[0]}
          </div>
          <div>
            <div className="font-semibold uppercase tracking-wide text-white">
              {u.firstName} {u.lastName}
            </div>
            <div className="text-[10px] text-ink-400">{u.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (u) => <span className="font-mono text-xs text-ink-400">{u.phone ?? '—'}</span>
    },
    {
      key: 'role',
      header: 'Role',
      render: (u) => (
        <span
          className={`inline-flex border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${
            u.role === 'ADMIN'
              ? 'border-blood-500/40 bg-blood-500/10 text-blood-400'
              : 'border-ink-600 bg-ink-800 text-ink-400'
          }`}
        >
          {u.role}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (u) => (
        <span className={`text-[11px] font-semibold uppercase tracking-widest ${u.enabled ? 'text-emerald-400' : 'text-blood-400'}`}>
          {u.enabled ? '● Active' : '○ Disabled'}
        </span>
      )
    },
    {
      key: 'created',
      header: 'Joined',
      render: (u) => <span className="font-mono text-[10px] text-ink-400">{new Date(u.createdAt).toLocaleDateString()}</span>
    }
  ];

  return (
    <div>
      <PageHeader title="Users" eyebrow="Community" subtitle="Customers and administrators of the store." />
      <div className="space-y-5 p-10">
        {loading ? (
          <div className="text-ink-400">Loading...</div>
        ) : (
          <DataTable columns={columns} data={users} rowKey={(u) => u.id} />
        )}
        <div className="flex items-center justify-between border border-ink-700 bg-ink-900 px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-ink-400">
          <span>
            Page <span className="text-white">{page + 1}</span> / {Math.max(totalPages, 1)}
          </span>
          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="border border-ink-600 px-4 py-1.5 transition hover:border-blood-500 hover:text-white disabled:opacity-30">
              ← Prev
            </button>
            <button disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)} className="border border-ink-600 px-4 py-1.5 transition hover:border-blood-500 hover:text-white disabled:opacity-30">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

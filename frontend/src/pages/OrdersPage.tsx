import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import DataTable, { Column } from '../components/DataTable';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { ordersApi } from '../api/endpoints';
import { Order, OrderStatus } from '../types';

const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: []
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await ordersApi.all(page, 10);
      setOrders(data.content);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const updateStatus = async (o: Order, status: OrderStatus) => {
    try {
      await ordersApi.updateStatus(o.id, status);
      toast.success(`Order #${o.id} → ${status}`);
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Status update failed');
    }
  };

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Order',
      render: (o) => <span className="font-mono text-sm text-blood-500">#{String(o.id).padStart(5, '0')}</span>
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (o) => (
        <div>
          <div className="font-semibold text-white">{o.userEmail}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-widest text-ink-400">
            {o.shippingCity}, {o.shippingCountry}
          </div>
        </div>
      )
    },
    {
      key: 'items',
      header: 'Items',
      render: (o) => (
        <div>
          <div className="text-sm text-white">
            {o.items.length} item{o.items.length !== 1 ? 's' : ''}
          </div>
          <div className="mt-0.5 text-[10px] text-ink-400">
            {o.items
              .slice(0, 2)
              .map((i) => `${i.quantity}× ${i.productName}`)
              .join(', ')}
            {o.items.length > 2 ? '…' : ''}
          </div>
        </div>
      )
    },
    {
      key: 'total',
      header: 'Total',
      render: (o) => <span className="font-mono text-base font-bold text-white">${Number(o.totalAmount).toLocaleString()}</span>
    },
    { key: 'status', header: 'Status', render: (o) => <OrderStatusBadge status={o.status} /> },
    {
      key: 'date',
      header: 'Date',
      render: (o) => <span className="font-mono text-[10px] text-ink-400">{new Date(o.createdAt).toLocaleString()}</span>
    },
    {
      key: 'actions',
      header: 'Transition',
      className: 'text-right',
      render: (o) => {
        const next = NEXT_STATUSES[o.status];
        if (next.length === 0) return <span className="text-[10px] text-ink-500">—</span>;
        return (
          <div className="flex justify-end gap-1.5">
            {next.map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(o, s)}
                className="border border-ink-600 bg-transparent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink-400 transition hover:border-blood-500 hover:text-white"
              >
                → {s}
              </button>
            ))}
          </div>
        );
      }
    }
  ];

  return (
    <div>
      <PageHeader title="Orders" eyebrow="Fulfillment" subtitle="Track every order through its lifecycle." />
      <div className="space-y-5 p-10">
        {loading ? (
          <div className="text-ink-400">Loading...</div>
        ) : (
          <DataTable columns={columns} data={orders} rowKey={(o) => o.id} emptyMessage="No orders yet" />
        )}
        <div className="flex items-center justify-between border border-ink-700 bg-ink-900 px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-ink-400">
          <span>
            Page <span className="text-white">{page + 1}</span> / {Math.max(totalPages, 1)}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="border border-ink-600 px-4 py-1.5 transition hover:border-blood-500 hover:text-white disabled:opacity-30"
            >
              ← Prev
            </button>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="border border-ink-600 px-4 py-1.5 transition hover:border-blood-500 hover:text-white disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

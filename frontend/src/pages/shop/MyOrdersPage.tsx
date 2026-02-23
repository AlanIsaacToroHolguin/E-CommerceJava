import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { ordersApi } from '../../api/endpoints';
import { Order } from '../../types';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.mine(0, 50)
      .then((d) => setOrders(d.content))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <div className="text-[11px] font-semibold uppercase tracking-ultra text-blood-500">
          Account · History
        </div>
        <h1 className="mt-1 font-display text-5xl text-white">MY ORDERS</h1>
      </div>

      {loading ? (
        <div className="text-ink-400">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="border border-ink-700 bg-ink-900 p-16 text-center">
          <div className="font-display text-3xl text-white">NO ORDERS YET</div>
          <p className="mt-2 text-sm text-ink-400">You haven't bought any guitars yet.</p>
          <Link
            to="/shop"
            className="mt-6 inline-block bg-blood-500 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blood-600"
          >
            Start Shopping →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="border border-ink-700 bg-ink-900 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[11px] text-blood-500">
                    ORDER #{String(o.id).padStart(5, '0')}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-ink-400">
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={o.status} />
                  <span className="font-mono text-xl font-bold text-white">
                    ${Number(o.totalAmount).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 border-t border-ink-700 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                {o.items.map((it) => (
                  <div key={it.id} className="flex justify-between text-xs text-ink-400">
                    <span>
                      {it.quantity}× <span className="text-white">{it.productName}</span>
                    </span>
                    <span className="font-mono">${Number(it.subtotal).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-[10px] uppercase tracking-widest text-ink-400">
                Ship to: <span className="text-white">{o.shippingAddress}, {o.shippingCity}, {o.shippingCountry} {o.shippingZip}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

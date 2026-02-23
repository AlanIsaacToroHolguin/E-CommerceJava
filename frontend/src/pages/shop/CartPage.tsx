import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Cart, cartApi } from '../../api/endpoints';
import ProductImage from '../../components/ProductImage';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refresh = async () => {
    setLoading(true);
    try {
      setCart(await cartApi.get());
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refresh();
  }, []);

  const updateQty = async (itemId: number, qty: number) => {
    try {
      const c = await cartApi.updateItem(itemId, qty);
      setCart(c);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Update failed');
    }
  };

  const remove = async (itemId: number) => {
    try {
      const c = await cartApi.remove(itemId);
      setCart(c);
      window.dispatchEvent(new Event('cart-updated'));
      toast.success('Removed');
    } catch {
      toast.error('Remove failed');
    }
  };

  if (loading) return <div className="mx-auto max-w-5xl px-6 py-20 text-ink-400">Loading cart...</div>;

  const empty = !cart || cart.items.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <div className="text-[11px] font-semibold uppercase tracking-ultra text-blood-500">
          Your Cart
        </div>
        <h1 className="mt-1 font-display text-5xl text-white">SHOPPING CART</h1>
      </div>

      {empty ? (
        <div className="border border-ink-700 bg-ink-900 p-16 text-center">
          <div className="font-display text-3xl text-white">YOUR CART IS EMPTY</div>
          <p className="mt-2 text-sm text-ink-400">Pick a guitar and start shredding.</p>
          <Link
            to="/shop"
            className="mt-6 inline-block bg-blood-500 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blood-600"
          >
            Browse Catalog →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-3">
            {cart!.items.map((it) => (
              <div key={it.id} className="flex gap-4 border border-ink-700 bg-ink-900 p-4">
                <ProductImage
                  src={it.imageUrl}
                  alt={it.productName}
                  className="h-28 w-28 border border-ink-700 object-cover"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl text-white">{it.productName.toUpperCase()}</h3>
                    <div className="mt-1 font-mono text-xs text-ink-400">
                      ${Number(it.unitPrice).toLocaleString()} ea.
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex border border-ink-600">
                      <button onClick={() => updateQty(it.id, Math.max(1, it.quantity - 1))} className="w-9 bg-ink-900 text-white hover:bg-ink-800">−</button>
                      <div className="flex w-12 items-center justify-center bg-ink-950 text-sm text-white">{it.quantity}</div>
                      <button onClick={() => updateQty(it.id, it.quantity + 1)} className="w-9 bg-ink-900 text-white hover:bg-ink-800">+</button>
                    </div>
                    <div className="font-mono text-xl font-bold text-white">
                      ${Number(it.subtotal).toLocaleString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => remove(it.id)}
                  className="self-start border border-blood-500/40 bg-transparent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-blood-400 transition hover:bg-blood-500 hover:text-white"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <aside className="h-fit border border-ink-700 bg-ink-900 p-6">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-blood-500">
              Summary
            </div>
            <h3 className="mt-1 font-display text-2xl text-white">ORDER TOTAL</h3>

            <div className="mt-6 space-y-3 border-y border-ink-700 py-5 text-sm">
              <Row label="Subtotal" value={`$${Number(cart!.total).toLocaleString()}`} />
              <Row label="Shipping" value="Free" />
              <Row label="Tax" value="Included" />
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest text-ink-400">Total</span>
              <span className="font-mono text-3xl font-bold text-white">${Number(cart!.total).toLocaleString()}</span>
            </div>
            <button
              onClick={() => navigate('/shop/checkout')}
              className="mt-6 w-full bg-blood-500 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blood-600"
            >
              Proceed to Checkout →
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-ink-400">
      <span className="text-[11px] uppercase tracking-widest">{label}</span>
      <span className="font-mono text-white">{value}</span>
    </div>
  );
}

import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Cart, cartApi, ordersApi } from '../../api/endpoints';

const inputCls =
  'w-full border border-ink-600 bg-ink-950 px-3 py-3 text-sm text-white placeholder-ink-500 focus:border-blood-500 focus:outline-none';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    shippingAddress: '',
    shippingCity: '',
    shippingCountry: '',
    shippingZip: ''
  });

  useEffect(() => {
    cartApi.get().then((c) => {
      setCart(c);
      if (c.items.length === 0) navigate('/shop/cart');
    });
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const order = await ordersApi.create(form);
      toast.success(`Order #${order.id} placed successfully`);
      window.dispatchEvent(new Event('cart-updated'));
      navigate('/shop/orders');
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <div className="text-[11px] font-semibold uppercase tracking-ultra text-blood-500">
          Final Step
        </div>
        <h1 className="mt-1 font-display text-5xl text-white">CHECKOUT</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <form onSubmit={submit} className="space-y-5 border border-ink-700 bg-ink-900 p-6">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-blood-500">
            Shipping Address
          </div>
          <Field label="Address *">
            <input required className={inputCls} value={form.shippingAddress} onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })} placeholder="Street and number" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="City *">
              <input required className={inputCls} value={form.shippingCity} onChange={(e) => setForm({ ...form, shippingCity: e.target.value })} />
            </Field>
            <Field label="ZIP *">
              <input required className={inputCls} value={form.shippingZip} onChange={(e) => setForm({ ...form, shippingZip: e.target.value })} />
            </Field>
          </div>
          <Field label="Country *">
            <input required className={inputCls} value={form.shippingCountry} onChange={(e) => setForm({ ...form, shippingCountry: e.target.value })} />
          </Field>

          <div className="border-t border-ink-700 pt-4 text-[10px] font-semibold uppercase tracking-widest text-blood-500">
            Payment
          </div>
          <div className="rounded-none border border-ink-600 bg-ink-950 p-4 text-xs text-ink-400">
            💳 Payment is mocked in demo mode — clicking "Place Order" will create the order and decrement stock.
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full bg-blood-500 px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-blood-600 disabled:opacity-50"
          >
            {submitting ? 'Placing order...' : 'Place Order →'}
          </button>
        </form>

        <aside className="h-fit border border-ink-700 bg-ink-900 p-6">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-blood-500">
            Your Order
          </div>
          <h3 className="mt-1 font-display text-2xl text-white">SUMMARY</h3>
          <div className="mt-5 space-y-2 border-y border-ink-700 py-4">
            {cart?.items.map((it) => (
              <div key={it.id} className="flex justify-between text-xs text-ink-400">
                <span>
                  {it.quantity}× <span className="text-white">{it.productName}</span>
                </span>
                <span className="font-mono">${Number(it.subtotal).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest text-ink-400">Total</span>
            <span className="font-mono text-2xl font-bold text-white">
              ${Number(cart?.total ?? 0).toLocaleString()}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-ink-400">
        {label}
      </label>
      {children}
    </div>
  );
}

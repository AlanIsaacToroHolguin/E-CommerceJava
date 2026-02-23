import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cartApi, productsApi } from '../../api/endpoints';
import { Product } from '../../types';
import ProductImage from '../../components/ProductImage';
import { FALLBACK_GUITARS } from './fallbackGuitars';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const numId = Number(id);
    if (numId < 0) {
      const fb = FALLBACK_GUITARS.find((g) => g.id === numId);
      setProduct(fb ?? null);
      return;
    }
    productsApi.byId(numId).then(setProduct).catch(() => {
      const fb = FALLBACK_GUITARS.find((g) => g.id === numId) ?? FALLBACK_GUITARS[0];
      setProduct(fb);
    });
  }, [id]);

  const isFallback = (product?.id ?? 0) < 0;

  const addToCart = async () => {
    if (!product) return;
    if (isFallback) {
      toast.error('Demo product — sign in as a real customer to checkout');
      return;
    }
    setAdding(true);
    try {
      await cartApi.addItem(product.id, qty);
      window.dispatchEvent(new Event('cart-updated'));
      toast.success('Added to cart');
      navigate('/shop/cart');
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center text-ink-400">Loading...</div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Link to="/shop" className="mb-6 inline-block text-[10px] font-semibold uppercase tracking-widest text-ink-400 hover:text-blood-500">
        ← Back to catalog
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="border border-ink-700 bg-ink-900">
          <ProductImage src={product.imageUrl} alt={product.name} className="h-[600px] w-full object-cover" />
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-ultra text-blood-500">
            {product.brand} · {product.categoryName}
          </div>
          <h1 className="mt-2 font-display text-5xl leading-none text-white">
            {product.name.toUpperCase()}
          </h1>
          {product.modelCode && (
            <div className="mt-2 font-mono text-xs text-ink-400">MODEL {product.modelCode}</div>
          )}

          <div className="my-6 h-1 w-16 bg-blood-500" />

          <p className="text-sm leading-relaxed text-ink-400">{product.description}</p>

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-ink-700 py-6 text-sm">
            <Spec label="Color" value={product.color} />
            <Spec label="Pickups" value={product.pickupConfig} />
            <Spec label="Body" value={product.bodyWood} />
            <Spec label="Neck" value={product.neckWood} />
            <Spec label="Fingerboard" value={product.fingerboard} />
            <Spec label="Stock" value={product.stock > 0 ? `${product.stock} units` : 'Sold out'} />
          </div>

          <div className="mt-8 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-ink-400">Price</div>
              <div className="font-mono text-5xl font-bold text-white">
                ${Number(product.price).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="mb-1 text-[10px] uppercase tracking-widest text-ink-400">Quantity</div>
              <div className="flex border border-ink-600">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 bg-ink-900 text-white hover:bg-ink-800"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={product.stock || 99}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  className="w-14 border-x border-ink-600 bg-ink-950 text-center text-white"
                />
                <button
                  onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                  className="w-10 bg-ink-900 text-white hover:bg-ink-800"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={addToCart}
            disabled={adding || product.stock === 0}
            className="mt-6 w-full bg-blood-500 px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-blood-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {product.stock === 0
              ? 'Sold out'
              : adding
              ? 'Adding to cart...'
              : `Add to cart — $${(Number(product.price) * qty).toLocaleString()}`}
          </button>

          {isFallback && (
            <div className="mt-4 border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] uppercase tracking-widest text-amber-300">
              Demo product · checkout disabled in showcase mode
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-ink-400">{label}</div>
      <div className="mt-1 text-sm text-white">{value || '—'}</div>
    </div>
  );
}

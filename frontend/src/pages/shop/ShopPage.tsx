import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoriesApi, productsApi } from '../../api/endpoints';
import { Category, Product } from '../../types';
import ProductImage from '../../components/ProductImage';
import { FALLBACK_GUITARS } from './fallbackGuitars';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await productsApi.search({ name: search || undefined, categoryId, page: 0, size: 24 });
      setProducts(data.content.length > 0 ? data.content : FALLBACK_GUITARS);
    } catch {
      setProducts(FALLBACK_GUITARS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    categoriesApi.all().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    load();
  }, [categoryId]);

  const visible = useMemo(() => {
    if (!search) return products;
    const q = search.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }, [products, search]);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative h-[480px] bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1556449895-a33c9dba33dd?auto=format&fit=crop&w=1900&q=85)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/30" />
        <div className="absolute inset-0 bg-noise opacity-40" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-ultra text-blood-500">
              The Catalog · Est. 2026
            </div>
            <h1 className="mt-3 font-display text-7xl leading-none text-white">
              ELECTRIC<br />GUITARS
            </h1>
            <div className="my-6 h-1 w-20 bg-blood-500" />
            <p className="max-w-lg text-sm leading-relaxed text-ink-400">
              Hand-picked instruments from the best builders on the planet. Vintage classics, modern
              workhorses and shred-ready superstrats — all with full specs, real stock and instant checkout.
            </p>
            <a
              href="#catalog"
              className="mt-8 inline-flex items-center gap-2 bg-blood-500 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blood-600"
            >
              Browse the catalog →
            </a>
          </div>
        </div>
      </section>

      {/* Categories strip */}
      {categories.length > 0 && (
        <section className="border-b border-ink-700 bg-ink-900">
          <div className="mx-auto max-w-7xl overflow-x-auto px-6 py-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCategoryId(undefined)}
                className={`whitespace-nowrap border px-4 py-2 text-[10px] font-semibold uppercase tracking-widest transition ${
                  categoryId === undefined
                    ? 'border-blood-500 bg-blood-500 text-white'
                    : 'border-ink-600 text-ink-400 hover:border-blood-500 hover:text-white'
                }`}
              >
                All Series
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryId(c.id)}
                  className={`whitespace-nowrap border px-4 py-2 text-[10px] font-semibold uppercase tracking-widest transition ${
                    categoryId === c.id
                      ? 'border-blood-500 bg-blood-500 text-white'
                      : 'border-ink-600 text-ink-400 hover:border-blood-500 hover:text-white'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Catalog */}
      <section id="catalog" className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-ultra text-blood-500">
              Catalog
            </div>
            <h2 className="mt-1 font-display text-4xl text-white">
              {visible.length} GUITAR{visible.length !== 1 ? 'S' : ''} AVAILABLE
            </h2>
          </div>
          <input
            placeholder="SEARCH BY NAME OR BRAND..."
            className="w-full max-w-sm border border-ink-600 bg-ink-900 px-4 py-3 text-xs uppercase tracking-widest text-white placeholder-ink-500 focus:border-blood-500 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-ink-400">Loading guitars...</div>
        ) : visible.length === 0 ? (
          <div className="border border-ink-700 bg-ink-900 p-12 text-center">
            <div className="font-display text-3xl text-white">NO MATCHES</div>
            <p className="mt-2 text-sm text-ink-400">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((p) => (
              <Link
                key={p.id}
                to={`/shop/products/${p.id}`}
                className="group relative flex flex-col border border-ink-700 bg-ink-900 transition hover:border-blood-500"
              >
                <div className="relative flex h-64 items-center justify-center overflow-hidden bg-ink-800 p-4">
                  <ProductImage
                    src={p.imageUrl}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain opacity-95 transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 border border-blood-500/40 bg-ink-950/80 px-2 py-1 text-[9px] font-semibold uppercase tracking-widest text-blood-400">
                    {p.categoryName}
                  </div>
                  {p.stock <= 5 && p.stock > 0 && (
                    <div className="absolute right-3 top-3 bg-amber-500 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-ink-950">
                      Only {p.stock} left
                    </div>
                  )}
                  {p.stock === 0 && (
                    <div className="absolute right-3 top-3 bg-ink-700 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
                      Sold out
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="font-mono text-[10px] text-blood-500">{p.brand.toUpperCase()}</div>
                  <h3 className="mt-1 font-display text-xl leading-tight text-white">
                    {p.name.toUpperCase()}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest text-ink-400">
                    {p.pickupConfig && <span>{p.pickupConfig}</span>}
                    {p.bodyWood && <span>· {p.bodyWood}</span>}
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-5">
                    <div className="font-mono text-2xl font-bold text-white">
                      ${Number(p.price).toLocaleString()}
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-blood-500 transition group-hover:translate-x-1">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

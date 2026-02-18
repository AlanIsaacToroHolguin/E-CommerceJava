import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import DataTable, { Column } from '../components/DataTable';
import ProductModal from '../components/ProductModal';
import { categoriesApi, productsApi } from '../api/endpoints';
import { Category, Product, ProductRequest } from '../types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await productsApi.search({ name: search || undefined, categoryId, page, size: 10 });
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    categoriesApi.all().then(setCategories);
  }, []);

  useEffect(() => {
    load();
  }, [page, categoryId]);

  const onSubmit = async (payload: ProductRequest) => {
    try {
      if (editing) {
        await productsApi.update(editing.id, payload);
        toast.success('Guitar updated');
      } else {
        await productsApi.create(payload);
        toast.success('Guitar created');
      }
      setModalOpen(false);
      setEditing(null);
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Save failed');
    }
  };

  const onDelete = async (p: Product) => {
    if (!confirm(`Disable "${p.name}"?`)) return;
    try {
      await productsApi.remove(p.id);
      toast.success('Product disabled');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const columns: Column<Product>[] = [
    {
      key: 'image',
      header: '',
      render: (p) => (
        <img
          src={p.imageUrl}
          alt={p.name}
          className="h-14 w-14 border border-ink-700 object-cover"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
        />
      )
    },
    {
      key: 'name',
      header: 'Guitar',
      render: (p) => (
        <div>
          <div className="font-semibold uppercase tracking-wide text-white">{p.name}</div>
          <div className="mt-0.5 font-mono text-[10px] text-ink-400">
            {p.brand} · {p.modelCode}
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (p) => <span className="text-[11px] uppercase tracking-widest text-ink-400">{p.categoryName}</span>
    },
    {
      key: 'price',
      header: 'Price',
      render: (p) => <span className="font-mono text-base font-bold text-white">${Number(p.price).toLocaleString()}</span>
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (p) => (
        <span className={`font-mono text-sm ${p.stock < 5 ? 'text-amber-400' : 'text-ink-400'}`}>
          {String(p.stock).padStart(3, '0')}
        </span>
      )
    },
    {
      key: 'active',
      header: 'Status',
      render: (p) => (
        <span
          className={`inline-flex border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${
            p.active
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-ink-600 bg-ink-800 text-ink-400'
          }`}
        >
          {p.active ? 'Active' : 'Disabled'}
        </span>
      )
    },
    {
      key: 'actions',
      header: '',
      render: (p) => (
        <div className="flex justify-end gap-2">
          <button
            className="border border-ink-600 bg-transparent px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-ink-400 transition hover:border-blood-500 hover:text-white"
            onClick={() => {
              setEditing(p);
              setModalOpen(true);
            }}
          >
            Edit
          </button>
          <button
            className="border border-blood-500/40 bg-transparent px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-blood-400 transition hover:bg-blood-500 hover:text-white"
            onClick={() => onDelete(p)}
          >
            Disable
          </button>
        </div>
      ),
      className: 'text-right'
    }
  ];

  return (
    <div>
      <PageHeader
        title="Guitars"
        eyebrow="Catalog"
        subtitle="Manage every electric guitar in the store."
        action={
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="bg-blood-500 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-white transition hover:bg-blood-600"
          >
            + New Guitar
          </button>
        }
      />
      <div className="space-y-5 p-10">
        <div className="flex flex-wrap gap-3 border border-ink-700 bg-ink-900 p-4">
          <input
            placeholder="SEARCH BY NAME..."
            className="min-w-[220px] flex-1 border border-ink-600 bg-ink-950 px-3 py-2.5 text-xs uppercase tracking-widest text-white placeholder-ink-500 focus:border-blood-500 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (setPage(0), load())}
          />
          <select
            className="border border-ink-600 bg-ink-950 px-3 py-2.5 text-xs uppercase tracking-widest text-white focus:border-blood-500 focus:outline-none"
            value={categoryId ?? ''}
            onChange={(e) => {
              setPage(0);
              setCategoryId(e.target.value ? Number(e.target.value) : undefined);
            }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setPage(0);
              load();
            }}
            className="border border-ink-600 bg-transparent px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-ink-400 transition hover:border-blood-500 hover:text-white"
          >
            Search →
          </button>
        </div>

        {loading ? (
          <div className="text-ink-400">Loading...</div>
        ) : (
          <DataTable columns={columns} data={products} rowKey={(p) => p.id} />
        )}

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>

      <ProductModal
        open={modalOpen}
        product={editing}
        categories={categories}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={onSubmit}
      />
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  setPage
}: {
  page: number;
  totalPages: number;
  setPage: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border border-ink-700 bg-ink-900 px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-ink-400">
      <span>
        Page <span className="text-white">{page + 1}</span> / {Math.max(totalPages, 1)}
      </span>
      <div className="flex gap-2">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="border border-ink-600 bg-transparent px-4 py-1.5 transition hover:border-blood-500 hover:text-white disabled:opacity-30"
        >
          ← Prev
        </button>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
          className="border border-ink-600 bg-transparent px-4 py-1.5 transition hover:border-blood-500 hover:text-white disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

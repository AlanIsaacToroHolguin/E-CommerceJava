import { useEffect, useState } from 'react';
import Modal from './Modal';
import { Category, Product, ProductRequest } from '../types';

interface Props {
  open: boolean;
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSubmit: (payload: ProductRequest) => Promise<void>;
}

const empty = (categoryId: number): ProductRequest => ({
  name: '',
  brand: '',
  modelCode: '',
  description: '',
  price: 0,
  stock: 0,
  imageUrl: '',
  color: '',
  bodyWood: '',
  neckWood: '',
  fingerboard: '',
  pickupConfig: '',
  active: true,
  categoryId
});

const inputCls =
  'w-full border border-ink-600 bg-ink-950 px-3 py-2.5 text-sm text-white placeholder-ink-500 focus:border-blood-500 focus:outline-none';

export default function ProductModal({ open, product, categories, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<ProductRequest>(empty(categories[0]?.id ?? 0));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        brand: product.brand,
        modelCode: product.modelCode ?? '',
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        color: product.color ?? '',
        bodyWood: product.bodyWood ?? '',
        neckWood: product.neckWood ?? '',
        fingerboard: product.fingerboard ?? '',
        pickupConfig: product.pickupConfig ?? '',
        active: product.active,
        categoryId: product.categoryId
      });
    } else {
      setForm(empty(categories[0]?.id ?? 0));
    }
  }, [product, categories, open]);

  const update = <K extends keyof ProductRequest>(k: K, v: ProductRequest[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} title={product ? 'Edit Guitar' : 'New Guitar'} onClose={onClose} size="lg">
      <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Name *">
          <input className={inputCls} required value={form.name} onChange={(e) => update('name', e.target.value)} />
        </Field>
        <Field label="Brand *">
          <input className={inputCls} required value={form.brand} onChange={(e) => update('brand', e.target.value)} />
        </Field>
        <Field label="Model Code">
          <input className={inputCls} value={form.modelCode ?? ''} onChange={(e) => update('modelCode', e.target.value)} />
        </Field>
        <Field label="Category *">
          <select
            className={inputCls}
            required
            value={form.categoryId}
            onChange={(e) => update('categoryId', Number(e.target.value))}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Price (USD) *">
          <input
            type="number"
            step="0.01"
            min="0"
            className={inputCls}
            required
            value={form.price}
            onChange={(e) => update('price', Number(e.target.value))}
          />
        </Field>
        <Field label="Stock *">
          <input
            type="number"
            min="0"
            className={inputCls}
            required
            value={form.stock}
            onChange={(e) => update('stock', Number(e.target.value))}
          />
        </Field>
        <Field label="Image URL *" className="md:col-span-2">
          <input
            className={inputCls}
            required
            value={form.imageUrl}
            onChange={(e) => update('imageUrl', e.target.value)}
            placeholder="https://..."
          />
        </Field>
        <Field label="Color">
          <input className={inputCls} value={form.color ?? ''} onChange={(e) => update('color', e.target.value)} />
        </Field>
        <Field label="Pickup Config">
          <input
            className={inputCls}
            value={form.pickupConfig ?? ''}
            onChange={(e) => update('pickupConfig', e.target.value)}
            placeholder="HH / SSS / HSS..."
          />
        </Field>
        <Field label="Body Wood">
          <input className={inputCls} value={form.bodyWood ?? ''} onChange={(e) => update('bodyWood', e.target.value)} />
        </Field>
        <Field label="Neck Wood">
          <input className={inputCls} value={form.neckWood ?? ''} onChange={(e) => update('neckWood', e.target.value)} />
        </Field>
        <Field label="Fingerboard">
          <input
            className={inputCls}
            value={form.fingerboard ?? ''}
            onChange={(e) => update('fingerboard', e.target.value)}
          />
        </Field>
        <div className="flex items-center gap-2 md:col-span-1">
          <input
            id="active"
            type="checkbox"
            checked={form.active ?? true}
            onChange={(e) => update('active', e.target.checked)}
            className="h-4 w-4 accent-blood-500"
          />
          <label htmlFor="active" className="text-[11px] uppercase tracking-widest text-ink-400">
            Active in catalog
          </label>
        </div>
        <Field label="Description *" className="md:col-span-2">
          <textarea
            className={`${inputCls} min-h-[110px]`}
            required
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </Field>

        <div className="flex justify-end gap-2 border-t border-ink-700 pt-5 md:col-span-2">
          <button
            type="button"
            onClick={onClose}
            className="border border-ink-600 bg-transparent px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-ink-400 transition hover:border-blood-500 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-blood-500 px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition hover:bg-blood-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : product ? 'Update' : 'Create'} →
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  children,
  className = ''
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-ink-400">
        {label}
      </label>
      {children}
    </div>
  );
}

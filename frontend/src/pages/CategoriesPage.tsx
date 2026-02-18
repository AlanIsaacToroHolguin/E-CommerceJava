import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { categoriesApi } from '../api/endpoints';
import { Category } from '../types';

interface FormState {
  name: string;
  description: string;
  imageUrl: string;
}

const inputCls =
  'w-full border border-ink-600 bg-ink-950 px-3 py-2.5 text-sm text-white placeholder-ink-500 focus:border-blood-500 focus:outline-none';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>({ name: '', description: '', imageUrl: '' });

  const load = async () => {
    setLoading(true);
    try {
      setCategories(await categoriesApi.all());
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const startCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', imageUrl: '' });
    setOpen(true);
  };
  const startEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description ?? '', imageUrl: c.imageUrl ?? '' });
    setOpen(true);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await categoriesApi.update(editing.id, form);
        toast.success('Category updated');
      } else {
        await categoriesApi.create(form);
        toast.success('Category created');
      }
      setOpen(false);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Save failed');
    }
  };

  const remove = async (c: Category) => {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    try {
      await categoriesApi.remove(c.id);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed (category may have products)');
    }
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        eyebrow="Series"
        subtitle="Guitar styles available in the catalog."
        action={
          <button onClick={startCreate} className="bg-blood-500 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-white transition hover:bg-blood-600">
            + New Category
          </button>
        }
      />
      <div className="p-10">
        {loading ? (
          <div className="text-ink-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <div key={c.id} className="group relative overflow-hidden border border-ink-700 bg-ink-900 transition hover:border-blood-500">
                {c.imageUrl ? (
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={c.imageUrl}
                      alt={c.name}
                      className="h-full w-full object-cover opacity-70 transition group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
                  </div>
                ) : (
                  <div className="h-44 bg-ink-800" />
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-[10px] text-blood-500">
                        SERIES {String(i + 1).padStart(2, '0')}
                      </div>
                      <h3 className="mt-1 font-display text-2xl text-white">{c.name.toUpperCase()}</h3>
                    </div>
                  </div>
                  {c.description && (
                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink-400">
                      {c.description}
                    </p>
                  )}
                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => startEdit(c)}
                      className="flex-1 border border-ink-600 bg-transparent px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-ink-400 transition hover:border-blood-500 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(c)}
                      className="flex-1 border border-blood-500/40 bg-transparent px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-blood-400 transition hover:bg-blood-500 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={open} title={editing ? 'Edit Category' : 'New Category'} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Name *">
            <input
              required
              className={inputCls}
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            />
          </Field>
          <Field label="Description">
            <textarea
              className={`${inputCls} min-h-[80px]`}
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            />
          </Field>
          <Field label="Image URL">
            <input
              className={inputCls}
              value={form.imageUrl}
              onChange={(e) => setForm((s) => ({ ...s, imageUrl: e.target.value }))}
            />
          </Field>
          <div className="flex justify-end gap-2 border-t border-ink-700 pt-5">
            <button type="button" onClick={() => setOpen(false)} className="border border-ink-600 bg-transparent px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-ink-400 transition hover:border-blood-500 hover:text-white">
              Cancel
            </button>
            <button type="submit" className="bg-blood-500 px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition hover:bg-blood-600">
              {editing ? 'Update' : 'Create'} →
            </button>
          </div>
        </form>
      </Modal>
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

import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

type Mode = 'admin' | 'customer';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('admin');
  const [email, setEmail] = useState('admin@guitarshop.com');
  const [password, setPassword] = useState('admin12345');
  const [loading, setLoading] = useState(false);

  const setDemo = (m: Mode) => {
    setMode(m);
    if (m === 'admin') {
      setEmail('admin@guitarshop.com');
      setPassword('admin12345');
    } else {
      setEmail('customer@guitarshop.com');
      setPassword('customer12345');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome, ${user.firstName}`);
      navigate(user.role === 'ADMIN' ? '/dashboard' : '/shop');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-ink-950">
      {/* Hero side */}
      <div
        className="relative hidden flex-1 bg-cover bg-center lg:block"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1519160558534-579f5106e43f?auto=format&fit=crop&w=1600&q=80)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-950/80 to-blood-900/40" />
        <div className="absolute inset-0 bg-noise opacity-30" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-ultra text-blood-500">
              Est. 2026 — Built with Java 21
            </div>
            <div className="mt-1 font-display text-5xl text-white">JAVA ECOMMERCE</div>
          </div>
          <div className="max-w-lg">
            <div className="mb-4 h-1 w-16 bg-blood-500" />
            <h2 className="font-display text-6xl leading-none text-white">
              FORGED FOR<br />THE STAGE.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-ink-400">
              The complete platform for the most uncompromising electric guitar marketplace.
              Browse the catalog as a customer or manage the store as an admin.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-ink-700 pt-6">
              <Stat num="12+" label="Models" />
              <Stat num="5" label="Series" />
              <Stat num="100%" label="Tone" />
            </div>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-[480px] lg:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link
            to="/shop"
            className="mb-6 inline-block text-[10px] font-semibold uppercase tracking-widest text-ink-400 hover:text-blood-500"
          >
            ← Browse without signing in
          </Link>

          <div className="mb-6">
            <div className="text-[11px] font-semibold uppercase tracking-ultra text-blood-500">
              Sign In
            </div>
            <h1 className="mt-2 font-display text-4xl text-white">ENTER</h1>
            <p className="mt-2 text-sm text-ink-400">
              Use one of the demo accounts or your own credentials.
            </p>
          </div>

          {/* Mode switch */}
          <div className="mb-5 grid grid-cols-2 border border-ink-700">
            <button
              type="button"
              onClick={() => setDemo('customer')}
              className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest transition ${
                mode === 'customer' ? 'bg-blood-500 text-white' : 'bg-ink-900 text-ink-400 hover:text-white'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setDemo('admin')}
              className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest transition ${
                mode === 'admin' ? 'bg-blood-500 text-white' : 'bg-ink-900 text-ink-400 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Email">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-2 flex w-full items-center justify-center gap-2 bg-blood-500 px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blood-600 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Enter →'}
            </button>
          </form>

          <div className="mt-6 border border-ink-700 bg-ink-900 p-4">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-blood-500">
              Demo Accounts
            </div>
            <div className="space-y-1 font-mono text-[11px] text-ink-400">
              <div><span className="text-white">Customer:</span> customer@guitarshop.com / customer12345</div>
              <div><span className="text-white">Admin:</span> admin@guitarshop.com / admin12345</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  'w-full border border-ink-600 bg-ink-900 px-4 py-3 text-sm text-white placeholder-ink-400 transition focus:border-blood-500 focus:outline-none';

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

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl text-white">{num}</div>
      <div className="text-[10px] uppercase tracking-widest text-ink-400">{label}</div>
    </div>
  );
}

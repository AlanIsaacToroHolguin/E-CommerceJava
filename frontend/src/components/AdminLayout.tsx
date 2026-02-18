import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard',  label: 'Dashboard',  num: '01' },
  { to: '/products',   label: 'Guitars',    num: '02' },
  { to: '/categories', label: 'Categories', num: '03' },
  { to: '/orders',     label: 'Orders',     num: '04' },
  { to: '/users',      label: 'Users',      num: '05' }
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-ink-950">
      <aside className="flex w-72 flex-col border-r border-ink-700 bg-ink-900">
        <div className="border-b border-ink-700 px-6 py-6">
          <div className="text-[11px] font-semibold uppercase tracking-ultra text-blood-500">
            Java Ecommerce
          </div>
          <div className="mt-1 font-display text-3xl text-white">GUITAR SHOP</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-ink-400">
            Admin Console v1.0
          </div>
        </div>

        <nav className="flex-1 px-3 py-6">
          <div className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-widest text-ink-400">
            Menu
          </div>
          <div className="space-y-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-4 border-l-2 px-4 py-3 text-sm font-semibold uppercase tracking-widest transition ${
                    isActive
                      ? 'border-blood-500 bg-ink-800 text-white'
                      : 'border-transparent text-ink-400 hover:border-blood-500/50 hover:bg-ink-800 hover:text-white'
                  }`
                }
              >
                <span className="font-mono text-[11px] text-blood-500">{item.num}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="border-t border-ink-700 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-blood-500 text-sm font-bold text-white">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="truncate text-[10px] uppercase tracking-widest text-ink-400">
                {user?.role}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full border border-ink-600 bg-transparent px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-ink-400 transition hover:border-blood-500 hover:text-white"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden bg-ink-950 bg-noise">
        <Outlet />
      </main>
    </div>
  );
}

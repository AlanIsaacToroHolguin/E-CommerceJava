import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cartApi } from '../api/endpoints';

const NAV = [
  { to: '/shop',         label: 'Catalog' },
  { to: '/shop/orders',  label: 'My Orders' }
];

export default function CustomerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const isAuthed = !!user;
  useEffect(() => {
    if (!isAuthed) {
      setCartCount(0);
      return;
    }
    const refresh = () => cartApi.get().then((c) => setCartCount(c.itemCount)).catch(() => {});
    refresh();
    const id = setInterval(refresh, 10000);
    const handler = () => refresh();
    window.addEventListener('cart-updated', handler);
    return () => {
      clearInterval(id);
      window.removeEventListener('cart-updated', handler);
    };
  }, [isAuthed]);

  return (
    <div className="min-h-screen bg-ink-950 text-neutral-200">
      <header className="sticky top-0 z-30 border-b border-ink-700 bg-ink-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/shop" className="flex items-center gap-3">
            <div className="text-[10px] font-semibold uppercase tracking-ultra text-blood-500">
              Java Ecommerce
            </div>
            <div className="hidden h-6 w-px bg-ink-700 sm:block" />
            <div className="hidden font-display text-2xl text-white sm:block">GUITAR SHOP</div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/shop'}
                className={({ isActive }) =>
                  `text-[11px] font-semibold uppercase tracking-widest transition ${
                    isActive ? 'text-white' : 'text-ink-400 hover:text-white'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/shop/cart"
              className="relative border border-ink-600 bg-transparent px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-white transition hover:border-blood-500"
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center bg-blood-500 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            {isAuthed ? (
              <div className="hidden text-right md:block">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-white">
                  {user?.firstName}
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="text-[10px] uppercase tracking-widest text-ink-400 hover:text-blood-500"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden bg-blood-500 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white transition hover:bg-blood-600 md:inline-block"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="bg-noise">
        <Outlet />
      </main>

      <footer className="border-t border-ink-700 bg-ink-900 px-6 py-10 text-center">
        <div className="text-[10px] font-semibold uppercase tracking-ultra text-blood-500">
          Java Ecommerce — Guitar Shop
        </div>
        <div className="mt-2 text-xs text-ink-400">
          Built with Spring Boot 3 · React · TypeScript · Tailwind
        </div>
      </footer>
    </div>
  );
}

import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin }: Props) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-ink-400">Loading...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950 p-6">
        <div className="max-w-md border border-blood-500/40 bg-ink-900 p-8 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-blood-500">
            Access Denied
          </div>
          <h2 className="mt-2 font-display text-3xl text-white">ADMIN ONLY</h2>
          <p className="mt-3 text-sm text-ink-400">
            Your account doesn't have permission to view the admin console.
          </p>
          <a
            href="/shop"
            className="mt-6 inline-block bg-blood-500 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-blood-600"
          >
            Go to Shop →
          </a>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

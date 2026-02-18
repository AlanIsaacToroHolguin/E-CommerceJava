import { OrderStatus } from '../types';

const STYLES: Record<OrderStatus, string> = {
  PENDING:    'border-amber-500/40 bg-amber-500/10 text-amber-300',
  PROCESSING: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
  SHIPPED:    'border-indigo-500/40 bg-indigo-500/10 text-indigo-300',
  DELIVERED:  'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  CANCELLED:  'border-blood-500/40 bg-blood-500/10 text-blood-400'
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}

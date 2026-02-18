import { ReactNode } from 'react';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' };

export default function Modal({ open, title, onClose, children, size = 'md' }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm">
      <div className={`w-full ${SIZES[size]} max-h-[90vh] overflow-y-auto border border-ink-700 bg-ink-900 shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-ink-700 bg-ink-800 px-6 py-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-blood-500">
              Form
            </div>
            <h2 className="font-display text-2xl text-white">{title.toUpperCase()}</h2>
          </div>
          <button
            onClick={onClose}
            className="border border-ink-600 bg-transparent px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-ink-400 transition hover:border-blood-500 hover:text-white"
            aria-label="Close"
          >
            Close ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

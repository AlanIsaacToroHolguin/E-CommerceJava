import { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, eyebrow, action }: Props) {
  return (
    <div className="border-b border-ink-700 bg-ink-900 px-10 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-ultra text-blood-500">
            {eyebrow ?? 'Admin'}
          </div>
          <h1 className="mt-1 font-display text-4xl text-white">{title.toUpperCase()}</h1>
          {subtitle && <p className="mt-2 text-sm text-ink-400">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

interface Props {
  title: string;
  value: string | number;
  num: string;
  subtitle?: string;
  accent?: boolean;
}

export default function StatsCard({ title, value, num, subtitle, accent }: Props) {
  return (
    <div
      className={`group relative border bg-ink-900 p-6 transition hover:border-blood-500 ${
        accent ? 'border-blood-500' : 'border-ink-700'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">
          {title}
        </div>
        <div className="font-mono text-[10px] text-ink-500">{num}</div>
      </div>
      <div className="mt-6 font-display text-5xl leading-none text-white">{value}</div>
      {subtitle && (
        <div className="mt-3 text-[11px] uppercase tracking-widest text-ink-400">{subtitle}</div>
      )}
      <div
        className={`absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-blood-500 transition-transform group-hover:scale-x-100 ${
          accent ? 'scale-x-100' : ''
        }`}
      />
    </div>
  );
}

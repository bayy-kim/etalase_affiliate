export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex min-w-[160px] shrink-0 snap-center flex-col gap-1 rounded-2xl border border-border-subtle bg-surface-card p-4">
      <span className="text-[12px] font-[600] uppercase tracking-[0.05em] leading-4 text-text-secondary">
        {label}
      </span>
      <span className="text-[24px] font-[700] leading-8 tracking-[-0.02em] text-accent-green">
        {value}
      </span>
      {sub && <span className="mt-1 text-sm text-on-surface">{sub}</span>}
    </div>
  );
}

export default function AdminLoading() {
  return (
    <div className="min-h-dvh bg-background-base">
      <div className="lg:pl-64">
        {/* Header placeholder */}
        <div className="hidden h-16 items-center justify-between border-b border-border-subtle bg-background-base/90 px-8 lg:flex">
          <div className="h-7 w-44 animate-pulse rounded-lg bg-surface-variant" />
          <div className="h-7 w-24 animate-pulse rounded-lg bg-surface-variant" />
        </div>

        <div className="px-4 pt-20 lg:px-8 lg:pt-8">
          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface-card p-4 lg:p-5"
              >
                <div className="h-3 w-24 animate-pulse rounded bg-surface-variant" />
                <div className="h-8 w-28 animate-pulse rounded bg-surface-variant" />
              </div>
            ))}
          </div>

          {/* Chart placeholder */}
          <div className="mt-6 h-64 animate-pulse rounded-2xl border border-border-subtle bg-surface-card" />

          {/* List placeholder */}
          <div className="mt-6 flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-card p-4"
              >
                <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-surface-variant" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-surface-variant" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-surface-variant" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

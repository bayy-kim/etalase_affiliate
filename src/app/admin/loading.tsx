export default function AdminLoading() {
  return (
    <div className="min-h-dvh bg-[#f0f2f7] text-slate-800">
      <div className="lg:pl-72">
        {/* Header placeholder desktop */}
        <div className="hidden h-20 items-center justify-between px-8 lg:flex">
          <div className="h-7 w-44 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-7 w-24 animate-pulse rounded-xl bg-slate-200" />
        </div>

        <div className="px-4 pt-4 lg:px-8 lg:pt-2">
          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-3.5 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-clay-card"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 animate-pulse rounded-md bg-slate-200" />
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200" />
                </div>
                <div className="h-8 w-24 animate-pulse rounded-xl bg-slate-200" />
                <div className="h-3.5 w-32 animate-pulse rounded-md bg-slate-200" />
              </div>
            ))}
          </div>

          {/* Chart & Widget Placeholder */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-64 lg:col-span-2 animate-pulse rounded-3xl border border-slate-200/80 bg-white p-5 shadow-clay-card" />
            <div className="h-64 animate-pulse rounded-3xl border border-slate-200/80 bg-white p-5 shadow-clay-card" />
          </div>

          {/* List placeholder */}
          <div className="mt-6 flex flex-col gap-3.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white p-4.5 shadow-clay-card"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
                  <div className="h-12 w-12 shrink-0 animate-pulse rounded-2xl bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 animate-pulse rounded-lg bg-slate-200" />
                    <div className="h-3 w-1/4 animate-pulse rounded-md bg-slate-200" />
                  </div>
                </div>
                <div className="h-5 w-5 animate-pulse rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

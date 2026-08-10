export default function Loading() {
  return (
    <main className="flex min-h-dvh w-full flex-col overflow-x-hidden bg-[#f0f2f7]">
      {/* Top bar mobile skeleton */}
      <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-slate-200/60 bg-[#f0f2f7]/90 px-4 py-2.5 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-32 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </header>

      {/* Main content skeleton */}
      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-4 pb-12 lg:max-w-7xl lg:px-8 lg:pt-10">
        {/* Profile Card Skeleton */}
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-clay-card pt-8 lg:p-8">
          <div className="h-24 w-24 animate-pulse rounded-full bg-slate-200 lg:h-32 lg:w-32" />
          <div className="h-6 w-40 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-4 w-64 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-8 w-32 animate-pulse rounded-full bg-slate-200" />
          <div className="flex gap-3">
            <div className="h-9 w-28 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-9 w-28 animate-pulse rounded-2xl bg-slate-200" />
          </div>
        </div>

        {/* Category Tabs Skeleton */}
        <div className="mt-6 flex gap-2.5 overflow-x-auto py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-24 shrink-0 animate-pulse rounded-2xl bg-slate-200/80" />
          ))}
        </div>

        {/* Search Bar Skeleton */}
        <div className="mt-6 h-13 w-full animate-pulse rounded-2xl bg-white border border-slate-200/80 shadow-sm" />

        {/* Grid Skeleton */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex h-20 w-full animate-pulse items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-clay-card">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-slate-200" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-4 w-3/4 rounded-lg bg-slate-200" />
                <div className="h-3 w-1/2 rounded-md bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

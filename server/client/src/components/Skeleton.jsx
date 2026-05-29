export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white animate-pulse shadow-sm">
          <div className="aspect-[4/3] bg-slate-100" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 rounded-lg bg-slate-100" />
            <div className="h-3 w-1/2 rounded-lg bg-slate-100" />
            <div className="flex gap-2 mt-2">
              <div className="h-3 w-12 rounded-full bg-slate-100" />
              <div className="h-3 w-12 rounded-full bg-slate-100" />
            </div>
            <div className="h-9 w-full rounded-xl bg-slate-100 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductListSkeleton({ count = 6 }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 bg-white border border-slate-200 rounded-2xl p-4 animate-pulse">
          <div className="w-28 h-28 rounded-xl bg-slate-100 flex-shrink-0" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 w-3/4 rounded-lg bg-slate-100" />
            <div className="h-3 w-1/3 rounded-lg bg-slate-100" />
            <div className="h-3 w-1/4 rounded-lg bg-slate-100" />
            <div className="flex justify-between items-center mt-2">
              <div className="h-5 w-24 rounded-lg bg-slate-100" />
              <div className="h-8 w-28 rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

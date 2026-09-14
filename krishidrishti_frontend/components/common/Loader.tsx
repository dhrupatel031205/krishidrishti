export function PageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-xl bg-stone-200" />
          <div className="h-4 w-96 rounded-lg bg-stone-100" />
        </div>
        <div className="h-9 w-32 rounded-xl bg-stone-200" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded-lg bg-stone-200" />
              <div className="h-8 w-8 rounded-xl bg-stone-100" />
            </div>
            <div className="h-8 w-20 rounded-lg bg-stone-200" />
            <div className="h-3 w-32 rounded-md bg-stone-100" />
          </div>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
          <div className="h-4 w-32 rounded-lg bg-stone-200" />
          <div className="flex justify-center">
            <div className="h-36 w-36 rounded-full bg-stone-100" />
          </div>
          <div className="h-16 rounded-xl bg-stone-100" />
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs lg:col-span-2 space-y-4">
          <div className="h-4 w-40 rounded-lg bg-stone-200" />
          <div className="h-64 rounded-xl bg-stone-100" />
        </div>
      </div>

      {/* Loading label */}
      <div className="flex items-center justify-center gap-2 text-sm text-stone-400 pt-2">
        <span className="h-4 w-4 rounded-full border-2 border-stone-300 border-t-emerald-600 animate-spin" />
        {message}
      </div>
    </div>
  );
}

export function InlineLoader({ message = "Refreshing..." }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
      <span className="h-3.5 w-3.5 rounded-full border-2 border-stone-300 border-t-emerald-600 animate-spin shrink-0" />
      {message}
    </div>
  );
}

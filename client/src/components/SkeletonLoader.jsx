// Skeleton Loader Components for Modern Dashboard

export function KPICardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200" />
        <div className="w-16 h-5 bg-gray-200 rounded" />
      </div>
      <div className="space-y-2">
        <div className="w-24 h-4 bg-gray-200 rounded" />
        <div className="w-32 h-8 bg-gray-200 rounded" />
        <div className="w-20 h-3 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="w-40 h-6 bg-gray-200 rounded mb-2" />
          <div className="w-32 h-4 bg-gray-200 rounded" />
        </div>
        <div className="w-24 h-9 bg-gray-200 rounded-lg" />
      </div>
      <div className="h-[300px] bg-gray-100 rounded-lg" />
    </div>
  );
}

export function QuickActionsSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
      <div className="w-32 h-6 bg-gray-200 rounded mb-6" />
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 border border-gray-100 rounded-xl">
            <div className="w-10 h-10 bg-gray-200 rounded-lg mb-4" />
            <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
            <div className="w-32 h-3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 4 }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="w-40 h-6 bg-gray-200 rounded" />
        <div className="w-20 h-5 bg-gray-200 rounded" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex-1">
              <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
              <div className="w-40 h-3 bg-gray-200 rounded" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-20 h-4 bg-gray-200 rounded" />
              <div className="w-16 h-6 bg-gray-200 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActivitySkeleton({ items = 4 }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="w-40 h-6 bg-gray-200 rounded" />
        <div className="w-20 h-5 bg-gray-200 rounded" />
      </div>
      <div>
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-100">
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            <div className="flex-1">
              <div className="w-48 h-4 bg-gray-200 rounded mb-2" />
              <div className="w-20 h-3 bg-gray-200 rounded" />
            </div>
            <div className="w-16 h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Greeting Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="w-64 h-9 bg-gray-200 rounded mb-2" />
          <div className="w-96 h-5 bg-gray-200 rounded" />
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ChartSkeleton />
          </div>
          <QuickActionsSkeleton />
        </div>

        {/* Lower Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TableSkeleton />
          <ActivitySkeleton />
          <TableSkeleton />
        </div>
      </div>
    </div>
  );
}

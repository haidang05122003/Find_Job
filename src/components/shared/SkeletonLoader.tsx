export const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 animate-pulse">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
      </div>
    </div>
    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
    <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex space-x-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
        ))}
      </div>
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="p-4 border-b border-gray-200 dark:border-gray-800 last:border-b-0">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 animate-pulse"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4 animate-pulse"></div>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-20 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
      </div>
    ))}
  </div>
);

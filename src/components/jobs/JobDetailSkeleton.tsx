export const JobDetailSkeleton = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-12">
            {/* Header Skeleton */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0"></div>
                        <div className="flex-1 space-y-3 w-full">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                            <div className="flex flex-wrap gap-4">
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 animate-pulse"></div>
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-12 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Skeleton */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6 animate-pulse"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6 animate-pulse"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Skeleton */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4 animate-pulse"></div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                                </div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

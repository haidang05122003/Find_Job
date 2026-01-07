import React from 'react';
import { SkeletonCard } from '@/components/shared/SkeletonLoader';

const JobSearchSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* Banner Skeleton */}
                <div className="mb-8 w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>

                {/* Search Bar Skeleton */}
                <div className="mb-8 w-full h-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse"></div>

                <div className="flex flex-col gap-6">
                    <div className="w-full">
                        {/* Toolbar Skeleton */}
                        <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                            <div className="flex gap-4">
                                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                            </div>
                        </div>

                        {/* Job Grid Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>

                        {/* Pagination Skeleton */}
                        <div className="mt-12 flex justify-center items-center gap-2">
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSearchSkeleton;

import React from 'react';
import { SkeletonCard } from '@/components/shared/SkeletonLoader';

const EmployerListSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Banner Skeleton */}
                <div className="mb-8 w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>

                {/* Search Bar Skeleton */}
                <div className="mb-8 w-full h-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse"></div>

                {/* Toolbar Skeleton */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div className="flex gap-2">
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 animate-pulse flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-800 mb-4"></div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-4"></div>
                            <div className="flex gap-2 w-full justify-center">
                                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
                                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="mt-8 flex justify-center items-center gap-2">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}

export default EmployerListSkeleton;

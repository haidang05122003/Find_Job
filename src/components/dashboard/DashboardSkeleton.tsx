import React from 'react';
import { SkeletonStats, SkeletonTable } from '@/components/shared/SkeletonLoader';

const DashboardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-800 p-6">
            {/* Header Skeleton */}
            <div className="mb-6 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="mb-6">
                <SkeletonStats count={2} className="grid grid-cols-1 md:grid-cols-2 gap-6" />
            </div>

            {/* Profile Completion Banner Skeleton */}
            <div className="mb-6 animate-pulse">
                <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"></div>
            </div>

            {/* Recently Applied Table Skeleton */}
            <div className="mb-4 flex items-center justify-between animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-48"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
            </div>
            <SkeletonTable rows={3} />
        </div>
    );
};

export default DashboardSkeleton;

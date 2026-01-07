import React from 'react';
import { SkeletonCard } from '@/components/shared/SkeletonLoader';

const CompanyDetailSkeleton = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-12">
            {/* Header Skeleton */}
            <div className="bg-white dark:bg-gray-800 shadow-sm relative z-0">
                <div className="h-64 sm:h-80 w-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="container mx-auto px-4 relative">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 pb-6">
                        <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-2xl bg-gray-300 dark:bg-gray-600 border-4 border-white dark:border-gray-800 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Intro Skeleton */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden p-6 space-y-4 animate-pulse">
                            <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>

                        {/* Jobs Skeleton */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden p-6 space-y-4 animate-pulse">
                            <div className="h-8 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Sidebar Skeleton */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 h-64 animate-pulse">
                            <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetailSkeleton;

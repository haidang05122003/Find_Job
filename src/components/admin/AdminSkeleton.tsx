import React from 'react';
import ComponentCard from '../common/ComponentCard';

const AdminSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Page Header Skeleton */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>

            <ComponentCard title="">
                <div className="space-y-6 p-4">
                    {/* Toolbar Skeleton */}
                    <div className="flex flex-col gap-3 sm:flex-row border-b border-gray-100 pb-6 dark:border-gray-800">
                        <div className="h-10 flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                        <div className="h-10 w-32 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                    </div>

                    {/* Table Skeleton */}
                    <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-800">
                        <div className="w-full">
                            {/* Table Header */}
                            <div className="flex bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <div className="p-4 w-1/4"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div></div>
                                <div className="p-4 w-1/4"><div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div></div>
                                <div className="p-4 w-1/4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div></div>
                                <div className="p-4 w-1/4"><div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div></div>
                            </div>
                            {/* Table Rows */}
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex border-b border-gray-100 dark:border-gray-800 p-4 items-center">
                                    <div className="w-1/4 pr-4"><div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded"></div></div>
                                    <div className="w-1/4 pr-4"><div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800 rounded"></div></div>
                                    <div className="w-1/4 pr-4"><div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 rounded-full"></div></div>
                                    <div className="w-1/4 pl-4 flex justify-end gap-2">
                                        <div className="h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                                        <div className="h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ComponentCard>
        </div>
    );
};

export default AdminSkeleton;

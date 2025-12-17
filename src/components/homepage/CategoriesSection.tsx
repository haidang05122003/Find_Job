'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFilters } from '@/context/FilterContext';
import Card from '@/components/shared/Card';
import type { Category } from '@/types/category';

interface CategoriesSectionProps {
  categories: Category[];
  title?: string;
  subtitle?: string;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  title = 'Danh mục phổ biến',
  subtitle = 'Khám phá các cơ hội việc làm theo ngành nghề',
}) => {
  const router = useRouter();
  const { updateFilter } = useFilters();

  const handleCategoryClick = (category: Category) => {
    updateFilter('category', category.name);
    router.push('/jobs');
  };

  return (
    <section className="bg-white py-16 dark:bg-gray-950 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              hover
              padding="md"
              onClick={() => handleCategoryClick(category)}
              className="group animate-fade-in-stagger cursor-pointer"
            >
              <div className="flex items-center gap-4">


                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 transition group-hover:text-brand-500 dark:text-white dark:group-hover:text-brand-400">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {category.jobCount.toLocaleString()} việc làm
                  </p>
                </div>

                {/* Arrow Icon */}
                <svg
                  className="h-5 w-5 flex-shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-brand-500 dark:group-hover:text-brand-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-10 text-center">
          <button
            onClick={() => router.push('/jobs')}
            className="inline-flex items-center gap-2 text-brand-500 font-semibold transition hover:text-brand-600 hover:gap-3"
          >
            Xem tất cả danh mục
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

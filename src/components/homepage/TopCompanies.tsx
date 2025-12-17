'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CompanyCardWithTooltip from '@/components/landing/CompanyCardWithTooltip';
import Button from '@/components/shared/Button';
import type { Company } from '@/types/company';

interface TopCompaniesProps {
  companies: Company[];
  title?: string;
  subtitle?: string;
}

const TopCompanies: React.FC<TopCompaniesProps> = ({
  companies,
  title = 'Công ty hàng đầu',
  subtitle = 'Khám phá các nhà tuyển dụng uy tín đang tìm kiếm nhân tài',
}) => {
  const router = useRouter();

  return (
    <section className="bg-white py-16 dark:bg-gray-950 sm:py-20 overflow-visible">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 overflow-visible">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/employers')}
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            }
            iconPosition="right"
          >
            Xem tất cả
          </Button>
        </div>

        {/* Companies Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 overflow-visible relative">
          {companies.map((company, index) => (
            <div
              key={company.id}
              className="animate-fade-in-stagger relative"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CompanyCardWithTooltip company={company} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCompanies;

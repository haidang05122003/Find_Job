'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/shared/Button';
import type { Company } from '@/types/company';

interface CompanyInfoSidebarProps {
  company: Company;
}

const CompanyInfoSidebar: React.FC<CompanyInfoSidebarProps> = ({ company }) => {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Company Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Về công ty
        </h3>

        {/* Company Logo */}
        {/* Company Logo */}
        <div className="mt-4 flex h-20 w-20 items-center justify-center rounded-xl border border-gray-200 bg-white p-2 text-4xl dark:border-gray-700 dark:bg-gray-800">
          {company.logo && (company.logo.startsWith('http') || company.logo.startsWith('/') || company.logo.length > 5) ? (
            <img
              src={company.logo}
              alt={company.name}
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('bg-gray-100');
                if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerText = '🏢';
              }}
            />
          ) : (
            <span className="text-4xl">🏢</span>
          )}
        </div>

        {/* Company Name */}
        <h4 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
          {company.name}
        </h4>

        {/* Company Info */}
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{company.industry}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{company.companySize} nhân viên</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span>{company.location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm text-gray-700 leading-relaxed dark:text-gray-300">
          {company.description}
        </p>

        {/* Website */}
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Xem website
          </a>
        )}

        {/* View Company Profile Button */}
        <Button
          variant="outline"
          fullWidth
          className="mt-6"
          onClick={() => router.push(`/employers/${company.id}`)}
        >
          Xem trang công ty
        </Button>
      </div>

      {/* Open Positions */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Vị trí đang tuyển
          </span>
          <span className="text-2xl font-bold text-brand-500">
            {company.openPositions}
          </span>
        </div>
        <Button
          variant="secondary"
          fullWidth
          className="mt-4"
          onClick={() => router.push(`/jobs?company=${company.id}`)}
        >
          Xem tất cả vị trí
        </Button>
      </div>
    </div>
  );
};

export default CompanyInfoSidebar;

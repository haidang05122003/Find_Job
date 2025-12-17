import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Company } from '@/types/company';

interface CompanyInfoSidebarProps {
  company: Company;
}

const CompanyInfoSidebar: React.FC<CompanyInfoSidebarProps> = ({ company }) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      <div className="flex items-start gap-4 mb-4">
        <div className="h-16 w-16 flex-shrink-0 animate-fade-in overflow-hidden rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
          {company.logo && (company.logo.startsWith('http') || company.logo.startsWith('/') || company.logo.length > 5) ? (
            <img
              src={company.logo}
              alt={company.name}
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '<div class="flex h-full w-full items-center justify-center text-2xl">🏢</div>';
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl">🏢</div>
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
          {company.name}
        </h3>
      </div>

      <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div>
            <span className="block font-medium text-gray-900 dark:text-white">Quy mô:</span>
            <span>{company.companySize || 'N/A'}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <div>
            <span className="block font-medium text-gray-900 dark:text-white">Lĩnh vực:</span>
            <span>{company.industry}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div>
            <span className="block font-medium text-gray-900 dark:text-white">Địa điểm:</span>
            <span className="line-clamp-2" title={company.location}>{company.location}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          href={`/employers/${company.id}`}
          className="inline-flex items-center text-brand-500 hover:text-brand-600 font-semibold text-sm transition-colors"
        >
          Xem trang công ty
          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default CompanyInfoSidebar;

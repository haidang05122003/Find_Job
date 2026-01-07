'use client';

import React from 'react';
import Link from 'next/link';
import { Company } from '@/types/company';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <Link href={`/employers/${company.id}`} className="block h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-brand-500 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-2xl dark:border-gray-700 overflow-hidden">
            {company.logo && (company.logo.startsWith('http') || company.logo.startsWith('/') || company.logo.length > 5) ? (
              <img
                src={company.logo}
                alt={company.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '<span>🏢</span>';
                }}
              />
            ) : (
              <span>🏢</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1 dark:text-white">
              {company.name}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {company.industry}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {company.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-.1283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {(company.companySize || '0').replace(/\s*nhân viên\s*$/i, '')} nhân viên
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 flex-1 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
          {(company.description || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/20 dark:text-brand-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {company.openPositions} vị trí đang tuyển
          </span>

          <span className="text-sm font-medium text-brand-600 group-hover:text-brand-700 dark:text-brand-400 dark:group-hover:text-brand-300">
            Xem chi tiết →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CompanyCard;

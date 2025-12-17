'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Company } from '@/types/company';

interface CompanyCardWithTooltipProps {
  company: Company;
}

const CompanyCardWithTooltip: React.FC<CompanyCardWithTooltipProps> = ({ company }) => {
  return (
    <div className="relative h-full">
      <Link href={`/employers/${company.id}`}>
        <div className="group h-full min-h-[140px] overflow-hidden rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200 bg-white text-3xl dark:border-gray-700 overflow-hidden">
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

            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 dark:text-white">
              {company.name}
            </h3>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              {company.industry}
            </p>
            <p className="mt-2 text-xs font-medium text-brand-600">
              {company.openPositions} vị trí đang tuyển
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CompanyCardWithTooltip;

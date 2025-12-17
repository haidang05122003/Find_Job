import React from 'react';
import Link from 'next/link';
import { t } from '@/lib/i18n';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex ${className}`}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="mx-2 h-4 w-4 text-gray-400 dark:text-gray-600"
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
              )}
              
              {isLast || !item.href ? (
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm font-medium text-gray-600 transition hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

// Helper function to generate breadcrumbs for job detail page
export const getJobDetailBreadcrumbs = (jobTitle: string): BreadcrumbItem[] => [
  { label: t('nav.breadcrumb.home'), href: '/' },
  { label: t('nav.breadcrumb.jobs'), href: '/jobs' },
  { label: jobTitle },
];

// Helper function to generate breadcrumbs for company detail page
export const getCompanyDetailBreadcrumbs = (companyName: string): BreadcrumbItem[] => [
  { label: t('nav.breadcrumb.home'), href: '/' },
  { label: t('nav.breadcrumb.companies'), href: '/employers' },
  { label: companyName },
];

// Helper function to generate breadcrumbs for jobs page
export const getJobsBreadcrumbs = (): BreadcrumbItem[] => [
  { label: t('nav.breadcrumb.home'), href: '/' },
  { label: t('nav.breadcrumb.jobs') },
];

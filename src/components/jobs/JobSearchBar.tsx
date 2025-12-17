'use client';

import React, { useState, useEffect, useRef } from 'react';
import Button from '@/components/shared/Button';
import { jobService, CategoryResponse } from '@/services/job.service';

interface JobSearchBarProps {
  onSearch: (query: SearchQuery) => void;
  initialValues?: Partial<SearchQuery>;
}

export interface SearchQuery {
  keyword: string;
  location: string;
  category: string;
}

const JobSearchBar: React.FC<JobSearchBarProps> = ({
  onSearch,
  initialValues = {},
}) => {
  const [keyword, setKeyword] = useState(initialValues.keyword || '');
  const [location, setLocation] = useState(initialValues.location || '');
  const [category, setCategory] = useState(initialValues.category || '');

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await jobService.getCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ keyword, location, category });
  };

  const handleCategorySelect = (groupName: string) => {
    setCategory(groupName);
    setIsCategoryOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-theme-lg dark:bg-gray-900 sm:flex-row">
        {/* Keyword Input */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tên công việc, từ khóa..."
            className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:bg-gray-900"
          />
        </div>

        {/* Location Input */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Địa điểm"
            className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:bg-gray-900"
          />
        </div>

        {/* Custom Category Dropdown */}
        <div className="relative flex-1" ref={dropdownRef}>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>

          <button
            type="button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-8 text-left text-sm text-gray-900 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
          >
            <span className={`block truncate ${!category ? 'text-gray-500 dark:text-gray-400' : ''}`}>
              {category || 'Tất cả danh mục'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg className={`h-5 w-5 text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>

          {/* Dropdown Menu */}
          {isCategoryOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <ul className="py-1">
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('')}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Tất cả danh mục
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => handleCategorySelect(cat.name)}
                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 hover:text-brand-600 dark:hover:bg-gray-700 dark:hover:text-white ${category === cat.name
                          ? 'bg-brand-50 font-medium text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                          : 'text-gray-700 dark:text-gray-200'
                        }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Search Button */}
        <Button type="submit" size="lg" className="sm:w-auto">
          <svg className="h-5 w-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden sm:inline">Tìm việc</span>
        </Button>
      </div>
    </form>
  );
};

export default JobSearchBar;

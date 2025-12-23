'use client';

import React, { useState, useEffect, useRef } from 'react';
import { jobService, CategoryResponse } from '@/services/job.service';
import AdvanceFilter, { FilterState } from './AdvanceFilter';

interface JobSearchBarProps {
  onSearch: (query: SearchQuery) => void;
  onFilterChange: (filters: FilterState) => void;
  filters: FilterState;
  onResetFilters: () => void;
  initialValues?: Partial<SearchQuery>;
  locations?: string[];
}

export interface SearchQuery {
  keyword: string;
  location: string;
  category: string;
}

const JobSearchBar: React.FC<JobSearchBarProps> = ({
  onSearch,
  onFilterChange,
  filters,
  onResetFilters,
  initialValues = {},
  locations = [],
}) => {
  const [keyword, setKeyword] = useState(initialValues.keyword || '');
  const [location, setLocation] = useState(initialValues.location || '');
  const [category, setCategory] = useState(initialValues.category || '');

  // Sync internal state with external prop changes
  useEffect(() => {
    setKeyword(initialValues.keyword || '');
    setLocation(initialValues.location || '');
    setCategory(initialValues.category || '');
  }, [initialValues.keyword, initialValues.location, initialValues.category]);

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAdvanceFilterOpen, setIsAdvanceFilterOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const advanceFilterRef = useRef<HTMLDivElement>(null);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (advanceFilterRef.current && !advanceFilterRef.current.contains(event.target as Node)) {
        setIsAdvanceFilterOpen(false);
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
    onSearch({ keyword, location, category: groupName });
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full flex flex-col xl:flex-row gap-4">
        <div className="flex-1 flex flex-col rounded-xl bg-white shadow-sm dark:bg-gray-800 sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-gray-700">

          {/* Keyword Input */}
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                const val = e.target.value;
                setKeyword(val);
                if (!val) onSearch({ keyword: '', location, category });
              }}
              placeholder="Tiêu đề, từ khóa..."
              className="w-full h-14 pl-11 pr-10 bg-transparent text-gray-900 placeholder-gray-500 dark:text-white rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700/50 transition-colors font-inter text-sm"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => {
                  setKeyword('');
                  onSearch({ keyword: '', location, category });
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Location Input (Typable) */}
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input
              type="text"
              list="search-locations-list"
              value={location}
              onChange={(e) => {
                const val = e.target.value;
                setLocation(val);
                if (!val) onSearch({ keyword, location: '', category });
              }}
              placeholder="Tất cả địa điểm"
              className="w-full h-14 pl-11 pr-10 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700/50 transition-colors truncate font-inter text-sm"
            />
            {location && (
              <button
                type="button"
                onClick={() => {
                  setLocation('');
                  onSearch({ keyword, location: '', category });
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <datalist id="search-locations-list">
              {locations.map((loc) => (
                <option key={loc} value={loc} />
              ))}
            </datalist>
          </div>

          {/* Category Dropdown */}
          <div className="relative flex-1 group" ref={dropdownRef}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full h-14 pl-11 pr-10 text-left bg-transparent text-gray-900 dark:text-white focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700/50 transition-colors relative text-sm"
            >
              <span className={`block truncate ${!category ? 'text-gray-500' : ''}`}>
                {category || 'Chọn danh mục'}
              </span>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isCategoryOpen && (
              <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-60 overflow-auto rounded-xl bg-white shadow-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <ul className="py-2">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleCategorySelect('')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      Tất cả danh mục
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        type="button"
                        onClick={() => handleCategorySelect(cat.name)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 hover:text-brand-600 dark:hover:bg-gray-700 ${category === cat.name ? 'text-brand-600 font-medium bg-brand-50 dark:bg-brand-900/20' : 'text-gray-700 dark:text-gray-200'
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

          {/* Advance Filter (Integrated) */}
          <div className="relative group flex-1 md:flex-none md:w-48" ref={advanceFilterRef}>
            <button
              type="button"
              onClick={() => setIsAdvanceFilterOpen(!isAdvanceFilterOpen)}
              className={`w-full h-14 flex items-center justify-between px-4 text-sm font-medium transition-colors ${isAdvanceFilterOpen ? 'text-brand-600 bg-brand-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <span className="truncate">Bộ lọc nâng cao</span>
              <svg className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform ${isAdvanceFilterOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Advance Filter Dropdown (Custom Pos) */}
            <div className="absolute top-full right-0 mt-2 w-screen max-w-4xl z-50">
              <AdvanceFilter
                isOpen={isAdvanceFilterOpen}
                onClose={() => setIsAdvanceFilterOpen(false)}
                filters={filters}
                onFilterChange={onFilterChange}
                onReset={onResetFilters}
              />
            </div>
          </div>
        </div>

        {/* Search Button (Separated) */}
        <button
          type="submit"
          className="h-14 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap min-w-[120px] text-sm"
        >
          Tìm kiếm
        </button>
      </form>
    </div>
  );
};

export default JobSearchBar;

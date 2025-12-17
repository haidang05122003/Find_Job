"use client";

import React from "react";
import Button from "@/components/ui/button/Button";
import { GridIcon } from "./icons";

interface SearchFilterBarProps {
  filterCount?: number;
  onFilterClick?: () => void;
  onSearch?: (term: string) => void;
  onLocationChange?: (location: string) => void;
  locationValue?: string;
  locations?: string[];
  placeholder?: string;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filterCount = 0,
  onFilterClick,
  onSearch,
  onLocationChange,
  locationValue = "",
  locations = [],
  placeholder = "Search...",
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 dark:bg-gray-900 p-2 flex flex-col md:flex-row items-center gap-2 mb-6 transition-all duration-200">
      {/* Search Input */}
      <div className="relative flex-1 w-full md:w-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full rounded-md border-transparent bg-transparent py-2.5 pl-10 pr-4 text-sm focus:border-transparent focus:ring-0 dark:text-white dark:placeholder-gray-500"
        />
      </div>

      {/* Separator - only show if we have location filter */}
      {onLocationChange && (
        <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2"></div>
      )}

      {/* Location Filter */}
      {onLocationChange && locations.length > 0 && (
        <div className="relative w-full md:w-48 lg:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <select
            value={locationValue}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full appearance-none rounded-md border-transparent bg-transparent py-2.5 pl-10 pr-8 text-sm focus:border-transparent focus:ring-0 dark:text-white cursor-pointer truncate"
          >
            <option value="">Tất cả địa điểm</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}

      {/* Button Search (Optional visually, but usually good to have 'Find') */}
      <div className="w-full md:w-auto">
        <Button className="w-full md:w-auto px-6 py-2.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors shadow-sm">
          Tìm kiếm
        </Button>
      </div>

    </div>
  );
};

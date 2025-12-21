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
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 dark:bg-gray-900 flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">
        {/* Search Input */}
        <div className="relative flex-1 w-full md:w-auto group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={placeholder}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full h-14 rounded-l-xl border-transparent bg-transparent pl-11 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-0 dark:text-white dark:placeholder-gray-400 font-inter"
          />
        </div>

        {/* Location Filter */}
        {onLocationChange && locations.length > 0 && (
          <div className="relative w-full md:w-64 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <select
              value={locationValue}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full h-14 appearance-none border-transparent bg-transparent pl-11 pr-10 text-sm text-gray-900 focus:border-transparent focus:ring-0 dark:text-white cursor-pointer truncate font-inter"
            >
              <option value="">Tất cả địa điểm</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Button Search (Separated) */}
      <Button className="w-full md:w-auto px-8 h-14 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors shadow-sm whitespace-nowrap min-w-[120px]">
        Tìm kiếm
      </Button>
    </div>
  );
};

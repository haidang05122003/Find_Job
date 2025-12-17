'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { JobFilters } from '@/types/job';

interface FilterContextValue {
  filters: JobFilters;
  setFilters: (filters: JobFilters) => void;
  updateFilter: <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => void;
  resetFilters: () => void;
  activeFilterCount: number;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider');
  }
  return context;
};

const defaultFilters: JobFilters = {
  categories: [],
  locations: [],
  salaryRange: { min: 0, max: 100000000 },
  experienceLevels: [],
  jobTypes: [],
  companySize: [],
  postedWithin: 'all',
  searchQuery: '',
};

function FilterProviderContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFiltersState] = useState<JobFilters>(defaultFilters);

  // Load filters from URL on mount
  useEffect(() => {
    const urlFilters: JobFilters = { ...defaultFilters };

    const categories = searchParams.get('categories');
    if (categories) {
      urlFilters.categories = categories.split(',');
    }

    const locations = searchParams.get('locations');
    if (locations) {
      urlFilters.locations = locations.split(',');
    }

    const minSalary = searchParams.get('minSalary');
    const maxSalary = searchParams.get('maxSalary');
    if (minSalary || maxSalary) {
      urlFilters.salaryRange = {
        min: minSalary ? parseInt(minSalary) : 0,
        max: maxSalary ? parseInt(maxSalary) : 100000000,
      };
    }

    const experienceLevels = searchParams.get('experienceLevels');
    if (experienceLevels) {
      urlFilters.experienceLevels = experienceLevels.split(',') as JobFilters['experienceLevels'];
    }

    const jobTypes = searchParams.get('jobTypes');
    if (jobTypes) {
      urlFilters.jobTypes = jobTypes.split(',') as JobFilters['jobTypes'];
    }

    const companySize = searchParams.get('companySize');
    if (companySize) {
      urlFilters.companySize = companySize.split(',') as JobFilters['companySize'];
    }

    const postedWithin = searchParams.get('postedWithin');
    if (postedWithin) {
      urlFilters.postedWithin = postedWithin as JobFilters['postedWithin'];
    }

    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      urlFilters.searchQuery = searchQuery;
    }

    setFiltersState(urlFilters);
  }, [searchParams]);

  // Update URL when filters change
  const setFilters = useCallback(
    (newFilters: JobFilters) => {
      setFiltersState(newFilters);

      const params = new URLSearchParams();

      if (newFilters.categories && newFilters.categories.length > 0) {
        params.set('categories', newFilters.categories.join(','));
      }

      if (newFilters.locations && newFilters.locations.length > 0) {
        params.set('locations', newFilters.locations.join(','));
      }

      if (newFilters.salaryRange.min > 0) {
        params.set('minSalary', newFilters.salaryRange.min.toString());
      }

      if (newFilters.salaryRange.max < 100000000) {
        params.set('maxSalary', newFilters.salaryRange.max.toString());
      }

      if (newFilters.experienceLevels.length > 0) {
        params.set('experienceLevels', newFilters.experienceLevels.join(','));
      }

      if (newFilters.jobTypes.length > 0) {
        params.set('jobTypes', newFilters.jobTypes.join(','));
      }

      if (newFilters.companySize && newFilters.companySize.length > 0) {
        params.set('companySize', newFilters.companySize.join(','));
      }

      if (newFilters.postedWithin && newFilters.postedWithin !== 'all') {
        params.set('postedWithin', newFilters.postedWithin);
      }

      if (newFilters.searchQuery) {
        params.set('q', newFilters.searchQuery);
      }

      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : window.location.pathname, {
        scroll: false,
      });
    },
    [router]
  );

  const updateFilter = useCallback(
    <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => {
      setFilters({ ...filters, [key]: value });
    },
    [filters, setFilters]
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [setFilters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories && filters.categories.length > 0) count++;
    if (filters.locations && filters.locations.length > 0) count++;
    if (filters.salaryRange.min > 0 || filters.salaryRange.max < 100000000) count++;
    if (filters.experienceLevels.length > 0) count++;
    if (filters.jobTypes.length > 0) count++;
    if (filters.companySize && filters.companySize.length > 0) count++;
    if (filters.postedWithin && filters.postedWithin !== 'all') count++;
    if (filters.searchQuery) count++;
    return count;
  }, [filters]);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      updateFilter,
      resetFilters,
      activeFilterCount,
    }),
    [filters, setFilters, updateFilter, resetFilters, activeFilterCount]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <FilterProviderContent>{children}</FilterProviderContent>
    </React.Suspense>
  );
};

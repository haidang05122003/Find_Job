import { useMemo } from 'react';
import { Job } from '@/types/job';

interface UseJobFiltersProps {
    jobs: Job[];
    searchQuery?: string;
    categories?: string[];
    locations?: string[];
    jobTypes?: string[];
    experienceLevels?: string[];
    salaryRange?: { min: number; max: number };
}

export const useJobFilters = ({
    jobs,
    searchQuery,
    categories,
    locations,
    jobTypes,
    experienceLevels,
    salaryRange,
}: UseJobFiltersProps) => {
    return useMemo(() => {
        let filtered = [...jobs];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (job) =>
                    job.title.toLowerCase().includes(query) ||
                    job.company.name.toLowerCase().includes(query) ||
                    job.description.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (categories && categories.length > 0) {
            filtered = filtered.filter((job) => categories.includes(job.category));
        }

        // Location filter
        if (locations && locations.length > 0) {
            filtered = filtered.filter((job) =>
                locations.some((loc) => job.location.toLowerCase().includes(loc.toLowerCase()))
            );
        }

        // Job type filter
        if (jobTypes && jobTypes.length > 0) {
            filtered = filtered.filter((job) => jobTypes.includes(job.jobType));
        }

        // Experience level filter
        if (experienceLevels && experienceLevels.length > 0) {
            filtered = filtered.filter((job) => experienceLevels.includes(job.experienceLevel));
        }

        // Salary range filter
        if (salaryRange) {
            filtered = filtered.filter(
                (job) =>
                    job.salary.min >= salaryRange.min &&
                    job.salary.max <= salaryRange.max
            );
        }

        return filtered;
    }, [jobs, searchQuery, categories, locations, jobTypes, experienceLevels, salaryRange]);
};

import { Job } from '@/types/job';

// ============================================
// JOB FORMATTING HELPERS
// ============================================

export const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hôm nay';
    if (days === 1) return 'Hôm qua';
    if (days < 7) return `${days} ngày trước`;
    if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
    return `${Math.floor(days / 30)} tháng trước`;
};

export const formatSalary = (salary: Job['salary']): string => {
    const { min, max, period } = salary;
    const periodText = period === 'month' ? '/tháng' : period === 'year' ? '/năm' : '/giờ';

    if (min === max) {
        return `${min.toLocaleString()}${periodText}`;
    }
    return `${min.toLocaleString()} - ${max.toLocaleString()}${periodText}`;
};

export const getLocationTypeColor = (locationType: Job['locationType']): 'success' | 'info' | 'neutral' => {
    switch (locationType) {
        case 'remote':
            return 'success';
        case 'hybrid':
            return 'info';
        default:
            return 'neutral';
    }
};

export const getLocationTypeLabel = (locationType: Job['locationType']): string => {
    switch (locationType) {
        case 'remote':
            return 'Remote';
        case 'hybrid':
            return 'Hybrid';
        default:
            return 'Onsite';
    }
};

// ============================================
// JOB FILTERING & SORTING
// ============================================

export const sortJobs = (jobs: Job[], sortBy: string): Job[] => {
    const sorted = [...jobs];

    switch (sortBy) {
        case 'salary-high':
            return sorted.sort((a, b) => b.salary.max - a.salary.max);
        case 'salary-low':
            return sorted.sort((a, b) => a.salary.min - b.salary.min);
        case 'latest':
        default:
            return sorted.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
    }
};

export const filterJobsBySearch = (jobs: Job[], searchQuery: string): Job[] => {
    if (!searchQuery) return jobs;

    const query = searchQuery.toLowerCase();
    return jobs.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.name.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
    );
};

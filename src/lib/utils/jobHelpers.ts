import { Job } from '@/types/job';

// ============================================
// JOB FORMATTING HELPERS
// ============================================

export const getTimeAgo = (date: Date): string => {
    if (!date || isNaN(date.getTime())) return 'Vừa xong';

    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 0) return 'Vừa xong';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hôm nay';
    if (days === 1) return 'Hôm qua';
    if (days < 7) return `${days} ngày trước`;
    if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
    return `${Math.floor(days / 30)} tháng trước`;
};

import { formatCurrency } from '@/lib/utils';

export const formatSalary = (salary: Job['salary'], options?: { short?: boolean, upTo?: boolean }): string => {
    const { min, max, period } = salary;
    // const periodText = period === 'month' ? '/tháng' : period === 'year' ? '/năm' : '/giờ';

    // If 'upTo' mode is requested (Lên đến X)
    if (options?.upTo) {
        if (max && max > 0) {
            return `Lên đến ${formatCurrency(max)}`;
        }
    }

    const periodText = period === 'month' ? '' : period === 'year' ? '/năm' : '/giờ';

    if (min === max) {
        return `${formatCurrency(min)}${period === 'month' ? '' : periodText}`;
    }

    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
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

export const filterJobsBySearch = (jobs: Job[], query?: string): Job[] => {
    if (!query) return jobs;
    const lowerQuery = query.toLowerCase();
    return jobs.filter(job =>
        job.title.toLowerCase().includes(lowerQuery) ||
        job.company.name.toLowerCase().includes(lowerQuery) ||
        job.location?.toLowerCase().includes(lowerQuery) ||
        job.skills?.some(skill => skill.toLowerCase().includes(lowerQuery)) ||
        job.keywords?.some(kw => kw.toLowerCase().includes(lowerQuery))
    );
};

export const getJobTypeLabel = (jobType?: string): string | null => {
    if (!jobType) return null;

    const normalizedType = jobType.toLowerCase().replace('-', '_');

    const map: Record<string, string> = {
        'full_time': 'Toàn thời gian',
        'part_time': 'Bán thời gian',
        'contract': 'Hợp đồng',
        'internship': 'Thực tập',
        'remote': 'Làm từ xa',
        'temporary': 'Tạm thời',
        'freelance': 'Tự do',
        'full_time_permanent': 'Toàn thời gian',
        'part_time_permanent': 'Bán thời gian',
    };

    return map[normalizedType] || jobType.replace(/_/g, ' ');
};

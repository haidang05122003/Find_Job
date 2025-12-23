export interface SalaryRange {
    min: number;
    max: number;
    currency: string;
    period?: 'hour' | 'month' | 'year';
}

export interface Job {
    id: string;
    title: string;
    company: {
        id: string;
        name: string;
        logo: string;
        size?: string; // Added field
    };
    location: string;
    locations?: string[];
    skills?: string[];
    keywords?: string[];
    locationType: 'onsite' | 'remote' | 'hybrid';
    jobType?: 'full-time' | 'part-time' | 'contract' | 'internship';
    experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
    experience?: string;
    level?: string;
    salary: {
        min: number;
        max: number;
        currency: string;
        period: 'hour' | 'month' | 'year';
    };
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    category: string;
    tags: string[];
    postedAt: Date;
    expiresAt: Date;
    isFeatured: boolean;
    isBookmarked: boolean;
    applicantsCount: number;
    quantity?: number;
    gender?: string;
    // Backend compatibility
    companyName?: string;
    companyLogo?: string;
    createdAt?: string | Date;
    status?: string;
    salaryMin?: number;
    salaryMax?: number;
    deadline?: string | Date;
}

export interface JobDetail extends Job {
    companyInfo: {
        description: string;
        industry: string;
        companySize: string;
        website: string;
        socialLinks?: {
            linkedin?: string;
            twitter?: string;
            facebook?: string;
        };
    };
}

export interface JobFilters {
    jobTypes: string[];
    experienceLevels: string[];
    jobLevels: string[];
    salaryRange: { min: number; max: number };
    datePosted?: string;
    locationType?: string[];
    category?: string;
    search?: string;
    searchQuery?: string;
    location?: string;
    categories?: string[];
    locations?: string[];
    companySize?: string[];
    postedWithin?: string;
}

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type JobStatus = 'active' | 'closed' | 'draft' | 'expired';

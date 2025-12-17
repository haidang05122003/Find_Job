export interface JobFilters {
    categories: string[];
    locations: string[];
    salaryRange: {
        min: number;
        max: number;
    };
    experienceLevels: ('entry' | 'mid' | 'senior' | 'lead')[];
    jobTypes: ('full-time' | 'part-time' | 'contract' | 'internship')[];
    companySize: string[];
    postedWithin: 'all' | '24h' | '7d' | '30d';
    searchQuery: string;
    category?: string;
    location?: string;
    locationType?: string[];
}

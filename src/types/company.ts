export interface Company {
    id: string;
    name: string;
    logo: string;
    coverImage?: string;
    description: string;
    industry: string;
    companySize?: string;
    size?: string; // Alias for companySize
    location: string;
    website: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
        facebook?: string;
    };
    openPositions: number;
    founded?: number;
    employees?: string;
    benefits?: string[];
    culture?: string[];
    images?: string[];
    isFollowing?: boolean;
    // Backend compatibility
    companyName?: string;
    email?: string;
    status?: string;
    createdAt?: string | Date;
    logoUrl?: string;
    phone?: string;
    address?: string;
    accountId?: number;
}

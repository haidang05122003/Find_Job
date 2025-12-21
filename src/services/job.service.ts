import { BaseService } from './base.service';
import type { BaseResponse, PageResponse } from '@/types/api';
import type { Job } from '@/types/job';
import type { QueryParams } from '@/types/service';

export interface JobSearchParams extends QueryParams {
    keyword?: string;
    location?: string;
    category?: string;
    minSalary?: number;
    maxSalary?: number;
    employmentType?: string;
    workMethod?: string;
    experience?: string;
    page?: number;
    size?: number;
    sort?: string;
}

// Helper to safely map string to union type
function mapToUnion<T extends string>(value: string | undefined, validValues: readonly T[], defaultValue: T): T {
    if (!value) return defaultValue;
    const normalized = value.toLowerCase() as T;
    return validValues.includes(normalized) ? normalized : defaultValue;
}

// Backend DTO
export interface JobPostResponse {
    id: number;
    companyId: number; // Added
    title: string;
    companyName: string;
    companyLogo: string;
    companySize?: string; // Added field
    categoryName: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    salaryUnit: string;
    employmentType: string;
    description: string;
    requirements: string;
    benefits: string;
    deadline: string;
    status: string;
    createdAt: string;
    experience: string;
    quantity: number;
    level?: string;
    gender: string;
    workMethod: string;
    address: string;
    locations?: string[];
    skills?: string[];
    keywords?: string[];
    isBookmarked?: boolean;
    applicationsCount?: number;
}

export interface CategoryResponse {
    id: number;
    name: string;
    description: string;
}

class JobService extends BaseService {
    /**
     * Search jobs with filters
     */
    async searchJobs(params: JobSearchParams): Promise<BaseResponse<PageResponse<Job>>> {
        const response = await this.getPaged<JobPostResponse>('/jobs', params);

        if (response.success && response.data) {
            // Transform to Frontend Job Interface
            const transformedContent = response.data.content.map(this.transformToJob.bind(this));

            return {
                ...response,
                data: {
                    ...response.data,
                    content: transformedContent
                }
            };
        }

        // Return empty page structure on error or empty response to maintain type safety
        return {
            success: false,
            code: 500,
            message: response.message || 'Failed to fetch jobs',
            data: {
                content: [],
                totalPages: 0,
                totalElements: 0,
                last: true,
                size: 0,
                number: 0,
                first: true,
                empty: true
            }
        };
    }

    /**
     * Get Job Detail
     */
    async getJobDetail(id: string | number): Promise<BaseResponse<Job>> {
        const response = await this.get<JobPostResponse>(`/jobs/${id}`);

        if (response.success && response.data) {
            return {
                ...response,
                data: this.transformToJob(response.data)
            };
        }

        // Return error response structure
        return {
            success: false,
            code: 404,
            message: response.message || 'Job not found',
            data: null as unknown as Job // Explicit null for not found or error, handled by caller
        };
    }

    /**
     * Get All Categories
     */
    async getCategories(): Promise<BaseResponse<CategoryResponse[]>> {
        return this.get<CategoryResponse[]>('/categories');
    }

    /**
     * Get All Locations
     */
    async getLocations(): Promise<BaseResponse<string[]>> {
        return this.get<string[]>('/jobs/locations');
    }

    /**
     * Bookmark a job
     */
    async bookmarkJob(id: string): Promise<BaseResponse<boolean>> {
        return this.post(`/jobs/${id}/bookmark`, {});
    }

    /**
     * Unbookmark a job
     */
    async unbookmarkJob(id: string): Promise<BaseResponse<boolean>> {
        return this.delete(`/jobs/${id}/bookmark`);
    }

    /**
     * Transform Backend DTO to Frontend Model
     */
    private transformToJob(dto: JobPostResponse): Job {
        return {
            id: dto.id ? dto.id.toString() : `unk-${Math.random()}`,
            title: dto.title || 'Untitled Job',
            company: {
                id: dto.companyId ? dto.companyId.toString() : '0',
                name: dto.companyName,
                logo: dto.companyLogo || '',
                size: dto.companySize || 'N/A',
            },
            location: dto.location || dto.address,
            locations: dto.locations || [],
            skills: dto.skills || [],
            keywords: dto.keywords || [],
            locationType: mapToUnion(dto.workMethod, ['onsite', 'remote', 'hybrid'], 'onsite'),
            jobType: mapToUnion(dto.employmentType, ['full-time', 'part-time', 'contract', 'internship'], 'full-time'),
            experienceLevel: mapToUnion(dto.experience, ['entry', 'mid', 'senior', 'lead'], 'entry'),
            experience: dto.experience || 'Không yêu cầu',
            salary: {
                min: dto.salaryMin || 0,
                max: dto.salaryMax || 0,
                currency: dto.salaryUnit || 'VND',
                period: 'month',
            },
            description: dto.description || '',
            requirements: dto.requirements ? [dto.requirements] : [],
            responsibilities: [],
            benefits: dto.benefits ? [dto.benefits] : [],
            category: dto.categoryName,
            tags: dto.keywords || [],
            postedAt: new Date(dto.createdAt),
            expiresAt: new Date(dto.deadline),
            isFeatured: false,
            isBookmarked: dto.isBookmarked || false,
            applicantsCount: dto.applicationsCount || 0,
            quantity: dto.quantity || 1,
            level: dto.level,
            gender: dto.gender || 'Không yêu cầu',
        };
    }
}

export const jobService = new JobService();

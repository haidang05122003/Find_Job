import { BaseService } from './base.service';
import type { BaseResponse, PageResponse } from '@/types/api';
import type { Job, JobFilters } from '@/types/job';

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
    gender: string;
    workMethod: string;
    address: string;
    isBookmarked?: boolean;
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
    async searchJobs(params: any): Promise<BaseResponse<PageResponse<Job>>> {
        const response = await this.getPaged<JobPostResponse>('/jobs', params);

        if (response.success && response.data) {
            // Transform to Frontend Job Interface
            const transformedContent = response.data.content.map(this.transformToJob);

            return {
                ...response,
                data: {
                    ...response.data,
                    content: transformedContent
                }
            };
        }

        return response as any;
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

        return response as any;
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
     * Transform Backend DTO to Frontend Model
     */
    private transformToJob(dto: JobPostResponse): Job {
        return {
            id: dto.id.toString(),
            title: dto.title,
            company: {
                id: dto.companyId ? dto.companyId.toString() : '0',
                name: dto.companyName,
                logo: dto.companyLogo || '',
                size: dto.companySize || 'N/A',
            },
            location: dto.location || dto.address,
            locationType: (dto.workMethod?.toLowerCase() as any) || 'onsite',
            jobType: (dto.employmentType?.toLowerCase() as any) || 'full-time',
            experienceLevel: (dto.experience?.toLowerCase() as any) || 'entry',
            experience: dto.experience || 'Không yêu cầu',
            salary: {
                min: dto.salaryMin,
                max: dto.salaryMax,
                currency: dto.salaryUnit || 'VND',
                period: 'month',
            },
            description: dto.description,
            requirements: dto.requirements ? [dto.requirements] : [], // TODO: Split by newline if needed
            responsibilities: [], // Backend merges description?
            benefits: dto.benefits ? [dto.benefits] : [],
            category: dto.categoryName,
            tags: [],
            postedAt: new Date(dto.createdAt),
            expiresAt: new Date(dto.deadline),
            isFeatured: false,
            isBookmarked: dto.isBookmarked || false,
            applicantsCount: 0,
            quantity: dto.quantity || 1,
            gender: dto.gender || 'Không yêu cầu',
        };
    }
}

export const jobService = new JobService();

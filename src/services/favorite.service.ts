import { BaseService } from './base.service';
import type { BaseResponse, PageResponse } from '@/types/api';
import type { Job } from '@/types/job';


interface FavoriteJobDto {
    id: number;
    title: string;
    companyId?: number;
    companyName: string;
    companyLogo?: string;
    location: string;
    workMethod: string;
    employmentType: string;
    experience: string;
    salaryMin: number;
    salaryMax: number;
    description: string;
    requirements?: string;
    benefits?: string;
    categoryName: string;
    createdAt: string;
    deadline: string;
    quantity?: number;
    gender?: string;
}

class FavoriteService extends BaseService {
    /**
     * Add to Favorites
     */
    async addFavorite(jobId: number | string): Promise<BaseResponse<string>> {
        return this.post<string>('/favorites', { jobId: Number(jobId) });
    }

    /**
     * Remove from Favorites
     */
    async removeFavorite(jobId: number | string): Promise<BaseResponse<string>> {
        return this.delete<string>(`/favorites/${jobId}`);
    }

    /**
     * Get Favorites (Paged)
     */

    /**
     * Get Favorites (Paged)
     */
    async getFavorites(params?: import('@/types/service').QueryParams): Promise<BaseResponse<PageResponse<Job>>> {
        const response = await this.getPaged<FavoriteJobDto>('/favorites', params);
        if (response.success && response.data) {
            // @ts-ignore - existing code had logical issue, corrected here map
            const transformedContent = response.data.content.map(this.mapToJob);
            return {
                ...response,
                data: {
                    ...response.data,
                    content: transformedContent
                }
            };
        }
        return response as any; // Cast needed if response structure mismatch, but prefer BaseResponse<PageResponse<Job>>
    }

    private mapToJob(item: FavoriteJobDto): Job {
        const jobType = (item.employmentType?.toLowerCase().replace('_', '-') || 'full-time') as Job['jobType'];
        const experienceLevel = (item.experience?.toLowerCase() || 'entry') as Job['experienceLevel'];

        return {
            id: item.id.toString(),
            title: item.title,
            company: {
                id: item.companyId ? item.companyId.toString() : '',
                name: item.companyName,
                logo: item.companyLogo || '',
            },
            location: item.location,
            locationType: item.workMethod === 'REMOTE' ? 'remote' : item.workMethod === 'HYBRID' ? 'hybrid' : 'onsite',
            jobType: ['full-time', 'part-time', 'contract', 'internship'].includes(jobType) ? jobType : 'full-time',
            experienceLevel: ['entry', 'mid', 'senior', 'lead'].includes(experienceLevel) ? experienceLevel : 'entry',
            experience: item.experience || '',
            salary: {
                min: item.salaryMin,
                max: item.salaryMax,
                currency: 'VNĐ',
                period: 'month',
            },
            description: item.description,
            requirements: item.requirements ? [item.requirements] : [],
            responsibilities: [],
            benefits: item.benefits ? [item.benefits] : [],
            category: item.categoryName,
            tags: [],
            postedAt: new Date(item.createdAt),
            expiresAt: new Date(item.deadline),
            isFeatured: false,
            isBookmarked: true,
            applicantsCount: 0,
            quantity: item.quantity || 1,
            gender: item.gender || 'Any',
        };
    }
}

export const favoriteService = new FavoriteService();

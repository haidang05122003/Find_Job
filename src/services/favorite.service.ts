import { BaseService } from './base.service';
import type { BaseResponse, PageResponse } from '@/types/api';
import type { Job } from '@/types/job';

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
    async getFavorites(params?: any): Promise<BaseResponse<PageResponse<Job>>> {
        const response = await this.getPaged<any>('/favorites', params);
        if (response.success && response.data) {
            response.data.content = response.data.content.map(this.mapToJob);
        }
        return response;
    }

    private mapToJob(item: any): Job {
        return {
            id: item.id,
            title: item.title,
            company: {
                id: item.companyId || '', // Backend might need to return companyId
                name: item.companyName,
                logo: item.companyLogo || '',
            },
            location: item.location,
            locationType: item.workMethod === 'REMOTE' ? 'remote' : item.workMethod === 'HYBRID' ? 'hybrid' : 'onsite',
            jobType: (item.employmentType?.toLowerCase().replace('_', '-') as any) || 'full-time',
            experienceLevel: (item.experience?.toLowerCase() as any) || 'entry',
            experience: item.experience || '',
            salary: {
                min: item.salaryMin,
                max: item.salaryMax,
                currency: 'VNĐ', // Default or from backend
                period: 'month',
            },
            description: item.description,
            requirements: item.requirements ? [item.requirements] : [], // Simple mapping
            responsibilities: [],
            benefits: item.benefits ? [item.benefits] : [],
            category: item.categoryName,
            tags: [],
            postedAt: new Date(item.createdAt),
            expiresAt: new Date(item.deadline),
            isFeatured: false,
            isBookmarked: true, // Always true for favorites
            applicantsCount: 0,
            quantity: item.quantity || 1,
            gender: item.gender || 'Any',
        };
    }
}

export const favoriteService = new FavoriteService();

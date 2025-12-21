import { BaseService } from './base.service';
import type { BaseResponse, PageResponse } from '@/types/api';


import type { Category } from '@/types/category';
export type { Category };

/**
 * Category Service
 * Handles job category operations
 */
class CategoryService extends BaseService {
    /**
     * Get paginated categories for admin
     */
    async getCategories(page: number = 0, size: number = 10): Promise<BaseResponse<PageResponse<Category>>> {
        return this.getPaged<Category>('/categories/paginated', { page, size });
    }

    /**
     * Get All Categories
     */
    async getAllCategories(): Promise<BaseResponse<Category[]>> {
        const response = await this.get<any[]>('/categories');

        if (response.success && response.data) {
            const transformedCategories: Category[] = response.data.map((item: any) => ({
                id: item.id.toString(),
                name: item.name,
                description: item.description,
                slug: item.name.toLowerCase().replace(/ /g, '-'),
                icon: '💼',
                jobCount: item.jobCount || 0,
                color: 'blue',
                subcategories: []
            }));

            return {
                ...response,
                data: transformedCategories
            };
        }

        return response as any;
    }


    /**
     * Create category
     */
    async createCategory(data: { name: string; description?: string }): Promise<BaseResponse<Category>> {
        return this.post<Category>('/categories', data);
    }

    /**
     * Update category
     */
    async updateCategory(id: string, data: { name: string; description?: string }): Promise<BaseResponse<Category>> {
        return this.put<Category>(`/categories/${id}`, data);
    }

    /**
     * Delete category
     */
    async deleteCategory(id: string): Promise<BaseResponse<void>> {
        return this.delete<void>(`/categories/${id}`);
    }

    /**
     * Get category by ID
     */
    async getCategoryById(id: string): Promise<BaseResponse<Category>> {
        return this.get<Category>(`/categories/${id}`);
    }

    /**
     * Get category by slug
     */
    async getCategoryBySlug(slug: string): Promise<BaseResponse<Category>> {
        return this.get<Category>(`/categories/slug/${slug}`);
    }

    /**
     * Get popular categories
     */
    async getPopularCategories(limit: number = 10): Promise<BaseResponse<Category[]>> {
        return this.get<Category[]>('/categories/popular', { params: { limit } });
    }
}

export const categoryService = new CategoryService();

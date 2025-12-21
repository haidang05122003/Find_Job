import { BaseService } from './base.service';
import type { BaseResponse, PageResponse } from '@/types/api';
import type { UserProfile } from '@/types/user';
import type { Company } from '@/types/company';
import type { Job } from '@/types/job';
import type { Report } from './report.service';
import type { Category } from './category.service';
import type { QueryParams } from '@/types/service';

/**
 * Dashboard statistics
 */
export interface DashboardStats {
    totalUsers: number;
    totalJobs: number;
    totalCompanies: number;
    totalApplications: number;
    activeUsers: number;
    pendingCompanies: number;
    pendingJobs: number;
    approvedJobs: number;
    pendingReports: number;
    recentActivity?: Activity[]; // Optional to match backend if needed, or remove if not used
}

/**
 * Activity log
 */
export interface Activity {
    id: string;
    type: string;
    description: string;
    userId: string;
    timestamp: string;
}

/**
 * Job approval data
 */
export interface JobApprovalData {
    action: 'APPROVE' | 'REJECT';
    reason?: string;
}

/**
 * Report resolution data
 */
export interface ReportResolutionData {
    status: 'resolved' | 'dismissed' | string;
    action?: string;
    note?: string;
}


export interface UserSearchParams extends QueryParams {
    role?: string;
    status?: string;
    keyword?: string;
}

export interface ReportSearchParams extends QueryParams {
    status?: string;
    type?: string;
}

export interface JobFilterParams extends QueryParams {
    status?: string;
    keyword?: string;
}

export interface ReportResolutionPayload {
    status: string;
    action?: string;
}

/**
 * Category creation data
 */
export interface CategoryCreateData {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    parentId?: string;
}

/**
 * Admin Service
 * Handles administrative operations
 */
class AdminService extends BaseService {
    // ==================== Dashboard ====================

    /**
     * Get dashboard statistics
     */
    async getDashboardStats(): Promise<BaseResponse<DashboardStats>> {
        return this.get<DashboardStats>('/admin/dashboard');
    }

    // ==================== User Management ====================

    /**
     * Get all users
     */
    /**
     * Get all users
     */
    async getAllUsers(params?: UserSearchParams): Promise<BaseResponse<PageResponse<UserProfile>>> {
        const queryParams: UserSearchParams = {
            page: (Number(params?.page) || 1) - 1,
            size: Number(params?.size || params?.limit || 10),
            role: params?.role,
            status: params?.status,
            keyword: params?.keyword
        };

        return this.getPaged<UserProfile>('/admin/users', queryParams);
    }

    /**
     * Get all reports
     */
    async getReports(params?: ReportSearchParams): Promise<BaseResponse<PageResponse<Report>>> {
        const queryParams: ReportSearchParams = {
            page: (Number(params?.page) || 1) - 1,
            size: Number(params?.size || params?.limit || 10),
            status: params?.status,
            type: params?.type
        };

        return this.getPaged<Report>('/admin/reports', queryParams);
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<BaseResponse<UserProfile>> {
        return this.get<UserProfile>(`/admin/users/${id}`);
    }

    /**
     * Lock user account
     */
    async lockUser(id: string, _reason?: string): Promise<BaseResponse<string>> {
        // Backend currently does not accept reason in body
        return this.patch<string>(`/admin/users/${id}/lock`);
    }

    /**
     * Unlock user account
     */
    async unlockUser(id: string): Promise<BaseResponse<string>> {
        return this.patch<string>(`/admin/users/${id}/unlock`);
    }

    /**
     * Delete user
     */
    async deleteUser(id: string): Promise<BaseResponse<string>> {
        return this.delete<string>(`/admin/users/${id}`);
    }

    // ==================== Company Management ====================

    /**
     * Get all companies
     */
    async getAllCompanies(params?: QueryParams): Promise<BaseResponse<PageResponse<Company>>> {
        return this.getPaged<Company>('/admin/companies', params);
    }

    /**
     * Get company detail
     */
    async getCompanyById(id: string): Promise<BaseResponse<Company>> {
        return this.get<Company>(`/admin/companies/${id}`);
    }

    /**
     * Get pending companies
     */
    async getPendingCompanies(params?: QueryParams): Promise<BaseResponse<PageResponse<Company>>> {
        return this.getPaged<Company>('/admin/companies/pending', params);
    }

    /**
     * Approve company
     */
    async approveCompany(id: string): Promise<BaseResponse<string>> {
        return this.patch<string>(`/admin/companies/${id}/approve`, {});
    }

    /**
     * Reject company
     */
    async rejectCompany(id: string, _reason?: string): Promise<BaseResponse<string>> {
        // Backend currently does not accept reason in body
        return this.patch<string>(`/admin/companies/${id}/reject`, {});
    }

    // ==================== Job Management ====================

    /**
     * Get all jobs
     */
    async getAllJobs(params?: JobFilterParams): Promise<BaseResponse<PageResponse<Job>>> {
        const queryParams: JobFilterParams = {
            page: (Number(params?.page) || 1) - 1,
            size: Number(params?.size || params?.limit || 10),
            status: params?.status,
            keyword: params?.keyword
        };

        return this.getPaged<Job>('/admin/jobs', queryParams);
    }

    /**
     * Get pending jobs for approval
     */
    async getPendingJobs(params?: QueryParams): Promise<BaseResponse<PageResponse<Job>>> {
        return this.getPaged<Job>('/admin/jobs/pending', params);
    }

    /**
     * Approve or reject job
     */
    async approveJob(id: string, data: JobApprovalData): Promise<BaseResponse<string>> {
        return this.patch<string, JobApprovalData>(`/admin/jobs/${id}/approval`, data);
    }

    /**
     * Delete job
     */
    async deleteJob(id: string): Promise<BaseResponse<string>> {
        return this.delete<string>(`/admin/jobs/${id}`);
    }

    // ==================== Report Management ====================



    /**
     * Get pending reports
     */
    async getPendingReports(params?: QueryParams): Promise<BaseResponse<PageResponse<Report>>> {
        return this.getPaged<Report>('/admin/reports/pending', params);
    }

    /**
     * Resolve report
     */
    async resolveReport(id: string, data: ReportResolutionData): Promise<BaseResponse<string>> {
        const payload: ReportResolutionPayload = {
            status: data.status.toUpperCase(),
            action: data.action
        };
        return this.patch<string, ReportResolutionPayload>(`/admin/reports/${id}`, payload);
    }

    // ==================== Category Management ====================

    /**
     * Create category
     */
    async createCategory(data: CategoryCreateData): Promise<BaseResponse<Category>> {
        return this.post<Category, CategoryCreateData>('/admin/categories', data);
    }

    /**
     * Update category
     */
    async updateCategory(id: string, data: Partial<CategoryCreateData>): Promise<BaseResponse<Category>> {
        return this.put<Category, Partial<CategoryCreateData>>(`/admin/categories/${id}`, data);
    }

    /**
     * Delete category
     */
    async deleteCategory(id: string): Promise<BaseResponse<string>> {
        return this.delete<string>(`/admin/categories/${id}`);
    }

    /**
     * Create skill
     */
    async createSkill(data: { name: string }): Promise<BaseResponse<Category>> {
        return this.post<Category, { name: string }>('/admin/skills', { name: data.name });
    }

    /**
     * Delete skill
     */
    async deleteSkill(id: string): Promise<BaseResponse<string>> {
        return this.delete<string>(`/admin/skills/${id}`);
    }

    /**
     * Get all skills
     */
    async getAllSkills(): Promise<BaseResponse<Category[]>> {
        return this.get<Category[]>('/admin/skills');
    }
}

export const adminService = new AdminService();

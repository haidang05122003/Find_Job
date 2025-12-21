import { BaseService } from './base.service';
import type { BaseResponse, PageResponse } from '@/types/api';
import type { QueryParams } from '@/types/service';

// ==================== Types ====================

/**
 * Job Post Request for creating/updating jobs
 */
export interface JobPostRequest {
    title: string;
    description: string;
    requirements: string;
    benefits?: string;
    categoryId: number;
    location: string;
    locations?: string[];
    skills?: string[];
    keywords?: string[];
    address?: string;
    salaryMin: number;
    salaryMax: number;
    salaryUnit?: string;
    employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
    workMethod: 'ONLINE' | 'OFFLINE' | 'HYBRID';
    experience: string;
    quantity: number;
    gender?: 'MALE' | 'FEMALE' | 'ALL';
    level?: string;
    deadline: string;
}

export interface CompanyRegistrationRequest {
    companyName: string;
    description: string;
    industry: string;
    address: string;
    website: string;
    phone: string;
    email: string;
    logoUrl?: string;
    companySize: string;
    companyCode?: string;
}

export interface MemberResponse {
    id: number;
    fullName: string;
    email: string;
    username: string;
    role: string;
    status: "ACTIVE" | "PENDING" | "INACTIVE";
    avatarUrl?: string;
    phone?: string;
}

/**
 * Job Post Response from backend
 */
export interface HRJobResponse {
    id: number;
    companyId: number; // Added
    title: string;
    companyName: string;
    companyLogo: string;
    companySize?: string; // Added
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
    skills?: string[];
    keywords?: string[];
    locations?: string[];
    level?: string;
    applicationsCount?: number;
}

/**
 * Company Profile Response
 */
export interface CompanyProfile {
    id: number;
    companyName: string;
    description: string;
    address: string;
    website: string;
    email: string;
    phone: string;
    logoUrl: string;
    coverImageUrl?: string; // Added
    companySize?: string;
    status: string;
}

/**
 * Company Update Request
 */
export interface CompanyUpdateRequest {
    companyName?: string;
    description?: string;
    address?: string;
    website?: string;
    phone?: string;
    logoUrl?: string;
    coverImageUrl?: string; // Added
    companySize?: string;
}

/**
 * HR Dashboard Statistics
 */
export interface HRDashboardStats {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    pendingApplications: number;
    approvedApplications: number;
    interviewScheduled: number;
    offeredApplications: number;
    hiredCount: number;
    recentJobs: {
        id: number;
        title: string;
        applicantsCount: number;
        status: string;
        createdAt: string;
    }[];
}

/**
 * HR Service
 * Handles HR-specific operations: job management, company profile, recruitment
 */
class HRService extends BaseService {
    // ==================== Dashboard ====================

    /**
     * Get HR dashboard statistics
     */
    async getDashboardStats(): Promise<BaseResponse<HRDashboardStats>> {
        return this.get<HRDashboardStats>('/hr/dashboard');
    }

    // ==================== Job Management ====================

    /**
     * Get all jobs posted by HR's company
     * GET /hr/jobs
     */
    async getMyJobs(params?: QueryParams): Promise<BaseResponse<PageResponse<HRJobResponse>>> {
        return this.getPaged<HRJobResponse>('/hr/jobs', params);
    }

    /**
     * Create a new job posting
     * POST /jobs
     */
    async createJob(data: JobPostRequest): Promise<BaseResponse<HRJobResponse>> {
        return this.post<HRJobResponse, JobPostRequest>('/jobs', data);
    }

    /**
     * Update an existing job posting
     * PUT /jobs/{jobId}
     */
    async updateJob(jobId: number | string, data: JobPostRequest): Promise<BaseResponse<HRJobResponse>> {
        return this.put<HRJobResponse, JobPostRequest>(`/jobs/${jobId}`, data);
    }

    /**
     * Change job status (Open/Close/Pause)
     * PATCH /jobs/{jobId}/status
     */
    async changeJobStatus(jobId: number | string, status: string): Promise<BaseResponse<string>> {
        return this.patch<string>(`/jobs/${jobId}/status?status=${status}`);
    }

    /**
     * Reopen a job (Approve and extend deadline)
     * POST /jobs/{jobId}/reopen
     */
    async reopenJob(jobId: number | string): Promise<BaseResponse<string>> {
        return this.post<string>(`/jobs/${jobId}/reopen`);
    }

    /**
     * Delete a job posting
     * DELETE /jobs/{jobId}
     */
    async deleteJob(jobId: number | string): Promise<BaseResponse<string>> {
        return this.delete<string>(`/jobs/${jobId}`);
    }

    /**
     * Get job detail for editing
     * GET /jobs/{jobId}
     */
    async getJob(jobId: number | string): Promise<BaseResponse<HRJobResponse & { categoryId?: number }>> {
        return this.get<HRJobResponse & { categoryId?: number }>(`/jobs/${jobId}`);
    }

    // ==================== Company Profile ====================

    /**
     * Get company profile
     * GET /companies/my-company
     */
    async getMyCompany(): Promise<BaseResponse<CompanyProfile>> {
        return this.get<CompanyProfile>('/companies/my-company');
    }

    /**
     * Update company profile
     * PUT /companies/my-company
     */
    async updateCompany(data: CompanyUpdateRequest): Promise<BaseResponse<string>> {
        return this.put<string, CompanyUpdateRequest>('/companies/my-company', data);
    }

    /**
     * Register new company
     * POST /companies/register
     */
    async registerCompany(data: CompanyRegistrationRequest): Promise<BaseResponse<CompanyProfile>> {
        return this.post<CompanyProfile, CompanyRegistrationRequest>('/companies/register', data);
    }

    /**
     * Join existing company via code
     * POST /companies/join
     */
    async joinCompany(companyCode: string): Promise<BaseResponse<string>> {
        return this.post<string>(`/companies/join?companyCode=${companyCode}`);
    }

    /**
     * Upload Company Logo
     */
    async uploadLogo(file: File): Promise<BaseResponse<string>> {
        const formData = new FormData();
        formData.append('file', file);

        return this.post<string, FormData>('/companies/my-company/logo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    /**
     * Upload Company Cover Image
     */
    async uploadCover(file: File): Promise<BaseResponse<string>> {
        const formData = new FormData();
        formData.append('file', file);

        return this.post<string, FormData>('/companies/my-company/cover-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    // ==================== Member Management ====================

    /**
     * Get all company members
     * GET /companies/members
     */
    async getMembers(): Promise<BaseResponse<MemberResponse[]>> {
        return this.get<MemberResponse[]>('/companies/members');
    }

    /**
     * Approve a member
     * POST /companies/members/{memberId}/approve
     */
    async approveMember(memberId: number | string): Promise<BaseResponse<string>> {
        return this.post<string>(`/companies/members/${memberId}/approve`);
    }

    /**
     * Reject a member
     * POST /companies/members/{memberId}/reject
     */
    async rejectMember(memberId: number | string): Promise<BaseResponse<string>> {
        return this.post<string>(`/companies/members/${memberId}/reject`);
    }

    /**
     * Remove a member
     * DELETE /companies/members/{memberId}
     */
    async removeMember(memberId: number | string): Promise<BaseResponse<string>> {
        return this.delete<string>(`/companies/members/${memberId}`);
    }

    // ==================== Helper Methods ====================

    /**
     * Transform job response to frontend format
     */
    /**
     * Transform job response to frontend format
     */
    transformJob(job: HRJobResponse) {
        return {
            id: job.id.toString(),
            title: job.title,
            company: {
                id: job.companyId ? job.companyId.toString() : '0',
                name: job.companyName,
                logo: job.companyLogo || '',
            },
            location: job.location || job.address,
            locationType: (job.workMethod?.toLowerCase() === 'offline' ? 'onsite' : job.workMethod?.toLowerCase()) as 'onsite' | 'remote' | 'hybrid',
            jobType: job.employmentType?.toLowerCase() as 'full-time' | 'part-time' | 'contract' | 'internship',
            experienceLevel: job.experience?.toLowerCase() as 'entry' | 'mid' | 'senior' | 'lead',
            salary: {
                min: job.salaryMin,
                max: job.salaryMax,
                currency: job.salaryUnit || 'VND',
            },
            status: job.status,
            deadline: job.deadline,
            createdAt: job.createdAt,
            applicationsCount: job.applicationsCount || 0,
            skills: job.skills || [],
            keywords: job.keywords || [],
        };
    }
}

export const hrService = new HRService();

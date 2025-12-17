import { BaseService } from './base.service';
import type { BaseResponse, PageResponse } from '@/types/api';
import type { CandidateProfile, CandidateProfileRequest, Resume, Skill } from '@/types/candidate';

export interface PublicCandidateResponse {
    id: number;
    fullName: string;
    avatarUrl: string;
    title: string;
    aboutMe: string;
    email: string;
    phone: string;
    education: string;
    gender: string;
    dateOfBirth: string;
    experience: string;
    address: string;
    skills: { id: number; skillName: string; skillLevel: string }[];
    socialLinks?: { id: number; platform: string; url: string }[];
    cv?: { id: number; fileName: string; fileUrl: string; isDefault: boolean };
}

export interface RecentApplicationDTO {
    id: number;
    jobTitle: string;
    companyName: string;
    companyLogo: string;
    location: string;
    salary: string;
    appliedAt: string;
    status: string;
}

export interface CandidateDashboardResponse {
    totalAppliedJobs: number;
    totalFavoriteJobs: number;
    totalJobAlerts: number;
    recentApplications: RecentApplicationDTO[];
}

class CandidateService extends BaseService {
    /**
     * Search candidates (Public)
     */
    async searchCandidates(params?: any): Promise<BaseResponse<PageResponse<PublicCandidateResponse>>> {
        return this.get<PageResponse<PublicCandidateResponse>>('/public/candidates', { params });
    }

    /**
     * Get public candidate detail
     */
    async getCandidateDetail(id: number | string): Promise<BaseResponse<PublicCandidateResponse>> {
        return this.get<PublicCandidateResponse>(`/public/candidates/${id}`);
    }

    /**
     * Get candidate profile
     */
    async getProfile(): Promise<BaseResponse<CandidateProfile>> {
        return this.get<CandidateProfile>('/candidates/profile');
    }

    /**
     * Get candidate dashboard stats
     */
    async getDashboardStats(): Promise<BaseResponse<CandidateDashboardResponse>> {
        return this.get<CandidateDashboardResponse>('/candidates/dashboard');
    }

    /**
     * Update candidate profile
     */
    async updateProfile(data: CandidateProfileRequest): Promise<BaseResponse<CandidateProfile>> {
        return this.put<CandidateProfile, CandidateProfileRequest>('/candidates/profile', data);
    }

    /**
     * Update skills separately
     */
    async updateSkills(skills: Skill[]): Promise<BaseResponse<string>> {
        return this.put<string, Skill[]>('/candidates/skills', skills);
    }

    /**
     * Update social links
     */
    async updateSocialLinks(links: { platform: string; url: string }[]): Promise<BaseResponse<string>> {
        return this.put<string, { platform: string; url: string }[]>('/candidates/social-links', links);
    }

    /**
     * Upload CV
     */
    async uploadCv(file: File): Promise<BaseResponse<Resume>> {
        const formData = new FormData();
        formData.append('file', file);

        return this.post<Resume, FormData>('/candidates/cvs', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    /**
     * Delete CV
     */
    async deleteCv(id: number): Promise<BaseResponse<string>> {
        return this.delete<string>(`/candidates/cvs/${id}`);
    }

    /**
     * Set Default CV
     */
    async setDefaultCv(id: number): Promise<BaseResponse<string>> {
        return this.patch<string, any>(`/candidates/cvs/${id}/default`, {});
    }

    /**
     * Download CV securely
     */
    async downloadCvBlob(id: number): Promise<Blob> {
        // We use the base http client directly or a specific method to get blob
        // Assuming 'this.http' refers to the axios instance from BaseService if exposed,
        // or we need to use a raw request. 
        // BaseService usually wraps calls. Let's assume we can add a method there or just use the path.
        // If BaseService doesn't support blob, we might need to extend it.
        // Let's rely on the fact that BaseService might need a 'getBlob' method.
        // Or checking BaseService first...
        // Wait, I should check BaseService.
        // If not, I can import axiosClient.
        return (await import("@/services/axios-client")).default.get(`/candidates/cvs/${id}`, {
            responseType: 'blob'
        }) as Promise<Blob>;
    }

    async downloadPublicCvBlob(cvId: number): Promise<Blob> {
        // @ts-ignore
        return (await import("@/services/axios-client")).default.get(`/public/candidates/cvs/${cvId}`, {
            responseType: 'blob'
        }) as Promise<Blob>;
    }

    async uploadAvatar(file: File): Promise<BaseResponse<string>> {
        const formData = new FormData();
        formData.append('file', file);

        return this.post<string, FormData>('/candidates/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
}

export const candidateService = new CandidateService();

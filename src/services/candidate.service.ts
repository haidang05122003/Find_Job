import { BaseService } from './base.service';
import type { BaseResponse, PageResponse } from '@/types/api';
import type { CandidateProfile, CandidateProfileRequest, Resume, Skill, CandidateEducation, CandidateExperience } from '@/types/candidate';
import type { QueryParams } from '@/types/service';

export interface CandidateSearchParams extends QueryParams {
    keyword?: string;
    location?: string;
    skills?: string[];
}

export interface PublicCandidateResponse {
    id: number;
    userId: number; // Add for chat
    fullName: string;
    avatarUrl: string;
    title: string;
    aboutMe: string;
    email: string;
    phone: string;
    educations?: CandidateEducation[];
    gender: string;
    dateOfBirth: string;
    experiences?: CandidateExperience[];
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
    /**
     * Search candidates (Public)
     */
    async searchCandidates(params?: CandidateSearchParams): Promise<BaseResponse<PageResponse<PublicCandidateResponse>>> {
        const queryParams: CandidateSearchParams = {
            page: params?.page ?? 0,
            size: Number(params?.size || params?.limit || 10),
            keyword: params?.keyword,
            location: params?.location,
            skills: params?.skills
        };
        return this.get<PageResponse<PublicCandidateResponse>>('/public/candidates', { params: queryParams });
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
        return this.patch<string, object>(`/candidates/cvs/${id}/default`, {});
    }

    /**
     * Download CV securely
     */
    async downloadCvBlob(id: number): Promise<Blob> {
        const axios = (await import("@/services/axios-client")).default;
        const response = await axios.get<Blob>(`/candidates/cvs/${id}`, {
            responseType: 'blob'
        });
        return response as unknown as Blob; // Axios interceptor might affect return type, safe cast if we know it works
    }

    async downloadPublicCvBlob(cvId: number): Promise<Blob> {
        const axios = (await import("@/services/axios-client")).default;
        const response = await axios.get<Blob>(`/public/candidates/cvs/${cvId}`, {
            responseType: 'blob'
        });
        return response as unknown as Blob;
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

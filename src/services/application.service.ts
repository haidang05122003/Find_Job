import { BaseService } from './base.service';
import type { BaseResponse, PageResponse } from '@/types/api';
import type { QueryParams } from '@/types/service';

/**
 * Application status types
 */
export type ApplicationStatus =
    | 'pending'
    | 'reviewing'
    | 'shortlisted'
    | 'interview'
    | 'offered'
    | 'rejected'
    | 'withdrawn';

/**
 * Job application data
 */
export interface Application {
    id: string;
    jobId: string;
    jobTitle: string;
    companyName: string;
    companyLogo?: string;
    recruiterId?: string; // HR ID for chatting
    candidateId: string;
    candidateProfileId?: string; // New field for profile ID
    candidateName: string;
    candidateEmail: string;
    status: ApplicationStatus;
    coverLetter?: string;
    cvUrl?: string;
    appliedAt: string;
    updatedAt: string;
    desiredLocation?: string;
}

/**
 * Application submission request
 */
export interface ApplicationRequest {
    jobId: string;
    cvId?: string;
    coverLetter?: string;
    desiredLocation?: string;
}

/**
 * Interview invitation request
 */
export interface InterviewInviteRequest {
    subject: string;
    customEmailContent?: string;
    body: {
        greeting?: string;
        introduction?: string;
        invitation?: string;
        interview_details: {
            time: string;
            format: string; // 'onsite' | 'online' | 'phone'
            location: string;
            interviewer?: string;
            content?: string;
        };
        confirmation_request?: string;
        note?: string;
        closing?: string;
        signature?: {
            sender_name: string;
        };
    };
}

/**
 * Application status update
 */
export interface ApplicationStatusUpdate {
    status: ApplicationStatus;
    note?: string;
}

/**
 * Application Service
 * Handles job application operations for candidates and HR
 */
class ApplicationService extends BaseService {
    // ==================== Candidate APIs ====================

    /**
     * Submit job application
     */
    async submitApplication(data: ApplicationRequest): Promise<BaseResponse<Application>> {
        return this.post<Application, ApplicationRequest>('/applications', data);
    }

    /**
     * Get application history for current user
     */
    async getHistory(params?: QueryParams): Promise<BaseResponse<PageResponse<Application>>> {
        return this.getPaged<Application>('/applications/history', params);
    }

    /**
     * Get application detail
     */
    async getApplicationDetail(id: string): Promise<BaseResponse<Application>> {
        return this.get<Application>(`/applications/${id}`);
    }

    /**
     * Withdraw application
     */
    async withdrawApplication(id: string): Promise<BaseResponse<string>> {
        return this.delete<string>(`/applications/${id}`);
    }

    // ==================== HR APIs ====================

    /**
     * Get applications for a specific job
     */
    async getJobApplications(
        jobId: string,
        params?: QueryParams
    ): Promise<BaseResponse<PageResponse<Application>>> {
        return this.getPaged<Application>(`/hr/jobs/${jobId}/applications`, params);
    }

    /**
     * Get all applications for HR's company
     */
    async getAllApplications(params?: QueryParams): Promise<BaseResponse<PageResponse<Application>>> {
        return this.getPaged<Application>('/hr/applications', params);
    }

    /**
     * Update application status (HR only)
     * PATCH /applications/{id}/status?status=XXX
     */
    async updateStatus(
        id: string,
        status: string,
        note?: string
    ): Promise<BaseResponse<string>> {
        return this.patch<string>(`/applications/${id}/status?status=${status}`);
    }

    /**
     * Send interview invitation (HR only)
     * POST /applications/{id}/interview-invite
     */
    async inviteInterview(
        id: string,
        data: InterviewInviteRequest,
        sendEmail: boolean = true
    ): Promise<BaseResponse<string>> {
        return this.post<string, InterviewInviteRequest>(
            `/applications/${id}/interview-invite?sendEmail=${sendEmail}`,
            data
        );
    }

    /**
     * Get application statistics
     */
    async getStatistics(jobId?: string): Promise<BaseResponse<ApplicationStatistics>> {
        const url = jobId ? `/hr/jobs/${jobId}/statistics` : '/hr/applications/statistics';
        return this.get<ApplicationStatistics>(url);
    }
}

/**
 * Application statistics
 */
export interface ApplicationStatistics {
    total: number;
    byStatus: Record<ApplicationStatus, number>;
    recentApplications: number;
    averageResponseTime: number;
}

export const applicationService = new ApplicationService();

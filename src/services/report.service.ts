import { BaseService } from './base.service';
import type { BaseResponse } from '@/types/api';

/**
 * Report types
 */
export type ReportType =
    | 'job_posting'
    | 'company'
    | 'user'
    | 'message'
    | 'other';

/**
 * Report reasons
 */
export type ReportReason =
    | 'spam'
    | 'inappropriate'
    | 'misleading'
    | 'fraud'
    | 'harassment'
    | 'other';

/**
 * Report data
 */
export interface Report {
    id: string;
    type: string; // Backend sends uppercase 'JOB', 'COMPANY', 'USER', etc.
    targetId: string;
    reason: string;
    description?: string;
    reporterId: string;
    status: 'PENDING' | 'RESOLVED' | 'DISMISSED' | string;
    createdAt: string;
    updatedAt: string;
    // Backend compatibility
    targetType?: string;
    reporterName?: string;
}

/**
 * Create report request
 */
export interface CreateReportRequest {
    type: ReportType;
    targetId: string;
    reason: ReportReason;
    description?: string;
}

/**
 * Report Service
 * Handles content reporting and moderation
 */
class ReportService extends BaseService {
    /**
     * Create a new report
     */
    async createReport(data: CreateReportRequest): Promise<BaseResponse<Report>> {
        const payload = {
            targetType: data.type.toUpperCase(), // Backend likely expects uppercase like JOB, COMPUTER, etc. based on comments
            targetId: data.targetId,
            reason: data.description ? `${data.reason}: ${data.description}` : data.reason
        };
        return this.post<Report, any>('/reports', payload);
    }

    /**
     * Get user's reports
     */
    async getMyReports(): Promise<BaseResponse<Report[]>> {
        return this.get<Report[]>('/reports/my-reports');
    }

    /**
     * Get report by ID
     */
    async getReport(id: string): Promise<BaseResponse<Report>> {
        return this.get<Report>(`/reports/${id}`);
    }
}

export const reportService = new ReportService();

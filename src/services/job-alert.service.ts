import axiosClient from './axios-client';
import { BaseResponse } from '@/types/api';
import { Job } from '@/types/job';
import { JobPostResponse } from './job.service';

export interface JobAlertResponse extends BaseResponse<JobPostResponse[]> { }

export const jobAlertService = {
    getAlertJobs: async (page = 0, size = 10): Promise<BaseResponse<Job[]>> => {
        const response = await axiosClient.get<any, JobAlertResponse>('/job-alerts/matches', {
            params: { page, size }
        });

        if (response.success && response.data) {
            // Transform DTO to Job model
            const jobs: Job[] = response.data.map((dto) => ({
                id: dto.id.toString(),
                title: dto.title,
                company: {
                    id: dto.companyId ? dto.companyId.toString() : '0',
                    name: dto.companyName,
                    logo: dto.companyLogo || '',
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
                requirements: dto.requirements ? [dto.requirements] : [],
                responsibilities: [],
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
            }));

            return {
                ...response,
                data: jobs
            };
        }

        return { ...response, data: [] };
    },

    createAlert: async (data: { keyword: string; location?: string; minSalary?: number }) => {
        return axiosClient.post<any, BaseResponse<string>>('/job-alerts', data);
    }
};

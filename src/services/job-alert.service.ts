import axiosClient from './axios-client';
import { BaseResponse } from '@/types/api';
import { Job } from '@/types/job';
import { JobPostResponse } from './job.service';


interface JobAlertDto {
    id: number;
    title: string;
    companyId?: number;
    companyName: string;
    companyLogo?: string;
    location?: string;
    address: string;
    workMethod?: string;
    employmentType?: string;
    experience?: string;
    salaryMin: number;
    salaryMax: number;
    salaryUnit?: string;
    description: string;
    requirements?: string;
    benefits?: string;
    categoryName: string;
    createdAt: string;
    deadline: string;
    isBookmarked?: boolean;
    quantity?: number;
    gender?: string;
}

export const jobAlertService = {
    getAlertJobs: async (page = 0, size = 10): Promise<BaseResponse<Job[]>> => {
        const response = await axiosClient.get<any, BaseResponse<JobAlertDto[]>>('/job-alerts/matches', {
            params: { page, size }
        });

        if (response.success && response.data) {
            // Transform DTO to Job model
            const jobs: Job[] = response.data.map((dto) => {
                const locationType = (dto.workMethod?.toLowerCase() || 'onsite') as Job['locationType'];
                const jobType = (dto.employmentType?.toLowerCase() || 'full-time') as Job['jobType'];
                const experienceLevel = (dto.experience?.toLowerCase() || 'entry') as Job['experienceLevel'];

                return {
                    id: dto.id.toString(),
                    title: dto.title,
                    company: {
                        id: dto.companyId ? dto.companyId.toString() : '0',
                        name: dto.companyName,
                        logo: dto.companyLogo || '',
                    },
                    location: dto.location || dto.address,
                    locationType: ['onsite', 'remote', 'hybrid'].includes(locationType) ? locationType : 'onsite',
                    jobType: ['full-time', 'part-time', 'contract', 'internship'].includes(jobType) ? jobType : 'full-time',
                    experienceLevel: ['entry', 'mid', 'senior', 'lead'].includes(experienceLevel) ? experienceLevel : 'entry',
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
                };
            });

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

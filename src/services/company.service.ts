import { BaseService } from './base.service';
import type { BaseResponse, PageResponse } from '@/types/api';
import type { Company } from '@/types/company';
import type { QueryParams } from '@/types/service';

export interface CompanyResponse {
    id: number;
    companyName: string;
    description: string;
    industry?: string;
    address: string;
    website: string;
    email: string;
    phone: string;
    logoUrl: string;
    companySize?: string;
    status: string;
    openPositions?: number;
    coverImageUrl?: string;
}

class CompanyService extends BaseService {
    /**
     * Search companies with pagination
     * Returns 12 companies per page by default
     */
    async searchCompanies(params?: QueryParams & { industry?: string; location?: string }): Promise<BaseResponse<PageResponse<Company>>> {
        const response = await this.getPaged<CompanyResponse>('/companies', params);

        if (response.success && response.data) {
            const transformedContent = response.data.content.map(this.transformToCompany);
            return {
                ...response,
                data: {
                    ...response.data,
                    content: transformedContent
                }
            };
        }

        return response as any;
    }

    /**
     * Get Company Detail
     */
    async getCompanyDetail(id: string | number): Promise<BaseResponse<Company>> {
        const response = await this.get<CompanyResponse>(`/companies/${id}`);

        if (response.success && response.data) {
            return {
                ...response,
                data: this.transformToCompany(response.data)
            };
        }

        return response as any;
    }

    private transformToCompany(dto: CompanyResponse): Company {
        return {
            id: dto.id.toString(),
            name: dto.companyName,
            logo: dto.logoUrl || '',
            description: dto.description || '',
            industry: dto.industry || 'Đa ngành nghề',
            location: dto.address || '',
            companySize: dto.companySize || 'Chưa cập nhật',
            website: dto.website || '',
            openPositions: dto.openPositions || 0,
            coverImage: dto.coverImageUrl || '',
        };
    }
}

export const companyService = new CompanyService();

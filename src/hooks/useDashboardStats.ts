import { useQuery } from '@tanstack/react-query';
import { candidateService } from '@/services/candidate.service';

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const response = await candidateService.getDashboardStats();
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch dashboard stats');
            }
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes cache
        refetchOnWindowFocus: true,
    });
};

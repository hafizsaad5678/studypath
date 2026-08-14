import { useQuery } from '@tanstack/react-query';

import { getScholarshipById, listScholarships } from '@/services/scholarships';
import type { FundingType } from '@/types/database';

export function useScholarships(params?: { search?: string; countryId?: string; fundingType?: FundingType }) {
  return useQuery({
    queryKey: ['scholarships', params],
    queryFn: () => listScholarships(params),
  });
}

export function useScholarship(id: string) {
  return useQuery({
    queryKey: ['scholarship', id],
    queryFn: () => getScholarshipById(id),
    enabled: !!id,
  });
}

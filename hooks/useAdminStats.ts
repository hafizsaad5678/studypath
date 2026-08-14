import { useQuery } from '@tanstack/react-query';

import { getAdminStats, listRecentActivity } from '@/services/admin';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: getAdminStats,
  });
}

export function useRecentActivity(limit?: number) {
  return useQuery({
    queryKey: ['admin-recent-activity', limit],
    queryFn: () => listRecentActivity(limit),
  });
}

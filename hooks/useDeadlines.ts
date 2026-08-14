import { useQuery } from '@tanstack/react-query';

import { listUpcomingDeadlines } from '@/services/deadlines';

export function useDeadlines(limit?: number) {
  return useQuery({
    queryKey: ['deadlines', limit],
    queryFn: () => listUpcomingDeadlines(limit),
  });
}

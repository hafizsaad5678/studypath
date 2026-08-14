import { useQuery } from '@tanstack/react-query';

import { getScrapingJobStats, listDataSources, listScrapingJobs } from '@/services/data-sources';
import type { JobStatus } from '@/types/database';

export function useDataSources() {
  return useQuery({
    queryKey: ['data-sources'],
    queryFn: listDataSources,
  });
}

export function useScrapingJobs(params?: { dataSourceId?: string; status?: JobStatus }) {
  return useQuery({
    queryKey: ['scraping-jobs', params?.dataSourceId, params?.status],
    queryFn: () => listScrapingJobs(params),
  });
}

export function useScrapingJobStats() {
  return useQuery({
    queryKey: ['scraping-job-stats'],
    queryFn: getScrapingJobStats,
  });
}

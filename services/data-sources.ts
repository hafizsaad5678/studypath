import { supabase } from '@/lib/supabase';
import type { DataSource, JobStatus, ScrapingJobWithSource } from '@/types/database';

export async function listDataSources(): Promise<DataSource[]> {
  const { data, error } = await supabase.from('data_sources').select('*').order('name');
  if (error) throw error;
  return data ?? [];
}

export async function listScrapingJobs(params?: {
  dataSourceId?: string;
  status?: JobStatus;
}): Promise<ScrapingJobWithSource[]> {
  let query = supabase
    .from('scraping_jobs')
    .select('*, data_source:data_sources(*)')
    .order('created_at', { ascending: false });

  if (params?.dataSourceId) {
    query = query.eq('data_source_id', params.dataSourceId);
  }
  if (params?.status) {
    query = query.eq('status', params.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as ScrapingJobWithSource[]) ?? [];
}

export type ScrapingJobStats = {
  totalRecordsSynced: number;
  activeJobCount: number;
  errorRate: number;
};

export async function getScrapingJobStats(): Promise<ScrapingJobStats> {
  const { data, error } = await supabase
    .from('scraping_jobs')
    .select('status, records_created, records_updated')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) throw error;

  const jobs = data ?? [];
  const totalRecordsSynced = jobs.reduce(
    (sum, job) => sum + (job.records_created ?? 0) + (job.records_updated ?? 0),
    0
  );
  const activeJobCount = jobs.filter((job) => job.status === 'running').length;
  const failedCount = jobs.filter((job) => job.status === 'failed').length;
  const errorRate = jobs.length > 0 ? failedCount / jobs.length : 0;

  return { totalRecordsSynced, activeJobCount, errorRate };
}

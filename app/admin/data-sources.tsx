import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, NotificationBell } from '@/components/layout/app-header';
import { useScrapingJobStats, useScrapingJobs } from '@/hooks/useDataSources';
import type { ScrapingJobWithSource } from '@/types/database';

type OverviewStat = {
  label: string;
  value: string;
  note: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  noteColor: string;
  badgeBg: string;
  badgeColor: string;
};

type JobStatus = 'running' | 'completed' | 'error';

const STATUS_META: Record<
  JobStatus,
  { label: string; icon: keyof typeof MaterialIcons.glyphMap; bg: string; color: string }
> = {
  running: { label: 'Running', icon: 'sync', bg: '#62ff96', color: '#00210b' },
  completed: { label: 'Completed', icon: 'check-circle', bg: '#0f2e1d', color: '#00e676' },
  error: { label: 'Error', icon: 'error', bg: '#93000a', color: '#ffdad6' },
};

function jobStatusToVisual(status: ScrapingJobWithSource['status']): JobStatus {
  if (status === 'failed') return 'error';
  if (status === 'running') return 'running';
  if (status === 'completed') return 'completed';
  return 'running';
}

function formatWhen(timestamp: string | null): string {
  if (!timestamp) return '-';
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function formatRecords(job: ScrapingJobWithSource): string {
  if (job.status === 'failed') return '-';
  if (job.status === 'running' || job.status === 'queued') {
    return job.records_found ? `~${job.records_found}` : '-';
  }
  const total = job.records_created + job.records_updated;
  return total > 0 ? `${total} updated` : '-';
}

function OverviewCard({ stat }: { stat: OverviewStat }) {
  return (
    <View className="flex-1 flex-row items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
      <View className="gap-1">
        <Text className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">
          {stat.label}
        </Text>
        <Text className="text-[24px] font-semibold text-on-surface">{stat.value}</Text>
        <Text className={`text-[14px] ${stat.noteColor}`}>{stat.note}</Text>
      </View>
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: stat.badgeBg }}>
        <MaterialIcons name={stat.icon} size={24} color={stat.badgeColor} />
      </View>
    </View>
  );
}

function JobRow({ job }: { job: ScrapingJobWithSource }) {
  const visualStatus = jobStatusToVisual(job.status);
  const meta = STATUS_META[visualStatus];
  return (
    <View className="gap-3 border-b border-outline-variant p-4">
      <View className="flex-row items-center gap-stack-sm">
        <View className="h-8 w-8 items-center justify-center rounded border border-outline-variant bg-surface-container">
          <MaterialIcons name="public" size={18} color="#bacbb9" />
        </View>
        <View className="flex-1">
          <Text className="text-[14px] font-medium text-on-surface">
            {job.data_source?.name ?? job.job_type}
          </Text>
          <Text className="text-[12px] text-outline">{job.id}</Text>
        </View>
        <View
          className="flex-row items-center gap-1 rounded-full px-2.5 py-0.5"
          style={{ backgroundColor: meta.bg }}>
          <MaterialIcons name={meta.icon} size={14} color={meta.color} />
          <Text className="text-[12px] font-semibold" style={{ color: meta.color }}>
            {meta.label}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-[14px] text-on-surface">{formatWhen(job.started_at ?? job.created_at)}</Text>
          <Text className="text-[12px] text-outline">{job.job_type}</Text>
        </View>
        <Text className="text-[12px] text-on-surface-variant">{formatRecords(job)}</Text>
      </View>
      <View className="flex-row justify-end gap-2">
        <Pressable className="rounded-full p-2" hitSlop={4}>
          <MaterialIcons name="code" size={20} color="#bacbb9" />
        </Pressable>
        {visualStatus === 'running' ? (
          <Pressable className="rounded-full p-2" hitSlop={4}>
            <MaterialIcons name="stop" size={20} color="#bacbb9" />
          </Pressable>
        ) : visualStatus === 'error' ? (
          <Pressable className="rounded-full p-2" hitSlop={4}>
            <MaterialIcons name="replay" size={20} color="#bacbb9" />
          </Pressable>
        ) : (
          <Pressable className="rounded-full p-2" hitSlop={4}>
            <MaterialIcons name="play-arrow" size={20} color="#bacbb9" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default function DataSourcesScreen() {
  const { data: stats, isLoading: statsLoading } = useScrapingJobStats();
  const { data: jobs, isLoading: jobsLoading } = useScrapingJobs();

  const overview: OverviewStat[] = stats
    ? [
        {
          label: 'Total Records Synced',
          value: stats.totalRecordsSynced.toLocaleString(),
          note: 'Across recent jobs',
          icon: 'storage',
          noteColor: 'text-tertiary',
          badgeBg: '#454747',
          badgeColor: '#b4b5b5',
        },
        {
          label: 'Active Jobs',
          value: String(stats.activeJobCount),
          note: stats.activeJobCount > 0 ? 'Running now' : 'None running',
          icon: 'sync',
          noteColor: 'text-primary',
          badgeBg: 'rgba(37,99,235,0.2)',
          badgeColor: '#00e676',
        },
        {
          label: 'Error Rate',
          value: `${(stats.errorRate * 100).toFixed(1)}%`,
          note: 'Of recent jobs',
          icon: 'error',
          noteColor: 'text-error',
          badgeBg: '#93000a',
          badgeColor: '#ffdad6',
        },
      ]
    : [];

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <AppHeader variant="detail" title="Data Sources" right={<NotificationBell />} />

      <ScrollView contentContainerClassName="gap-stack-lg px-margin-mobile py-stack-lg">
        <View className="gap-2">
          <Text className="text-[28px] font-bold text-on-surface">Data Ingestion Jobs</Text>
          <Text className="text-[16px] text-on-surface-variant">
            Manage and monitor automated scholarship and program scraping pipelines.
          </Text>
        </View>

        <View className="flex-row gap-stack-md">
          <Pressable className="flex-1 flex-row items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-container py-2">
            <MaterialIcons name="schedule" size={20} color="#e2e2e2" />
            <Text className="text-[14px] font-semibold text-on-surface">Schedule All</Text>
          </Pressable>
          <Pressable className="flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-primary-container py-2">
            <MaterialIcons name="play-arrow" size={20} color="#003918" />
            <Text className="text-[14px] font-semibold text-on-primary">Run All Now</Text>
          </Pressable>
        </View>

        {statsLoading ? (
          <View className="items-center py-4">
            <ActivityIndicator />
          </View>
        ) : (
          <View className="gap-stack-md">
            {overview.map((stat) => (
              <OverviewCard key={stat.label} stat={stat} />
            ))}
          </View>
        )}

        <View className="rounded-xl border border-outline-variant bg-surface-container-lowest">
          {jobsLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator />
            </View>
          ) : jobs && jobs.length > 0 ? (
            jobs.map((job) => <JobRow key={job.id} job={job} />)
          ) : (
            <View className="items-center p-8">
              <Text className="text-[14px] text-on-surface-variant">No scraping jobs yet.</Text>
            </View>
          )}
          <View className="flex-row items-center justify-between p-4">
            <Text className="text-[12px] text-on-surface-variant">
              Showing {jobs?.length ?? 0} of {jobs?.length ?? 0} jobs
            </Text>
            <View className="flex-row gap-2">
              <View className="rounded border border-outline-variant px-3 py-1">
                <Text className="text-[12px] text-on-surface-variant">Previous</Text>
              </View>
              <Pressable className="rounded border border-outline-variant px-3 py-1">
                <Text className="text-[12px] text-on-surface">Next</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

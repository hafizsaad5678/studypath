import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type OverviewStat = {
  label: string;
  value: string;
  note: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  noteColor: string;
  badgeBg: string;
  badgeColor: string;
};

const OVERVIEW: OverviewStat[] = [
  {
    label: 'Total Records Synced',
    value: '14,205',
    note: '+12% this week',
    icon: 'storage',
    noteColor: 'text-tertiary',
    badgeBg: '#454747',
    badgeColor: '#b4b5b5',
  },
  {
    label: 'Active Jobs',
    value: '2',
    note: 'Running now',
    icon: 'sync',
    noteColor: 'text-primary',
    badgeBg: 'rgba(37,99,235,0.2)',
    badgeColor: '#00e676',
  },
  {
    label: 'Error Rate',
    value: '0.8%',
    note: '3 failed jobs',
    icon: 'error',
    noteColor: 'text-error',
    badgeBg: '#93000a',
    badgeColor: '#ffdad6',
  },
];

type JobStatus = 'running' | 'completed' | 'error';

type Job = {
  id: string;
  source: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  when: string;
  schedule: string;
  status: JobStatus;
  records: string;
};

const JOBS: Job[] = [
  {
    id: 'JOB-4992',
    source: 'DAAD Full Sync',
    icon: 'public',
    when: '10 mins ago',
    schedule: 'Manual trigger',
    status: 'running',
    records: '~4,500',
  },
  {
    id: 'JOB-4991',
    source: 'Uni-Assist Deadlines',
    icon: 'account-balance',
    when: '2 hours ago',
    schedule: 'Scheduled: Daily',
    status: 'completed',
    records: '1,204 updated',
  },
  {
    id: 'JOB-4990',
    source: 'StudyInGermany Master',
    icon: 'dataset',
    when: 'Yesterday, 14:30',
    schedule: 'Scheduled: Weekly',
    status: 'error',
    records: '-',
  },
  {
    id: 'JOB-4989',
    source: 'DAAD Scholarships',
    icon: 'payment',
    when: 'Yesterday, 02:00',
    schedule: 'Scheduled: Daily',
    status: 'completed',
    records: '345 new',
  },
];

const STATUS_META: Record<
  JobStatus,
  { label: string; icon: keyof typeof MaterialIcons.glyphMap; bg: string; color: string }
> = {
  running: { label: 'Running', icon: 'sync', bg: '#62ff96', color: '#00210b' },
  completed: { label: 'Completed', icon: 'check-circle', bg: '#0f2e1d', color: '#00e676' },
  error: { label: 'Error', icon: 'error', bg: '#93000a', color: '#ffdad6' },
};

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

function JobRow({ job }: { job: Job }) {
  const meta = STATUS_META[job.status];
  return (
    <View className="gap-3 border-b border-outline-variant p-4">
      <View className="flex-row items-center gap-stack-sm">
        <View className="h-8 w-8 items-center justify-center rounded border border-outline-variant bg-surface-container">
          <MaterialIcons name={job.icon} size={18} color="#bacbb9" />
        </View>
        <View className="flex-1">
          <Text className="text-[14px] font-medium text-on-surface">{job.source}</Text>
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
          <Text className="text-[14px] text-on-surface">{job.when}</Text>
          <Text className="text-[12px] text-outline">{job.schedule}</Text>
        </View>
        <Text className="text-[12px] text-on-surface-variant">{job.records}</Text>
      </View>
      <View className="flex-row justify-end gap-2">
        <Pressable className="rounded-full p-2" hitSlop={4}>
          <MaterialIcons name="code" size={20} color="#bacbb9" />
        </Pressable>
        {job.status === 'running' ? (
          <Pressable className="rounded-full p-2" hitSlop={4}>
            <MaterialIcons name="stop" size={20} color="#bacbb9" />
          </Pressable>
        ) : job.status === 'error' ? (
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
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="h-16 w-full flex-row items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-margin-mobile">
        <Pressable onPress={() => router.back()} hitSlop={8} className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
          <MaterialIcons name="arrow-back" size={20} color="#e2e2e2" />
        </Pressable>
        <Text className="text-[20px] font-bold text-primary">Data Sources</Text>
        <View className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
          <MaterialIcons name="notifications" size={20} color="#75ff9e" />
        </View>
      </View>

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

        <View className="gap-stack-md">
          {OVERVIEW.map((stat) => (
            <OverviewCard key={stat.label} stat={stat} />
          ))}
        </View>

        <View className="rounded-xl border border-outline-variant bg-surface-container-lowest">
          {JOBS.map((job) => (
            <JobRow key={job.id} job={job} />
          ))}
          <View className="flex-row items-center justify-between p-4">
            <Text className="text-[12px] text-on-surface-variant">Showing 1-4 of 24 jobs</Text>
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

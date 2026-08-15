import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/layout/app-header';
import { useApplications, useUpdateApplicationStatus } from '@/hooks/useApplications';
import type { ApplicationStatus, ApplicationWithProgram } from '@/types/database';

const STATUSES: ApplicationStatus[] = ['draft', 'submitted', 'under_review', 'accepted', 'rejected'];

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

const STATUS_STYLES: Record<ApplicationStatus, { bg: string; text: string }> = {
  draft: { bg: 'bg-surface-variant', text: 'text-on-surface-variant' },
  submitted: { bg: 'bg-primary-container', text: 'text-on-primary-container' },
  under_review: { bg: 'bg-[#f5c5181a]', text: 'text-[#f5c518]' },
  accepted: { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' },
  rejected: { bg: 'bg-error-container', text: 'text-on-error-container' },
};

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <View className={`rounded px-2 py-0.5 ${style.bg}`}>
      <Text className={`text-[12px] font-semibold ${style.text}`}>{STATUS_LABEL[status]}</Text>
    </View>
  );
}

function ApplicationCard({ item }: { item: ApplicationWithProgram }) {
  const updateStatus = useUpdateApplicationStatus();

  return (
    <View className="mb-stack-sm rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
      <View className="mb-2 flex-row items-start justify-between gap-2">
        <View className="flex-1">
          <Text className="text-[18px] font-semibold text-on-surface" numberOfLines={1}>
            {item.program?.name ?? 'Unknown program'}
          </Text>
          <Text className="text-[14px] text-on-surface-variant" numberOfLines={1}>
            {item.program?.university?.name} • {item.program?.university?.country?.name}
          </Text>
        </View>
        <StatusBadge status={item.status} />
      </View>
      <View className="mt-stack-sm flex-row flex-wrap gap-2 border-t border-outline-variant pt-stack-sm">
        {STATUSES.map((s) => (
          <Pressable
            key={s}
            disabled={updateStatus.isPending}
            onPress={() => updateStatus.mutate({ applicationId: item.id, status: s })}
            className={`rounded-full border px-3 py-1 ${
              item.status === s ? 'border-primary bg-primary-container' : 'border-outline-variant'
            }`}>
            <Text
              className={`text-[12px] font-semibold ${
                item.status === s ? 'text-on-primary-container' : 'text-on-surface-variant'
              }`}>
              {STATUS_LABEL[s]}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function ApplicationsScreen() {
  const { data, isLoading } = useApplications();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <AppHeader variant="detail" title="My Applications" />

      <ScrollView contentContainerClassName="px-margin-mobile pb-8 pt-4" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View className="items-center py-8">
            <ActivityIndicator />
          </View>
        ) : (data ?? []).length === 0 ? (
          <View className="items-center gap-stack-md py-8">
            <Text className="text-[16px] text-on-surface-variant">No applications yet</Text>
            <Pressable
              onPress={() => router.push('/(tabs)/explore')}
              className="rounded-lg bg-primary-container px-4 py-2">
              <Text className="text-[14px] font-semibold text-on-primary-container">Explore Programs</Text>
            </Pressable>
          </View>
        ) : (
          (data ?? []).map((app) => <ApplicationCard key={app.id} item={app} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

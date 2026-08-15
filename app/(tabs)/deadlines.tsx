import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/layout/app-header';
import { useDeadlines } from '@/hooks/useDeadlines';
import type { DeadlineWithRelations } from '@/types/database';

function daysUntil(dateStr: string) {
  const ms = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeLeftLabel(days: number) {
  if (days <= 0) return 'Due today';
  if (days === 1) return '1 Day Left';
  if (days < 30) return `${days} Days Left`;
  return `${Math.round(days / 30)} Months Left`;
}

function targetName(item: DeadlineWithRelations) {
  return item.program?.name ?? item.scholarship?.name ?? item.title;
}

function targetImage(item: DeadlineWithRelations) {
  return item.university?.image_url ?? '';
}

function SectionHeader({ color, title, count }: { color: string; title: string; count: number }) {
  return (
    <View className="mb-stack-sm flex-row items-center gap-2 border-b border-outline-variant pb-2">
      <View className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      <Text className="text-[20px] font-semibold text-on-surface">{title}</Text>
      <View className="ml-2 rounded-full bg-surface-container-high px-2 py-0.5">
        <Text className="text-[12px] text-on-surface-variant">{count}</Text>
      </View>
    </View>
  );
}

function DeadlineRow({ item, urgent }: { item: DeadlineWithRelations; urgent?: boolean }) {
  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: '/program/[id]', params: { id: item.program_id ?? item.id } })
      }
      className="mb-stack-sm flex-row items-center justify-between gap-stack-sm rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
      <View className="flex-1 flex-row items-center gap-stack-sm">
        <View className="h-16 w-16 overflow-hidden rounded-lg border border-outline-variant bg-surface-container">
          <Image source={{ uri: targetImage(item) }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        </View>
        <View className="flex-1">
          <Text className="text-[18px] font-semibold text-on-surface" numberOfLines={1}>
            {targetName(item)}
          </Text>
          <View className="mt-1 flex-row items-center gap-1">
            <MaterialIcons name="account-balance" size={16} color="#bacbb9" />
            <Text className="text-[14px] text-on-surface-variant" numberOfLines={1}>
              {item.university?.name ?? 'Multiple institutions'}
            </Text>
          </View>
        </View>
      </View>
      <View className="items-end gap-1">
        <View className="flex-row items-center gap-1">
          <MaterialIcons name={urgent ? 'timer' : 'schedule'} size={18} color={urgent ? '#ffb4ab' : '#e7e4e6'} />
          <Text className={`text-[14px] font-semibold ${urgent ? 'text-error' : 'text-tertiary'}`}>
            {timeLeftLabel(daysUntil(item.deadline_date))}
          </Text>
        </View>
        <Text className="text-[14px] text-on-surface-variant">{formatDate(item.deadline_date)}</Text>
      </View>
    </Pressable>
  );
}

export default function DeadlinesScreen() {
  const { data, isLoading } = useDeadlines();

  const { urgent, thisMonth, upcoming } = useMemo(() => {
    const list = data ?? [];
    const urgent: DeadlineWithRelations[] = [];
    const thisMonth: DeadlineWithRelations[] = [];
    const upcoming: DeadlineWithRelations[] = [];
    for (const item of list) {
      const days = daysUntil(item.deadline_date);
      if (days <= 7) urgent.push(item);
      else if (days <= 30) thisMonth.push(item);
      else upcoming.push(item);
    }
    return { urgent, thisMonth, upcoming };
  }, [data]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <AppHeader variant="brand" />
      <ScrollView contentContainerClassName="px-margin-mobile pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="mb-2 text-[28px] font-bold text-on-surface">Deadlines</Text>
        <Text className="mb-stack-lg text-[16px] text-on-surface-variant">
          Track and manage upcoming application closures.
        </Text>

        {urgent.length > 0 ? (
          <View className="mb-stack-lg gap-stack-md rounded-xl border border-error/20 bg-error-container p-stack-md">
            <View className="flex-row items-start gap-stack-sm">
              <View className="mt-1 h-12 w-12 items-center justify-center rounded-full bg-error/10">
                <MaterialIcons name="warning" size={22} color="#ffb4ab" />
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-[18px] font-semibold text-on-error-container">
                  {urgent.length} Deadline{urgent.length === 1 ? '' : 's'} Approaching Rapidly
                </Text>
                <Text className="text-[14px] text-on-error-container">
                  You have deadlines closing within the next week. Ensure all documents are submitted.
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {isLoading ? (
          <View className="items-center py-8">
            <ActivityIndicator />
          </View>
        ) : (data ?? []).length === 0 ? (
          <Text className="py-8 text-center text-[14px] text-on-surface-variant">No upcoming deadlines.</Text>
        ) : (
          <>
            <SectionHeader color="#ffb4ab" title="Closing This Week" count={urgent.length} />
            {urgent.map((item) => (
              <DeadlineRow key={item.id} item={item} urgent />
            ))}

            <View className="mt-stack-lg">
              <SectionHeader color="#e7e4e6" title="Closing This Month" count={thisMonth.length} />
              {thisMonth.map((item) => (
                <DeadlineRow key={item.id} item={item} />
              ))}
            </View>

            <View className="mt-stack-lg">
              <SectionHeader color="#75ff9e" title="Upcoming" count={upcoming.length} />
              {upcoming.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    router.push({ pathname: '/program/[id]', params: { id: item.program_id ?? item.id } })
                  }
                  className="mb-stack-sm rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
                  <View className="mb-stack-sm flex-row items-start justify-between">
                    <View className="h-10 w-10 overflow-hidden rounded-lg border border-outline-variant bg-surface-container">
                      <Image source={{ uri: targetImage(item) }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                    </View>
                    <View className="items-end">
                      <Text className="text-[12px] text-primary">{daysUntil(item.deadline_date)} Days</Text>
                      <Text className="text-[14px] text-on-surface-variant">{formatDate(item.deadline_date)}</Text>
                    </View>
                  </View>
                  <Text className="mb-1 text-[16px] font-semibold text-on-surface">{targetName(item)}</Text>
                  <Text className="text-[14px] text-on-surface-variant">
                    {item.university?.name ?? 'Multiple institutions'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

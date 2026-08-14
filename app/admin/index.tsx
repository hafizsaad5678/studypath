import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAdminStats, useRecentActivity } from '@/hooks/useAdminStats';

type StatCard = {
  label: string;
  value: string;
  trend: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  tone: 'default' | 'error';
};

type ActivityItem = {
  title: string;
  description: string;
  time: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  iconColor: string;
  tag?: string;
};

function formatRelativeTime(timestamp: string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

type QuickAction = {
  label: string;
  sublabel: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  badge?: string;
  href?: '/admin/data-sources';
};

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Scraping Jobs', sublabel: 'Manage active workers', icon: 'bug-report' },
  {
    label: 'Data Sources',
    sublabel: 'Configure university APIs',
    icon: 'dataset',
    href: '/admin/data-sources',
  },
  { label: 'User Reports', sublabel: 'Review community feedback', icon: 'flag', badge: '3' },
];

function StatCardView({ stat }: { stat: StatCard }) {
  const isError = stat.tone === 'error';
  return (
    <View
      className={`flex-1 gap-2 rounded-xl border p-4 ${
        isError ? 'border-error/30 bg-error-container/20' : 'border-outline-variant bg-surface-container-lowest'
      }`}>
      <View className="flex-row items-start justify-between">
        <Text className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">
          {stat.label}
        </Text>
        <View
          className={`h-8 w-8 items-center justify-center rounded ${
            isError ? 'bg-error/10' : 'bg-primary-container/20'
          }`}>
          <MaterialIcons name={stat.icon} size={20} color={isError ? '#ffb4ab' : '#75ff9e'} />
        </View>
      </View>
      <Text className={`text-[32px] font-bold ${isError ? 'text-error' : 'text-on-surface'}`}>
        {stat.value}
      </Text>
      <View className="flex-row items-center gap-1">
        {!isError ? <MaterialIcons name="trending-up" size={16} color="#e7e4e6" /> : null}
        <Text className="text-[12px] font-medium text-on-surface-variant">{stat.trend}</Text>
        {isError ? (
          <MaterialIcons name="arrow-forward" size={16} color="#bacbb9" style={{ marginLeft: 'auto' }} />
        ) : null}
      </View>
    </View>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  return (
    <View className="flex-row gap-stack-sm">
      <View
        className="h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: item.iconBg }}>
        <MaterialIcons name={item.icon} size={16} color={item.iconColor} />
      </View>
      <View className="flex-1 gap-1 border-b border-outline-variant pb-4">
        <View className="flex-row items-baseline justify-between gap-2">
          <Text className="flex-1 text-[16px] font-semibold text-on-surface">{item.title}</Text>
          <Text className="text-[12px] text-outline">{item.time}</Text>
        </View>
        <Text className="text-[14px] text-on-surface-variant">{item.description}</Text>
        {item.tag ? (
          <View className="mt-1 flex-row self-start items-center gap-1 rounded bg-surface-container px-2 py-1">
            <Text className="text-[12px] text-on-surface-variant">{item.tag}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function QuickActionRow({ action }: { action: QuickAction }) {
  return (
    <Pressable
      onPress={() => (action.href ? router.push(action.href) : undefined)}
      className="flex-row items-center justify-between rounded-lg border border-outline-variant p-3">
      <View className="flex-row items-center gap-stack-sm">
        <View className="h-8 w-8 items-center justify-center rounded bg-surface-variant">
          <MaterialIcons name={action.icon} size={20} color="#bacbb9" />
        </View>
        <View>
          <Text className="text-[14px] font-semibold text-on-surface">{action.label}</Text>
          <Text className="text-[12px] text-outline">{action.sublabel}</Text>
        </View>
      </View>
      {action.badge ? (
        <View className="rounded-full bg-error px-2 py-0.5">
          <Text className="text-[12px] font-bold text-on-error">{action.badge}</Text>
        </View>
      ) : (
        <MaterialIcons name="chevron-right" size={20} color="#859585" />
      )}
    </Pressable>
  );
}

export default function AdminDashboardScreen() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: activity, isLoading: activityLoading } = useRecentActivity(3);

  const statCards: StatCard[] = stats
    ? [
        {
          label: 'Universities',
          value: String(stats.universityCount),
          trend: 'Live count',
          icon: 'account-balance',
          tone: 'default',
        },
        {
          label: 'Programs',
          value: String(stats.programCount),
          trend: 'Live count',
          icon: 'description',
          tone: 'default',
        },
        {
          label: 'Data verification',
          value: String(stats.pendingVerificationCount),
          trend: 'Requires manual review',
          icon: 'warning',
          tone: 'error',
        },
      ]
    : [];

  const activityItems: ActivityItem[] = (activity ?? []).map((item) => ({
    title: item.label,
    description: '',
    time: formatRelativeTime(item.timestamp),
    icon: 'event',
    iconBg: '#454747',
    iconColor: '#75ff9e',
  }));

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="h-16 w-full flex-row items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-margin-mobile">
        <Pressable onPress={() => router.back()} hitSlop={8} className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
          <MaterialIcons name="arrow-back" size={20} color="#e2e2e2" />
        </Pressable>
        <Text className="text-[20px] font-bold text-primary">Admin Panel</Text>
        <View className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
          <MaterialIcons name="notifications" size={20} color="#75ff9e" />
        </View>
      </View>

      <ScrollView contentContainerClassName="gap-gutter px-margin-mobile py-stack-lg">
        <Text className="text-[28px] font-bold text-on-surface">Overview</Text>

        {statsLoading ? (
          <View className="items-center py-4">
            <ActivityIndicator />
          </View>
        ) : (
          <View className="flex-row gap-stack-md">
            {statCards.map((stat) => (
              <StatCardView key={stat.label} stat={stat} />
            ))}
          </View>
        )}

        <View className="rounded-xl border border-outline-variant bg-surface-container-lowest">
          <View className="flex-row items-center justify-between border-b border-outline-variant p-4">
            <Text className="text-[20px] font-bold text-on-surface">Recent Activity</Text>
            <Text className="text-[14px] font-semibold text-primary">View All</Text>
          </View>
          <View className="gap-stack-md p-4">
            {activityLoading ? (
              <View className="items-center py-4">
                <ActivityIndicator />
              </View>
            ) : activityItems.length > 0 ? (
              activityItems.map((item, index) => <ActivityRow key={`${item.title}-${index}`} item={item} />)
            ) : (
              <Text className="text-[14px] text-on-surface-variant">No recent activity.</Text>
            )}
          </View>
        </View>

        <View className="rounded-xl border border-outline-variant bg-surface-container-lowest">
          <View className="border-b border-outline-variant p-4">
            <Text className="text-[20px] font-bold text-on-surface">Quick Actions</Text>
          </View>
          <View className="gap-stack-sm p-4">
            {QUICK_ACTIONS.map((action) => (
              <QuickActionRow key={action.label} action={action} />
            ))}
            <Pressable className="mt-1 items-center rounded-lg bg-primary-container py-2">
              <Text className="text-[14px] font-bold text-on-primary-container">Run Global Sync</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

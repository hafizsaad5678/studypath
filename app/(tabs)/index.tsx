import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/useAuth';
import { useDeadlines } from '@/hooks/useDeadlines';
import { useSavedItems } from '@/hooks/useSavedItems';
import { supabase } from '@/lib/supabase';
import type { DeadlineWithRelations, ProgramWithUniversity } from '@/types/database';

type QuickAction = {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const quickActions: QuickAction[] = [
  { id: '1', label: 'Find Programs', icon: 'search' },
  { id: '2', label: 'Scholarships', icon: 'payments' },
  { id: '3', label: 'Deadlines', icon: 'event' },
  { id: '4', label: 'Get Advice', icon: 'person-add' },
];

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function deadlineTitle(item: DeadlineWithRelations) {
  return item.program?.name ?? item.scholarship?.name ?? item.title;
}

function DeadlineItem({ item }: { item: DeadlineWithRelations }) {
  const days = daysUntil(item.deadline_date);
  const urgent = days <= 7;
  const bg = urgent ? 'bg-error-container' : 'bg-[#2a2410]';
  const iconColor = urgent ? '#ffb4ab' : '#f5c518';
  const badgeBg = urgent ? 'bg-[#ffb4ab1a]' : 'bg-[#f5c5181a]';
  const textColor = urgent ? 'text-error' : 'text-[#f5c518]';

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/program/[id]', params: { id: item.program_id ?? item.id } })}
      className={`flex-row items-start gap-4 rounded-lg p-4 ${bg}`}>
      <MaterialIcons name={urgent ? 'warning' : 'schedule'} size={22} color={iconColor} style={{ marginTop: 2 }} />
      <View className="flex-1">
        <View className="mb-1 flex-row items-start justify-between gap-2">
          <Text className="flex-1 text-[14px] font-bold text-on-surface">{deadlineTitle(item)}</Text>
          <Text className={`rounded px-2 py-1 text-[12px] font-bold ${badgeBg} ${textColor}`}>
            {days <= 0 ? 'Due today' : `${days} day${days === 1 ? '' : 's'} left`}
          </Text>
        </View>
        <Text className="mb-2 text-[14px] text-on-surface-variant">
          {item.university?.name ?? 'Multiple institutions'}
        </Text>
        <View className="flex-row items-center gap-1">
          <Text className={`text-[12px] font-semibold ${textColor}`}>View details</Text>
          <MaterialIcons name="chevron-right" size={14} color={iconColor} />
        </View>
      </View>
    </Pressable>
  );
}

function QuickActionButton({ item }: { item: QuickAction }) {
  return (
    <Pressable className="w-[47%] items-center justify-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-secondary-container">
        <MaterialIcons name={item.icon} size={22} color="#75ff9e" />
      </View>
      <Text className="text-center text-[14px] font-semibold text-on-surface">{item.label}</Text>
    </Pressable>
  );
}

function RecommendationCard({ item }: { item: ProgramWithUniversity }) {
  const { isSaved, toggle } = useSavedItems();
  const saved = isSaved('program', item.id);

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/program/[id]', params: { id: item.id } })}
      className="w-full overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
      <View className="h-32 w-full">
        <Image
          source={{ uri: item.university?.image_url ?? '' }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
        {item.scholarship_available ? (
          <View className="absolute right-2 top-2 rounded bg-surface-container-lowest px-2 py-1">
            <Text className="text-[12px] font-bold text-primary">Funding Available</Text>
          </View>
        ) : null}
      </View>
      <View className="p-4">
        <Text className="mb-1 text-[14px] font-bold text-on-surface">{item.name}</Text>
        <Text className="mb-4 text-[14px] text-on-surface-variant">
          {item.university?.name} • {item.university?.country?.name}
        </Text>
        <View className="flex-row items-center justify-between border-t border-outline-variant pt-3">
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="school" size={16} color="#bacbb9" />
            <Text className="text-[12px] text-on-surface-variant">{item.field_of_study ?? item.degree_level}</Text>
          </View>
          <Pressable onPress={() => toggle('program', item.id)} className="rounded-full p-2">
            <MaterialIcons name={saved ? 'bookmark' : 'bookmark-border'} size={20} color="#75ff9e" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { profile } = useAuth();
  const { data: deadlines, isLoading: deadlinesLoading } = useDeadlines(3);

  const { data: recommendations, isLoading: recsLoading } = useQuery({
    queryKey: ['home-recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('*, university:universities(*, country:countries(*))')
        .limit(3);
      if (error) throw error;
      return (data ?? []) as ProgramWithUniversity[];
    },
  });

  const profileComplete = !!profile?.education_level;
  const completionPct = profileComplete ? 100 : 50;
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="h-16 w-full flex-row items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-margin-mobile">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="school" size={22} color="#75ff9e" />
          <Text className="text-[20px] font-bold text-primary">StudyPath</Text>
        </View>
        <Pressable className="rounded-full p-2">
          <MaterialIcons name="notifications" size={22} color="#bacbb9" />
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="px-margin-mobile pb-8 pt-6" showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="mb-2 text-[28px] font-bold text-on-surface">Good afternoon, {firstName} 👋</Text>
          <Text className="text-[16px] text-on-surface-variant">
            Here is a summary of your academic journey.
          </Text>
        </View>

        <View className="mb-6 rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-[20px] font-semibold text-on-surface">Profile Setup</Text>
            <Text className="text-[14px] font-bold text-primary">{completionPct}% complete</Text>
          </View>
          <Text className="mb-6 text-[14px] text-on-surface-variant">
            Complete your profile to unlock personalized university recommendations and higher
            scholarship matches.
          </Text>
          <View className="mb-4 h-2 w-full rounded-full bg-surface-container-high">
            <View className="h-2 rounded-full bg-primary" style={{ width: `${completionPct}%` }} />
          </View>
          <Pressable className="w-full flex-row items-center justify-center gap-2 rounded-lg bg-primary-container px-4 py-3">
            <Text className="text-[14px] font-semibold text-on-primary-container">Complete Profile</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#00612e" />
          </Pressable>
        </View>

        <View className="mb-6 rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-[20px] font-semibold text-on-surface">Upcoming Deadlines</Text>
            <Pressable onPress={() => router.push('/(tabs)/deadlines')}>
              <Text className="text-[12px] font-semibold text-primary">View All</Text>
            </Pressable>
          </View>
          {deadlinesLoading ? (
            <ActivityIndicator />
          ) : (deadlines ?? []).length === 0 ? (
            <Text className="text-[14px] text-on-surface-variant">No upcoming deadlines.</Text>
          ) : (
            <View className="gap-4">
              {(deadlines ?? []).map((d) => (
                <DeadlineItem key={d.id} item={d} />
              ))}
            </View>
          )}
        </View>

        <View className="mb-6">
          <Text className="mb-4 text-[20px] font-semibold text-on-surface">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {quickActions.map((a) => (
              <QuickActionButton key={a.id} item={a} />
            ))}
          </View>
        </View>

        <View>
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-[20px] font-semibold text-on-surface">Recommended for You</Text>
            <Pressable onPress={() => router.push('/(tabs)/explore')}>
              <Text className="text-[12px] font-semibold text-primary">Explore All</Text>
            </Pressable>
          </View>
          {recsLoading ? (
            <ActivityIndicator />
          ) : (recommendations ?? []).length === 0 ? (
            <Text className="text-[14px] text-on-surface-variant">No recommendations yet.</Text>
          ) : (
            <View className="gap-4">
              {(recommendations ?? []).map((r) => (
                <RecommendationCard key={r.id} item={r} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

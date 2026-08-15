import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/layout/app-header';
import { useSavedItems } from '@/hooks/useSavedItems';
import { useUniversityById } from '@/hooks/useUniversities';
import { useProgramsByUniversity } from '@/hooks/usePrograms';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { formatTuition } from '@/lib/formatters';

export default function UniversityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: university, isLoading, isError } = useUniversityById(id ?? '');
  const { data: programs, isLoading: programsLoading } = useProgramsByUniversity(id ?? '');
  const { isSaved, toggle } = useSavedItems();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <AppHeader variant="detail" title="Loading University..." />
        <LoadingState message="Loading university details..." />
      </SafeAreaView>
    );
  }

  if (isError || !university) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <AppHeader variant="detail" title="University Details" />
        <ErrorState message="University not found." onRetry={() => router.back()} />
      </SafeAreaView>
    );
  }

  const QUICK_FACTS = [
    { icon: 'location-on' as const, label: 'Location', value: `${university.city ?? ''}${university.country?.name ? `, ${university.country.name}` : ''}` },
    ...(university.ranking != null
      ? [{ icon: 'star' as const, label: 'Ranking', value: `#${university.ranking}` }]
      : []),
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <AppHeader
        variant="detail"
        title={university.name}
        right={
          <Pressable onPress={() => toggle('university', university.id)} hitSlop={8}>
            <MaterialIcons
              name={isSaved('university', university.id) ? 'bookmark' : 'bookmark-border'}
              size={22}
              color="#bacbb9"
            />
          </Pressable>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="h-56 w-full bg-surface-variant">
          {university.image_url ? (
            <Image
              source={{ uri: university.image_url }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : null}
          <View className="absolute bottom-0 left-0 right-0 flex-row items-end justify-between bg-on-background/40 px-margin-mobile py-stack-md">
            <View className="flex-1">
              <Text className="text-[24px] font-bold text-surface-container-lowest">{university.name}</Text>
              <Text className="mt-1 text-[14px] text-surface-container-low">Public University</Text>
            </View>
            <Pressable
              onPress={() => toggle('university', university.id)}
              className="flex-row items-center gap-1 rounded-lg border border-surface-container-lowest/30 bg-surface-container-lowest/20 px-3 py-2">
              <MaterialIcons
                name={isSaved('university', university.id) ? 'bookmark' : 'bookmark-add'}
                size={18}
                color="#ffffff"
              />
              <Text className="text-[12px] font-semibold text-surface-container-lowest">
                {isSaved('university', university.id) ? 'Saved' : 'Save'}
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="px-margin-mobile pb-8 pt-stack-lg">
          {/* Quick Facts */}
          <View className="mb-stack-lg rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
            <Text className="mb-stack-md text-[18px] font-semibold text-on-surface">Quick Facts</Text>
            <View className="gap-stack-sm">
              {QUICK_FACTS.map((f, i) => (
                <View
                  key={f.label}
                  className={`flex-row items-center gap-3 py-2 ${
                    i < QUICK_FACTS.length - 1 ? 'border-b border-surface-variant' : ''
                  }`}>
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <MaterialIcons name={f.icon} size={18} color="#75ff9e" />
                  </View>
                  <View>
                    <Text className="text-[12px] text-on-surface-variant">{f.label}</Text>
                    <Text className="text-[16px] font-medium text-on-surface">{f.value}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View className="mt-stack-md gap-2 border-t border-surface-variant pt-stack-sm">
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="verified" size={14} color="#859585" />
                <Text className="text-[12px] text-on-surface-variant">Last verified: 14 Aug 2026</Text>
              </View>
              {university.website_url ? (
                <Pressable
                  onPress={() => Linking.openURL(university.website_url!)}
                  className="w-full flex-row items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-variant px-4 py-2">
                  <MaterialIcons name="language" size={18} color="#e2e2e2" />
                  <Text className="text-[14px] font-semibold text-on-surface">Official Website</Text>
                </Pressable>
              ) : null}
            </View>
          </View>

          {/* Programs */}
          <View className="mb-stack-md flex-row items-center justify-between">
            <Text className="text-[22px] font-semibold text-on-surface">Available Programs</Text>
          </View>
          {programsLoading ? (
            <ActivityIndicator />
          ) : !programs || programs.length === 0 ? (
            <Text className="text-[14px] text-on-surface-variant">No programs found yet.</Text>
          ) : (
            programs.map((p) => (
              <View key={p.id} className="mb-stack-md rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
                <View className="mb-stack-sm flex-row items-start justify-between">
                  <View className="flex-1">
                    <View className="mb-2 self-start rounded-full bg-primary/10 px-2 py-0.5">
                      <Text className="text-[12px] font-semibold text-primary">{p.degree_level}</Text>
                    </View>
                    <Text className="text-[18px] font-semibold text-on-surface">{p.name}</Text>
                  </View>
                  <Pressable onPress={() => toggle('program', p.id)} hitSlop={8}>
                    <MaterialIcons
                      name={isSaved('program', p.id) ? 'favorite' : 'favorite-border'}
                      size={20}
                      color="#bacbb9"
                    />
                  </Pressable>
                </View>
                <View className="my-stack-md flex-row flex-wrap gap-y-4">
                  <View className="w-1/2">
                    <Text className="text-[12px] text-on-surface-variant">Duration</Text>
                    <Text className="text-[16px] font-medium text-on-surface">
                      {p.duration_months ? `${p.duration_months} months` : 'N/A'}
                    </Text>
                  </View>
                  <View className="w-1/2">
                    <Text className="text-[12px] text-on-surface-variant">Tuition (Approx)</Text>
                    <Text className="text-[16px] font-medium text-on-surface">
                      {p.tuition_amount != null
                        ? `${p.tuition_currency ?? ''} ${p.tuition_amount} / year`
                        : 'N/A'}
                    </Text>
                  </View>
                  <View className="w-full">
                    <Text className="text-[12px] text-on-surface-variant">Next Deadline</Text>
                    <View className="mt-1 flex-row items-center gap-2">
                      <View className="h-2 w-2 rounded-full bg-error" />
                      <Text className="text-[16px] font-medium text-on-surface">
                        {p.application_deadline ?? 'TBA'}
                      </Text>
                    </View>
                  </View>
                </View>
                <Pressable
                  onPress={() => router.push({ pathname: '/program/[id]', params: { id: p.id } })}
                  className="flex-row items-center justify-center gap-2 rounded-lg border-t border-surface-variant bg-primary-container py-2.5 pt-stack-sm">
                  <Text className="text-[14px] font-semibold text-on-primary">View Program Details</Text>
                  <MaterialIcons name="arrow-forward" size={18} color="#003918" />
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

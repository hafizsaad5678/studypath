import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePrograms, useProgramsByIds } from '@/hooks/usePrograms';
import type { ProgramWithUniversity } from '@/types/database';

type Row = { label: string; values: React.ReactNode[] };

function ValueBlock({
  icon,
  color = '#e2e2e2',
  children,
}: {
  icon?: keyof typeof MaterialIcons.glyphMap;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center gap-2">
      {icon ? <MaterialIcons name={icon} size={16} color={color} /> : null}
      <View className="flex-1">{children}</View>
    </View>
  );
}

function formatTuition(p: ProgramWithUniversity) {
  if (p.tuition_amount == null) return 'N/A';
  return `${p.tuition_currency ?? ''} ${p.tuition_amount}`;
}

export default function CompareScreen() {
  // The current UI navigates here without passing which two programs to compare yet.
  // If a caller starts passing `ids` (comma-separated program ids) as a route param,
  // use those; otherwise fall back to the first two programs available as a stand-in.
  const params = useLocalSearchParams<{ ids?: string }>();
  const idsFromParams = params.ids ? params.ids.split(',').filter(Boolean) : [];

  const byIdsQuery = useProgramsByIds(idsFromParams);
  const fallbackQuery = usePrograms();

  const isLoading = idsFromParams.length > 0 ? byIdsQuery.isLoading : fallbackQuery.isLoading;
  const source = idsFromParams.length > 0 ? byIdsQuery.data : fallbackQuery.data?.slice(0, 2);
  const programs = source ?? [];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background" edges={['top']}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (programs.length < 2) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <View className="flex-row items-center border-b border-outline-variant bg-surface-container-lowest px-margin-mobile py-3">
          <Pressable onPress={() => router.back()} hitSlop={8} className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
            <MaterialIcons name="arrow-back" size={20} color="#e2e2e2" />
          </Pressable>
          <Text className="text-[18px] font-bold text-primary">StudyPath</Text>
        </View>
        <View className="flex-1 items-center justify-center px-margin-mobile">
          <Text className="text-center text-[16px] text-on-surface-variant">
            Not enough programs available to compare yet.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const [a, b] = programs;

  const rows: Row[] = [
    {
      label: 'Location',
      values: [
        <ValueBlock key="a" icon="location-on" color="#859585">
          <Text className="text-[14px] text-on-surface">
            {[a.university?.city, a.university?.country?.name].filter(Boolean).join(', ') || 'N/A'}
          </Text>
        </ValueBlock>,
        <ValueBlock key="b" icon="location-on" color="#859585">
          <Text className="text-[14px] text-on-surface">
            {[b.university?.city, b.university?.country?.name].filter(Boolean).join(', ') || 'N/A'}
          </Text>
        </ValueBlock>,
      ],
    },
    {
      label: 'Tuition (Yearly)',
      values: [
        <Text key="a" className="text-[16px] font-bold text-on-surface">{formatTuition(a)}</Text>,
        <Text key="b" className="text-[16px] font-bold text-on-surface">{formatTuition(b)}</Text>,
      ],
    },
    {
      label: 'Duration',
      values: [
        <ValueBlock key="a" icon="schedule" color="#859585">
          <Text className="text-[14px] text-on-surface">
            {a.duration_months ? `${a.duration_months} months` : 'N/A'}
          </Text>
        </ValueBlock>,
        <ValueBlock key="b" icon="schedule" color="#859585">
          <Text className="text-[14px] text-on-surface">
            {b.duration_months ? `${b.duration_months} months` : 'N/A'}
          </Text>
        </ValueBlock>,
      ],
    },
    {
      label: 'Language',
      values: [
        <Text key="a" className="text-[14px] text-on-surface">{a.language ?? 'N/A'}</Text>,
        <Text key="b" className="text-[14px] text-on-surface">{b.language ?? 'N/A'}</Text>,
      ],
    },
    {
      label: 'Next Deadline',
      values: [
        <ValueBlock key="a" icon="event-busy" color="#ffb4ab">
          <Text className="text-[14px] font-semibold text-error">{a.application_deadline ?? 'TBA'}</Text>
        </ValueBlock>,
        <ValueBlock key="b" icon="event-available" color="#75ff9e">
          <Text className="text-[14px] font-semibold text-primary">{b.application_deadline ?? 'TBA'}</Text>
        </ValueBlock>,
      ],
    },
    {
      label: 'Scholarship',
      values: [
        <Text key="a" className="text-[13px] text-on-surface">
          {a.scholarship_available ? 'Available' : 'Not available'}
        </Text>,
        <Text key="b" className="text-[13px] text-on-surface">
          {b.scholarship_available ? 'Available' : 'Not available'}
        </Text>,
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center border-b border-outline-variant bg-surface-container-lowest px-margin-mobile py-3">
        <Pressable onPress={() => router.back()} hitSlop={8} className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
          <MaterialIcons name="arrow-back" size={20} color="#e2e2e2" />
        </Pressable>
        <Text className="text-[18px] font-bold text-primary">StudyPath</Text>
      </View>

      <ScrollView contentContainerClassName="px-margin-mobile pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="mb-2 text-[26px] font-bold text-on-surface">Compare Programs</Text>
        <Text className="mb-stack-lg text-[16px] text-on-surface-variant">
          Evaluate top academic paths to make an informed decision for your future.
        </Text>

        {/* Program cards (stacked, side headers) */}
        <View className="mb-stack-lg flex-row gap-stack-md">
          {[a, b].map((p) => (
            <View key={p.id} className="flex-1 overflow-hidden rounded-xl border border-outline-variant bg-surface-bright">
              <View className="p-stack-sm">
                <View className="mb-2 h-20 w-full overflow-hidden rounded-lg bg-surface-variant">
                  {p.university?.image_url ? (
                    <Image source={{ uri: p.university.image_url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                  ) : null}
                </View>
                <Text className="mb-1 text-[11px] font-bold text-primary">{p.university?.name ?? ''}</Text>
                <Text className="text-[15px] font-semibold text-on-surface">{p.name}</Text>
                <Pressable
                  onPress={() => router.push({ pathname: '/program/[id]', params: { id: p.id } })}
                  className="mt-2 items-center rounded-lg border border-outline-variant bg-surface-container py-2">
                  <Text className="text-[12px] font-semibold text-on-surface">View Details</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Comparison rows */}
        <View className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
          {rows.map((row, i) => (
            <View
              key={row.label}
              className={`p-stack-md ${i < rows.length - 1 ? 'border-b border-outline-variant' : ''} ${
                i % 2 === 1 ? 'bg-surface-container-lowest' : ''
              }`}>
              <Text className="mb-stack-sm text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">
                {row.label}
              </Text>
              <View className="flex-row gap-stack-md">
                <View className="flex-1">{row.values[0]}</View>
                <View className="flex-1">{row.values[1]}</View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

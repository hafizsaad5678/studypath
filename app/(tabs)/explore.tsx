import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { usePrograms } from '@/hooks/usePrograms';
import { useSavedItems } from '@/hooks/useSavedItems';
import type { DegreeLevel, ProgramWithUniversity } from '@/types/database';

const DEGREE_FILTERS: { label: string; value: DegreeLevel | null }[] = [
  { label: 'All Degrees', value: null },
  { label: 'Diploma', value: 'diploma' },
  { label: 'Bachelor', value: 'bachelor' },
  { label: 'Master', value: 'master' },
  { label: 'PhD', value: 'phd' },
];

const filterChips = ['Country', 'Field', 'Tuition'];

function formatTuition(p: ProgramWithUniversity) {
  if (p.tuition_amount == null) return 'N/A';
  return `${p.tuition_currency ?? ''}${p.tuition_amount} / yr`;
}

function ProgramCardView({
  item,
  isSaved,
  onToggleSave,
}: {
  item: ProgramWithUniversity;
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/program/[id]', params: { id: item.id } })}
      className="relative flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
      <Pressable
        onPress={onToggleSave}
        hitSlop={8}
        className="absolute right-3 top-3 z-10 h-8 w-8 items-center justify-center rounded-full bg-surface-container">
        <MaterialIcons name={isSaved ? 'bookmark' : 'bookmark-border'} size={18} color="#bacbb9" />
      </Pressable>
      <View className="mb-4 flex-row items-start gap-4 pr-4">
        <View className="h-16 w-16 items-center justify-center rounded-lg border border-outline-variant bg-surface-container">
          <MaterialIcons name="account-balance" size={28} color="#bacbb9" />
        </View>
        <View className="flex-1">
          <Text className="text-[18px] font-semibold text-on-surface">{item.name}</Text>
          <Text className="mt-1 text-[14px] text-on-surface-variant">
            {[item.university?.name, item.university?.country?.name].filter(Boolean).join(' • ')}
          </Text>
        </View>
      </View>
      <View className="mb-4 flex-row justify-between border-t border-outline-variant pt-4">
        <View>
          <Text className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
            Tuition
          </Text>
          <Text className="text-[16px] font-medium text-on-surface">{formatTuition(item)}</Text>
        </View>
        <View>
          <Text className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
            Deadline
          </Text>
          <Text className="text-[16px] font-medium text-on-surface">
            {item.application_deadline ?? 'TBA'}
          </Text>
        </View>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {item.scholarship_available && (
          <View className="flex-row items-center gap-1 rounded-md px-2 py-1 bg-tertiary-container/10">
            <MaterialIcons name="workspace-premium" size={14} color="#cac8ca" />
            <Text className="text-[12px] font-medium text-tertiary-container">Scholarship Available</Text>
          </View>
        )}
        {item.language && (
          <View className="flex-row items-center gap-1 rounded-md px-2 py-1 bg-surface-container">
            <MaterialIcons name="language" size={14} color="#bacbb9" />
            <Text className="text-[12px] font-medium text-on-surface-variant">{item.language}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default function ExploreScreen() {
  const [search, setSearch] = useState('');
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel | null>(null);

  const { data: programs, isLoading, isError } = usePrograms({
    search: search || undefined,
    degreeLevel: degreeLevel ?? undefined,
  });
  const { isSaved, toggle } = useSavedItems();

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

      <ScrollView contentContainerClassName="px-margin-mobile pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <View className="relative mb-4">
          <MaterialIcons
            name="search"
            size={20}
            color="#bacbb9"
            style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }}
          />
          <TextInput
            className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-4 pl-12 pr-4 text-[16px] text-on-surface"
            placeholder="Search universities, programs, or keywords"
            placeholderTextColor="#bacbb9"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 pb-4">
          {DEGREE_FILTERS.map((chip) => (
            <Pressable
              key={chip.label}
              onPress={() => setDegreeLevel(chip.value)}
              className={`flex-row items-center gap-1 rounded-full border px-4 py-2 ${
                degreeLevel === chip.value
                  ? 'border-primary bg-primary-container'
                  : 'border-outline-variant bg-surface-container-lowest'
              }`}>
              <Text
                className={`text-[14px] font-semibold ${
                  degreeLevel === chip.value ? 'text-on-primary-container' : 'text-on-surface'
                }`}>
                {chip.label}
              </Text>
            </Pressable>
          ))}
          {filterChips.map((chip) => (
            <Pressable
              key={chip}
              className="flex-row items-center gap-1 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2">
              <Text className="text-[14px] font-semibold text-on-surface">{chip}</Text>
              <MaterialIcons name="expand-more" size={16} color="#e2e2e2" />
            </Pressable>
          ))}
        </ScrollView>

        <View className="mb-4 mt-2 flex-row items-center justify-between">
          <Text className="text-[20px] font-semibold text-on-surface">
            {isLoading ? 'Loading…' : `${programs?.length ?? 0} Programs Found`}
          </Text>
        </View>

        {isLoading ? (
          <View className="items-center py-8">
            <ActivityIndicator />
          </View>
        ) : isError ? (
          <Text className="text-center text-[14px] text-on-surface-variant">
            Something went wrong loading programs.
          </Text>
        ) : !programs || programs.length === 0 ? (
          <Text className="text-center text-[14px] text-on-surface-variant">No programs found.</Text>
        ) : (
          <View className="gap-4">
            {programs.map((p) => (
              <ProgramCardView
                key={p.id}
                item={p}
                isSaved={isSaved('program', p.id)}
                onToggleSave={() => toggle('program', p.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

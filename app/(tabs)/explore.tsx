import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/layout/app-header';
import { CountryPickerModal } from '@/components/ui/country-picker-modal';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useCountries } from '@/hooks/useCountries';
import { usePrograms } from '@/hooks/usePrograms';
import { useSavedItems } from '@/hooks/useSavedItems';
import { formatTuition } from '@/lib/formatters';
import type { DegreeLevel, ProgramWithUniversity } from '@/types/database';

const DEGREE_FILTERS: { label: string; value: DegreeLevel | null }[] = [
  { label: 'All Degrees', value: null },
  { label: 'Diploma', value: 'diploma' },
  { label: 'Bachelor', value: 'bachelor' },
  { label: 'Master', value: 'master' },
  { label: 'PhD', value: 'phd' },
];

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
          <Text className="text-[16px] font-medium text-on-surface">
            {formatTuition(item.tuition_amount, undefined, item.tuition_currency)}
          </Text>
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
          <View className="flex-row items-center gap-1 rounded-md bg-tertiary-container/10 px-2 py-1">
            <MaterialIcons name="workspace-premium" size={14} color="#cac8ca" />
            <Text className="text-[12px] font-medium text-tertiary-container">Scholarship Available</Text>
          </View>
        )}
        {item.language && (
          <View className="flex-row items-center gap-1 rounded-md bg-surface-container px-2 py-1">
            <MaterialIcons name="language" size={14} color="#bacbb9" />
            <Text className="text-[12px] font-medium text-on-surface-variant">{item.language}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default function ExploreScreen() {
  const params = useLocalSearchParams<{ degree?: string; countryId?: string; search?: string }>();
  const [search, setSearch] = useState(params.search ?? '');
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel | null>(
    (params.degree as DegreeLevel) ?? null
  );
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(params.countryId ?? null);
  const [showCountryModal, setShowCountryModal] = useState(false);

  const { data: countries } = useCountries();

  const { data: programs, isLoading, isError } = usePrograms({
    search: search || undefined,
    degreeLevel: degreeLevel ?? undefined,
    countryId: selectedCountryId ?? undefined,
  });
  const { isSaved, toggle } = useSavedItems();

  const selectedCountry = countries?.find((c) => c.id === selectedCountryId);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <AppHeader variant="brand" />

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

          <Pressable
            onPress={() => setShowCountryModal(true)}
            className={`flex-row items-center gap-1 rounded-full border px-4 py-2 ${
              selectedCountryId
                ? 'border-primary bg-primary-container'
                : 'border-outline-variant bg-surface-container-lowest'
            }`}>
            <Text
              className={`text-[14px] font-semibold ${
                selectedCountryId ? 'text-on-primary-container' : 'text-on-surface'
              }`}>
              {selectedCountry ? selectedCountry.name : 'Country'}
            </Text>
            {selectedCountryId ? (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  setSelectedCountryId(null);
                }}
                hitSlop={8}>
                <MaterialIcons name="close" size={16} color="#00612e" />
              </Pressable>
            ) : (
              <MaterialIcons name="expand-more" size={16} color="#e2e2e2" />
            )}
          </Pressable>
        </ScrollView>

        <View className="mb-4 mt-2 flex-row items-center justify-between">
          <Text className="text-[20px] font-semibold text-on-surface">
            {isLoading ? 'Loading…' : `${programs?.length ?? 0} Programs Found`}
          </Text>
        </View>

        {isLoading ? (
          <LoadingState message="Fetching programs..." />
        ) : isError ? (
          <ErrorState message="Something went wrong loading programs." />
        ) : !programs || programs.length === 0 ? (
          <EmptyState
            title="No programs found"
            description="Try changing your search keywords or clearing the active filters."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearch('');
              setDegreeLevel(null);
              setSelectedCountryId(null);
            }}
          />
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

      <CountryPickerModal
        visible={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        countries={countries}
        selectedCountryId={selectedCountryId}
        onSelectCountry={setSelectedCountryId}
      />
    </SafeAreaView>
  );
}


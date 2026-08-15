import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/layout/app-header';
import { useSavedItems } from '@/hooks/useSavedItems';
import { useScholarships } from '@/hooks/useScholarships';
import type { ScholarshipWithRelations } from '@/types/database';

const COUNTRIES = ['Any Country', 'Germany', 'France', 'UK', 'USA'];
const DEGREES = ['Any Level', "Bachelor's", "Master's", 'PhD'];

function FilterPill({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-1 min-w-[45%] rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md gap-stack-sm">
      <View className="flex-row items-center gap-1">
        <MaterialIcons name={icon} size={16} color="#e2e2e2" />
        <Text className="text-[14px] font-semibold text-on-surface">{label}</Text>
      </View>
      <View className="rounded-lg border border-outline-variant bg-surface-container-low px-2 py-2">
        <Text className="text-[14px] text-on-surface">{value}</Text>
      </View>
    </View>
  );
}

function formatDeadline(deadline: string | null) {
  if (!deadline) return 'No deadline';
  const d = new Date(deadline);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function timeLeftLabel(deadline: string | null) {
  if (!deadline) return '';
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return 'Deadline passed';
  if (days === 0) return 'Due today';
  if (days < 14) return `${days} day${days === 1 ? '' : 's'} left`;
  if (days < 60) return `${Math.round(days / 7)} weeks left`;
  return `${Math.round(days / 30)} months left`;
}

function ScholarshipCard({ item }: { item: ScholarshipWithRelations }) {
  const { isSaved, toggle } = useSavedItems();
  const saved = isSaved('scholarship', item.id);
  const urgent = item.deadline
    ? Math.ceil((new Date(item.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) <= 14
    : false;

  return (
    <View className="mb-gutter overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
      <View className="h-32 w-full bg-surface-container-low">
        <Image
          source={{ uri: item.university?.image_url ?? item.country?.image_url ?? '' }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
        <Pressable
          onPress={() => toggle('scholarship', item.id)}
          className="absolute right-stack-sm top-stack-sm h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest">
          <MaterialIcons name={saved ? 'bookmark' : 'bookmark-border'} size={18} color="#75ff9e" />
        </Pressable>
      </View>
      <View className="p-stack-md">
        <View className="mb-1 flex-row items-start justify-between gap-2">
          <Text className="flex-1 text-[20px] font-semibold text-on-surface" numberOfLines={1}>
            {item.name}
          </Text>
          <View
            className={`flex-row items-center gap-1 rounded px-2 py-0.5 ${
              urgent ? 'bg-error-container' : 'bg-surface-variant'
            }`}>
            <MaterialIcons
              name={urgent ? 'schedule' : 'event'}
              size={14}
              color={urgent ? '#ffdad6' : '#bacbb9'}
            />
            <Text
              className={`text-[12px] font-semibold ${
                urgent ? 'text-on-error-container' : 'text-on-surface-variant'
              }`}>
              {formatDeadline(item.deadline)}
            </Text>
          </View>
        </View>
        <View className="mb-stack-md flex-row items-center gap-1">
          <MaterialIcons name="location-on" size={16} color="#bacbb9" />
          <Text className="text-[14px] text-on-surface-variant">
            {item.country?.name ?? 'Multiple countries'} • {item.university?.name ?? 'Various institutions'}
          </Text>
        </View>
        <View className="mb-stack-md flex-row flex-wrap gap-stack-sm rounded-lg border border-surface-container-high bg-surface p-stack-sm">
          <View className="w-[45%]">
            <Text className="text-[12px] text-on-surface-variant">Funding</Text>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="verified" size={14} color="#75ff9e" />
              <Text className="text-[14px] font-semibold text-primary">
                {item.funding_type === 'full' ? 'Fully Funded' : 'Partial Funding'}
              </Text>
            </View>
          </View>
          <View className="w-[45%]">
            <Text className="text-[12px] text-on-surface-variant">Stipend</Text>
            <Text className="text-[14px] text-on-surface">{item.amount_text ?? '—'}</Text>
          </View>
          <View className="w-full">
            <Text className="text-[12px] text-on-surface-variant">Coverage</Text>
            <Text className="text-[14px] text-on-surface">{item.coverage ?? '—'}</Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between border-t border-outline-variant pt-stack-sm">
          <Text className="text-[12px] text-on-surface-variant">{timeLeftLabel(item.deadline)}</Text>
          <Pressable
            onPress={() => router.push({ pathname: '/program/[id]', params: { id: item.program_id ?? item.id } })}
            className="rounded-lg bg-primary-container px-4 py-2">
            <Text className="text-[14px] font-semibold text-on-primary-container">View Details</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

import { useCountries } from '@/hooks/useCountries';
import type { FundingType } from '@/types/database';
import { Modal } from 'react-native';

export default function ScholarshipsScreen() {
  const [search, setSearch] = useState('');
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [fullyFundedOnly, setFullyFundedOnly] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);

  const { data: countries } = useCountries();

  const { data: scholarships, isLoading } = useScholarships({
    search: search || undefined,
    countryId: selectedCountryId ?? undefined,
    fundingType: fullyFundedOnly ? 'full' : undefined,
  });

  const list = useMemo(() => scholarships ?? [], [scholarships]);
  const selectedCountry = countries?.find((c) => c.id === selectedCountryId);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <AppHeader variant="brand" />
      <ScrollView contentContainerClassName="px-margin-mobile pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="mb-2 text-[28px] font-bold text-on-surface">Scholarships Discovery</Text>
        <Text className="mb-stack-lg text-[16px] text-on-surface-variant">
          Find and apply to fully funded programs worldwide.
        </Text>

        <View className="mb-stack-md flex-row items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2">
          <MaterialIcons name="search" size={20} color="#bacbb9" />
          <TextInput
            className="flex-1 text-[16px] text-on-surface"
            placeholder="Search scholarships, country, university..."
            placeholderTextColor="#859585"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View className="mb-stack-lg flex-row flex-wrap gap-stack-sm">
          <Pressable
            onPress={() => setShowCountryModal(true)}
            className="flex-1 min-w-[45%] rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md gap-stack-sm active:bg-surface-container-high">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="public" size={16} color="#e2e2e2" />
                <Text className="text-[14px] font-semibold text-on-surface">Country</Text>
              </View>
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
                <MaterialIcons name="expand-more" size={16} color="#bacbb9" />
              )}
            </View>
            <View className="rounded-lg border border-outline-variant bg-surface-container-low px-2 py-2">
              <Text className="text-[14px] text-on-surface" numberOfLines={1}>
                {selectedCountry ? selectedCountry.name : 'Any Country'}
              </Text>
            </View>
          </Pressable>
        </View>

        <Pressable
          onPress={() => setFullyFundedOnly((prev) => !prev)}
          className="mb-stack-lg flex-row items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md active:bg-surface-container-high">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="monetization-on" size={18} color="#e2e2e2" />
            <Text className="text-[14px] font-semibold text-on-surface">Fully Funded Only</Text>
          </View>
          <MaterialIcons
            name={fullyFundedOnly ? 'check-box' : 'check-box-outline-blank'}
            size={22}
            color={fullyFundedOnly ? '#75ff9e' : '#bacbb9'}
          />
        </Pressable>

        <View className="mb-stack-lg flex-row items-center justify-between">
          <Text className="text-[14px] font-semibold text-on-surface">
            {isLoading ? 'Loading...' : `${list.length} Scholarships`}
          </Text>
        </View>

        {isLoading ? (
          <View className="items-center py-8">
            <ActivityIndicator />
          </View>
        ) : list.length === 0 ? (
          <Text className="py-8 text-center text-[14px] text-on-surface-variant">No scholarships found.</Text>
        ) : (
          list.map((s) => <ScholarshipCard key={s.id} item={s} />)
        )}
      </ScrollView>

      <Modal visible={showCountryModal} transparent animationType="fade" onRequestClose={() => setShowCountryModal(false)}>
        <Pressable className="flex-1 bg-black/60 justify-end" onPress={() => setShowCountryModal(false)}>
          <Pressable className="max-h-[70%] rounded-t-2xl border-t border-outline-variant bg-surface-container-lowest p-6" onPress={(e) => e.stopPropagation?.()}>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-[18px] font-bold text-on-surface">Select Country</Text>
              <Pressable onPress={() => setShowCountryModal(false)} hitSlop={8}>
                <MaterialIcons name="close" size={22} color="#bacbb9" />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Pressable
                onPress={() => {
                  setSelectedCountryId(null);
                  setShowCountryModal(false);
                }}
                className={`flex-row items-center justify-between rounded-xl p-4 ${
                  !selectedCountryId ? 'bg-primary-container/20' : 'active:bg-surface-container'
                }`}>
                <Text className={`text-[16px] ${!selectedCountryId ? 'font-bold text-primary' : 'text-on-surface'}`}>
                  All Countries
                </Text>
                {!selectedCountryId ? <MaterialIcons name="check" size={20} color="#75ff9e" /> : null}
              </Pressable>
              {(countries ?? []).map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => {
                    setSelectedCountryId(c.id);
                    setShowCountryModal(false);
                  }}
                  className={`flex-row items-center justify-between rounded-xl p-4 ${
                    selectedCountryId === c.id ? 'bg-primary-container/20' : 'active:bg-surface-container'
                  }`}>
                  <Text className={`text-[16px] ${selectedCountryId === c.id ? 'font-bold text-primary' : 'text-on-surface'}`}>
                    {c.name}
                  </Text>
                  {selectedCountryId === c.id ? <MaterialIcons name="check" size={20} color="#75ff9e" /> : null}
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCountry } from '@/hooks/useCountries';
import { useUniversitiesByCountry } from '@/hooks/useUniversities';

const TIMELINE = [
  {
    active: true,
    label: 'September / October Intake (Main)',
    window: 'Application Window: Dec - May',
    desc: 'The primary intake for almost all Bachelor\'s and Master\'s programs. Pre-enrollment via Universitaly is required for non-EU students.',
  },
  {
    active: false,
    label: 'February / March Intake (Secondary)',
    window: 'Application Window: Jul - Oct',
    desc: 'Available for select Master\'s programs and a limited number of Bachelor\'s degrees. Check specific university offerings.',
  },
];

const TABS = ['Overview', 'Universities', 'Scholarships', 'Deadlines'];

function formatTuition(min: number | null, max: number | null, currency: string | null) {
  if (min == null && max == null) return 'N/A';
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'CAD' ? 'C$' : '';
  return `${symbol}${min ?? 0} - ${symbol}${max ?? 0}`;
}

export default function CountryDetailScreen() {
  const params = useLocalSearchParams<{ slug: string }>();
  const slug = params.slug ?? 'italy';
  const { data: country, isLoading, isError } = useCountry(slug);
  const { data: universities, isLoading: universitiesLoading } = useUniversitiesByCountry(
    country?.id ?? ''
  );

  const STATS = country
    ? [
        {
          icon: 'payments' as const,
          bg: 'bg-secondary-container',
          iconColor: '#b4b5b5',
          label: 'Avg. Tuition',
          value: formatTuition(country.avg_tuition_min, country.avg_tuition_max, country.currency),
          unit: '/ year',
          desc: `Studying in ${country.name}`,
        },
        {
          icon: 'account-balance' as const,
          bg: 'bg-primary-container',
          iconColor: '#00612e',
          label: 'Universities',
          value: `${universities?.length ?? 0}`,
          unit: '',
          desc: 'Recognized higher education institutions',
        },
      ]
    : [];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background" edges={['top']}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (isError || !country) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background" edges={['top']}>
        <Text className="text-[16px] text-on-surface-variant">Country not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center border-b border-outline-variant bg-surface-container-lowest px-margin-mobile py-3">
        <Pressable onPress={() => router.back()} hitSlop={8} className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
          <MaterialIcons name="arrow-back" size={20} color="#e2e2e2" />
        </Pressable>
        <Text className="text-[18px] font-bold text-primary">StudyPath</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="h-56 w-full bg-surface-container-high">
          {country.image_url ? (
            <Image
              source={{ uri: country.image_url }}
              style={{ width: '100%', height: '100%', opacity: 0.6 }}
              contentFit="cover"
            />
          ) : null}
          <View className="absolute bottom-0 left-0 right-0 flex-row items-end px-margin-mobile py-stack-md">
            <View className="flex-1 flex-row items-center gap-3">
              <View className="h-16 w-16 items-center justify-center overflow-hidden rounded-xl border-2 border-surface-container-lowest bg-surface-container-lowest">
                <Text className="text-[28px]">{country.flag_emoji ?? '🌍'}</Text>
              </View>
              <View>
                <Text className="text-[26px] font-bold text-on-surface">Study in {country.name}</Text>
                <View className="mt-1 flex-row items-center gap-1">
                  <MaterialIcons name="location-on" size={14} color="#bacbb9" />
                  <Text className="text-[14px] text-on-surface-variant">{country.region ?? ''}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="px-margin-mobile pb-8 pt-stack-lg">
          {/* Tabs */}
          <View className="mb-stack-lg flex-row gap-6 border-b border-outline-variant">
            {TABS.map((t, i) => (
              <View key={t} className={`pb-3 ${i === 0 ? 'border-b-2 border-primary' : ''}`}>
                <Text className={`text-[14px] font-semibold ${i === 0 ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {t}
                </Text>
              </View>
            ))}
          </View>

          {/* Stats */}
          <View className="mb-stack-lg gap-stack-md">
            {STATS.map((s) => (
              <View key={s.label} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
                <View className="mb-4 flex-row items-center gap-3">
                  <View className={`rounded-lg p-2 ${s.bg}`}>
                    <MaterialIcons name={s.icon} size={20} color={s.iconColor} />
                  </View>
                  <Text className="text-[14px] font-semibold text-on-surface-variant">{s.label}</Text>
                </View>
                <Text className="text-[24px] font-semibold text-on-surface">
                  {s.value} <Text className="text-[14px] text-on-surface-variant">{s.unit}</Text>
                </Text>
                <Text className="mt-1 text-[14px] text-on-surface-variant">{s.desc}</Text>
              </View>
            ))}
          </View>

          {/* Popular Universities */}
          <View className="mb-stack-md flex-row items-center justify-between">
            <Text className="text-[20px] font-semibold text-on-surface">Popular Universities</Text>
            <Pressable className="flex-row items-center gap-1">
              <Text className="text-[14px] font-semibold text-primary">View All</Text>
              <MaterialIcons name="arrow-forward" size={14} color="#75ff9e" />
            </Pressable>
          </View>
          <View className="mb-stack-lg gap-stack-md">
            {universitiesLoading ? (
              <ActivityIndicator />
            ) : !universities || universities.length === 0 ? (
              <Text className="text-[14px] text-on-surface-variant">No universities found yet.</Text>
            ) : (
              universities.map((u) => (
                <Pressable
                  key={u.id}
                  onPress={() => router.push({ pathname: '/university/[id]', params: { id: u.id } })}
                  className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
                  <View className="h-40 w-full">
                    {u.image_url ? (
                      <Image source={{ uri: u.image_url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                    ) : null}
                  </View>
                  <View className="p-stack-md">
                    <View className="mb-2 flex-row items-start justify-between">
                      <Text className="flex-1 text-[18px] font-semibold text-on-surface">{u.name}</Text>
                      <View className="rounded-md bg-surface-variant px-2 py-1">
                        <Text className="text-[10px] text-on-surface-variant">Public</Text>
                      </View>
                    </View>
                    <View className="mb-stack-sm flex-row items-center gap-1">
                      <MaterialIcons name="location-on" size={16} color="#bacbb9" />
                      <Text className="text-[14px] text-on-surface-variant">{u.city ?? ''}</Text>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </View>

          {/* Admission Timeline */}
          <View className="mb-stack-lg rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
            <Text className="mb-stack-md text-[18px] font-semibold text-on-surface">Admission Intakes (General)</Text>
            <View className="gap-stack-lg border-l-2 border-surface-variant pl-6">
              {TIMELINE.map((t) => (
                <View key={t.label} className="relative">
                  <View
                    className={`absolute -left-[29px] top-1 h-4 w-4 rounded-full ${
                      t.active ? 'bg-primary' : 'bg-surface-variant'
                    }`}
                  />
                  <Text className={`mb-1 text-[12px] font-semibold uppercase ${t.active ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {t.label}
                  </Text>
                  <Text className="mb-2 text-[16px] font-semibold text-on-surface">{t.window}</Text>
                  <Text className="text-[14px] text-on-surface-variant">{t.desc}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View className="flex-col gap-3 border-t border-outline-variant pt-stack-md">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="verified" size={14} color="#bacbb9" />
              <Text className="text-[14px] text-on-surface-variant">Last verified: 14 Aug 2026</Text>
            </View>
            {country.visa_info ? (
              <Pressable
                onPress={() => Linking.openURL('https://www.miur.gov.it')}
                className="flex-row items-center gap-1">
                <Text className="text-[14px] font-semibold text-primary">Official Ministry of Education Site</Text>
                <MaterialIcons name="open-in-new" size={14} color="#75ff9e" />
              </Pressable>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

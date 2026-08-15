import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/layout/app-header';
import { useAuth } from '@/hooks/useAuth';
import { useDeadlines } from '@/hooks/useDeadlines';
import { useCountries } from '@/hooks/useCountries';
import { useScholarships } from '@/hooks/useScholarships';
import type { Country as CountryRow } from '@/types/database';

const FILTERS = ["Bachelor's", "Master's", 'Scholarships', 'Low Tuition', 'Open Admissions'];

const STEPS: { icon: keyof typeof MaterialIcons.glyphMap; title: string; desc: string }[] = [
  { icon: 'travel-explore', title: 'Discover', desc: 'Search thousands of programs based on your academic profile and budget.' },
  { icon: 'fact-check', title: 'Compare', desc: 'Evaluate tuition, living costs, and admission requirements side-by-side.' },
  { icon: 'edit-document', title: 'Apply', desc: 'Track deadlines and organize your documents in one centralized dashboard.' },
  { icon: 'flight-takeoff', title: 'Enroll', desc: 'Secure your spot, arrange visas, and prepare for departure.' },
];

function formatTuition(min: number | null, max: number | null, currency: string | null) {
  if (min == null && max == null) return null;
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'CAD' ? 'C$' : '';
  return `${symbol}${min ?? 0}${max ? `–${symbol}${max}` : ''} Tuition`;
}

function CountryCard({ item, wide }: { item: CountryRow; wide?: boolean }) {
  const stats = formatTuition(item.avg_tuition_min, item.avg_tuition_max, item.currency);
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/country/[slug]', params: { slug: item.slug } })}
      className={`overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest ${
        wide ? 'w-full' : 'flex-1'
      }`}
      style={{ height: 160 }}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      ) : null}
      <View className="absolute inset-0 bg-black/40" />
      <View className="absolute bottom-0 left-0 w-full p-4">
        <Text className="mb-1 text-[18px] font-bold text-white">{item.name}</Text>
        {stats ? (
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="account-balance" size={14} color="#e2e2e2" />
            <Text className="text-[12px] text-white/90">{stats}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function LandingScreen() {
  const [search, setSearch] = useState('');
  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: scholarships } = useScholarships();
  const { data: deadlines } = useDeadlines(1);
  const featuredScholarship = scholarships?.[0];
  const nextDeadline = deadlines?.[0];
  const { session } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <AppHeader
        variant="brand"
        right={
          session ? undefined : (
            <Link href="/(auth)/login" asChild>
              <Pressable className="rounded-lg bg-primary-container px-4 py-2">
                <Text className="text-[14px] font-semibold text-on-primary-container">Sign In</Text>
              </Pressable>
            </Link>
          )
        }
      />

      <ScrollView contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        <View className="items-center px-margin-mobile pb-8 pt-10">
          <Text className="mb-3 text-center text-[32px] font-bold leading-[38px] text-on-surface">
            Find the Right Study Abroad Opportunity
          </Text>
          <Text className="mb-6 text-center text-[16px] leading-[24px] text-on-surface-variant">
            Discover top universities, fully-funded scholarships, and track application deadlines
            across 25+ countries.
          </Text>

          <View className="mb-4 w-full flex-row items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-1">
            <MaterialIcons name="search" size={20} color="#859585" />
            <TextInput
              className="flex-1 py-3 text-[16px] text-on-surface"
              placeholder="Search countries, universities, programs..."
              placeholderTextColor="#859585"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-stack-sm pb-2">
            {FILTERS.map((f) => (
              <Pressable
                key={f}
                className="rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-1.5">
                <Text className="text-[12px] font-semibold text-on-surface-variant">{f}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View className="mt-8 w-full flex-row justify-around border-t border-outline-variant/50 pt-6">
            <View className="items-center">
              <Text className="text-[20px] font-bold text-primary">25+</Text>
              <Text className="text-[12px] text-on-surface-variant">Countries</Text>
            </View>
            <View className="items-center">
              <Text className="text-[20px] font-bold text-primary">1200+</Text>
              <Text className="text-[12px] text-on-surface-variant">Universities</Text>
            </View>
            <View className="items-center">
              <Text className="text-[20px] font-bold text-primary">800+</Text>
              <Text className="text-[12px] text-on-surface-variant">Scholarships</Text>
            </View>
          </View>
        </View>

        <View className="border-t border-outline-variant bg-surface-container-low px-margin-mobile py-8">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-[20px] font-bold text-on-surface">Popular Destinations</Text>
            <Pressable>
              <Text className="text-[12px] font-semibold text-primary">View All</Text>
            </Pressable>
          </View>
          {countriesLoading ? (
            <ActivityIndicator />
          ) : !countries || countries.length === 0 ? (
            <Text className="text-[14px] text-on-surface-variant">No destinations yet.</Text>
          ) : (
            <View className="gap-stack-sm">
              {countries[0] ? <CountryCard item={countries[0]} wide /> : null}
              {(countries[1] || countries[2]) ? (
                <View className="flex-row gap-stack-sm">
                  {countries[1] ? <CountryCard item={countries[1]} /> : null}
                  {countries[2] ? <CountryCard item={countries[2]} /> : null}
                </View>
              ) : null}
              {countries[3] ? <CountryCard item={countries[3]} wide /> : null}
            </View>
          )}
        </View>

        <View className="border-t border-outline-variant px-margin-mobile py-8">
          <View className="mb-4 flex-row items-center justify-between border-b border-outline-variant pb-3">
            <Text className="flex-row items-center text-[18px] font-semibold text-on-surface">
              Featured Scholarships
            </Text>
            <Link href="/(tabs)/scholarships" asChild>
              <Pressable>
                <Text className="text-[12px] font-semibold text-primary">See all</Text>
              </Pressable>
            </Link>
          </View>
          {featuredScholarship ? (
            <Pressable
              onPress={() => router.push('/(tabs)/scholarships')}
              className="mb-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
              <Text className="mb-2 self-start rounded bg-primary-container/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                {featuredScholarship.funding_type === 'full' ? 'Fully Funded' : 'Partial Funding'}
              </Text>
              <Text className="mb-1 text-[16px] font-semibold text-on-surface">
                {featuredScholarship.name}
              </Text>
              {featuredScholarship.coverage ? (
                <Text className="mb-3 text-[14px] text-on-surface-variant" numberOfLines={2}>
                  {featuredScholarship.coverage}
                </Text>
              ) : null}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name="location-on" size={16} color="#bacbb9" />
                  <Text className="text-[12px] text-on-surface-variant">
                    {featuredScholarship.country?.name ?? 'Multiple countries'}
                  </Text>
                </View>
                {featuredScholarship.deadline ? (
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="timer" size={16} color="#ffb4ab" />
                    <Text className="text-[12px] font-semibold text-error">
                      {new Date(featuredScholarship.deadline).toLocaleDateString()}
                    </Text>
                  </View>
                ) : null}
              </View>
            </Pressable>
          ) : (
            <Text className="mb-3 text-[14px] text-on-surface-variant">No scholarships yet.</Text>
          )}

          <Text className="mb-3 mt-2 text-[18px] font-semibold text-on-surface">Upcoming Deadlines</Text>
          {nextDeadline ? (
            <Pressable
              onPress={() => router.push('/(tabs)/deadlines')}
              className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
              <Text className="mb-1 text-[12px] font-bold text-error">
                {new Date(nextDeadline.deadline_date).toLocaleDateString()}
              </Text>
              <Text className="mb-1 text-[16px] font-semibold text-on-surface">{nextDeadline.title}</Text>
              {nextDeadline.program ? (
                <Text className="text-[14px] text-on-surface-variant">{nextDeadline.program.name}</Text>
              ) : null}
            </Pressable>
          ) : (
            <Text className="text-[14px] text-on-surface-variant">No upcoming deadlines yet.</Text>
          )}
        </View>

        <View className="border-t border-outline-variant bg-surface-container-low px-margin-mobile py-10">
          <Text className="mb-2 text-center text-[22px] font-bold text-on-surface">
            How StudyPath Works
          </Text>
          <Text className="mb-8 text-center text-[14px] text-on-surface-variant">
            Your journey from exploring options to landing on campus, simplified.
          </Text>
          <View className="flex-row flex-wrap justify-between gap-y-6">
            {STEPS.map((s, i) => (
              <View key={s.title} className="w-[47%] items-center">
                <View className="relative mb-3 h-14 w-14 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-lowest">
                  <MaterialIcons name={s.icon} size={26} color="#75ff9e" />
                  <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-primary-container">
                    <Text className="text-[10px] font-bold text-on-primary-container">{i + 1}</Text>
                  </View>
                </View>
                <Text className="mb-1 text-center text-[14px] font-semibold text-on-surface">
                  {s.title}
                </Text>
                <Text className="text-center text-[12px] text-on-surface-variant">{s.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="items-center gap-stack-md px-margin-mobile pt-8">
          <Link href="/(auth)/signup" asChild>
            <Pressable className="w-full items-center rounded-xl bg-primary py-3.5">
              <Text className="text-[16px] font-semibold text-on-primary">Get Started</Text>
            </Pressable>
          </Link>
          <Text className="text-[12px] text-on-surface-variant">
            © 2023 StudyPath. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

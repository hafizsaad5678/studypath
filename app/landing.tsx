import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Country = {
  id: string;
  name: string;
  image: string;
  stats: string;
  tagIcon: keyof typeof MaterialIcons.glyphMap;
};

const COUNTRIES: Country[] = [
  {
    id: 'italy',
    name: 'Italy',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuASqGRcxgex2QPOpJIIcxtaEXxiTInNxr-dAlyVvMBo5yMB3UDba3V9KjZtZO-kzPGB8d2dVWefaOvPIu-kJYAVJA7X-jfh-DSKfa9r9Adl6z4Tefpj_OO7S2JXhafPD_aVYbVNTsRJs29lffoJ0UlPso8xYPxC8wx08hSal8eCg2So_E9NRB8KVt_ykZJ-FlBhf8MCRGdfHEPlUgXeIJpcuONwQ-jlbwbBG3prVAebfkaT52JQp20LTA',
    stats: '200+ Unis • €0–3k Tuition',
    tagIcon: 'account-balance',
  },
  {
    id: 'germany',
    name: 'Germany',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDuB2LcMdps4B7DE1rDK-hsqpZzlfKcByOpdQytYFaDGTfnQmCy14MsyhPvBdJ_J5l7kI5TKK9geURLzvzWQmJNSyBRGK2TPQD2vp_vBX50ZUY5HxuyliaXuO0jO1VylFlPb8gJArzc8UDTj_p7eOX5FDSKSW2RzQm3jUmFwKjG5EcpkrZRsaISWlzvB3n3lfHA7WWnLME2gBoV6ajjvUO-PDad10VxaS0YCEMhlmZ8UwTWyeXVgIOloA',
    stats: '300+ Unis • €0 Tuition',
    tagIcon: 'money-off',
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuADg15JJjsXFdzR4m_t9FY-wsJNT-TPmc4LhCpU6V-DoSSGf-ezB38GUewE22eG4Ij4S7V4roUl6o6DmPDxvWd2kuczsgC2BoE6nIKRViZd59jF8eXlcf0JhNj72xDQJ48JKTeLVFiCRBMvvOFfaL-p8JAdxRNyB_BQImrudFxNWdU0mMBaZXEDkiIVQYzzgVu4t8eoivoFyXMUOLMhcqM1SZSroTExMDbJcOsihbSOP2gf44Cg6etDPQ',
    stats: 'Top Ranked',
    tagIcon: 'school',
  },
  {
    id: 'canada',
    name: 'Canada',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfTLis-yk5rLbcy-squ3ZPuQ5zMlBmKBqG3JBY8oVfECEIX8KBgjPhrJjvvqSB0kRaVdO0yhijr8Fwb53Gq1HHGDMJzEcmuqaP508WWsSzPlLc5nX44mbuh-dyRLy0Sz8ssSGRAtuNEzPz37O_XYdJbsYRTWuJUCxVVezlDOglI5QJJ4SU5o4ZAOQHC1ArejlaFSuhPK-vqXIyRUkIc0NwQY5nXsbN6FTh_IkGwN77-6LC7-xawItmBQ',
    stats: 'Post-Study Work Visa',
    tagIcon: 'work',
  },
];

const FILTERS = ["Bachelor's", "Master's", 'Scholarships', 'Low Tuition', 'Open Admissions'];

const STEPS: { icon: keyof typeof MaterialIcons.glyphMap; title: string; desc: string }[] = [
  { icon: 'travel-explore', title: 'Discover', desc: 'Search thousands of programs based on your academic profile and budget.' },
  { icon: 'fact-check', title: 'Compare', desc: 'Evaluate tuition, living costs, and admission requirements side-by-side.' },
  { icon: 'edit-document', title: 'Apply', desc: 'Track deadlines and organize your documents in one centralized dashboard.' },
  { icon: 'flight-takeoff', title: 'Enroll', desc: 'Secure your spot, arrange visas, and prepare for departure.' },
];

function CountryCard({ item, wide }: { item: Country; wide?: boolean }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/country/[slug]', params: { slug: item.id } })}
      className={`overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest ${
        wide ? 'w-full' : 'flex-1'
      }`}
      style={{ height: 160 }}>
      <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      <View className="absolute inset-0 bg-black/40" />
      <View className="absolute bottom-0 left-0 w-full p-4">
        <Text className="mb-1 text-[18px] font-bold text-white">{item.name}</Text>
        <View className="flex-row items-center gap-1">
          <MaterialIcons name={item.tagIcon} size={14} color="#e2e2e2" />
          <Text className="text-[12px] text-white/90">{item.stats}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function LandingScreen() {
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="h-16 w-full flex-row items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-margin-mobile">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="school" size={22} color="#75ff9e" />
          <Text className="text-[20px] font-bold text-primary">StudyPath</Text>
        </View>
        <Link href="/(auth)/login" asChild>
          <Pressable className="rounded-lg bg-primary-container px-4 py-2">
            <Text className="text-[14px] font-semibold text-on-primary-container">Sign In</Text>
          </Pressable>
        </Link>
      </View>

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
          <View className="gap-stack-sm">
            <CountryCard item={COUNTRIES[0]} wide />
            <View className="flex-row gap-stack-sm">
              <CountryCard item={COUNTRIES[1]} />
              <CountryCard item={COUNTRIES[2]} />
            </View>
            <CountryCard item={COUNTRIES[3]} wide />
          </View>
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
          <Pressable
            onPress={() => router.push('/(tabs)/scholarships')}
            className="mb-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
            <Text className="mb-2 self-start rounded bg-primary-container/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              Fully Funded
            </Text>
            <Text className="mb-1 text-[16px] font-semibold text-on-surface">DAAD Scholarship 2024</Text>
            <Text className="mb-3 text-[14px] text-on-surface-variant" numberOfLines={2}>
              Masters and PhD opportunities for international students in Germany across various
              disciplines.
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="location-on" size={16} color="#bacbb9" />
                <Text className="text-[12px] text-on-surface-variant">Germany</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="timer" size={16} color="#ffb4ab" />
                <Text className="text-[12px] font-semibold text-error">Ends in 14 days</Text>
              </View>
            </View>
          </Pressable>

          <Text className="mb-3 mt-2 text-[18px] font-semibold text-on-surface">Upcoming Deadlines</Text>
          <Pressable
            onPress={() => router.push('/(tabs)/deadlines')}
            className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
            <Text className="mb-1 text-[12px] font-bold text-error">Oct 15, 2023</Text>
            <Text className="mb-1 text-[16px] font-semibold text-on-surface">Oxford Winter Intake</Text>
            <Text className="text-[14px] text-on-surface-variant">MSc Computer Science</Text>
          </Pressable>
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

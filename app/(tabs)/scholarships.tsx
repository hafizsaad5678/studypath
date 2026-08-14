import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Scholarship = {
  id: string;
  name: string;
  country: string;
  level: string;
  image: string;
  featured?: boolean;
  deadline: string;
  deadlineUrgent?: boolean;
  timeLeft: string;
  stipend: string;
  coverage: string;
};

const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'daad',
    name: 'DAAD Scholarship',
    country: 'Germany',
    level: "Master's / PhD",
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCN3dIpRZtaV6tZ18Kb1H9n8GSe66TWzbiv2EDDZ8jOoJNob1qxprllT-hAB6GaEcScpJalaZAfAr0tgp9oIwWBI0B4kZncEqrumKv5FVG5-Up_6OGYjE-74wZyPmkShnlYVCd87wFiRp0AVy_tePQxms4F4WzMEHFHmY3hDMbeNZroVY3eKzKhQBzEOVCw2_bXPOmeuRzr9y6HgGgwJAjA6hdzraF8iiu_IRtiQ9ZMhs2HiLNKDAav5g',
    featured: true,
    deadline: 'Dec 15',
    deadlineUrgent: true,
    timeLeft: '2 weeks left',
    stipend: '€934 - €1,200/mo',
    coverage: 'Tuition, Travel, Health Insurance',
  },
  {
    id: 'eiffel',
    name: 'Eiffel Excellence Program',
    country: 'France',
    level: "Master's / PhD",
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAURTJUzcWbN-AcWkcn3KJwS0rI4FpxBKKjS-sdXqg2tfPDxbf0HwwpFN5SJJGJSIslynG_w3ppXPCUL47bU7pr7rHZOK0c3n5Z1pGt6FcDxJU22k6lKzg_qR_wUgZWZeotTGoLhlFPf43XAAr-xGKDIj0NTEKyzXqPAVMSrC1icZQ5GMcfZmt5afNC19N2uZyBU1MJHr-nVUMeWlP4GjKEysn2U4zxyg9neD-O-IILZ0Azm2IHF3VACw',
    deadline: 'Jan 10',
    timeLeft: '1 month left',
    stipend: '€1,181 - €1,700/mo',
    coverage: 'Living allowance, Travel, Housing aid',
  },
];

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

function ScholarshipCard({ item }: { item: Scholarship }) {
  return (
    <View className="mb-gutter overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
      <View className="h-32 w-full bg-surface-container-low">
        <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        {item.featured ? (
          <View className="absolute right-stack-sm top-stack-sm flex-row items-center gap-1 rounded bg-primary-container px-2 py-1">
            <MaterialIcons name="star" size={14} color="#00612e" />
            <Text className="text-[12px] font-semibold text-on-primary-container">Featured</Text>
          </View>
        ) : null}
      </View>
      <View className="p-stack-md">
        <View className="mb-1 flex-row items-start justify-between gap-2">
          <Text className="flex-1 text-[20px] font-semibold text-on-surface" numberOfLines={1}>
            {item.name}
          </Text>
          <View
            className={`flex-row items-center gap-1 rounded px-2 py-0.5 ${
              item.deadlineUrgent ? 'bg-error-container' : 'bg-surface-variant'
            }`}>
            <MaterialIcons
              name={item.deadlineUrgent ? 'schedule' : 'event'}
              size={14}
              color={item.deadlineUrgent ? '#ffdad6' : '#bacbb9'}
            />
            <Text
              className={`text-[12px] font-semibold ${
                item.deadlineUrgent ? 'text-on-error-container' : 'text-on-surface-variant'
              }`}>
              {item.deadline}
            </Text>
          </View>
        </View>
        <View className="mb-stack-md flex-row items-center gap-1">
          <MaterialIcons name="location-on" size={16} color="#bacbb9" />
          <Text className="text-[14px] text-on-surface-variant">
            {item.country} • {item.level}
          </Text>
        </View>
        <View className="mb-stack-md flex-row flex-wrap gap-stack-sm rounded-lg border border-surface-container-high bg-surface p-stack-sm">
          <View className="w-[45%]">
            <Text className="text-[12px] text-on-surface-variant">Funding</Text>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="verified" size={14} color="#75ff9e" />
              <Text className="text-[14px] font-semibold text-primary">Fully Funded</Text>
            </View>
          </View>
          <View className="w-[45%]">
            <Text className="text-[12px] text-on-surface-variant">Stipend</Text>
            <Text className="text-[14px] text-on-surface">{item.stipend}</Text>
          </View>
          <View className="w-full">
            <Text className="text-[12px] text-on-surface-variant">Coverage</Text>
            <Text className="text-[14px] text-on-surface">{item.coverage}</Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between border-t border-outline-variant pt-stack-sm">
          <Text className="text-[12px] text-on-surface-variant">{item.timeLeft}</Text>
          <Pressable
            onPress={() => router.push({ pathname: "/program/[id]", params: { id: item.id } })}
            className="rounded-lg bg-primary-container px-4 py-2">
            <Text className="text-[14px] font-semibold text-on-primary-container">View Details</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function ScholarshipsScreen() {
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
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
          <FilterPill icon="public" label="Country" value={COUNTRIES[0]} />
          <FilterPill icon="school" label="Degree" value={DEGREES[0]} />
        </View>

        <View className="mb-stack-lg flex-row items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="monetization-on" size={18} color="#e2e2e2" />
            <Text className="text-[14px] font-semibold text-on-surface">Fully Funded Only</Text>
          </View>
          <MaterialIcons name="check-box" size={22} color="#75ff9e" />
        </View>

        <View className="mb-stack-lg flex-row items-center justify-between">
          <Text className="text-[14px] font-semibold text-on-surface">Sort By</Text>
          <Pressable className="flex-row items-center gap-1">
            <Text className="text-[14px] font-semibold text-primary">Deadline (Upcoming)</Text>
            <MaterialIcons name="arrow-drop-down" size={18} color="#75ff9e" />
          </Pressable>
        </View>

        {SCHOLARSHIPS.map((s) => (
          <ScholarshipCard key={s.id} item={s} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

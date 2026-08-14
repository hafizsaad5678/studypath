import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ProgramCard = {
  id: string;
  matchesProfile: boolean;
  title: string;
  school: string;
  tuition: string;
  deadline: string;
  urgentDeadline: boolean;
  tags: { icon: keyof typeof MaterialIcons.glyphMap; label: string; scholarship?: boolean }[];
};

const programs: ProgramCard[] = [
  {
    id: '1',
    matchesProfile: true,
    title: 'MSc Data Science & Artificial Intelligence',
    school: 'Technical University of Munich • Germany',
    tuition: '€0 / yr',
    deadline: 'May 31, 2024',
    urgentDeadline: true,
    tags: [
      { icon: 'workspace-premium', label: 'Scholarship Available', scholarship: true },
      { icon: 'language', label: 'English Taught' },
    ],
  },
  {
    id: '2',
    matchesProfile: false,
    title: 'Master in Machine Learning',
    school: 'KTH Royal Institute of Technology • Sweden',
    tuition: '€14,500 / yr',
    deadline: 'Jan 15, 2024',
    urgentDeadline: false,
    tags: [
      { icon: 'language', label: 'English Taught' },
      { icon: 'schedule', label: '2 Years' },
    ],
  },
  {
    id: '3',
    matchesProfile: true,
    title: 'MSc Applied Data Analytics',
    school: 'University of Amsterdam • Netherlands',
    tuition: '€2,314 / yr',
    deadline: 'Apr 01, 2024',
    urgentDeadline: false,
    tags: [
      { icon: 'workspace-premium', label: 'Partial Funding', scholarship: true },
      { icon: 'schedule', label: '1 Year' },
    ],
  },
  {
    id: '4',
    matchesProfile: false,
    title: 'MSc Robotics & Autonomous Systems',
    school: 'ETH Zurich • Switzerland',
    tuition: '€1,460 / yr',
    deadline: 'Dec 15, 2024',
    urgentDeadline: false,
    tags: [
      { icon: 'language', label: 'English Taught' },
      { icon: 'schedule', label: '2 Years' },
    ],
  },
  {
    id: '5',
    matchesProfile: true,
    title: 'Master in International Business',
    school: 'Copenhagen Business School • Denmark',
    tuition: '€16,000 / yr',
    deadline: 'Mar 01, 2024',
    urgentDeadline: false,
    tags: [
      { icon: 'workspace-premium', label: 'Scholarship Available', scholarship: true },
      { icon: 'language', label: 'English Taught' },
    ],
  },
  {
    id: '6',
    matchesProfile: false,
    title: 'MSc Renewable Energy Engineering',
    school: 'University of Edinburgh • UK',
    tuition: '£24,500 / yr',
    deadline: 'Jun 30, 2024',
    urgentDeadline: false,
    tags: [
      { icon: 'language', label: 'English Taught' },
      { icon: 'schedule', label: '1 Year' },
    ],
  },
];

const filterChips = ['Country', 'Degree', 'Field', 'Tuition'];

function ProgramCardView({ item }: { item: ProgramCard }) {
  return (
    <Pressable className="relative flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
      {item.matchesProfile && (
        <View className="absolute right-0 top-0 flex-row items-center gap-1 rounded-bl-lg bg-secondary-container px-3 py-1">
          <MaterialIcons name="bolt" size={12} color="#b4b5b5" />
          <Text className="text-[10px] font-bold uppercase tracking-wider text-on-secondary-container">
            Matches Profile
          </Text>
        </View>
      )}
      <View className="mb-4 flex-row items-start gap-4 pr-4">
        <View className="h-16 w-16 items-center justify-center rounded-lg border border-outline-variant bg-surface-container">
          <MaterialIcons name="account-balance" size={28} color="#bacbb9" />
        </View>
        <View className="flex-1">
          <Text className="text-[18px] font-semibold text-on-surface">{item.title}</Text>
          <Text className="mt-1 text-[14px] text-on-surface-variant">{item.school}</Text>
        </View>
      </View>
      <View className="mb-4 flex-row justify-between border-t border-outline-variant pt-4">
        <View>
          <Text className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
            Tuition
          </Text>
          <Text className="text-[16px] font-medium text-on-surface">{item.tuition}</Text>
        </View>
        <View>
          <Text className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
            Deadline
          </Text>
          <Text
            className={`text-[16px] font-medium ${item.urgentDeadline ? 'text-error' : 'text-on-surface'}`}>
            {item.deadline}
          </Text>
        </View>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {item.tags.map((tag) => (
          <View
            key={tag.label}
            className={`flex-row items-center gap-1 rounded-md px-2 py-1 ${
              tag.scholarship ? 'bg-tertiary-container/10' : 'bg-surface-container'
            }`}>
            <MaterialIcons
              name={tag.icon}
              size={14}
              color={tag.scholarship ? '#cac8ca' : '#bacbb9'}
            />
            <Text
              className={`text-[12px] font-medium ${tag.scholarship ? 'text-tertiary-container' : 'text-on-surface-variant'}`}>
              {tag.label}
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

export default function ExploreScreen() {
  const [search, setSearch] = useState('');

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
          <Text className="text-[20px] font-semibold text-on-surface">240 Programs Found</Text>
        </View>

        <View className="gap-4">
          {programs.map((p) => (
            <ProgramCardView key={p.id} item={p} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

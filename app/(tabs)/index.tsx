import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Deadline = {
  id: string;
  title: string;
  description: string;
  daysLeft: string;
  cta: string;
  urgent: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const deadlines: Deadline[] = [
  {
    id: '1',
    title: 'Sapienza University (MSc AI)',
    description: 'Final application submission deadline.',
    daysLeft: '5 days left',
    cta: 'Complete Application',
    urgent: true,
    icon: 'warning',
  },
  {
    id: '2',
    title: 'Technical University of Munich',
    description: 'Document upload and language proficiency proof.',
    daysLeft: '20 days left',
    cta: 'Upload Documents',
    urgent: false,
    icon: 'schedule',
  },
];

type QuickAction = {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const quickActions: QuickAction[] = [
  { id: '1', label: 'Find Programs', icon: 'search' },
  { id: '2', label: 'Scholarships', icon: 'payments' },
  { id: '3', label: 'Deadlines', icon: 'event' },
  { id: '4', label: 'Get Advice', icon: 'person-add' },
];

type Recommendation = {
  id: string;
  title: string;
  school: string;
  match: string;
  image: string;
  tagIcon: keyof typeof MaterialIcons.glyphMap;
  tagLabel: string;
};

const recommendations: Recommendation[] = [
  {
    id: '1',
    title: 'MSc Computer Science',
    school: 'ETH Zurich • Switzerland',
    match: '92% Match',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAvyJ2zs4_LaY1C2ESofRF3kEe3BermygkqH27wXA8iXYZpqkXFplTFpO4Gz1P2Z4L5LsVwx_PCI6ETSjX4nwdXzP99I4Jw-qh2gkTkWnpR3Iv1LuIC5LC3xS3LHqLTe02rU8v2zkr_UC98ZbuFrKJfdHEMa13mVJ5h8XyS7UjQRHLQeeZR3EjeY_l8OYfrLko8WM0QOsHJBDErG3GhOptCeYSGdUbTjZtKao8bsCC8F1bNZIoCwDhWbQ',
    tagIcon: 'payments',
    tagLabel: 'Funding Available',
  },
  {
    id: '2',
    title: 'Master in Data Science',
    school: 'Imperial College London • UK',
    match: '88% Match',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAjjcXuEtvrM6kAry1z9bhx8zD6Rl8uqq6e1jIz-JW3FOR2Dk2IE8_mVMqtnwKFZO0UCbKXNNiLdbUBAA4UvtZLVhm3GCP6HWlic2v9LwdIqO5DaORDXQdqVPE1UBlBo40uram5GusPopfCK7pkndpplR607HYcI9Swz2Eh4pcZqnnSaRp3ZH0fJDX7i-oxc3V5oQi2FyvmfRzyPk6HKU0MeWW5G8waDsPyQAgaEYTl_YmZ8kVUBXGaPg',
    tagIcon: 'language',
    tagLabel: 'IELTS req.',
  },
  {
    id: '3',
    title: 'MSc Artificial Intelligence',
    school: 'University of Amsterdam • NL',
    match: '85% Match',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDW6EGPQlPBo2zLzpCTPa3slApKUpRQ2oP73uW5PfqaqnuJOJGNIVBKRzzQusasp_KKQeaX6ZoE8UvDxRNyjK5Jcbr-VPwp68WTuAZUj7_BmUi-tBSY9uYIDgVtilDvlOCE9tpXsqco1cH9-fYuRuzK331ELiSvib1pREpGSP6UZ1Nv7I3UgMJBd7R72ATCK5uYD2Erbp8KMi_3788W_XRhoVhgyQWdizP7ZC4mGAzdqNkSumrRmB819g',
    tagIcon: 'groups',
    tagLabel: 'High acceptance',
  },
];

function DeadlineItem({ item }: { item: Deadline }) {
  const bg = item.urgent ? 'bg-error-container' : 'bg-[#2a2410]';
  const iconColor = item.urgent ? '#ffb4ab' : '#f5c518';
  const badgeBg = item.urgent ? 'bg-[#ffb4ab1a]' : 'bg-[#f5c5181a]';
  const textColor = item.urgent ? 'text-error' : 'text-[#f5c518]';

  return (
    <View className={`flex-row items-start gap-4 rounded-lg p-4 ${bg}`}>
      <MaterialIcons name={item.icon} size={22} color={iconColor} style={{ marginTop: 2 }} />
      <View className="flex-1">
        <View className="mb-1 flex-row items-start justify-between gap-2">
          <Text className="flex-1 text-[14px] font-bold text-on-surface">{item.title}</Text>
          <Text className={`rounded px-2 py-1 text-[12px] font-bold ${badgeBg} ${textColor}`}>
            {item.daysLeft}
          </Text>
        </View>
        <Text className="mb-2 text-[14px] text-on-surface-variant">{item.description}</Text>
        <Pressable className="flex-row items-center gap-1">
          <Text className={`text-[12px] font-semibold ${textColor}`}>{item.cta}</Text>
          <MaterialIcons name="chevron-right" size={14} color={iconColor} />
        </Pressable>
      </View>
    </View>
  );
}

function QuickActionButton({ item }: { item: QuickAction }) {
  return (
    <Pressable className="w-[47%] items-center justify-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-secondary-container">
        <MaterialIcons name={item.icon} size={22} color="#75ff9e" />
      </View>
      <Text className="text-center text-[14px] font-semibold text-on-surface">{item.label}</Text>
    </Pressable>
  );
}

function RecommendationCard({ item }: { item: Recommendation }) {
  return (
    <Pressable className="w-full overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
      <View className="h-32 w-full">
        <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        <View className="absolute right-2 top-2 rounded bg-surface-container-lowest px-2 py-1">
          <Text className="text-[12px] font-bold text-primary">{item.match}</Text>
        </View>
      </View>
      <View className="p-4">
        <Text className="mb-1 text-[14px] font-bold text-on-surface">{item.title}</Text>
        <Text className="mb-4 text-[14px] text-on-surface-variant">{item.school}</Text>
        <View className="flex-row items-center justify-between border-t border-outline-variant pt-3">
          <View className="flex-row items-center gap-1">
            <MaterialIcons name={item.tagIcon} size={16} color="#bacbb9" />
            <Text className="text-[12px] text-on-surface-variant">{item.tagLabel}</Text>
          </View>
          <Pressable className="rounded-full p-2">
            <MaterialIcons name="bookmark-border" size={20} color="#75ff9e" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
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

      <ScrollView contentContainerClassName="px-margin-mobile pb-8 pt-6" showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="mb-2 text-[28px] font-bold text-on-surface">Good afternoon, Ahmed 👋</Text>
          <Text className="text-[16px] text-on-surface-variant">
            Here is a summary of your academic journey.
          </Text>
        </View>

        <View className="mb-6 rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-[20px] font-semibold text-on-surface">Profile Setup</Text>
            <Text className="text-[14px] font-bold text-primary">75% complete</Text>
          </View>
          <Text className="mb-6 text-[14px] text-on-surface-variant">
            Complete your profile to unlock personalized university recommendations and higher
            scholarship matches.
          </Text>
          <View className="mb-4 h-2 w-full rounded-full bg-surface-container-high">
            <View className="h-2 rounded-full bg-primary" style={{ width: '75%' }} />
          </View>
          <Pressable className="w-full flex-row items-center justify-center gap-2 rounded-lg bg-primary-container px-4 py-3">
            <Text className="text-[14px] font-semibold text-on-primary-container">Complete Profile</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#00612e" />
          </Pressable>
        </View>

        <View className="mb-6 rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-[20px] font-semibold text-on-surface">Upcoming Deadlines</Text>
            <Pressable>
              <Text className="text-[12px] font-semibold text-primary">View All</Text>
            </Pressable>
          </View>
          <View className="gap-4">
            {deadlines.map((d) => (
              <DeadlineItem key={d.id} item={d} />
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="mb-4 text-[20px] font-semibold text-on-surface">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {quickActions.map((a) => (
              <QuickActionButton key={a.id} item={a} />
            ))}
          </View>
        </View>

        <View>
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-[20px] font-semibold text-on-surface">Recommended for You</Text>
            <Pressable>
              <Text className="text-[12px] font-semibold text-primary">Explore All</Text>
            </Pressable>
          </View>
          <View className="gap-4">
            {recommendations.map((r) => (
              <RecommendationCard key={r.id} item={r} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

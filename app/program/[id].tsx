import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FACTS = [
  { icon: 'schedule' as const, label: 'Duration', value: '2 Years' },
  { icon: 'payments' as const, label: 'Tuition', value: '€3,800 / year' },
  { icon: 'calendar-month' as const, label: 'Intake', value: 'September' },
];

const ELIGIBILITY = [
  { title: "Bachelor's Degree", desc: 'In Computer Science, Engineering, or related field.' },
  { title: 'Minimum CGPA', desc: '3.0+ or equivalent (70%+).' },
  { title: 'English Proficiency', desc: 'IELTS 6.0 / TOEFL 78.' },
];

const DOCUMENTS = [
  { label: 'Statement of Purpose (SOP)', icon: 'article' as const },
  { label: 'Curriculum Vitae (CV)', icon: 'person' as const },
  { label: 'Academic Transcripts', icon: 'school' as const },
  { label: 'Language Certificate', icon: 'language' as const },
  { label: '2 Recommendation Letters', icon: 'mark-email-read' as const },
];

export default function ProgramDetailScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center border-b border-outline-variant bg-surface-container-lowest px-margin-mobile py-3">
        <Pressable onPress={() => router.back()} hitSlop={8} className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
          <MaterialIcons name="arrow-back" size={20} color="#e2e2e2" />
        </Pressable>
        <Text className="text-[18px] font-bold text-primary">StudyPath</Text>
      </View>

      <ScrollView contentContainerClassName="px-margin-mobile pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <View className="mb-2 flex-row flex-wrap items-center gap-2">
          <View className="rounded bg-secondary-container px-2 py-1">
            <Text className="text-[12px] font-semibold text-on-secondary-container">Master's</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="location-on" size={16} color="#bacbb9" />
            <Text className="text-[14px] text-on-surface-variant">Milan, Italy</Text>
          </View>
        </View>
        <Text className="mb-1 text-[26px] font-bold text-on-surface">MSc Computer Science</Text>
        <Text className="mb-stack-md text-[18px] font-semibold text-primary">
          Politecnico di Milano (Polimi)
        </Text>

        <Pressable
          onPress={() => Linking.openURL('https://www.polimi.it')}
          className="mb-stack-lg flex-row items-center justify-center gap-2 rounded-lg bg-primary-container px-5 py-3">
          <Text className="text-[14px] font-semibold text-on-primary-container">Visit Official Application</Text>
          <MaterialIcons name="open-in-new" size={18} color="#00612e" />
        </Pressable>

        {/* Key Facts */}
        <View className="mb-stack-md rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
          <Text className="mb-stack-md text-[18px] font-semibold text-on-surface">Program at a Glance</Text>
          <View className="flex-row flex-wrap gap-stack-md">
            {FACTS.map((f) => (
              <View key={f.label} className="w-[45%] gap-1">
                <MaterialIcons name={f.icon} size={22} color="#859585" />
                <Text className="text-[11px] uppercase text-on-surface-variant">{f.label}</Text>
                <Text className="text-[16px] font-semibold text-on-surface">{f.value}</Text>
              </View>
            ))}
            <View className="w-[45%] gap-1 rounded-lg border border-error-container bg-error-container/30 p-2">
              <MaterialIcons name="alarm" size={22} color="#ffb4ab" />
              <Text className="text-[11px] uppercase text-on-surface-variant">Deadline</Text>
              <Text className="text-[16px] font-semibold text-error">Jan 15, 2024</Text>
            </View>
          </View>
        </View>

        {/* Overview */}
        <View className="mb-stack-md rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
          <View className="mb-stack-sm flex-row items-center gap-2">
            <MaterialIcons name="info" size={20} color="#75ff9e" />
            <Text className="text-[18px] font-semibold text-on-surface">Overview</Text>
          </View>
          <Text className="mb-stack-md text-[14px] leading-6 text-on-surface-variant">
            The Master of Science in Computer Science at Politecnico di Milano aims to train highly qualified
            professionals who can manage the complexity of modern IT systems. The program provides a solid
            methodological background along with deep technical knowledge in areas like Artificial Intelligence,
            Data Science, and Cybersecurity.
          </Text>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMRPpL3Fbt3KWAovjZZRqwYCAPi5YKWKfTlB2CblJCZshyVbRUskFpHRr6aFn5FfQ1GfdQy5zFRUUiTrZh5y_Z-a4RtHGpJrj5yEhL4oVdOm1Ra6ahiOeax-9WnatqrKszl9sAfrLh1vSOyIsPKTPDD2aapIl7TSAIalE9OhnaS058H6H0w0n3DnmzYe-ytQGyotMWgrpPQD2cIg8CtLOwWPOj0e6MbQ62q82MkTgvSoh9bg__Jx874Q',
            }}
            style={{ width: '100%', height: 180, borderRadius: 12 }}
            contentFit="cover"
          />
        </View>

        {/* Tuition & Funding */}
        <View className="mb-stack-md rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
          <View className="mb-stack-sm flex-row items-center gap-2">
            <MaterialIcons name="account-balance" size={20} color="#75ff9e" />
            <Text className="text-[18px] font-semibold text-on-surface">Tuition & Funding</Text>
          </View>
          <Text className="mb-stack-md text-[14px] text-on-surface-variant">
            Base tuition is approximately €3,800 per year for non-EU students. However, Polimi offers several
            merit-based scholarships (Platinum, Gold, Silver) that can significantly reduce or waive these fees,
            alongside regional DSU grants based on financial need.
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="flex-row items-center gap-1 rounded-full bg-tertiary-container/10 px-3 py-1">
              <MaterialIcons name="workspace-premium" size={14} color="#cac8ca" />
              <Text className="text-[12px] font-semibold text-tertiary-container">Merit Scholarships Available</Text>
            </View>
            <View className="flex-row items-center gap-1 rounded-full bg-surface-variant px-3 py-1">
              <MaterialIcons name="euro-symbol" size={14} color="#bacbb9" />
              <Text className="text-[12px] font-semibold text-on-surface-variant">DSU Grants Applicable</Text>
            </View>
          </View>
        </View>

        {/* Eligibility */}
        <View className="mb-stack-md rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
          <View className="mb-stack-sm flex-row items-center gap-2">
            <MaterialIcons name="verified-user" size={20} color="#75ff9e" />
            <Text className="text-[18px] font-semibold text-on-surface">Eligibility</Text>
          </View>
          <View className="gap-stack-sm">
            {ELIGIBILITY.map((e) => (
              <View key={e.title} className="flex-row items-start gap-2">
                <MaterialIcons name="check-circle" size={20} color="#cac8ca" style={{ marginTop: 2 }} />
                <View className="flex-1">
                  <Text className="text-[14px] font-semibold text-on-surface">{e.title}</Text>
                  <Text className="text-[14px] text-on-surface-variant">{e.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Documents */}
        <View className="mb-stack-md rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
          <View className="mb-stack-sm flex-row items-center gap-2">
            <MaterialIcons name="folder-open" size={20} color="#75ff9e" />
            <Text className="text-[18px] font-semibold text-on-surface">Documents Needed</Text>
          </View>
          <View className="gap-2">
            {DOCUMENTS.map((d) => (
              <View
                key={d.label}
                className="flex-row items-center justify-between rounded bg-surface border border-outline-variant/50 p-2">
                <Text className="text-[14px] text-on-surface">{d.label}</Text>
                <MaterialIcons name={d.icon} size={18} color="#859585" />
              </View>
            ))}
          </View>
        </View>

        <View className="mt-stack-md items-center border-t border-outline-variant pt-stack-md">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="gpp-maybe" size={16} color="#859585" />
            <Text className="text-center text-[12px] text-outline">
              Information is curated for guidance. Always verify on the official portal.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

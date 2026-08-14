import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STATS = [
  {
    icon: 'payments' as const,
    bg: 'bg-secondary-container',
    iconColor: '#b4b5b5',
    label: 'Avg. Tuition',
    value: '€0 - 3k',
    unit: '/ year',
    desc: 'Highly subsidized public universities',
  },
  {
    icon: 'home' as const,
    bg: 'bg-tertiary-container',
    iconColor: '#545356',
    label: 'Living Cost',
    value: '€700 - 1.2k',
    unit: '/ mo',
    desc: 'Varies by city (Milan vs. South)',
  },
  {
    icon: 'account-balance' as const,
    bg: 'bg-primary-container',
    iconColor: '#00612e',
    label: 'Universities',
    value: '90+',
    unit: '',
    desc: 'Recognized higher education institutions',
  },
];

const UNIVERSITIES = [
  {
    id: '1',
    name: 'Politecnico di Milano',
    location: 'Milan, Lombardy',
    tags: ['Engineering', 'Architecture'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCypJzFHB72KyZW6uP-4qATpZI_zhiGsHf_5Xw8IPO8DPr3gGv8U9YM0QSgDgFeYASPQuKGCIjMQQLA8aE2-Nt2YNJb3DIRszjDeA-JkZxujIMmLfaM-LCyUrnXa0_2QXePxMqsEd6U-w6no89nPCIl6EQXFhg99ffnfDrd2vGTl_kbhGxJCTZJxveyRo37qIxjGFhaq2eSPrxTtbJCEAXOXHpbmFfVz7kEJDXwNJEIaqjjQgLp1FvHOQ',
  },
  {
    id: '2',
    name: 'University of Bologna',
    location: 'Bologna, Emilia-Romagna',
    tags: ['Humanities', 'Law'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC65rCxBMFcHmkHAE2m2G5TF5u6GjVT-1ESY8ZP4OjrsVvMUGJ9O2aDGFF45XNRzKCIDVCGZEaG2oeREXP7YYUIsfMsbq8R077dL6ayOK6ONTieJu7S5QPDzWI9aJM9icDtWPUhUjAG3oTVBpVcPlUBd8y9UmgkJ-I4eIwDzzId3C9wCpoJ5q6Ma-73ZyBZnw83YTEgbtWX17UL5P4zubwg27MI5qQUyRg7VJxbD4kR6S2JG9ygsbg3wA',
  },
];

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

export default function CountryDetailScreen() {
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
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVFIUzlsRNhL7VYpgTCCM1FemUgGiPEn3GAFX7i7VC-469LbuMAGiOcBiM2I7zTptQBEIWGN92G6iyFOVGeNN-Vu3rS8oy7nJo_rAoG8kfgbfOLrBUlj9PWOqueicfcokz8KLiuwgWx2afRpVAp7mGr51KFtWjwZIjK-giX2JrQ6BtvwzJO5e9wGMhJUqas16cMZ9_kmbEO9viNVpSYjKOjgxepEtSqqcVKFImD4cpjM1o5oW4N0cMqQ',
            }}
            style={{ width: '100%', height: '100%', opacity: 0.6 }}
            contentFit="cover"
          />
          <View className="absolute bottom-0 left-0 right-0 flex-row items-end justify-between px-margin-mobile py-stack-md">
            <View className="flex-1 flex-row items-center gap-3">
              <View className="h-16 w-16 items-center justify-center overflow-hidden rounded-xl border-2 border-surface-container-lowest bg-surface-container-lowest">
                <Text className="text-[28px]">🇮🇹</Text>
              </View>
              <View>
                <Text className="text-[26px] font-bold text-on-surface">Study in Italy</Text>
                <View className="mt-1 flex-row items-center gap-1">
                  <MaterialIcons name="location-on" size={14} color="#bacbb9" />
                  <Text className="text-[14px] text-on-surface-variant">Southern Europe</Text>
                </View>
              </View>
            </View>
            <Pressable className="flex-row items-center gap-1 rounded-lg bg-primary-container px-4 py-2">
              <MaterialIcons name="bookmark" size={16} color="#00612e" />
              <Text className="text-[13px] font-semibold text-on-primary-container">Save</Text>
            </Pressable>
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
            {UNIVERSITIES.map((u) => (
              <Pressable
                key={u.id}
                onPress={() => router.push({ pathname: "/university/[id]", params: { id: u.id } })}
                className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
                <View className="h-40 w-full">
                  <Image source={{ uri: u.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
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
                    <Text className="text-[14px] text-on-surface-variant">{u.location}</Text>
                  </View>
                  <View className="flex-row flex-wrap gap-2">
                    {u.tags.map((tag) => (
                      <View key={tag} className="rounded-md border border-outline-variant px-2 py-1">
                        <Text className="text-[10px] text-on-surface-variant">{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </Pressable>
            ))}
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
            <Pressable
              onPress={() => Linking.openURL('https://www.miur.gov.it')}
              className="flex-row items-center gap-1">
              <Text className="text-[14px] font-semibold text-primary">Official Ministry of Education Site</Text>
              <MaterialIcons name="open-in-new" size={14} color="#75ff9e" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const QUICK_FACTS = [
  { icon: 'location-on' as const, label: 'Location', value: 'Milan, Italy' },
  { icon: 'history' as const, label: 'Established', value: '1863' },
  { icon: 'account-balance' as const, label: 'Institution Type', value: 'Public' },
];

const PROGRAMS = [
  {
    id: '1',
    level: 'MSc',
    name: 'Computer Science and Engineering',
    duration: '2 Years',
    tuition: '€3,900 / year',
    deadline: 'Nov 15, 2026 (Non-EU)',
  },
  {
    id: '2',
    level: 'MSc',
    name: 'Architecture - Building Architecture',
    duration: '2 Years',
    tuition: '€3,900 / year',
    deadline: 'Nov 15, 2026 (Non-EU)',
  },
];

export default function UniversityDetailScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center border-b border-outline-variant bg-surface-container-lowest px-margin-mobile py-3">
        <Pressable onPress={() => router.back()} hitSlop={8} className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
          <MaterialIcons name="arrow-back" size={20} color="#e2e2e2" />
        </Pressable>
        <Text className="text-[18px] font-bold text-primary">StudyPath</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="h-56 w-full bg-surface-variant">
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-oYOoFbmgZgNMSGdQD8kQDBaHQYR800RssxpL6B5r9dfLce9zJZhIB-aM6R_FD72ceufJwqvZRPBFCWgb5g6wLnpY9-M3IV8lgXp9Enx-UGgyOjD_Ykvk4AfZrhsbWY_b9_h7aljNzOUFXxwWH5aMdx0BdLLjS_l9sGhHz51ilm6iRT_RvkQPKvK_yBj2lgUPo1YPAV_rg36PVfRvZ0i3kXCZNyZTTIE-NhcQUDvoOgzruAeBeleUJA',
            }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          <View className="absolute bottom-0 left-0 right-0 flex-row items-end justify-between bg-on-background/40 px-margin-mobile py-stack-md">
            <View className="flex-1">
              <Text className="text-[24px] font-bold text-surface-container-lowest">Politecnico di Milano</Text>
              <Text className="mt-1 text-[14px] text-surface-container-low">Public University</Text>
            </View>
            <Pressable className="flex-row items-center gap-1 rounded-lg border border-surface-container-lowest/30 bg-surface-container-lowest/20 px-3 py-2">
              <MaterialIcons name="bookmark-add" size={18} color="#ffffff" />
              <Text className="text-[12px] font-semibold text-surface-container-lowest">Save</Text>
            </Pressable>
          </View>
        </View>

        <View className="px-margin-mobile pb-8 pt-stack-lg">
          {/* Quick Facts */}
          <View className="mb-stack-lg rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
            <Text className="mb-stack-md text-[18px] font-semibold text-on-surface">Quick Facts</Text>
            <View className="gap-stack-sm">
              {QUICK_FACTS.map((f, i) => (
                <View
                  key={f.label}
                  className={`flex-row items-center gap-3 py-2 ${
                    i < QUICK_FACTS.length - 1 ? 'border-b border-surface-variant' : ''
                  }`}>
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <MaterialIcons name={f.icon} size={18} color="#75ff9e" />
                  </View>
                  <View>
                    <Text className="text-[12px] text-on-surface-variant">{f.label}</Text>
                    <Text className="text-[16px] font-medium text-on-surface">{f.value}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View className="mt-stack-md gap-2 border-t border-surface-variant pt-stack-sm">
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="verified" size={14} color="#859585" />
                <Text className="text-[12px] text-on-surface-variant">Last verified: 14 Aug 2026</Text>
              </View>
              <Pressable className="w-full flex-row items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-variant px-4 py-2">
                <MaterialIcons name="language" size={18} color="#e2e2e2" />
                <Text className="text-[14px] font-semibold text-on-surface">Official Website</Text>
              </Pressable>
            </View>
          </View>

          {/* Programs */}
          <View className="mb-stack-md flex-row items-center justify-between">
            <Text className="text-[22px] font-semibold text-on-surface">Available Programs</Text>
            <Pressable className="rounded-full bg-primary/10 px-3 py-1.5">
              <Text className="text-[14px] font-semibold text-primary">Master's</Text>
            </Pressable>
          </View>
          {PROGRAMS.map((p) => (
            <View key={p.id} className="mb-stack-md rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
              <View className="mb-stack-sm flex-row items-start justify-between">
                <View className="flex-1">
                  <View className="mb-2 self-start rounded-full bg-primary/10 px-2 py-0.5">
                    <Text className="text-[12px] font-semibold text-primary">{p.level}</Text>
                  </View>
                  <Text className="text-[18px] font-semibold text-on-surface">{p.name}</Text>
                </View>
                <MaterialIcons name="favorite-border" size={20} color="#bacbb9" />
              </View>
              <View className="my-stack-md flex-row flex-wrap gap-y-4">
                <View className="w-1/2">
                  <Text className="text-[12px] text-on-surface-variant">Duration</Text>
                  <Text className="text-[16px] font-medium text-on-surface">{p.duration}</Text>
                </View>
                <View className="w-1/2">
                  <Text className="text-[12px] text-on-surface-variant">Tuition (Approx)</Text>
                  <Text className="text-[16px] font-medium text-on-surface">{p.tuition}</Text>
                </View>
                <View className="w-full">
                  <Text className="text-[12px] text-on-surface-variant">Next Deadline</Text>
                  <View className="mt-1 flex-row items-center gap-2">
                    <View className="h-2 w-2 rounded-full bg-error" />
                    <Text className="text-[16px] font-medium text-on-surface">{p.deadline}</Text>
                  </View>
                </View>
              </View>
              <Pressable
                onPress={() => router.push({ pathname: "/program/[id]", params: { id: p.id } })}
                className="flex-row items-center justify-center gap-2 rounded-lg border-t border-surface-variant bg-primary-container py-2.5 pt-stack-sm">
                <Text className="text-[14px] font-semibold text-on-primary">View Program Details</Text>
                <MaterialIcons name="arrow-forward" size={18} color="#003918" />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

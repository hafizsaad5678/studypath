import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/layout/app-header';
import { useSavedItems } from '@/hooks/useSavedItems';
import { useProgram } from '@/hooks/usePrograms';

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: program, isLoading, isError } = useProgram(id ?? '');
  const { isSaved, toggle } = useSavedItems();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <AppHeader variant="detail" title="Loading Program..." />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#75ff9e" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !program) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <AppHeader variant="detail" title="Program Details" />
        <View className="flex-1 items-center justify-center px-margin-mobile">
          <Text className="text-center text-[16px] text-on-surface-variant">Program not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const university = program.university;
  const country = university?.country;

  const FACTS = [
    { icon: 'schedule' as const, label: 'Duration', value: program.duration_months ? `${program.duration_months} months` : 'N/A' },
    {
      icon: 'payments' as const,
      label: 'Tuition',
      value:
        program.tuition_amount != null
          ? `${program.tuition_currency ?? ''} ${program.tuition_amount} / year`
          : 'N/A',
    },
    { icon: 'calendar-month' as const, label: 'Language', value: program.language ?? 'N/A' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <AppHeader
        variant="detail"
        title={program.name}
        right={
          <Pressable onPress={() => toggle('program', program.id)} hitSlop={8}>
            <MaterialIcons
              name={isSaved('program', program.id) ? 'bookmark' : 'bookmark-border'}
              size={22}
              color="#bacbb9"
            />
          </Pressable>
        }
      />

      <ScrollView contentContainerClassName="px-margin-mobile pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <View className="mb-2 flex-row flex-wrap items-center gap-2">
          <View className="rounded bg-secondary-container px-2 py-1">
            <Text className="text-[12px] font-semibold text-on-secondary-container">{program.degree_level}</Text>
          </View>
          {university?.city || country?.name ? (
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="location-on" size={16} color="#bacbb9" />
              <Text className="text-[14px] text-on-surface-variant">
                {[university?.city, country?.name].filter(Boolean).join(', ')}
              </Text>
            </View>
          ) : null}
        </View>
        <Text className="mb-1 text-[26px] font-bold text-on-surface">{program.name}</Text>
        <Text className="mb-stack-md text-[18px] font-semibold text-primary">{university?.name ?? ''}</Text>

        {university?.website_url ? (
          <Pressable
            onPress={() => Linking.openURL(university.website_url!)}
            className="mb-stack-lg flex-row items-center justify-center gap-2 rounded-lg bg-primary-container px-5 py-3">
            <Text className="text-[14px] font-semibold text-on-primary-container">Visit Official Application</Text>
            <MaterialIcons name="open-in-new" size={18} color="#00612e" />
          </Pressable>
        ) : null}

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
              <Text className="text-[16px] font-semibold text-error">
                {program.application_deadline ?? 'TBA'}
              </Text>
            </View>
          </View>
        </View>

        {/* Overview */}
        {program.description ? (
          <View className="mb-stack-md rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
            <View className="mb-stack-sm flex-row items-center gap-2">
              <MaterialIcons name="info" size={20} color="#75ff9e" />
              <Text className="text-[18px] font-semibold text-on-surface">Overview</Text>
            </View>
            <Text className="text-[14px] leading-6 text-on-surface-variant">{program.description}</Text>
          </View>
        ) : null}

        {/* Tuition & Funding */}
        <View className="mb-stack-md rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
          <View className="mb-stack-sm flex-row items-center gap-2">
            <MaterialIcons name="account-balance" size={20} color="#75ff9e" />
            <Text className="text-[18px] font-semibold text-on-surface">Tuition & Funding</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {program.scholarship_available ? (
              <View className="flex-row items-center gap-1 rounded-full bg-tertiary-container/10 px-3 py-1">
                <MaterialIcons name="workspace-premium" size={14} color="#cac8ca" />
                <Text className="text-[12px] font-semibold text-tertiary-container">Scholarship Available</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Eligibility / requirements */}
        {program.requirements ? (
          <View className="mb-stack-md rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
            <View className="mb-stack-sm flex-row items-center gap-2">
              <MaterialIcons name="verified-user" size={20} color="#75ff9e" />
              <Text className="text-[18px] font-semibold text-on-surface">Eligibility</Text>
            </View>
            <Text className="text-[14px] text-on-surface-variant">{program.requirements}</Text>
          </View>
        ) : null}

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

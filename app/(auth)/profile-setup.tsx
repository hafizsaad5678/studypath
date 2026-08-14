import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/auth-button';
import { useAuth } from '@/hooks/useAuth';
import { updateProfile } from '@/services/auth';

type EducationLevel = {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const EDUCATION_LEVELS: EducationLevel[] = [
  { id: '10th', title: '10th Grade', subtitle: 'High School', icon: 'menu-book' },
  { id: '12th', title: '12th Grade', subtitle: 'Higher Secondary', icon: 'military-tech' },
  { id: 'bachelors', title: "Bachelor's", subtitle: 'Undergraduate Degree', icon: 'school' },
  { id: 'masters', title: "Master's", subtitle: 'Postgraduate Degree', icon: 'local-library' },
];

function EducationOption({
  option,
  selected,
  onSelect,
}: {
  option: EducationLevel;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      onPress={onSelect}
      className={`w-full flex-row items-center justify-between rounded-lg border p-stack-md ${
        selected ? 'border-primary' : 'border-outline-variant'
      } bg-surface-container-lowest`}>
      <View className="flex-row items-center gap-stack-sm">
        <View
          className={`h-10 w-10 items-center justify-center rounded-full ${
            selected ? 'bg-primary-container' : 'bg-secondary-container'
          }`}>
          <MaterialIcons
            name={option.icon}
            size={20}
            color={selected ? '#00612e' : '#b4b5b5'}
          />
        </View>
        <View>
          <Text className="text-[20px] font-semibold text-on-surface">{option.title}</Text>
          <Text className="text-[14px] text-on-surface-variant">{option.subtitle}</Text>
        </View>
      </View>
      <View
        className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
          selected ? 'border-primary bg-primary' : 'border-outline-variant'
        }`}>
        {selected ? <MaterialIcons name="check" size={16} color="#003918" /> : null}
      </View>
    </Pressable>
  );
}

export default function ProfileSetupScreen() {
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    if (!selectedLevel || !user) return;
    const level = EDUCATION_LEVELS.find((l) => l.id === selectedLevel);
    setSaving(true);
    try {
      await updateProfile(user.id, { education_level: level?.title ?? selectedLevel });
    } catch {
      // Profile update failed silently; user can retry from their profile later.
    } finally {
      setSaving(false);
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="h-16 w-full flex-row items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-margin-mobile">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="school" size={22} color="#75ff9e" />
          <Text className="text-[20px] font-bold text-primary">StudyPath</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <Text className="text-[14px] font-semibold text-on-surface-variant">Step 1 of 5</Text>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <MaterialIcons name="close" size={22} color="#bacbb9" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerClassName="flex-grow items-center justify-center px-margin-mobile py-stack-lg"
        keyboardShouldPersistTaps="handled">
        <View className="w-full max-w-2xl rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-lg">
          <View className="mb-stack-lg items-center">
            <Text className="mb-stack-sm text-center text-[36px] font-bold text-on-surface">
              Education Level
            </Text>
            <Text className="text-center text-[18px] text-on-surface-variant">
              Build your profile to see relevant scholarship matches.
            </Text>
          </View>

          <View className="mb-stack-lg h-2 w-full rounded-full bg-surface-container-high">
            <View className="h-2 w-1/5 rounded-full bg-primary" />
          </View>

          <View className="gap-stack-md">
            {EDUCATION_LEVELS.map((option) => (
              <EducationOption
                key={option.id}
                option={option}
                selected={selectedLevel === option.id}
                onSelect={() => setSelectedLevel(option.id)}
              />
            ))}
          </View>

          <View className="mt-stack-lg items-end">
            <AuthButton
              label="Next"
              onPress={handleNext}
              disabled={!selectedLevel}
              loading={saving}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

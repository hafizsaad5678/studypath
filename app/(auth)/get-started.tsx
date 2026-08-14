import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/auth-button';

export default function GetStartedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-between px-margin-mobile pb-8 pt-12">
        <View className="items-center gap-stack-sm">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary-container">
            <MaterialIcons name="school" size={32} color="#00612e" />
          </View>
          <Text className="text-[22px] font-bold text-primary">StudyPath</Text>
        </View>

        <View className="items-center gap-stack-md px-2">
          <Text className="text-center text-[32px] font-bold leading-[38px] text-on-surface">
            Find the Right Study Abroad Opportunity
          </Text>
          <Text className="text-center text-[16px] leading-[24px] text-on-surface-variant">
            Discover top universities, fully-funded scholarships, and track application
            deadlines across 25+ countries.
          </Text>

          <View className="mt-stack-lg w-full flex-row justify-center gap-gutter border-t border-outline-variant/50 pt-8">
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

        <View className="gap-stack-md">
          <Link href="/(auth)/signup" asChild>
            <AuthButton label="Get Started" />
          </Link>
          <Link href="/(auth)/login" asChild>
            <AuthButton label="I already have an account" variant="secondary" />
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

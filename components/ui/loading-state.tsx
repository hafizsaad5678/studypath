import { ActivityIndicator, Text, View } from 'react-native';

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <ActivityIndicator color="#75ff9e" size="large" />
      <Text className="mt-3 text-[14px] text-on-surface-variant">{message}</Text>
    </View>
  );
}

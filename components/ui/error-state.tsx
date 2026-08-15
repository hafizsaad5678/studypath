import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <View className="items-center justify-center py-12 px-margin-mobile">
      <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-error-container">
        <MaterialIcons name="error-outline" size={28} color="#ffb4ab" />
      </View>
      <Text className="mb-4 text-center text-[14px] text-error">{message}</Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          className="rounded-lg bg-surface-container px-4 py-2 active:bg-surface-container-high">
          <Text className="text-[14px] font-semibold text-on-surface">Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

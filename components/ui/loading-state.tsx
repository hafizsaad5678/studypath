import { ActivityIndicator, Text, View } from 'react-native';

export function LoadingState({
  message = 'Loading...',
  size = 'large',
  color = '#75ff9e',
}: {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}) {
  return (
    <View
      className="flex-1 items-center justify-center py-12"
      accessibilityRole="progressbar"
      accessibilityLabel={message}>
      <ActivityIndicator color={color} size={size} />
      {message ? <Text className="mt-3 text-[14px] text-on-surface-variant">{message}</Text> : null}
    </View>
  );
}


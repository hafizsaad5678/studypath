import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

export function EmptyState({
  title = 'No items found',
  description,
  actionLabel,
  onAction,
  icon = 'inbox',
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
}) {
  return (
    <View className="items-center justify-center py-12 px-margin-mobile">
      <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-surface-container">
        <MaterialIcons name={icon} size={28} color="#bacbb9" />
      </View>
      <Text className="mb-1 text-[16px] font-semibold text-on-surface">{title}</Text>
      {description ? (
        <Text className="mb-4 text-center text-[14px] text-on-surface-variant">{description}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          className="rounded-lg bg-primary-container px-4 py-2 active:opacity-90">
          <Text className="text-[14px] font-semibold text-on-primary-container">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

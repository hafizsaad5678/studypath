import { ActivityIndicator, Pressable, Text } from 'react-native';

type AuthButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
};

export function AuthButton({
  label,
  onPress,
  variant = 'primary',
  loading,
  disabled,
}: AuthButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`h-[52px] items-center justify-center rounded-xl ${
        isPrimary ? 'bg-primary' : 'border border-outline-variant bg-surface-container-lowest'
      } ${disabled || loading ? 'opacity-60' : ''}`}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#003918' : '#75ff9e'} />
      ) : (
        <Text
          className={`text-[16px] font-semibold ${isPrimary ? 'text-on-primary' : 'text-primary'}`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

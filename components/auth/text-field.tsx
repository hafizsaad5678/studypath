import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';

type TextFieldProps = TextInputProps & {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  error?: string;
  secure?: boolean;
};

export function TextField({ label, icon, error, secure, ...props }: TextFieldProps) {
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View className="mb-stack-md">
      <Text className="mb-2 text-[14px] font-semibold text-on-surface">{label}</Text>
      <View
        className={`flex-row items-center rounded-xl border bg-surface-container-lowest px-3 ${
          error ? 'border-error' : 'border-outline-variant'
        }`}>
        <MaterialIcons name={icon} size={20} color="#859585" />
        <TextInput
          className="ml-2 flex-1 py-3 text-[16px] text-on-surface"
          placeholderTextColor="#859585"
          secureTextEntry={hidden}
          {...props}
        />
        {secure ? (
          <Pressable hitSlop={8} onPress={() => setHidden((v) => !v)}>
            <MaterialIcons name={hidden ? 'visibility-off' : 'visibility'} size={20} color="#859585" />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text className="mt-1 text-[12px] text-error">{error}</Text> : null}
    </View>
  );
}

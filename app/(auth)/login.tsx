import { MaterialIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/auth-button';
import { TextField } from '@/components/auth/text-field';
import { signIn } from '@/services/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          contentContainerClassName="flex-grow px-margin-mobile pb-8 pt-4"
          keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} hitSlop={8} className="mb-6 h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
            <MaterialIcons name="arrow-back" size={20} color="#e2e2e2" />
          </Pressable>

          <Text className="mb-2 text-[28px] font-bold text-on-surface">Welcome back</Text>
          <Text className="mb-stack-lg text-[16px] text-on-surface-variant">
            Log in to continue your study abroad journey.
          </Text>

          <TextField
            label="Email"
            icon="mail-outline"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            label="Password"
            icon="lock-outline"
            placeholder="Enter your password"
            secure
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text className="mb-stack-md text-[13px] text-error">{error}</Text> : null}

          <Link href="/(auth)/reset-password" asChild>
            <Pressable className="mb-stack-lg self-end">
              <Text className="text-[14px] font-semibold text-primary">Forgot password?</Text>
            </Pressable>
          </Link>

          <AuthButton label="Log In" onPress={handleLogin} loading={loading} />

          <View className="mt-stack-lg flex-row justify-center gap-1">
            <Text className="text-[14px] text-on-surface-variant">Don&apos;t have an account?</Text>
            <Link href="/(auth)/signup" asChild>
              <Pressable>
                <Text className="text-[14px] font-semibold text-primary">Sign up</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/auth-button';
import { TextField } from '@/components/auth/text-field';
import { AppHeader } from '@/components/layout/app-header';
import { signIn } from '@/services/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Enter your email and password.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await signIn(trimmedEmail, password);
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
          <AppHeader variant="detail" bare />

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

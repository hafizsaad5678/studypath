import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/auth-button';
import { TextField } from '@/components/auth/text-field';
import { AppHeader } from '@/components/layout/app-header';
import { signUp } from '@/services/auth';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    setError(null);
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail || !password) {
      setError('Fill in your name, email, and password.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await signUp(trimmedEmail, password, trimmedName);
      router.replace('/(auth)/profile-setup');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create your account. Please try again.');
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

          <Text className="mb-2 text-[28px] font-bold text-on-surface">Create your account</Text>
          <Text className="mb-stack-lg text-[16px] text-on-surface-variant">
            Start exploring universities and scholarships worldwide.
          </Text>

          <TextField
            label="Full name"
            icon="person-outline"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
          />
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
            placeholder="At least 8 characters"
            secure
            value={password}
            onChangeText={setPassword}
          />

          <Text className="mb-stack-md text-[12px] leading-[18px] text-on-surface-variant">
            By continuing, you agree to StudyPath&apos;s{' '}
            <Text className="font-semibold text-primary">Terms of Service</Text> and{' '}
            <Text className="font-semibold text-primary">Privacy Policy</Text>.
          </Text>

          {error ? <Text className="mb-stack-md text-[13px] text-error">{error}</Text> : null}

          <AuthButton label="Create Account" onPress={handleSignup} loading={loading} />

          <View className="mt-stack-lg flex-row justify-center gap-1">
            <Text className="text-[14px] text-on-surface-variant">Already have an account?</Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text className="text-[14px] font-semibold text-primary">Log in</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

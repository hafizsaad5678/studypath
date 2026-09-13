import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/auth-button';
import { TextField } from '@/components/auth/text-field';
import { AppHeader } from '@/components/layout/app-header';
import { sendPasswordResetEmail } from '@/services/auth';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    setError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(trimmedEmail);
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send the reset link. Please try again.');
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

          {sent ? (
            <View className="flex-1 items-center justify-center gap-stack-md pt-16">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-tertiary-container/10">
                <MaterialIcons name="mark-email-read" size={32} color="#e7e4e6" />
              </View>
              <Text className="text-center text-[22px] font-bold text-on-surface">
                Check your email
              </Text>
              <Text className="px-6 text-center text-[16px] text-on-surface-variant">
                We sent a password reset link to{' '}
                <Text className="font-semibold text-on-surface">{email || 'your email'}</Text>.
              </Text>
              <View className="mt-stack-md w-full">
                <AuthButton label="Back to Log In" onPress={() => router.replace('/(auth)/login')} />
              </View>
            </View>
          ) : (
            <>
              <Text className="mb-2 text-[28px] font-bold text-on-surface">Reset password</Text>
              <Text className="mb-stack-lg text-[16px] text-on-surface-variant">
                Enter the email associated with your account and we&apos;ll send a link to reset
                your password.
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

              {error ? <Text className="mb-stack-md text-[13px] text-error">{error}</Text> : null}

              <AuthButton label="Send Reset Link" onPress={handleReset} loading={loading} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

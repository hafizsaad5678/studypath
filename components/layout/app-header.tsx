import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { useAuth } from '@/hooks/useAuth';
import { useDeadlines } from '@/hooks/useDeadlines';
import { signOut } from '@/services/auth';

type BrandHeaderProps = {
  variant: 'brand';
  /** Overrides the default bell + profile menu (e.g. landing's "Sign In" button). */
  right?: ReactNode;
};

type DetailHeaderProps = {
  variant: 'detail';
  title?: string;
  onBack?: () => void;
  /** Extra action rendered on the right (e.g. a bookmark toggle). */
  right?: ReactNode;
  /** Borderless icon-only back button, meant to sit inline in scroll content (auth screens). */
  bare?: boolean;
};

type AppHeaderProps = BrandHeaderProps | DetailHeaderProps;

function ProfileMenu() {
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);
  const initial = (profile?.full_name?.trim()?.[0] ?? profile?.email?.[0] ?? '?').toUpperCase();

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    router.replace('/landing');
  };

  const goTo = (href: '/saved' | '/applications') => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={8}
        className="h-9 w-9 items-center justify-center rounded-full bg-primary-container">
        <Text className="text-[14px] font-bold text-on-primary-container">{initial}</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/40" onPress={() => setOpen(false)}>
          <View className="absolute right-margin-mobile top-16 w-56 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
            {profile ? (
              <View className="border-b border-outline-variant px-4 py-3">
                <Text className="text-[14px] font-semibold text-on-surface" numberOfLines={1}>
                  {profile.full_name ?? 'Student'}
                </Text>
                <Text className="text-[12px] text-on-surface-variant" numberOfLines={1}>
                  {profile.email}
                </Text>
              </View>
            ) : null}
            <Pressable
              onPress={() => goTo('/saved')}
              className="flex-row items-center gap-3 px-4 py-3 active:bg-surface-container-high">
              <MaterialIcons name="bookmark-border" size={18} color="#bacbb9" />
              <Text className="text-[14px] text-on-surface">Saved Items</Text>
            </Pressable>
            <Pressable
              onPress={() => goTo('/applications')}
              className="flex-row items-center gap-3 px-4 py-3 active:bg-surface-container-high">
              <MaterialIcons name="assignment" size={18} color="#bacbb9" />
              <Text className="text-[14px] text-on-surface">My Applications</Text>
            </Pressable>
            <Pressable
              onPress={handleSignOut}
              className="flex-row items-center gap-3 border-t border-outline-variant px-4 py-3 active:bg-surface-container-high">
              <MaterialIcons name="logout" size={18} color="#ffb4ab" />
              <Text className="text-[14px] font-semibold text-error">Sign Out</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

export function NotificationBell() {
  const { data: deadlines } = useDeadlines(10);
  const hasUrgent = useMemo(
    () =>
      (deadlines ?? []).some(
        (d) => (new Date(d.deadline_date).getTime() - Date.now()) / 86_400_000 <= 7
      ),
    [deadlines]
  );

  return (
    <Pressable
      onPress={() => router.push('/(tabs)/deadlines')}
      hitSlop={8}
      className="h-9 w-9 items-center justify-center rounded-full">
      <MaterialIcons name="notifications" size={22} color="#bacbb9" />
      {hasUrgent ? (
        <View className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border border-surface-container-lowest bg-error" />
      ) : null}
    </Pressable>
  );
}

export function AppHeader(props: AppHeaderProps) {
  const { session } = useAuth();

  if (props.variant === 'detail' && props.bare) {
    return (
      <Pressable
        onPress={props.onBack ?? (() => router.back())}
        hitSlop={8}
        className="mb-6 h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
        <MaterialIcons name="arrow-back" size={20} color="#e2e2e2" />
      </Pressable>
    );
  }

  if (props.variant === 'detail') {
    return (
      <View className="flex-row items-center border-b border-outline-variant bg-surface-container-lowest px-margin-mobile py-3">
        <Pressable
          onPress={props.onBack ?? (() => router.back())}
          hitSlop={8}
          className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
          <MaterialIcons name="arrow-back" size={20} color="#e2e2e2" />
        </Pressable>
        <Text className="flex-1 text-[18px] font-bold text-primary" numberOfLines={1}>
          {props.title ?? 'StudyPath'}
        </Text>
        {props.right}
      </View>
    );
  }

  return (
    <View className="h-16 w-full flex-row items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-margin-mobile">
      <View className="flex-row items-center gap-2">
        <MaterialIcons name="school" size={22} color="#75ff9e" />
        <Text className="text-[20px] font-bold text-primary">StudyPath</Text>
      </View>
      <View className="flex-row items-center gap-2">
        {props.right ??
          (session ? (
            <>
              <NotificationBell />
              <ProfileMenu />
            </>
          ) : null)}
      </View>
    </View>
  );
}

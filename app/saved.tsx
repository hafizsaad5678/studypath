import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSavedItems } from '@/hooks/useSavedItems';
import { supabase } from '@/lib/supabase';
import type { Scholarship, University } from '@/types/database';

type ProgramRow = { id: string; name: string; degree_level: string };

function useSavedDetails(ids: string[], table: 'universities' | 'programs' | 'scholarships') {
  return useQuery({
    queryKey: ['saved-details', table, ids],
    queryFn: async () => {
      if (ids.length === 0) return [];
      const { data, error } = await supabase.from(table).select('*').in('id', ids);
      if (error) throw error;
      return data ?? [];
    },
    enabled: ids.length > 0,
  });
}

function SavedRow({
  icon,
  title,
  subtitle,
  image,
  onUnsave,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string | null;
  image?: string | null;
  onUnsave: () => void;
}) {
  return (
    <View className="mb-stack-sm flex-row items-center gap-stack-sm rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
      <View className="h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-outline-variant bg-surface-container">
        {image ? (
          <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        ) : (
          <MaterialIcons name={icon} size={22} color="#bacbb9" />
        )}
      </View>
      <View className="flex-1">
        <Text className="text-[16px] font-semibold text-on-surface" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-[14px] text-on-surface-variant" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Pressable onPress={onUnsave} hitSlop={8} className="rounded-full p-2">
        <MaterialIcons name="bookmark" size={20} color="#75ff9e" />
      </Pressable>
    </View>
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <View className="mb-stack-sm mt-stack-lg flex-row items-center gap-2 border-b border-outline-variant pb-2">
      <Text className="text-[20px] font-semibold text-on-surface">{title}</Text>
      <View className="rounded-full bg-surface-container-high px-2 py-0.5">
        <Text className="text-[12px] text-on-surface-variant">{count}</Text>
      </View>
    </View>
  );
}

export default function SavedScreen() {
  const { data: savedItems, isLoading: savedLoading, toggle } = useSavedItems();

  const universityIds = (savedItems ?? []).filter((s) => s.item_type === 'university').map((s) => s.item_id);
  const programIds = (savedItems ?? []).filter((s) => s.item_type === 'program').map((s) => s.item_id);
  const scholarshipIds = (savedItems ?? []).filter((s) => s.item_type === 'scholarship').map((s) => s.item_id);

  const { data: universities, isLoading: uniLoading } = useSavedDetails(universityIds, 'universities');
  const { data: programs, isLoading: progLoading } = useSavedDetails(programIds, 'programs');
  const { data: scholarships, isLoading: schLoading } = useSavedDetails(scholarshipIds, 'scholarships');

  const isLoading = savedLoading || uniLoading || progLoading || schLoading;
  const totalCount = (universities?.length ?? 0) + (programs?.length ?? 0) + (scholarships?.length ?? 0);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center border-b border-outline-variant bg-surface-container-lowest px-margin-mobile py-3">
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
          <MaterialIcons name="arrow-back" size={20} color="#e2e2e2" />
        </Pressable>
        <Text className="text-[18px] font-bold text-primary">Saved Items</Text>
      </View>

      <ScrollView contentContainerClassName="px-margin-mobile pb-8 pt-4" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View className="items-center py-8">
            <ActivityIndicator />
          </View>
        ) : totalCount === 0 ? (
          <Text className="py-8 text-center text-[14px] text-on-surface-variant">Nothing saved yet</Text>
        ) : (
          <>
            {universities && universities.length > 0 ? (
              <View>
                <SectionHeader title="Universities" count={universities.length} />
                {(universities as University[]).map((u) => (
                  <SavedRow
                    key={u.id}
                    icon="account-balance"
                    title={u.name}
                    subtitle={u.city}
                    image={u.image_url}
                    onUnsave={() => toggle('university', u.id)}
                  />
                ))}
              </View>
            ) : null}

            {programs && programs.length > 0 ? (
              <View>
                <SectionHeader title="Programs" count={programs.length} />
                {(programs as ProgramRow[]).map((p) => (
                  <SavedRow
                    key={p.id}
                    icon="school"
                    title={p.name}
                    subtitle={p.degree_level}
                    onUnsave={() => toggle('program', p.id)}
                  />
                ))}
              </View>
            ) : null}

            {scholarships && scholarships.length > 0 ? (
              <View>
                <SectionHeader title="Scholarships" count={scholarships.length} />
                {(scholarships as Scholarship[]).map((s) => (
                  <SavedRow
                    key={s.id}
                    icon="payments"
                    title={s.name}
                    subtitle={s.amount_text}
                    onUnsave={() => toggle('scholarship', s.id)}
                  />
                ))}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

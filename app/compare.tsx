import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/layout/app-header';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { usePrograms } from '@/hooks/usePrograms';
import { formatTuition } from '@/lib/formatters';
import type { ProgramWithUniversity } from '@/types/database';

type Row = { label: string; values: React.ReactNode[] };

function ValueBlock({
  icon,
  color = '#e2e2e2',
  children,
}: {
  icon?: keyof typeof MaterialIcons.glyphMap;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center gap-2">
      {icon ? <MaterialIcons name={icon} size={16} color={color} /> : null}
      <View className="flex-1">{children}</View>
    </View>
  );
}

export default function CompareScreen() {
  const params = useLocalSearchParams<{ ids?: string }>();
  const { data: allPrograms, isLoading } = usePrograms();

  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (params.ids) {
      return params.ids.split(',').filter(Boolean).slice(0, 2);
    }
    return [];
  });

  const [pickerSlot, setPickerSlot] = useState<0 | 1 | null>(null);
  const [modalSearch, setModalSearch] = useState('');

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <AppHeader variant="detail" title="Compare Programs" />
        <LoadingState message="Loading programs..." />
      </SafeAreaView>
    );
  }

  const progList = allPrograms ?? [];

  // If user hasn't selected 2 programs yet, initialize them if available
  const firstId = selectedIds[0] ?? progList[0]?.id;
  const secondId = selectedIds[1] ?? (progList.find((p) => p.id !== firstId)?.id ?? progList[1]?.id);

  const a = progList.find((p) => p.id === firstId);
  const b = progList.find((p) => p.id === secondId);

  if (!a || !b) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <AppHeader variant="detail" title="Compare Programs" />
        <EmptyState
          title="Not enough programs to compare"
          description="We need at least two programs available in the catalog to perform a comparison."
          actionLabel="Explore Programs"
          onAction={() => router.push('/(tabs)/explore')}
        />
      </SafeAreaView>
    );
  }

  const rows: Row[] = [
    {
      label: 'Location',
      values: [
        <ValueBlock key="a" icon="location-on" color="#859585">
          <Text className="text-[14px] text-on-surface">
            {[a.university?.city, a.university?.country?.name].filter(Boolean).join(', ') || 'N/A'}
          </Text>
        </ValueBlock>,
        <ValueBlock key="b" icon="location-on" color="#859585">
          <Text className="text-[14px] text-on-surface">
            {[b.university?.city, b.university?.country?.name].filter(Boolean).join(', ') || 'N/A'}
          </Text>
        </ValueBlock>,
      ],
    },
    {
      label: 'Tuition (Yearly)',
      values: [
        <Text key="a" className="text-[16px] font-bold text-on-surface">
          {formatTuition(a.tuition_amount, undefined, a.tuition_currency)}
        </Text>,
        <Text key="b" className="text-[16px] font-bold text-on-surface">
          {formatTuition(b.tuition_amount, undefined, b.tuition_currency)}
        </Text>,
      ],
    },
    {
      label: 'Duration',
      values: [
        <ValueBlock key="a" icon="schedule" color="#859585">
          <Text className="text-[14px] text-on-surface">
            {a.duration_months ? `${a.duration_months} months` : 'N/A'}
          </Text>
        </ValueBlock>,
        <ValueBlock key="b" icon="schedule" color="#859585">
          <Text className="text-[14px] text-on-surface">
            {b.duration_months ? `${b.duration_months} months` : 'N/A'}
          </Text>
        </ValueBlock>,
      ],
    },
    {
      label: 'Language',
      values: [
        <Text key="a" className="text-[14px] text-on-surface">{a.language ?? 'N/A'}</Text>,
        <Text key="b" className="text-[14px] text-on-surface">{b.language ?? 'N/A'}</Text>,
      ],
    },
    {
      label: 'Next Deadline',
      values: [
        <ValueBlock key="a" icon="event-busy" color="#ffb4ab">
          <Text className="text-[14px] font-semibold text-error">{a.application_deadline ?? 'TBA'}</Text>
        </ValueBlock>,
        <ValueBlock key="b" icon="event-available" color="#75ff9e">
          <Text className="text-[14px] font-semibold text-primary">{b.application_deadline ?? 'TBA'}</Text>
        </ValueBlock>,
      ],
    },
    {
      label: 'Scholarship',
      values: [
        <Text key="a" className="text-[13px] text-on-surface">
          {a.scholarship_available ? 'Available' : 'Not available'}
        </Text>,
        <Text key="b" className="text-[13px] text-on-surface">
          {b.scholarship_available ? 'Available' : 'Not available'}
        </Text>,
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <AppHeader variant="detail" title="Compare Programs" />

      <ScrollView contentContainerClassName="px-margin-mobile pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="mb-2 text-[26px] font-bold text-on-surface">Compare Programs</Text>
        <Text className="mb-stack-lg text-[16px] text-on-surface-variant">
          Tap Change Program to select any two programs from the catalog.
        </Text>

        {/* Program cards with Change Program action */}
        <View className="mb-stack-lg flex-row gap-stack-md">
          {[a, b].map((p, idx) => (
            <View
              key={p.id}
              className="flex-1 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
              <View className="p-stack-sm">
                <View className="mb-2 h-20 w-full overflow-hidden rounded-lg bg-surface-variant">
                  {p.university?.image_url ? (
                    <Image
                      source={{ uri: p.university.image_url }}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                    />
                  ) : null}
                </View>
                <Text className="mb-1 text-[11px] font-bold text-primary" numberOfLines={1}>
                  {p.university?.name ?? ''}
                </Text>
                <Text className="text-[14px] font-semibold text-on-surface" numberOfLines={2}>
                  {p.name}
                </Text>
                <Pressable
                  onPress={() => setPickerSlot(idx as 0 | 1)}
                  className="mt-3 items-center rounded-lg bg-secondary-container py-2 active:opacity-80">
                  <Text className="text-[12px] font-semibold text-on-secondary-container">
                    Change Program
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Comparison rows */}
        <View className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
          {rows.map((row, i) => (
            <View
              key={row.label}
              className={`p-stack-md ${
                i < rows.length - 1 ? 'border-b border-outline-variant' : ''
              }`}>
              <Text className="mb-stack-sm text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">
                {row.label}
              </Text>
              <View className="flex-row gap-stack-md">
                <View className="flex-1">{row.values[0]}</View>
                <View className="flex-1">{row.values[1]}</View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Program Selector Modal */}
      <Modal
        visible={pickerSlot !== null}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setPickerSlot(null);
          setModalSearch('');
        }}>
        <Pressable
          className="flex-1 justify-end bg-black/60"
          onPress={() => {
            setPickerSlot(null);
            setModalSearch('');
          }}>
          <Pressable
            className="max-h-[75%] rounded-t-2xl border-t border-outline-variant bg-surface-container-lowest p-6"
            onPress={(e) => e.stopPropagation?.()}>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-[18px] font-bold text-on-surface">Select Program</Text>
              <Pressable
                onPress={() => {
                  setPickerSlot(null);
                  setModalSearch('');
                }}
                hitSlop={8}>
                <MaterialIcons name="close" size={22} color="#bacbb9" />
              </Pressable>
            </View>

            {/* Modal search bar */}
            <View className="mb-3 flex-row items-center rounded-xl bg-surface-container px-3 py-2">
              <MaterialIcons name="search" size={20} color="#859585" />
              <TextInput
                placeholder="Search by program or university..."
                placeholderTextColor="#859585"
                value={modalSearch}
                onChangeText={setModalSearch}
                className="ml-2 flex-1 text-[14px] text-on-surface"
              />
              {modalSearch ? (
                <Pressable onPress={() => setModalSearch('')}>
                  <MaterialIcons name="clear" size={18} color="#859585" />
                </Pressable>
              ) : null}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {progList
                .filter((item) => {
                  if (!modalSearch.trim()) return true;
                  const query = modalSearch.toLowerCase();
                  return (
                    item.name.toLowerCase().includes(query) ||
                    (item.university?.name && item.university.name.toLowerCase().includes(query)) ||
                    (item.field_of_study && item.field_of_study.toLowerCase().includes(query))
                  );
                })
                .map((item) => {
                  const isCurrent = (pickerSlot === 0 ? a.id : b.id) === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => {
                        if (pickerSlot === 0) {
                          setSelectedIds([item.id, secondId]);
                        } else if (pickerSlot === 1) {
                          setSelectedIds([firstId, item.id]);
                        }
                        setPickerSlot(null);
                        setModalSearch('');
                      }}
                      className={`mb-2 rounded-xl border p-4 ${
                        isCurrent
                          ? 'border-primary bg-primary-container/20'
                          : 'border-outline-variant active:bg-surface-container'
                      }`}>
                      <Text className="text-[15px] font-semibold text-on-surface">{item.name}</Text>
                      <Text className="text-[13px] text-on-surface-variant">
                        {item.university?.name} • {item.degree_level}
                      </Text>
                    </Pressable>
                  );
                })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}


import { MaterialIcons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import type { Country } from '@/types/database';

export function CountryPickerModal({
  visible,
  onClose,
  countries,
  selectedCountryId,
  onSelectCountry,
}: {
  visible: boolean;
  onClose: () => void;
  countries: Country[] | undefined;
  selectedCountryId: string | null;
  onSelectCountry: (countryId: string | null) => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/60" onPress={onClose}>
        <Pressable
          className="max-h-[70%] rounded-t-2xl border-t border-outline-variant bg-surface-container-lowest p-6"
          onPress={(e) => e.stopPropagation?.()}>
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-[18px] font-bold text-on-surface">Select Country</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <MaterialIcons name="close" size={22} color="#bacbb9" />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable
              onPress={() => {
                onSelectCountry(null);
                onClose();
              }}
              className={`flex-row items-center justify-between rounded-xl p-4 ${
                !selectedCountryId ? 'bg-primary-container/20' : 'active:bg-surface-container'
              }`}>
              <Text
                className={`text-[16px] ${
                  !selectedCountryId ? 'font-bold text-primary' : 'text-on-surface'
                }`}>
                All Countries
              </Text>
              {!selectedCountryId ? <MaterialIcons name="check" size={20} color="#75ff9e" /> : null}
            </Pressable>
            {(countries ?? []).map((c) => {
              const isSelected = selectedCountryId === c.id;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => {
                    onSelectCountry(c.id);
                    onClose();
                  }}
                  className={`flex-row items-center justify-between rounded-xl p-4 ${
                    isSelected ? 'bg-primary-container/20' : 'active:bg-surface-container'
                  }`}>
                  <Text
                    className={`text-[16px] ${
                      isSelected ? 'font-bold text-primary' : 'text-on-surface'
                    }`}>
                    {c.name}
                  </Text>
                  {isSelected ? <MaterialIcons name="check" size={20} color="#75ff9e" /> : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

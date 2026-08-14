import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DeadlineItem = {
  id: string;
  program: string;
  university: string;
  country: string;
  image: string;
  timeLeft: string;
  date: string;
};

const URGENT: DeadlineItem[] = [
  {
    id: '1',
    program: 'MSc Computer Science',
    university: 'University of Oxford',
    country: 'UK',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB7xdMgTvUeHQ7Meg6qgNxwiAWO_FSmV3fA1BVJnD0hjEXJNTMQIz0pj0abXmQ1bWo56hn4cRvFy0MzF8381vtD9dDkoEb103fVvcvZgMcM2wdKyGHX4YlW4lR7e8HZZgwUqA4I0tGlT2xOoxdZhb4xc_1TtHeqD9cuhAYUKXkFPVwf-3M0JpGSpR95YeSZUiM_y3p8sqx2kljzA029mTsc8DwsSNTpnjVhl43W3WZ61MEyFY14_rkgCg',
    timeLeft: '2 Days Left',
    date: 'Oct 15, 2023',
  },
  {
    id: '2',
    program: 'MA Data Science',
    university: 'Cambridge University',
    country: 'UK',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBHdEzQU3cEn_Qby_5x2KtAeqnl0DyLrULGPmju1ESkcDLfEsWeXLBRsvJE_Z8A9zgRxhME0JVDrJaZDj6RDdKg0qOVRR7qTMj_iZMVzbZ_VejDogqzjsjD2JCC4Qj8V_ScEdldF__zGAYL2B3H_g3QI2JGn9pgCkq2pcYuYHXJ3EPRnkjJU_RSy1cRumN-bF6Be_qlXIqw8pGFSOQJWlrbpXYT7WwxJ-XzrjHuGP820d1scP7uzJoslA',
    timeLeft: '3 Days Left',
    date: 'Oct 16, 2023',
  },
];

const THIS_MONTH: DeadlineItem[] = [
  {
    id: '3',
    program: 'BSc Artificial Intelligence',
    university: 'MIT',
    country: 'USA',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuALeTSYerxyYDV4qCl1kI4MIrODkskpoIdGzm_ThnKqfYD_z3iCbli6qAqBllAOnJjkMBZRyPXBqjQ82KUW4C2u-foJZZCfM9BGZaVKvqB_aOhScl1kIi5MnGlk9ppk4g_tw8odNRBM4P32wmoi3fiqcg6e_BnlhYOSTHG6pTLVMgloEkkOkbtBS6aI3oNYtiYVGdV36qITqt9upK3VbRc4ht9xnSu0mdB9oqX71CBOFSUSovasfpvMdQ',
    timeLeft: '14 Days Left',
    date: 'Oct 27, 2023',
  },
];

const UPCOMING = [
  {
    id: '4',
    program: 'MBA Program',
    university: 'Stanford University',
    country: 'USA',
    days: '45 Days',
    date: 'Nov 28, 2023',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDB6CPaZVQN3jg4YGM0nQ5MuUw3Allpr17o7Knr7ANOIsYQlEDoiGay4I2LHUolNdUFi0nwxaKUFC1tFMt0qjQsC24Nqwtjiq6hl8_WapnxKN2SMDh52SmZt0Xg1erqawArIQFV1iSnsdqY7YwnRiFeEufgNIVsM86Swv6x2ANew8oBq2q_XH7b2y5f9FOYfFnAofh4XXtR40-ajFv-KDPFJBwwDKYP5xA00c4f-UzeeGCd9Qng4q3Kag',
  },
  {
    id: '5',
    program: 'MSc Finance',
    university: 'LSE',
    country: 'UK',
    days: '60 Days',
    date: 'Dec 12, 2023',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAvvktnkFNcG2I1Ts-_uGR20xD-AJjEohTUdFCFlTwLbud9Rh0pOE1ypKaJcVdS28HbEyquiqyDNe0JCyRburSL3jota4uJf7vf24U_r_lE-8906003AxnMo770ySmMFRW_at6EM6oE_kbHqiNFkawbwRxKuvlfVOfx-FG_J4aKqo--bOy8puQzrnNeWMFkt3WcsnE6tEu5OHiUDgtxgyNsmTcQQXZZidJivAUVY0lbNexY9767fnaJBw',
  },
];

function SectionHeader({ color, title, count }: { color: string; title: string; count: number }) {
  return (
    <View className="mb-stack-sm flex-row items-center gap-2 border-b border-outline-variant pb-2">
      <View className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      <Text className="text-[20px] font-semibold text-on-surface">{title}</Text>
      <View className="ml-2 rounded-full bg-surface-container-high px-2 py-0.5">
        <Text className="text-[12px] text-on-surface-variant">{count}</Text>
      </View>
    </View>
  );
}

function DeadlineRow({ item, urgent }: { item: DeadlineItem; urgent?: boolean }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: "/program/[id]", params: { id: item.id } })}
      className="mb-stack-sm flex-row items-center justify-between gap-stack-sm rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
      <View className="flex-1 flex-row items-center gap-stack-sm">
        <View className="h-16 w-16 overflow-hidden rounded-lg border border-outline-variant bg-surface-container">
          <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        </View>
        <View className="flex-1">
          <Text className="text-[18px] font-semibold text-on-surface" numberOfLines={1}>
            {item.program}
          </Text>
          <View className="mt-1 flex-row items-center gap-1">
            <MaterialIcons name="account-balance" size={16} color="#bacbb9" />
            <Text className="text-[14px] text-on-surface-variant" numberOfLines={1}>
              {item.university} • {item.country}
            </Text>
          </View>
        </View>
      </View>
      <View className="items-end gap-1">
        <View className="flex-row items-center gap-1">
          <MaterialIcons name={urgent ? 'timer' : 'schedule'} size={18} color={urgent ? '#ffb4ab' : '#e7e4e6'} />
          <Text className={`text-[14px] font-semibold ${urgent ? 'text-error' : 'text-tertiary'}`}>
            {item.timeLeft}
          </Text>
        </View>
        <Text className="text-[14px] text-on-surface-variant">{item.date}</Text>
      </View>
    </Pressable>
  );
}

export default function DeadlinesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView contentContainerClassName="px-margin-mobile pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="mb-2 text-[28px] font-bold text-on-surface">Deadlines</Text>
        <Text className="mb-stack-lg text-[16px] text-on-surface-variant">
          Track and manage upcoming application closures.
        </Text>

        <View className="mb-stack-lg gap-stack-md rounded-xl border border-error/20 bg-error-container p-stack-md">
          <View className="flex-row items-start gap-stack-sm">
            <View className="mt-1 h-12 w-12 items-center justify-center rounded-full bg-error/10">
              <MaterialIcons name="warning" size={22} color="#ffb4ab" />
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-[18px] font-semibold text-on-error-container">
                2 Deadlines Approaching Rapidly
              </Text>
              <Text className="text-[14px] text-on-error-container">
                You have applications for Oxford and Cambridge closing in less than 48 hours. Ensure all documents
                are submitted.
              </Text>
            </View>
          </View>
          <Pressable className="self-start rounded-lg bg-error px-6 py-3">
            <Text className="text-[14px] font-semibold text-on-error">Review Now</Text>
          </Pressable>
        </View>

        <SectionHeader color="#ffb4ab" title="Closing This Week" count={URGENT.length} />
        {URGENT.map((item) => (
          <DeadlineRow key={item.id} item={item} urgent />
        ))}

        <View className="mt-stack-lg">
          <SectionHeader color="#e7e4e6" title="Closing This Month" count={THIS_MONTH.length} />
          {THIS_MONTH.map((item) => (
            <DeadlineRow key={item.id} item={item} />
          ))}
        </View>

        <View className="mt-stack-lg">
          <SectionHeader color="#75ff9e" title="Upcoming" count={UPCOMING.length} />
          {UPCOMING.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.push({ pathname: "/program/[id]", params: { id: item.id } })}
              className="mb-stack-sm rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md">
              <View className="mb-stack-sm flex-row items-start justify-between">
                <View className="h-10 w-10 overflow-hidden rounded-lg border border-outline-variant bg-surface-container">
                  <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                </View>
                <View className="items-end">
                  <Text className="text-[12px] text-primary">{item.days}</Text>
                  <Text className="text-[14px] text-on-surface-variant">{item.date}</Text>
                </View>
              </View>
              <Text className="mb-1 text-[16px] font-semibold text-on-surface">{item.program}</Text>
              <Text className="text-[14px] text-on-surface-variant">
                {item.university} • {item.country}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

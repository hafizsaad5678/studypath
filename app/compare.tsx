import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Program = {
  id: string;
  university: string;
  program: string;
  image: string;
  bestMatch?: boolean;
};

const PROGRAMS: Program[] = [
  {
    id: '1',
    university: 'Politecnico di Milano',
    program: 'MSc Computer Science',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCC8jAANLcJ1fJ-P0vqTrzUrbsZEkDqbQCa3vgqRNoRe3Cr1rnZ8xH_i9djudDCd3WHkH8bb7yoAXXpHf9KpHq8C3ZFnb1ptrU-UL2XAg5U7z5OK2U7RdTybiuspZ_d6SZtRgd0eznS2Anm4D5gbPuKU-4s-5p-8CMMi-Z7SvZdRvI5Git4CZ8gY9pD0LczXUlREhvRAA1OvTKtrwl65d9AiM8CdWeWuwdYC-Tpa3yJykrNfJ0gB2oopQ',
  },
  {
    id: '2',
    university: 'Technical University Munich',
    program: 'MSc Data Science',
    bestMatch: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDa1LVdKjmVC0p0ZX8NVSAgcd4LRKnBD789tvNf616VUIgvdSzam_2Hn0eIMI5K23X0GBlVBeDWEOoh8HWrJCc6A2-hCRTe5wbCn9JOOpaEqL7yn9Fw8WBuM1hxTOwLr2X-pXouCp4OeQGTCrAricUk2oE4-szkYjkuMjaeCWZi0TKfdLTmRXI_jeSvTe3uJqWoeug48nRLeziI0LkNZWt9qukIQ7T_18NoIOSFO9V2oXT6KfVep597-Q',
  },
];

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
  const rows: Row[] = [
    {
      label: 'Location',
      values: [
        <ValueBlock key="a" icon="location-on" color="#859585">
          <Text className="text-[14px] text-on-surface">Milan, Italy</Text>
        </ValueBlock>,
        <ValueBlock key="b" icon="location-on" color="#859585">
          <Text className="text-[14px] text-on-surface">Munich, Germany</Text>
        </ValueBlock>,
      ],
    },
    {
      label: 'Tuition (Yearly)',
      values: [
        <View key="a">
          <Text className="text-[16px] font-bold text-on-surface">€3,900</Text>
          <Text className="text-[12px] text-on-surface-variant">Varies by income</Text>
        </View>,
        <View key="b">
          <Text className="text-[16px] font-bold text-tertiary">€0 - €150</Text>
          <Text className="text-[12px] text-on-surface-variant">Semester fee only</Text>
        </View>,
      ],
    },
    {
      label: 'Living Cost (Monthly)',
      values: [
        <Text key="a" className="text-[16px] font-bold text-tertiary">€900 - €1,200</Text>,
        <Text key="b" className="text-[16px] font-bold text-on-surface">€1,200 - €1,500</Text>,
      ],
    },
    {
      label: 'Duration',
      values: [
        <ValueBlock key="a" icon="schedule" color="#859585">
          <Text className="text-[14px] text-on-surface">2 Years (4 Semesters)</Text>
        </ValueBlock>,
        <ValueBlock key="b" icon="schedule" color="#859585">
          <Text className="text-[14px] text-on-surface">2 Years (4 Semesters)</Text>
        </ValueBlock>,
      ],
    },
    {
      label: 'Language Req.',
      values: [
        <View key="a" className="gap-1">
          <View className="self-start rounded bg-surface-container px-2 py-1">
            <Text className="text-[12px] text-on-surface-variant">IELTS: 6.0</Text>
          </View>
          <View className="self-start rounded bg-surface-container px-2 py-1">
            <Text className="text-[12px] text-on-surface-variant">TOEFL: 78</Text>
          </View>
        </View>,
        <View key="b" className="gap-1">
          <View className="self-start rounded bg-surface-container px-2 py-1">
            <Text className="text-[12px] text-on-surface-variant">IELTS: 6.5</Text>
          </View>
          <View className="self-start rounded bg-surface-container px-2 py-1">
            <Text className="text-[12px] text-on-surface-variant">TOEFL: 88</Text>
          </View>
        </View>,
      ],
    },
    {
      label: 'Next Deadline',
      values: [
        <ValueBlock key="a" icon="event-busy" color="#ffb4ab">
          <Text className="text-[14px] font-semibold text-error">Mar 15, 2024</Text>
        </ValueBlock>,
        <ValueBlock key="b" icon="event-available" color="#75ff9e">
          <Text className="text-[14px] font-semibold text-primary">May 31, 2024</Text>
        </ValueBlock>,
      ],
    },
    {
      label: 'Scholarship Options',
      values: [
        <View key="a">
          <Text className="text-[13px] text-on-surface">• DSU Regional Scholarship</Text>
          <Text className="text-[13px] text-on-surface">• Merit-based Gold/Silver</Text>
        </View>,
        <View key="b">
          <Text className="text-[13px] text-on-surface">• Deutschlandstipendium</Text>
          <Text className="text-[13px] text-on-surface">• DAAD Grants</Text>
        </View>,
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center border-b border-outline-variant bg-surface-container-lowest px-margin-mobile py-3">
        <Pressable onPress={() => router.back()} hitSlop={8} className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-surface-container-low">
          <MaterialIcons name="arrow-back" size={20} color="#e2e2e2" />
        </Pressable>
        <Text className="text-[18px] font-bold text-primary">StudyPath</Text>
      </View>

      <ScrollView contentContainerClassName="px-margin-mobile pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="mb-2 text-[26px] font-bold text-on-surface">Compare Programs</Text>
        <Text className="mb-stack-lg text-[16px] text-on-surface-variant">
          Evaluate top academic paths to make an informed decision for your future.
        </Text>

        {/* Program cards (stacked, side headers) */}
        <View className="mb-stack-lg flex-row gap-stack-md">
          {PROGRAMS.map((p) => (
            <View key={p.id} className="flex-1 overflow-hidden rounded-xl border border-outline-variant bg-surface-bright">
              {p.bestMatch ? (
                <View className="absolute right-0 top-0 z-10 rounded-bl-lg bg-tertiary-container px-2 py-1">
                  <Text className="text-[10px] font-bold text-on-tertiary-container">Best Match</Text>
                </View>
              ) : null}
              <View className="p-stack-sm">
                <View className="mb-2 h-20 w-full overflow-hidden rounded-lg bg-surface-variant">
                  <Image source={{ uri: p.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                </View>
                <Text className="mb-1 text-[11px] font-bold text-primary">{p.university}</Text>
                <Text className="text-[15px] font-semibold text-on-surface">{p.program}</Text>
                <Pressable
                  onPress={() => router.push({ pathname: "/program/[id]", params: { id: p.id } })}
                  className="mt-2 items-center rounded-lg border border-outline-variant bg-surface-container py-2">
                  <Text className="text-[12px] font-semibold text-on-surface">View Details</Text>
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
              className={`p-stack-md ${i < rows.length - 1 ? 'border-b border-outline-variant' : ''} ${
                i % 2 === 1 ? 'bg-surface-container-lowest' : ''
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
    </SafeAreaView>
  );
}

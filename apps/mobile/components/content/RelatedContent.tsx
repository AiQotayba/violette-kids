import { ContentCard } from '@/components/cards/ContentCard';
import { Text } from '@/components/Text';
import Colors from '@/constants/Colors';
import type { RelatedContentType } from '@/lib/api/related';
import { getRelatedContent } from '@/lib/api/related';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import type { Content } from '@/types/content';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const SECTION_TINT: Record<RelatedContentType, 'tabPillStories' | 'tabPillVideos' | 'tabPillGames'> = {
  story: 'tabPillStories',
  video: 'tabPillVideos',
  game: 'tabPillGames',
};

const TYPE_ICON: Record<RelatedContentType, React.ComponentProps<typeof Ionicons>['name']> = {
  story: 'book',
  video: 'play-circle',
  game: 'game-controller',
};

export interface RelatedContentProps {
  type: RelatedContentType;
  /** معرف المحتوى الحالي (يُستبعد من النتائج) */
  excludeId: string | number;
}

export function RelatedContent({ type, excludeId }: RelatedContentProps) {
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const numId = typeof excludeId === 'string' ? parseInt(excludeId, 10) : excludeId;
  const isValidId = Number.isInteger(numId) && numId > 0;

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['related', type, numId],
    queryFn: () => getRelatedContent(type, numId),
    enabled: isValidId,
    staleTime: 60_000,
    gcTime: 120_000,
  });

  if (!isValidId || items.length === 0) return null;

  const tintKey = SECTION_TINT[type];
  const sectionColor = colors[tintKey];
  const iconName = TYPE_ICON[type];

  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      className="mt-8"
    >
      <View className="flex-row items-center gap-2.5 mb-3">
        <View
          className="w-9 h-9 rounded-xl items-center justify-center"
          style={{ backgroundColor: `${sectionColor}22` }}
        >
          <Ionicons name={iconName} size={20} color={sectionColor} />
        </View>
        <Text className="text-lg" style={{ color: colors.foreground, fontFamily: 'Tajawal_700Bold' }}>
          محتوى ذي صلة
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 4, paddingBottom: 8 }}
      >
        {items.map((item: Content, index: number) => (
          <ContentCard
            key={item.id}
            item={item}
            type={type}
            index={index}
            loading={isLoading}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

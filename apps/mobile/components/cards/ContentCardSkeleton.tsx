import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { lightTheme, darkTheme } from '@/lib/theme';
import type { CardSize } from './ContentCard';

export interface ContentCardSkeletonProps {
  /** نوع البطاقة: قصة (3:4)، فيديو/لعبة (16:9) */
  type: 'story' | 'game' | 'video';
  /** عند true يُستخدم داخل شبكة */
  grid?: boolean;
  /** حجم البطاقة: compact، default، large */
  cardSize?: CardSize;
}

export function ContentCardSkeleton({
  type,
  grid = false,
  cardSize = 'default',
}: ContentCardSkeletonProps) {
  const isDark = useEffectiveColorScheme() === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const pulse = useSharedValue(0.5);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(0.85, { duration: 900 }),
      -1,
      true
    );
    return () => {
      pulse.value = 0.5;
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  const isStory = type === 'story';
  /** كتب: طولية. فيديو/ألعاب: عرضية (نفس قياس ContentCard) */
  const CARD_WIDTH_BOOK = 148;
  const CARD_WIDTH_MEDIA = 208;
  const cardWidth = grid ? undefined : isStory ? CARD_WIDTH_BOOK : CARD_WIDTH_MEDIA;
  const bg = theme.muted;

  return (
    <View
      className={grid ? 'flex-1 min-w-0 mx-1.5' : 'mx-2'}
      style={cardWidth != null ? { width: cardWidth } : undefined}
    >
      <View
        className={`rounded-[20px] overflow-hidden bg-transparent ${isStory ? 'min-h-[54px] min-w-[44px]' : ''}`}
      >
        <Animated.View
          className={`w-full overflow-hidden ${isStory ? 'aspect-[3/4]' : 'aspect-video rounded-[20px]'}`}
          style={[{ backgroundColor: bg }, animatedStyle]}
        >
          {isStory && (
            <View className="absolute left-0 right-0 bottom-0 px-3.5 py-3.5 gap-2">
              <Animated.View
                className="h-3 rounded-md w-[85%]"
                style={[{ backgroundColor: theme.textSecondary }, animatedStyle]}
              />
              <Animated.View
                className="h-3 rounded-md w-1/2"
                style={[{ backgroundColor: theme.textSecondary }, animatedStyle]}
              />
            </View>
          )}
        </Animated.View>
        {!isStory && (
          <View className="mt-2.5 px-1 gap-2">
            <Animated.View
              className="h-3 rounded-md w-[85%]"
              style={[{ backgroundColor: bg }, animatedStyle]}
            />
            <Animated.View
              className="h-3 rounded-md w-1/2"
              style={[{ backgroundColor: bg }, animatedStyle]}
            />
          </View>
        )}
      </View>
    </View>
  );
}

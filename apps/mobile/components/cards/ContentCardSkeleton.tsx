import Colors from '@/constants/Colors';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { useEffect } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import type { CardSize } from './ContentCard';

export interface ContentCardSkeletonProps {
  type: 'story' | 'game' | 'video';
  grid?: boolean;
  cardSize?: CardSize;
  style?: StyleProp<ViewStyle>;
}

const RADIUS = 20;
const TITLE_BLOCK_HEIGHT = 52;

export function ContentCardSkeleton({
  type,
  grid = false,
  style,
}: ContentCardSkeletonProps) {
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const pulse = useSharedValue(0.5);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(0.75, { duration: 700 }), -1, true);
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  const isStory = type === 'story';
  const CARD_WIDTH_BOOK = 150;
  const CARD_WIDTH_MEDIA = 192;
  const cardWidth = grid ? undefined : isStory ? CARD_WIDTH_BOOK : CARD_WIDTH_MEDIA;
  const typeColor = type === 'story' ? colors.stories : type === 'video' ? colors.videos : colors.games;

  return (
    <View
      style={[
        grid && { flex: 1, minWidth: 0 },
        !grid && cardWidth != null && { width: cardWidth },
        !grid && { marginHorizontal: 8 },
        style,
      ]}
    >
      <View
        style={{
          borderRadius: RADIUS,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={[
            {
              width: '100%',
              aspectRatio: isStory ? 3 / 4 : 16 / 9,
              backgroundColor: colors.muted, 
            },
            animatedStyle,
          ]}
        />
        <View
          style={{
            flexDirection: 'row',
            minHeight: TITLE_BLOCK_HEIGHT,
            height: TITLE_BLOCK_HEIGHT,
            paddingVertical: 8,
            paddingHorizontal: 10,
            paddingRight: 10, 
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Animated.View
            style={[
              { flex: 1, height: 14, borderRadius: 6, backgroundColor: colors.muted },
              animatedStyle,
            ]}
          />
          <Animated.View
            style={[
              { width: '35%', height: 14, borderRadius: 6, backgroundColor: colors.muted },
              animatedStyle,
            ]}
          />
        </View>
      </View>
    </View>
  );
}

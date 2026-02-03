import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { lightTheme, darkTheme } from '@/lib/theme';
import type { CardSize } from './ContentCard';

interface ContentCardSkeletonProps {
  /** حجم البطاقة: compact (شبكة 3 أعمدة)، default (2)، large (1) */
  cardSize?: CardSize;
}

export function ContentCardSkeleton({ cardSize = 'default' }: ContentCardSkeletonProps) {
  const isDark = useEffectiveColorScheme() === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.8, { duration: 800 }),
      1000,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const bg = theme.muted;
  const isCompact = cardSize === 'compact';
  const isLarge = cardSize === 'large';

  return (
    <View style={[styles.wrap, isCompact && styles.wrapCompact, isLarge && styles.wrapLarge]}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Animated.View
          style={[
            styles.thumb,
            isCompact && styles.thumbCompact,
            isLarge && styles.thumbLarge,
            { backgroundColor: bg },
            animatedStyle,
          ]}
        />
        {!isCompact && (
          <Animated.View
            style={[styles.line, { backgroundColor: bg }, animatedStyle]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: 6,
  },
  wrapCompact: {
    marginHorizontal: 4,
  },
  wrapLarge: {
    marginHorizontal: 0,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  thumb: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 20,
  },
  thumbCompact: {
    aspectRatio: 1,
    borderRadius: 14,
  },
  thumbLarge: {
    aspectRatio: 16 / 9,
  },
  line: {
    height: 16,
    borderRadius: 8,
    marginTop: 10,
    marginHorizontal: 4,
    width: '70%',
  },
});

import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { lightTheme, darkTheme } from '@/lib/theme';

export type ContentDetailSkeletonVariant = 'story' | 'media';

export interface ContentDetailSkeletonProps {
  /** story: عنوان + وصف + صفحات. media: صورة مصغرة + عنوان + وصف */
  variant: ContentDetailSkeletonVariant;
}

export function ContentDetailSkeleton({ variant }: ContentDetailSkeletonProps) {
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
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  const bg = theme.muted;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {variant === 'media' && (
        <Animated.View
          style={[styles.thumbnail, { backgroundColor: bg }, animatedStyle]}
        />
      )}
      <Animated.View
        style={[styles.titleLine, { backgroundColor: bg }, animatedStyle]}
      />
      <Animated.View
        style={[styles.descLine1, { backgroundColor: bg }, animatedStyle]}
      />
      <Animated.View
        style={[styles.descLine2, { backgroundColor: bg }, animatedStyle]}
      />
      {variant === 'story' && (
        <>
          <Animated.View
            style={[styles.pageBlock, { backgroundColor: bg }, animatedStyle]}
          />
          <Animated.View
            style={[styles.pageBlock, { backgroundColor: bg }, animatedStyle]}
          />
          <Animated.View
            style={[styles.pageBlockShort, { backgroundColor: bg }, animatedStyle]}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    marginBottom: 16,
  },
  titleLine: {
    height: 24,
    borderRadius: 8,
    width: '80%',
    marginBottom: 12,
  },
  descLine1: {
    height: 16,
    borderRadius: 6,
    width: '100%',
    marginBottom: 8,
  },
  descLine2: {
    height: 16,
    borderRadius: 6,
    width: '65%',
    marginBottom: 24,
  },
  pageBlock: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
    marginBottom: 24,
  },
  pageBlockShort: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
    marginBottom: 24,
  },
});

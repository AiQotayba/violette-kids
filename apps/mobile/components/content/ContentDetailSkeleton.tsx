import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import Colors from '@/constants/Colors';

export type ContentDetailSkeletonVariant = 'story' | 'media';

export interface ContentDetailSkeletonProps {
  variant: ContentDetailSkeletonVariant;
}

export function ContentDetailSkeleton({ variant }: ContentDetailSkeletonProps) {
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
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

  const bg = colors.muted;

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* هيدر السكيلتون (زر رجوع + عنوان) */}
      <Animated.View
        className="flex-row items-center gap-3 px-4 py-3 border-b"
        style={[
          {
            paddingTop: insets.top + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
          animatedStyle,
        ]}
      >
        <Animated.View
          className="w-10 h-10 rounded-full"
          style={[{ backgroundColor: bg }, animatedStyle]}
        />
        <Animated.View
          className="h-5 rounded-lg flex-1"
          style={[{ backgroundColor: bg }, animatedStyle]}
        />
      </Animated.View>
      <View style={{ padding: 16 }}>
        {variant === 'media' && (
          <Animated.View
            className="w-full aspect-video rounded-xl mb-4"
            style={[{ backgroundColor: bg }, animatedStyle]}
          />
        )}
        <Animated.View
          className="h-6 rounded-lg w-[80%] mb-3"
          style={[{ backgroundColor: bg }, animatedStyle]}
        />
        <Animated.View
          className="h-4 rounded-md w-full mb-2"
          style={[{ backgroundColor: bg }, animatedStyle]}
        />
        <Animated.View
          className="h-4 rounded-md w-[65%] mb-6"
          style={[{ backgroundColor: bg }, animatedStyle]}
        />
        {variant === 'story' && (
          <>
            <Animated.View
              className="w-full aspect-[4/3] rounded-lg mb-6"
              style={[{ backgroundColor: bg }, animatedStyle]}
            />
            <Animated.View
              className="w-full aspect-[4/3] rounded-lg mb-6"
              style={[{ backgroundColor: bg }, animatedStyle]}
            />
            <Animated.View
              className="w-full aspect-[4/3] rounded-lg mb-6"
              style={[{ backgroundColor: bg }, animatedStyle]}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

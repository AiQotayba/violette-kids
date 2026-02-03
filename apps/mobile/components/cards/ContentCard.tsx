import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import type { Content } from '@/types/content';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { lightTheme, darkTheme } from '@/lib/theme';
import { kidSpring } from '@/lib/animations/springs';
import { PLACEHOLDER_STORY_IMAGE } from '@/lib/constants/placeholders';

export type CardSize = 'compact' | 'default' | 'large';

interface ContentCardProps {
  item: Content;
  type: 'story' | 'game' | 'video';
  index?: number;
  /** عند true يُستخدم داخل شبكة (يشغل عرض الخلية) */
  grid?: boolean;
  /** حجم البطاقة في الشبكة: compact (3 أعمدة)، default (2)، large (1) */
  cardSize?: CardSize;
}

const TYPE_LABEL = {
  story: 'قصة',
  video: 'فيديو',
  game: 'لعبة',
} as const;

export function ContentCard({ item, type, index = 0, grid = false, cardSize = 'default' }: ContentCardProps) {
  const router = useRouter();
  const isDark = useEffectiveColorScheme() === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const scale = useSharedValue(1);
  const isCompact = cardSize === 'compact';
  const isLarge = cardSize === 'large';

  const href =
    type === 'story'
      ? `/story/${item.id}`
      : type === 'game'
        ? `/game/${item.id}`
        : `/video/${item.id}`;

  const isStory = type === 'story';
  const isVideo = type === 'video';

  const cardWidth = grid ? undefined : (isStory ? 148 : isVideo ? 208 : 184);
  const pagesCount = item.pages?.length;
  const typeColor = type === 'story' ? theme.stories : type === 'video' ? theme.videos : theme.games;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPress = () => router.push(href as never);

  const pressIn = () => { scale.value = withSpring(0.95, kidSpring.press); };
  const pressOut = () => { scale.value = withSpring(1, kidSpring.press); };

  if (isStory) {
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 50).duration(380).springify()}
        style={[styles.wrap, grid && styles.wrapGrid, cardWidth != null && { width: cardWidth }]}
      >
        <Pressable
          onPress={onPress}
          onPressIn={pressIn}
          onPressOut={pressOut}
          style={styles.pressable}
        >
          <Animated.View style={[styles.card, styles.cardStory, animatedStyle]}>
            <View style={[styles.thumbWrap, { backgroundColor: theme.muted }]}>
              <Image
                source={
                  item.thumbnailUrl
                    ? { uri: item.thumbnailUrl }
                    : PLACEHOLDER_STORY_IMAGE
                }
                style={styles.thumb}
                resizeMode="cover"
              />
              <View style={styles.storyGradientWrap}>
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.88)']}
                  locations={[0, 0.45, 1]}
                  style={styles.storyGradient}
                />
              </View>
              <View style={[styles.typeBadge, isCompact && styles.typeBadgeCompact, { backgroundColor: `${typeColor}E6` }]}>
                <FontAwesome name="book" size={isCompact ? 10 : 12} color="#fff" />
                <Text style={[styles.typeBadgeText, isCompact && styles.typeBadgeTextCompact]}>{TYPE_LABEL.story}</Text>
              </View>
              {pagesCount != null && pagesCount > 0 && (
                <View style={styles.pagesBadge}>
                  <Text style={[styles.pagesText, { color: theme.foreground }]}>
                    {pagesCount} صفحة
                  </Text>
                </View>
              )}
              <View style={styles.storyTitleBox}>
                <Text style={styles.storyTitle} numberOfLines={2}>
                  {item.title}
                </Text>
              </View>
            </View>
          </Animated.View>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(380).springify()}
      style={[styles.wrap, grid && styles.wrapGrid, cardWidth != null && { width: cardWidth }]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={styles.pressable}
      >
        <Animated.View style={[styles.card, isStory ? styles.cardStory : styles.card, animatedStyle]}>
          <View
            style={[
              styles.thumbWrap,
              styles.thumbVideo,
              { backgroundColor: theme.muted },
            ]}
          >
            <Image
              source={item.thumbnailUrl ? { uri: item.thumbnailUrl } : undefined}
              style={styles.thumb}
              resizeMode="cover"
            />
            <View style={[styles.typeBadge, styles.typeBadgeTop, isCompact && styles.typeBadgeCompact, { backgroundColor: `${typeColor}E6` }]}>
              <FontAwesome
                name={isVideo ? 'video-camera' : 'gamepad'}
                size={isCompact ? 9 : 11}
                color="#fff"
              />
              <Text style={[styles.typeBadgeText, isCompact && styles.typeBadgeTextCompact]}>{TYPE_LABEL[type]}</Text>
            </View>
            <View style={styles.playOverlay}>
              <View
                style={[
                  styles.playBtn,
                  grid && (isCompact ? styles.playBtnGridCompact : isLarge ? styles.playBtnGridLarge : styles.playBtnGrid),
                  { backgroundColor: typeColor },
                ]}
              >
                <FontAwesome
                  name="play"
                  size={grid ? (isCompact ? 14 : isLarge ? 24 : 18) : 26}
                  color="#fff"
                  style={styles.playIcon}
                />
              </View>
            </View>
            {isVideo && (item as Content & { duration?: string }).duration ? (
              <View style={styles.durationBadge}>
                <FontAwesome name="clock-o" size={12} color="#fff" />
                <Text style={styles.durationText}>
                  {(item as Content & { duration?: string }).duration}
                </Text>
              </View>
            ) : null}
          </View>
          <Text
            style={[styles.mediaTitle, { color: theme.foreground }]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 8,
  },
  wrapGrid: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: 6,
  },
  pressable: {
    minHeight: 48,
    minWidth: 48,
  },
  pressableStory: {
    minHeight: 54,
    minWidth: 44,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  cardStory: {
    minHeight: 54,
    minWidth: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  thumbWrap: {
    width: '100%',
    aspectRatio: 3 / 4,
    overflow: 'hidden',
  },
  thumbVideo: {
    aspectRatio: 16 / 9,
    borderRadius: 20,
  },
  storyGradientWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '62%',
  },
  storyGradient: {
    flex: 1,
    width: '100%',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  storyTitleBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingVertical: 14,
    paddingTop: 32,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 22,
  },
  typeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  typeBadgeTop: {
    top: 8,
    right: 8,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  pagesBadge: {
    position: 'absolute',
    bottom: 70,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  pagesText: {
    fontSize: 12,
    fontWeight: '600',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  playBtnGrid: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  playIcon: {
    marginLeft: 3,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  durationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  mediaTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  typeBadgeCompact: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeBadgeTextCompact: {
    fontSize: 10,
  },
  playBtnGridCompact: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  playBtnGridLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});

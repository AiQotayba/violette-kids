import { useRouter } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
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
import { ContentCardSkeleton } from './ContentCardSkeleton';

export type CardSize = 'compact' | 'default' | 'large';

interface ContentCardProps {
  item: Content;
  type: 'story' | 'game' | 'video';
  index?: number;
  /** عند true يُستخدم داخل شبكة */
  grid?: boolean;
  /** حجم البطاقة: compact، default، large */
  cardSize?: CardSize;
  /** عند true يُستخدم skeleton */
  loading?: boolean;
}

const TYPE_LABEL = {
  story: 'القصص',
  video: 'الفيديوهات',
  game: 'الألعاب',
} as const;

export function ContentCard({ item, type, index = 0, grid = false, cardSize = 'default', loading = false }: ContentCardProps) {
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

  /** خارج الشبكة: الكتب أبعاد طولية ككتاب (عرض أصغر)، الفيديو والألعاب أبعاد عرضية */
  const CARD_WIDTH_BOOK = 148;
  const CARD_WIDTH_MEDIA = 208;
  const cardWidth = grid ? undefined : isStory ? CARD_WIDTH_BOOK : CARD_WIDTH_MEDIA;
  const pagesCount = item.pages?.length;
  const typeColor = type === 'story' ? theme.stories : type === 'video' ? theme.videos : theme.games;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPress = () => router.push(href as never);

  const pressIn = () => { scale.value = withSpring(0.95, kidSpring.press); };
  const pressOut = () => { scale.value = withSpring(1, kidSpring.press); };

  if (loading) {
    return (
      <ContentCardSkeleton
        type={type}
        grid={grid}
        cardSize={cardSize}
      />
    );
  }

  if (isStory) {
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 50).duration(380).springify()}
        className={grid ? 'flex-1 min-w-0 mx-1.5' : 'mx-2'}
        style={cardWidth != null ? { width: cardWidth } : undefined}
      >
        <Pressable
          onPress={onPress}
          onPressIn={pressIn}
          onPressOut={pressOut}
          className="min-h-12 min-w-12"
        >
          <Animated.View
            className="rounded-[20px] overflow-hidden bg-transparent min-h-[54px] min-w-[44px]"
            style={[
              animatedStyle,
              {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
              },
            ]}
          >
            <View
              className="w-full aspect-[3/4] overflow-hidden"
              style={{ backgroundColor: theme.muted }}
            >
              <Image
                source={
                  item.thumbnailUrl
                    ? { uri: item.thumbnailUrl }
                    : PLACEHOLDER_STORY_IMAGE
                }
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute left-0 right-0 bottom-0 h-[62%]">
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.88)']}
                  locations={[0, 0.45, 1]}
                  style={{ flex: 1, width: '100%' }}
                />
              </View>
              <View
                className={`absolute top-2.5 right-2.5 flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-[14px] ${isCompact ? 'px-1.5 py-1 rounded-[10px]' : ''}`}
                style={{ backgroundColor: `${typeColor}E6` }}
              >
                <FontAwesome name="book" size={isCompact ? 10 : 12} color="#fff" />
                <Text className={`text-white font-bold ${isCompact ? 'text-[10px]' : 'text-xs'}`}>
                  {TYPE_LABEL.story}
                </Text>
              </View>
              {pagesCount != null && pagesCount > 0 && (
                <View className="absolute bottom-[70px] left-2.5 px-2.5 py-1.5 rounded-xl bg-white/90">
                  <Text className="text-xs font-semibold" style={{ color: theme.foreground }}>
                    {pagesCount} صفحات
                  </Text>
                </View>
              )}
              <View className="absolute left-0 right-0 bottom-0 px-3.5 py-3.5 pt-8">
                <Text className="text-base font-extrabold text-white leading-[22px]" numberOfLines={2}>
                  {item.title}
                </Text>
              </View>
            </View>
          </Animated.View>
        </Pressable>
      </Animated.View>
    );
  }

  const playBtnSizeClass = grid
    ? isCompact
      ? 'w-8 h-8 rounded-full'
      : isLarge
        ? 'w-16 h-16 rounded-full'
        : 'w-10 h-10 rounded-[20px]'
    : 'w-14 h-14 rounded-full';
  const playIconSize = grid ? (isCompact ? 14 : isLarge ? 24 : 18) : 26;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(380).springify()}
      className={grid ? 'flex-1 min-w-0 mx-1.5' : 'mx-2'}
      style={cardWidth != null ? { width: cardWidth } : undefined}
    >
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        className="min-h-12 min-w-12"
      >
        <Animated.View className="rounded-[20px] overflow-hidden bg-transparent" style={animatedStyle}>
          <View
            className="w-full aspect-video overflow-hidden rounded-[20px]"
            style={{ backgroundColor: theme.muted }}
          >
            <Image
              source={item.thumbnailUrl ? { uri: item.thumbnailUrl } : undefined}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View
              className={`absolute top-2 right-2 flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-[14px] ${isCompact ? 'px-1.5 py-1 rounded-[10px]' : ''}`}
              style={{ backgroundColor: `${typeColor}E6` }}
            >
              <FontAwesome
                name={isVideo ? 'video-camera' : 'gamepad'}
                size={isCompact ? 9 : 11}
                color="#fff"
              />
              <Text className={`text-white font-bold ${isCompact ? 'text-[10px]' : 'text-xs'}`}>
                {TYPE_LABEL[type]}
              </Text>
            </View>
            <View className="absolute inset-0 items-center justify-center bg-black/10">
              <View
                className={`items-center justify-center ${playBtnSizeClass}`}
                style={[
                  { backgroundColor: typeColor },
                  !grid && {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                  },
                ]}
              >
                <FontAwesome
                  name="play"
                  size={playIconSize}
                  color="#fff"
                  style={{ marginLeft: 3 }}
                />
              </View>
            </View>
            {isVideo && (item as Content & { duration?: string }).duration ? (
              <View className="absolute bottom-2.5 left-2.5 flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/70">
                <FontAwesome name="clock-o" size={12} color="#fff" />
                <Text className="text-xs font-bold text-white">
                  {(item as Content & { duration?: string }).duration}
                </Text>
              </View>
            ) : null}
          </View>
          <Text
            className="text-[15px] font-bold leading-5 mt-2.5 px-1"
            style={{ color: theme.foreground }}
            numberOfLines={2}
          >
            {item.title}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}


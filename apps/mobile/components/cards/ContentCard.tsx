import { Text } from '@/components/Text';
import Colors from '@/constants/Colors';
import { kidSpring } from '@/lib/animations/springs';
import { PLACEHOLDER_STORY_IMAGE } from '@/lib/constants/placeholders';
import { useGamificationOptional } from '@/lib/gamification/context';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import type { Content, ContentType } from '@/types/content';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ContentCardSkeleton } from './ContentCardSkeleton';

export type CardSize = 'compact' | 'default' | 'large';

interface ContentCardProps {
  item: Content;
  type: 'story' | 'game' | 'video';
  index?: number;
  grid?: boolean;
  cardSize?: CardSize;
  loading?: boolean;
}

const TYPE_ICON: Record<ContentType, React.ComponentProps<typeof Ionicons>['name']> = {
  story: 'book',
  video: 'videocam',
  game: 'game-controller',
};

const RADIUS = 20;
/** ارتفاع منطقة العنوان فوق الصورة (قصص فقط) */
const TITLE_OVERLAY_MIN_HEIGHT = 72;
/** ارتفاع منطقة العنوان تحت الصورة (فيديو/ألعاب) */
const TITLE_BLOCK_HEIGHT = 52;

export function ContentCard({
  item,
  type,
  index = 0,
  grid = false,
  cardSize = 'default',
  loading = false,
}: ContentCardProps) {
  const router = useRouter();
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const gamification = useGamificationOptional();
  const completed = gamification?.isContentCompleted(type, String(item.id)) ?? false;

  const scale = useSharedValue(1);
  const isStory = type === 'story';
  const isVideo = type === 'video';

  const typeColor = type === 'story' ? colors.stories : type === 'video' ? colors.videos : colors.games;
  const completedLabel = type === 'story' ? 'تمت القراءة' : type === 'video' ? 'تمت المشاهدة' : 'تم اللعب';

  const href =
    type === 'story'
      ? `/story/${item.id}`
      : type === 'game'
        ? `/game/${item.id}`
        : `/video/${item.id}`;

  const CARD_WIDTH_BOOK = 150;
  const CARD_WIDTH_MEDIA = 192;
  const cardWidth = grid ? undefined : isStory ? CARD_WIDTH_BOOK : CARD_WIDTH_MEDIA;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPress = () => router.push(href as never);
  const pressIn = () => { scale.value = withSpring(0.98, kidSpring.press); };
  const pressOut = () => { scale.value = withSpring(1, kidSpring.press); };
  if (loading) {
    return <ContentCardSkeleton type={type} grid={grid} cardSize={cardSize} />;
  }

  const isCompact = cardSize === 'compact';
  const isLarge = cardSize === 'large';
  const playSize = grid ? (isCompact ? 36 : isLarge ? 52 : 44) : 48;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(360).springify()}
      style={[
        grid && { flex: 1, minWidth: 0 },
        !grid && cardWidth != null && { width: cardWidth },
        !grid && { marginHorizontal: 8 },
      ]}
    >
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
        <Animated.View
          className="border-0 overflow-hidden"
          style={[animatedStyle, { borderRadius: RADIUS }]}
        >
          {isStory ? (
            /* قصص: الصورة خلفية والعنوان فوقها بتدرج — نسبة عمودية (أطول من المربع) */
            <>
              <View className="w-full aspect-[3/4]"
              >
                <Image
                  source={
                    item.thumbnailUrl
                      ? { uri: item.thumbnailUrl }
                      : PLACEHOLDER_STORY_IMAGE
                  }
                  className="absolute left-0 right-0 top-0 bottom-0 w-full h-full object-cover rounded-lg"
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.75)', 'rgba(0,0,0,0.92)']}
                  className="absolute left-0 right-0 bottom-0 w-full h-full min-h-24 p-3 pr-3 justify-end"
                >
                  {completed && (
                    <View className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-white/90">
                      <Text className="text-xs " style={{ color: colors.success, fontFamily: 'Tajawal_700Bold' }}>
                        {completedLabel}
                      </Text>
                    </View>
                  )}
                  <Text
                    className="text-white text-lg leading-6"
                    style={{ fontFamily: 'Tajawal_700Bold' }}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                </LinearGradient>
              </View>
            </>
          ) : (
            /* فيديو/ألعاب: صورة أعلى ثم عنوان في بلوك تحتها */
            <>
              <View className="w-full aspect-video overflow-hidden"
              >
                <Image
                  source={item.thumbnailUrl ? { uri: item.thumbnailUrl } : PLACEHOLDER_STORY_IMAGE}
                  className="absolute left-0 right-0 top-0 bottom-0 w-full h-full object-cover rounded-[1.6rem]"
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      width: playSize,
                      height: playSize,
                      borderRadius: playSize / 2,
                      backgroundColor: typeColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="play" size={playSize * 0.44} color="#fff" style={{ marginLeft: 2 }} />
                  </View>
                </View>
                {completed && (
                  <View className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-white/90">
                    <Text className="text-xs" style={{ color: colors.success, fontFamily: 'Tajawal_700Bold' }}>
                      {completedLabel}
                    </Text>
                  </View>
                )}
                {isVideo && (item as Content & { duration?: string }).duration && (
                  <View className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/55"                   >
                    <Text className="text-xs text-white" style={{ fontFamily: 'Tajawal_700Bold' }}>
                      {(item as Content & { duration?: string }).duration}
                    </Text>
                  </View>
                )}
              </View>
              <View className="flex-row min-h-16 h-16 p-2 pr-4 items-center justify-center"
              >
                <Text className="flex-1 text-base text-foreground leading-5" numberOfLines={2} style={{ fontFamily: 'Tajawal_700Bold' }}>
                  {item.title}
                </Text>
              </View>
            </>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

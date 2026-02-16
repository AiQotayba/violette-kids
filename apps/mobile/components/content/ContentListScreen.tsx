import type { CardSize } from '@/components/cards/ContentCard';
import { ContentCard } from '@/components/cards/ContentCard';
import Colors from '@/constants/Colors';
import { getAgeGroups, getCategories, getContentList } from '@/lib/api';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { useTabBarBottomPadding } from '@/lib/useTabBarBottomPadding';
import type { Content } from '@/types/content';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

type ContentType = 'story' | 'video' | 'game';

const TYPE_ICON: Record<ContentType, React.ComponentProps<typeof Ionicons>['name']> = {
  story: 'book',
  video: 'videocam',
  game: 'game-controller',
};

const PAGE_SIZE = 5;
/** عدد بطاقات السكيلتون أثناء انتظار المحتوى */
const SKELETON_COUNT = 6;

interface ContentListScreenProps {
  type: ContentType;
  title: string;
}

const GAP = 12;
const PADDING = 16;

export function ContentListScreen({ type, title }: ContentListScreenProps) {
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const tabBarBottomPadding = useTabBarBottomPadding();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [ageId, setAgeId] = useState<number | null>(null);
  const [cardSize, setCardSize] = useState<CardSize>('default');
  const [refreshing, setRefreshing] = useState(false);

  const { data: categoriesData, error: errorCategories, isPending: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories({ limit: 50 }),
  });
  const categories = categoriesData?.data ?? [];

  const { data: ageGroupsData } = useQuery({
    queryKey: ['ageGroups'],
    queryFn: () => getAgeGroups({ limit: 20 }),
  });
  const ageGroups = ageGroupsData?.data ?? [];

  const {
    data: contentData,
    isPending: loading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['content', type, categoryId, ageId, search],
    queryFn: async ({ pageParam }) => {
      const r = await getContentList({
        type,
        limit: PAGE_SIZE,
        offset: pageParam * PAGE_SIZE,
        category: categoryId != null ? String(categoryId) : undefined,
        age: ageId != null ? String(ageId) : undefined,
        search: search.trim() || undefined,
      });
      return { data: r.data ?? [], total: r.total ?? 0 };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((acc, p) => acc + p.data.length, 0);
      return loaded < lastPage.total ? allPages.length : undefined;
    },
  });

  const list = useMemo(
    () => contentData?.pages.flatMap((p) => p.data) ?? [],
    [contentData]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const applySearch = () => setSearch(searchInput.trim());

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['content', type, categoryId, ageId, search] });
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [queryClient, type, categoryId, ageId, search, refetch]);
  const clearFilters = useCallback(() => {
    setCategoryId(null);
    setAgeId(null);
  }, []);

  const numColumns = cardSize === 'compact' ? 3 : cardSize === 'large' ? 1 : 2;
  const errorMessage = error instanceof Error ? error.message : error ? 'خطأ' : null;
  const showSkeleton = loading && list.length === 0;
  const hasActiveFilters = categoryId != null || ageId != null;
  const searchPlaceholder = type === 'story' ? 'ابحث عن قصة أو شخصية...' : type === 'video' ? 'ابحث عن فيديو...' : 'ابحث عن لعبة...';

  if (errorMessage && list.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
          backgroundColor: colors.background,
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${colors.error}15`,
            marginBottom: 16,
          }}
        >
          <Ionicons name="cloud-offline" size={40} color={colors.error} />
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: colors.foreground,
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          عفواً، لم نستطع التحميل
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          تأكد من الاتصال ثم جرّب مرة أخرى
        </Text>
        <Pressable
          onPress={handleRefresh}
          style={({ pressed }) => ({
            opacity: pressed ? 0.9 : 1,
            paddingHorizontal: 28,
            paddingVertical: 14,
            borderRadius: 16,
            backgroundColor: colors.primary[500],
          })}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>حاول مرة أخرى</Text>
        </Pressable>
      </View>
    );
  }

  const typeColor = type === 'story' ? colors.stories : type === 'video' ? colors.videos : colors.games;
  /** خلفية الشيب عند التحديد — من الثيم فقط (rgba ثابتة، لا تركيب hex) */
  const chipSelectedBg =
    type === 'story'
      ? colors.chipSelectedBg.stories
      : type === 'video'
        ? colors.chipSelectedBg.videos
        : colors.chipSelectedBg.games;
  /** خلفية أزرار الشيب غير المحددة (slate-200 / slate-700 من الثيم) */
  const chipBgUnselected = colors.chipBgUnselected;
  const chipBorderUnselected = colorScheme === 'dark' ? 'rgba(255,255,255,0.15)' : '#E5E9ED';

  const listHeader = (
    <View
      style={{
        backgroundColor: colors.headerBarBg ?? colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.headerBorder ?? colors.border,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 14,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        overflow: 'hidden',
      }}
    >
      {/* شريط لوني علوي بلون القسم - هوية بصرية */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: typeColor,
        }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: chipSelectedBg,
          }}
        >
          <Ionicons name={TYPE_ICON[type]} size={26} color={typeColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: colors.foreground,
            }}
          >
            {title}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 48,
          paddingHorizontal: 14,
          marginBottom: 14,
          borderRadius: 16,
          backgroundColor: colors.muted,
          borderRightWidth: 4,
          borderRightColor: typeColor,
        }}
      >
        <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginLeft: 6 }} />
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            paddingVertical: 0,
            paddingHorizontal: 10,
            color: colors.foreground,
          }}
          placeholder={searchPlaceholder}
          placeholderTextColor={colors.textSecondary}
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={applySearch}
          returnKeyType="search"
          accessibilityLabel="بحث"
        />
      </View>

      {/* التصنيفات — التصميم الأول: العنوان بجانب الشريط */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: colors.textSecondary,
            minWidth: 64,
          }}
        >
          التصنيفات
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          style={{ flex: 1 }}
        >
          <Pressable
            onPress={() => setCategoryId(null)}
            className="py-3 px-3 rounded-lg flex items-center justify-center overflow-hidden"
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
              backgroundColor: categoryId === null ? typeColor : chipBgUnselected,
              borderWidth: 1,
              borderColor: categoryId === null ? typeColor : chipBorderUnselected,
            })}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: categoryId === null ? '#fff' : colors.foreground,
              }}
            >
              الكل
            </Text>
          </Pressable>
          {categories.map((c) => {
            const selected = categoryId === c.id;
            return (
              <Pressable
                key={`c-${c.id}`}
                onPress={() => setCategoryId(selected ? null : c.id)}
                className="py-3 px-3 rounded-lg flex items-center justify-center overflow-hidden"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.85 : 1,
                  backgroundColor: selected ? typeColor : chipBgUnselected,
                  borderWidth: 1,
                  borderColor: selected ? typeColor : chipBorderUnselected,
                })}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: selected ? '#fff' : colors.foreground,
                  }}
                  numberOfLines={1}
                >
                  {c.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* العمر — التصميم الأول: العنوان بجانب الشريط */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: colors.textSecondary,
            minWidth: 64,
          }}
        >
          العمر
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          style={{ flex: 1 }}
        >
          <Pressable
            onPress={() => setAgeId(null)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
              paddingHorizontal: 18,
              paddingVertical: 12,
              minHeight: 44,
              justifyContent: 'center',
              borderRadius: 22,
              backgroundColor: ageId === null ? typeColor : chipBgUnselected,
              borderWidth: 1,
              borderColor: ageId === null ? typeColor : chipBorderUnselected,
              overflow: 'hidden',
            })}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: ageId === null ? '#fff' : colors.foreground,
              }}
            >
              الكل
            </Text>
          </Pressable>
          {ageGroups.map((a) => {
            const selected = ageId === a.id;
            return (
              <Pressable
                key={`a-${a.id}`}
                onPress={() => setAgeId(selected ? null : a.id)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.85 : 1,
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  minHeight: 44,
                  justifyContent: 'center',
                  borderRadius: 22,
                  backgroundColor: selected ? typeColor : chipBgUnselected,
                  borderWidth: 1,
                  borderColor: selected ? typeColor : chipBorderUnselected,
                  overflow: 'hidden',
                })}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: selected ? '#fff' : colors.foreground,
                  }}
                  numberOfLines={1}
                >
                  {a.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {hasActiveFilters && (
        <Pressable
          onPress={clearFilters}
          style={({ pressed }) => ({
            opacity: pressed ? 0.85 : 1,
            alignSelf: 'flex-start',
            marginTop: 12,
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 12,
            backgroundColor: colors.muted,
          })}
        >
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.primary[500] }}>
            مسح الفلاتر · عرض الكل
          </Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={loading ? Array.from({ length: 4 }).map((_, index) => ({ id: index } as Content)) : list}
        keyExtractor={(item: unknown) => String((item as Content).id)}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? { gap: GAP, marginBottom: GAP } : undefined}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 12,
          paddingBottom: (tabBarBottomPadding ?? PADDING) + 8,
          flexGrow: 1,
          backgroundColor: "#eeeeee",
        }}
        ListHeaderComponent={listHeader}
        ListHeaderComponentStyle={{ marginBottom: 16 }}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            <ContentCard item={item as Content} type={type} index={index} grid cardSize={cardSize} loading={loading} />
          </View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.35}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary[500]]}
            tintColor={colors.primary[500]}
          />
        }
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 48,
              paddingHorizontal: 24,
            }}
          >
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: chipSelectedBg,
                marginBottom: 20,
              }}
            >
              <Ionicons name={TYPE_ICON[type]} size={44} color={typeColor} />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.foreground,
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              لا يوجد هنا شيء بعد
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 22,
              }}
            >
              جرّب تغيير التصنيف أو العمر أو ابحث بكلمة أخرى
            </Text>
            {hasActiveFilters && (
              <Pressable
                onPress={clearFilters}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.9 : 1,
                  marginTop: 20,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 14,
                  backgroundColor: typeColor,
                })}
              >
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>عرض الكل</Text>
              </Pressable>
            )}
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 20,
              }}
            >
              <ActivityIndicator size="small" color={colors.primary[500]} />
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>جاري تحميل المزيد...</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
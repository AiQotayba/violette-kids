import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getContentList, getCategories, getAgeGroups } from '@/lib/api';
import { ContentCard } from '@/components/cards/ContentCard';
import { ContentCardSkeleton } from '@/components/cards/ContentCardSkeleton';
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { useTabBarBottomPadding } from '@/lib/useTabBarBottomPadding';
import { lightTheme, darkTheme } from '@/lib/theme';
import type { Content } from '@/types/content';
import type { Category } from '@/types/content';
import type { AgeGroup } from '@/types/content';
import type { CardSize } from '@/components/cards/ContentCard';

type ContentType = 'story' | 'video' | 'game';
type SortOption = 'default' | 'newest' | 'oldest' | 'title';

const TYPE_ICON: Record<ContentType, React.ComponentProps<typeof FontAwesome>['name']> = {
  story: 'book',
  video: 'video-camera',
  game: 'gamepad',
};

const SORT_LABELS: Record<SortOption, string> = {
  default: 'الترتيب',
  newest: 'الأحدث',
  oldest: 'الأقدم',
  title: 'الاسم أ–ي',
};

const PAGE_SIZE = 5;

interface ContentListScreenProps {
  type: ContentType;
  title: string;
}

const GAP = 12;
const PADDING = 16;

function sortContent(list: Content[], sort: SortOption): Content[] {
  if (sort === 'default') return list;
  const arr = [...list];
  if (sort === 'newest') {
    arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return arr;
  }
  if (sort === 'oldest') {
    arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return arr;
  }
  if (sort === 'title') {
    arr.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
    return arr;
  }
  return arr;
}

export function ContentListScreen({ type, title }: ContentListScreenProps) {
  const isDark = useEffectiveColorScheme() === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const tabBarBottomPadding = useTabBarBottomPadding();

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [ageId, setAgeId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [cardSize, setCardSize] = useState<CardSize>('default');

  const { data: categoriesData } = useQuery({
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

  const sortedList = useMemo(() => sortContent(list, sortBy), [list, sortBy]);

  const numColumns = cardSize === 'compact' ? 3 : cardSize === 'large' ? 1 : 2;
  const errorMessage = error instanceof Error ? error.message : error ? 'خطأ' : null;

  if (errorMessage && list.length === 0) {
    return (
      <View
        className="flex-1 justify-center items-center p-6"
        style={{ backgroundColor: theme.background }}
      >
        <FontAwesome name="exclamation-circle" size={48} color={theme.error} />
        <Text
          className="text-base mt-4 text-center"
          style={{ color: theme.foreground }}
        >
          {errorMessage}
        </Text>
        <Pressable
          onPress={() => refetch()}
          className="mt-5 px-6 py-3 rounded-[14px] active:opacity-90"
          style={{ backgroundColor: theme.primary[500] }}
        >
          <Text className="text-white text-base font-bold">إعادة المحاولة</Text>
        </Pressable>
      </View>
    );
  }

  const typeColor = type === 'story' ? theme.stories : type === 'video' ? theme.videos : theme.games;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View
        className="px-4 pt-3 pb-3 border-b"
        style={{ borderBottomColor: theme.border }}
      >
        <View className="flex-row items-center gap-3 mb-3">
          <View
            className="w-11 h-11 rounded-[14px] items-center justify-center"
            style={{ backgroundColor: `${typeColor}22` }}
          >
            <FontAwesome name={TYPE_ICON[type]} size={24} color={typeColor} />
          </View>
          <Text
            className="text-[22px] font-bold flex-1"
            style={{ color: theme.foreground }}
          >
            {title}
          </Text>
        </View>

        <View
          className="flex-row items-center rounded-[14px] px-3.5 mb-2.5 h-11"
          style={{ backgroundColor: theme.muted }}
        >
          <View className="ml-2">
            <FontAwesome name="search" size={16} color={theme.textSecondary} />
          </View>
          <TextInput
            className="flex-1 text-base py-0"
            style={{ color: theme.foreground }}
            placeholder="ابحث..."
            placeholderTextColor={theme.textSecondary}
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={applySearch}
            returnKeyType="search"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <Pressable
            onPress={() => {
              setCategoryId(null);
              setAgeId(null);
            }}
            className="px-3.5 py-2 rounded-[20px] border active:opacity-90"
            style={{
              backgroundColor: categoryId === null && ageId === null ? theme.primary[500] : theme.muted,
              borderColor: categoryId === null && ageId === null ? theme.primary[500] : theme.border,
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: categoryId === null && ageId === null ? '#fff' : theme.foreground }}
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
                className="px-3.5 py-2 rounded-[20px] border active:opacity-90"
                style={{
                  backgroundColor: selected ? theme.primary[500] : theme.muted,
                  borderColor: selected ? theme.primary[500] : theme.border,
                }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: selected ? '#fff' : theme.foreground }}
                  numberOfLines={1}
                >
                  {c.name}
                </Text>
              </Pressable>
            );
          })}
          {ageGroups.map((a) => {
            const selected = ageId === a.id;
            return (
              <Pressable
                key={`a-${a.id}`}
                onPress={() => setAgeId(selected ? null : a.id)}
                className="px-3.5 py-2 rounded-[20px] border active:opacity-90"
                style={{
                  backgroundColor: selected ? theme.primary[500] : theme.muted,
                  borderColor: selected ? theme.primary[500] : theme.border,
                }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: selected ? '#fff' : theme.foreground }}
                  numberOfLines={1}
                >
                  {a.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View
          className="flex-row items-center justify-between mt-2.5 pt-2.5 border-t"
          style={{ borderTopColor: theme.border }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
              <Pressable
                key={key}
                onPress={() => setSortBy(key)}
                className="px-3 py-1.5 rounded-2xl border active:opacity-90"
                style={{
                  backgroundColor: sortBy === key ? theme.primary[500] : theme.muted,
                  borderColor: sortBy === key ? theme.primary[500] : theme.border,
                }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: sortBy === key ? '#fff' : theme.foreground }}
                >
                  {SORT_LABELS[key]}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <View className="flex-row items-center gap-1.5">
            {(['default', 'large'] as const).map((size) => (
              <Pressable
                key={size}
                onPress={() => setCardSize(size)}
                className="w-9 h-9 rounded-full items-center justify-center active:opacity-90"
                style={{ backgroundColor: cardSize === size ? theme.primary[500] : theme.muted }}
              >
                <FontAwesome
                  name={size === 'default' ? 'th-large' : 'square-o'}
                  size={16}
                  color={cardSize === size ? '#fff' : theme.foreground}
                />
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {loading && list.length === 0 ? (
        <View
          className="p-4"
          style={{ paddingBottom: tabBarBottomPadding ?? PADDING }}
        >
          {numColumns === 1
            ? Array.from({ length: 4 }).map((_, i) => (
                <View key={i} className="mb-3">
                  <ContentCardSkeleton type={type} grid cardSize={cardSize} />
                </View>
              ))
            : (() => {
                const perRow = numColumns;
                const total = perRow * 3;
                const rows: number[][] = [];
                for (let i = 0; i < total; i++) {
                  const rowIndex = Math.floor(i / perRow);
                  if (!rows[rowIndex]) rows[rowIndex] = [];
                  rows[rowIndex].push(i);
                }
                return rows.map((rowItems, rowIndex) => (
                  <View key={rowIndex} className="flex-row gap-3 mb-3">
                    {rowItems.map((i) => (
                      <View key={i} className="flex-1 min-w-0">
                        <ContentCardSkeleton type={type} grid cardSize={cardSize} />
                      </View>
                    ))}
                  </View>
                ));
              })()}
        </View>
      ) : (
        <FlatList
          data={sortedList}
          keyExtractor={(item) => String(item.id)}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? { gap: GAP, marginBottom: GAP } : undefined}
          contentContainerStyle={{ padding: PADDING, paddingBottom: tabBarBottomPadding ?? PADDING }}
          renderItem={({ item, index }) => (
            <View className="flex-1 min-w-0">
              <ContentCard item={item} type={type} index={index} grid cardSize={cardSize} />
            </View>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-12 gap-3">
              <FontAwesome
                name={type === 'story' ? 'book' : type === 'video' ? 'video-camera' : 'gamepad'}
                size={48}
                color={theme.textSecondary}
              />
              <Text
                className="text-base"
                style={{ color: theme.textSecondary }}
              >
                لا يوجد محتوى
              </Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="flex-row items-center justify-center gap-2 py-4">
                <ActivityIndicator size="small" color={theme.primary[500]} />
                <Text
                  className="text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  جاري تحميل المزيد...
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}
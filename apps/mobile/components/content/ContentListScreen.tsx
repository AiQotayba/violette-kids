import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getContentList } from '@/lib/api';
import { getCategories } from '@/lib/api';
import { getAgeGroups } from '@/lib/api';
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

const PAGE_SIZE = 20;

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

  const [list, setList] = useState<Content[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [ageId, setAgeId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [cardSize, setCardSize] = useState<CardSize>('default');
  const [categories, setCategories] = useState<Category[]>([]);
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);

  const loadFilters = useCallback(() => {
    getCategories({ limit: 50 })
      .then((r) => setCategories(r.data ?? []))
      .catch(() => setCategories([]));
    getAgeGroups({ limit: 20 })
      .then((r) => setAgeGroups(r.data ?? []))
      .catch(() => setAgeGroups([]));
  }, []);

  const loadContent = useCallback(
    (append: boolean) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }
      const requestOffset = append ? offset : 0;
      getContentList({
        type,
        limit: PAGE_SIZE,
        offset: requestOffset,
        category: categoryId != null ? String(categoryId) : undefined,
        age: ageId != null ? String(ageId) : undefined,
        search: search.trim() || undefined,
      })
        .then((r) => {
          const data = r.data ?? [];
          const newTotal = r.total ?? 0;
          setTotal(newTotal);
          if (append) {
            setList((prev) => prev.concat(data));
          } else {
            setList(data);
          }
          setOffset(requestOffset + data.length);
        })
        .catch((e) => setError(e instanceof Error ? e.message : 'خطأ'))
        .finally(() => {
          setLoading(false);
          setLoadingMore(false);
        });
    },
    [type, categoryId, ageId, search, offset]
  );

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  useEffect(() => {
    setOffset(0);
    loadContent(false);
  }, [type, categoryId, ageId, search]); // loadContent intentionally omitted to avoid refetch on offset change

  const handleLoadMore = useCallback(() => {
    if (loadingMore || loading || list.length >= total) return;
    loadContent(true);
  }, [loadingMore, loading, list.length, total, loadContent]);

  const applySearch = () => setSearch(searchInput.trim());

  const sortedList = useMemo(() => sortContent(list, sortBy), [list, sortBy]);

  const numColumns = cardSize === 'compact' ? 3 : cardSize === 'large' ? 1 : 2;
  const hasMore = list.length < total && !loading && !loadingMore;

  if (error && list.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <FontAwesome name="exclamation-circle" size={48} color={theme.error} />
        <Text style={[styles.errorText, { color: theme.foreground }]}>{error}</Text>
        <Pressable
          onPress={() => loadContent(false)}
          style={[styles.retryBtn, { backgroundColor: theme.primary[500] }]}
        >
          <Text style={styles.retryText}>إعادة المحاولة</Text>
        </Pressable>
      </View>
    );
  }

  const typeColor = type === 'story' ? theme.stories : type === 'video' ? theme.videos : theme.games;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View style={styles.titleRow}>
          <View style={[styles.titleIcon, { backgroundColor: `${typeColor}22` }]}>
            <FontAwesome name={TYPE_ICON[type]} size={24} color={typeColor} />
          </View>
          <Text style={[styles.title, { color: theme.foreground }]}>{title}</Text>
        </View>

        <View style={[styles.searchRow, { backgroundColor: theme.muted }]}>
          <FontAwesome name="search" size={16} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.foreground }]}
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
          contentContainerStyle={styles.filterRow}
        >
          <Pressable
            onPress={() => {
              setCategoryId(null);
              setAgeId(null);
            }}
            style={[
              styles.chip,
              {
                backgroundColor: categoryId === null && ageId === null ? theme.primary[500] : theme.muted,
                borderColor: categoryId === null && ageId === null ? theme.primary[500] : theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: categoryId === null && ageId === null ? '#fff' : theme.foreground },
              ]}
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
                style={[
                  styles.chip,
                  {
                    backgroundColor: selected ? theme.primary[500] : theme.muted,
                    borderColor: selected ? theme.primary[500] : theme.border,
                  },
                ]}
              >
                <Text
                  style={[styles.chipText, { color: selected ? '#fff' : theme.foreground }]}
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
                style={[
                  styles.chip,
                  {
                    backgroundColor: selected ? theme.primary[500] : theme.muted,
                    borderColor: selected ? theme.primary[500] : theme.border,
                  },
                ]}
              >
                <Text
                  style={[styles.chipText, { color: selected ? '#fff' : theme.foreground }]}
                  numberOfLines={1}
                >
                  {a.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={[styles.toolRow, { borderTopColor: theme.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>
            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
              <Pressable
                key={key}
                onPress={() => setSortBy(key)}
                style={[
                  styles.sortChip,
                  {
                    backgroundColor: sortBy === key ? theme.primary[500] : theme.muted,
                    borderColor: sortBy === key ? theme.primary[500] : theme.border,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: sortBy === key ? '#fff' : theme.foreground }]}>
                  {SORT_LABELS[key]}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={styles.cardSizeRow}>
            {([ 'default', 'large'] as const).map((size) => (
              <Pressable
                key={size}
                onPress={() => setCardSize(size)}
                style={[
                  styles.cardSizeBtn,
                  { backgroundColor: cardSize === size ? theme.primary[500] : theme.muted },
                ]}
              >
                <FontAwesome
                  name={ size === 'default' ? 'th-large' : 'square-o'}
                  size={16}
                  color={cardSize === size ? '#fff' : theme.foreground}
                />
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {loading && list.length === 0 ? (
        <View style={[styles.gridContent, { paddingBottom: tabBarBottomPadding }]}>
          {numColumns === 1
            ? Array.from({ length: 4 }).map((_, i) => (
                <View key={i} style={styles.skeletonCell1}>
                  <ContentCardSkeleton cardSize={cardSize} />
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
                  <View key={rowIndex} style={styles.gridRow}>
                    {rowItems.map((i) => (
                      <View key={i} style={styles.gridCell}>
                        <ContentCardSkeleton cardSize={cardSize} />
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
          columnWrapperStyle={numColumns > 1 ? styles.gridRow : undefined}
          contentContainerStyle={[styles.gridContent, { paddingBottom: tabBarBottomPadding }]}
          renderItem={({ item, index }) => (
            <View style={styles.gridCell}>
              <ContentCard item={item} type={type} index={index} grid cardSize={cardSize} />
            </View>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <View style={styles.empty}>
              <FontAwesome
                name={type === 'story' ? 'book' : type === 'video' ? 'video-camera' : 'gamepad'}
                size={48}
                color={theme.textSecondary}
              />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>لا يوجد محتوى</Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={theme.primary[500]} />
                <Text style={[styles.footerLoaderText, { color: theme.textSecondary }]}>جاري تحميل المزيد...</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  header: {
    paddingHorizontal: PADDING,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  titleIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    height: 44,
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardSizeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContent: {
    padding: PADDING,
    paddingBottom: PADDING,
  },
  gridRow: {
    gap: GAP,
    marginBottom: GAP,
  },
  gridCell: {
    flex: 1,
    minWidth: 0,
  },
  skeletonCell1: {
    marginBottom: GAP,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
  },
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  footerLoaderText: {
    fontSize: 14,
  },
});

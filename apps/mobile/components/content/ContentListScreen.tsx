import { useCallback, useEffect, useState } from 'react';
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
import { useEffectiveColorScheme } from '@/lib/settings/context';
import { lightTheme, darkTheme } from '@/lib/theme';
import type { Content } from '@/types/content';
import type { Category } from '@/types/content';
import type { AgeGroup } from '@/types/content';

type ContentType = 'story' | 'video' | 'game';

const TYPE_ICON: Record<ContentType, React.ComponentProps<typeof FontAwesome>['name']> = {
  story: 'book',
  video: 'video-camera',
  game: 'gamepad',
};

interface ContentListScreenProps {
  type: ContentType;
  title: string;
}

const GAP = 12;
const PADDING = 16;

export function ContentListScreen({ type, title }: ContentListScreenProps) {
  const isDark = useEffectiveColorScheme() === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const [list, setList] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [ageId, setAgeId] = useState<number | null>(null);
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

  const loadContent = useCallback(() => {
    setLoading(true);
    setError(null);
    getContentList({
      type,
      limit: 50,
      category: categoryId != null ? String(categoryId) : undefined,
      age: ageId != null ? String(ageId) : undefined,
      search: search.trim() || undefined,
    })
      .then((r) => setList(r.data ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : 'خطأ'))
      .finally(() => setLoading(false));
  }, [type, categoryId, ageId, search]);

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const applySearch = () => setSearch(searchInput.trim());


  if (error && list.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <FontAwesome name="exclamation-circle" size={48} color={theme.error} />
        <Text style={[styles.errorText, { color: theme.foreground }]}>{error}</Text>
        <Pressable
          onPress={loadContent}
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
            onPress={() => { setCategoryId(null); setAgeId(null); }}
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
      </View>

      {loading && list.length === 0 ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={theme.primary[500]} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            جاري التحميل...
          </Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item, index }) => (
            <View style={styles.gridCell}>
              <ContentCard item={item} type={type} index={index} grid />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <FontAwesome
                name={type === 'story' ? 'book' : type === 'video' ? 'video-camera' : 'gamepad'}
                size={48}
                color={theme.textSecondary}
              />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                لا يوجد محتوى
              </Text>
            </View>
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
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
  },
  gridContent: {
    padding: PADDING,
    paddingBottom: 100,
  },
  gridRow: {
    gap: GAP,
    marginBottom: GAP,
  },
  gridCell: {
    flex: 1,
    minWidth: 0,
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
});

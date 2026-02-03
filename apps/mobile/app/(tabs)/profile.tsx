import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSettings, useEffectiveColorScheme } from '@/lib/settings/context';
import { useTabBarBottomPadding } from '@/lib/useTabBarBottomPadding';
import { lightTheme, darkTheme } from '@/lib/theme';

const appName = Constants.expoConfig?.name ?? 'Violette Kids';
const appVersion = Constants.expoConfig?.version ?? '1.0.0';
const TEAM_NAME = 'Osus plus';

type ProfileTheme = typeof lightTheme | typeof darkTheme;

function RowLink({
  label,
  onPress,
  theme,
  icon,
  showBorder = true,
}: {
  label: string;
  onPress: () => void;
  theme: ProfileTheme;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  showBorder?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.rowLink,
        showBorder && {
          borderBottomWidth: 1,
          borderColor: theme.border,
        }, 
        pressed && styles.rowLinkPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.rowLinkContent}>
        <View style={styles.rowLinkLeft}>
          <View style={[styles.rowLinkIconWrap, { backgroundColor: theme.muted }]}>
            <FontAwesome name={icon} size={16} color={theme.tint} />
          </View>
          <Text style={[styles.rowLinkText, { color: theme.text }]}>{label}</Text>
        </View>
        <FontAwesome
          name="chevron-left"
          size={12}
          color={theme.textSecondary}
          style={{ transform: [{ rotate: '180deg' }] }} // تحويل ليكون سهم يمين
        />
      </View>
    </Pressable>
  );
}

/** الألوان للخيارات غير المفعلة */
const INACTIVE_BG = '#FFFFFF';
const INACTIVE_TEXT = '#1F2937';
const INACTIVE_HINT = '#6B7280';
const INACTIVE_ICON = '#2563EB';
const INACTIVE_BORDER = '#E5E7EB';

/** الألوان للخيارات المفعلة */
const ACTIVE_BG = {
  light: '#2563EB',
  dark: '#1E40AF',
};
const ACTIVE_TEXT = '#FFFFFF';
const ACTIVE_ICON = '#FFFFFF';
const ACTIVE_BORDER = {
  light: '#1D4ED8',
  dark: '#1E3A8A',
};

function ThemeOption({
  label,
  hint,
  icon,
  active,
  onPress,
  theme,
  isDark,
}: {
  label: string;
  hint: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  active: boolean;
  onPress: () => void;
  theme: ProfileTheme;
  isDark: boolean;
}) {
  // تحديد الألوان بناءً على حالة التفعيل
  const backgroundColor = active
    ? (isDark ? ACTIVE_BG.dark : ACTIVE_BG.light)
    : INACTIVE_BG;

  const borderColor = active
    ? (isDark ? ACTIVE_BORDER.dark : ACTIVE_BORDER.light)
    : INACTIVE_BORDER;

  const textColor = active ? ACTIVE_TEXT : INACTIVE_TEXT;
  const hintColor = active ? 'rgba(255,255,255,0.85)' : INACTIVE_HINT;
  const iconColor = active ? ACTIVE_ICON : INACTIVE_ICON;
  const iconBackground = active ? 'rgba(255,255,255,0.2)' : '#EFF6FF';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.themeOption,
        {
          backgroundColor,
          borderColor,
          borderWidth: active ? 2 : 1,
        },
        active && styles.themeOptionActive,
        pressed && styles.themeOptionPressed,
      ]}
      onPress={onPress}
    >
      {/* أيقونة الخيار */}
      <View style={[styles.themeOptionIconWrap, { backgroundColor: iconBackground }]}>
        <FontAwesome name={icon} size={24} color={iconColor} />
      </View>

      {/* النص في المنتصف */}
      <View style={styles.themeOptionTextContainer}>
        <Text
          style={[
            styles.themeOptionLabel,
            { color: textColor, textAlign: 'center' }
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.themeOptionHint,
            { color: hintColor, textAlign: 'center' }
          ]}
        >
          {hint}
        </Text>
      </View>

      {/* علامة الاختيار للمفعل */}
      {active && (
        <View style={styles.themeOptionCheckWrap}>
          <FontAwesome
            name="check-circle"
            size={20}
            color={ACTIVE_TEXT}
          />
        </View>
      )}
    </Pressable>
  );
}


/** المفعل: خلفية زرقاء كاملة، نص وأيقونة بيضاء */
const ACTIVE_BG_LIGHT = '#2563EB';
const ACTIVE_BG_DARK = '#3B82F6';
const ACTIVE_BORDER_LIGHT = '#1D4ED8';
const ACTIVE_BORDER_DARK = '#2563EB';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useEffectiveColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const { themePreference, setThemePreference } = useSettings();
  const tabBarBottomPadding = useTabBarBottomPadding();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: tabBarBottomPadding }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header: App name + version */}
      <View style={[styles.header, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[styles.headerIconWrap, { backgroundColor: theme.primary[100] }]}>
          <FontAwesome name="child" size={28} color={theme.primary[500]} />
        </View>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{appName}</Text>
        <Text style={[styles.headerVersion, { color: theme.textSecondary }]}>الإصدار {appVersion}</Text>
      </View>

      {/* المظهر — سهل للأطفال */}
      {/* <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.themeSectionTitle, { color: theme.text }]}>كيف تحب أن يظهر التطبيق؟</Text>
        <Text style={[styles.themeSectionHint, { color: theme.textSecondary }]}>اختر واحداً بالضغط عليه</Text>
        <View style={[styles.themeOptionsList, { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <ThemeOption
            label="نهار"
            hint="ألوان فاتحة"
            icon="sun-o"
            active={themePreference === 'light'}
            onPress={() => setThemePreference('light')}
            theme={theme}
            isDark={colorScheme === 'dark'}
          />
          <ThemeOption
            label="ليل"
            hint="ألوان هادئة"
            icon="moon-o"
            active={themePreference === 'dark'}
            onPress={() => setThemePreference('dark')}
            theme={theme}
            isDark={colorScheme === 'dark'}
          />
          <ThemeOption
            label="تلقائي"
            hint="مثل جهازك"
            icon="mobile"
            active={themePreference === 'system'}
            onPress={() => setThemePreference('system')}
            theme={theme}
            isDark={colorScheme === 'dark'}
          />
        </View>
      </View> */}

      {/* Achievements */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>الإنجازات</Text>
        <RowLink
          label="عرض الإنجازات والشارات"
          theme={theme}
          icon="star"
          onPress={() => router.push('/achievements')}
          showBorder={false}
        />
      </View>

      {/* Pages */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>صفحات</Text>
        <RowLink
          label="سياسة الخصوصية"
          theme={theme}
          icon="lock"
          onPress={() => router.push('/privacy')}
        />
        <RowLink
          label="شروط الخدمة"
          theme={theme}
          icon="file-text-o"
          onPress={() => router.push('/terms')}
        />
        <RowLink
          label="من نحن"
          theme={theme}
          icon="info-circle"
          onPress={() => router.push('/about')}
          showBorder={false}
        />
      </View>

      {/* Team */}
      <View style={[styles.footer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[styles.footerIconWrap, { backgroundColor: theme.muted }]}>
          <FontAwesome name="users" size={18} color={theme.textSecondary} />
        </View>
        <Text style={[styles.footerLabel, { color: theme.textSecondary }]}>فريق التطوير</Text>
        <Text style={[styles.footerValue, { color: theme.text }]}>{TEAM_NAME}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  // RowLink Styles
  rowLink: {
    // margin: 10,
  },
  rowLinkPressed: {
    opacity: 0.7,
  },
  rowLinkContent: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLinkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  rowLinkIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowLinkText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },

  // ThemeOption Styles
  themeOption: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  themeOptionActive: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  themeOptionPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  themeOptionIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  themeOptionTextContainer: {
    alignItems: 'center',
    width: '100%',
  },
  themeOptionLabel: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
    width: '100%',
  },
  themeOptionHint: {
    fontSize: 14,
    lineHeight: 20,
    width: '100%',
  },
  themeOptionCheckWrap: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 4,
  },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerVersion: {
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitleIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  themeSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  themeSectionHint: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 14,
  },
  themeOptionsList: {
    gap: 12,
  },
  themeOptionActiveShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  themeOptionTextWrap: { flex: 1 },
  themeOptionCheck: {
    marginRight: 4,
  },
  settingsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  settingsLinkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  footerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  footerLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 16,
    fontWeight: '700',
  },
});

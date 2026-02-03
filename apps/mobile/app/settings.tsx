import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { useSettings, useEffectiveColorScheme } from '@/lib/settings/context';
import { lightTheme, darkTheme } from '@/lib/theme';

const appName = Constants.expoConfig?.name ?? 'Violette Kids';
const appVersion = Constants.expoConfig?.version ?? '1.0.0';

function getApiDocsUrl(apiBaseUrl: string): string {
  try {
    const u = new URL(apiBaseUrl);
    return `${u.origin}/api-docs`;
  } catch {
    return 'http://localhost:4000/api-docs';
  }
}

export default function SettingsScreen() {
  const theme = useEffectiveColorScheme() === 'dark' ? darkTheme : lightTheme;
  const {
    apiBaseUrl,
    setApiBaseUrl,
    language,
    setLanguage,
    themePreference,
    setThemePreference,
  } = useSettings();

  const openApiDocs = () => {
    Linking.openURL(getApiDocsUrl(apiBaseUrl)).catch(() => {});
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>التطبيق</Text>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>الاسم</Text>
          <Text style={[styles.value, { color: theme.text }]}>{appName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>الإصدار</Text>
          <Text style={[styles.value, { color: theme.text }]}>{appVersion}</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>عنوان الـ API</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.background,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          value={apiBaseUrl}
          onChangeText={setApiBaseUrl}
          placeholder="http://localhost:4000/api"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>اللغة</Text>
        <View style={styles.optionsRow}>
          <Pressable
            style={[
              styles.option,
              language === 'ar' && { backgroundColor: theme.primary[400] },
            ]}
            onPress={() => setLanguage('ar')}
          >
            <Text
              style={[
                styles.optionText,
                { color: language === 'ar' ? '#fff' : theme.text },
              ]}
            >
              العربية
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.option,
              language === 'en' && { backgroundColor: theme.primary[400] },
            ]}
            onPress={() => setLanguage('en')}
          >
            <Text
              style={[
                styles.optionText,
                { color: language === 'en' ? '#fff' : theme.text },
              ]}
            >
              English
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>المظهر (الوضع الداكن)</Text>
        <View style={styles.optionsRow}>
          <Pressable
            style={[
              styles.option,
              themePreference === 'light' && { backgroundColor: theme.primary[400] },
            ]}
            onPress={() => setThemePreference('light')}
          >
            <Text
              style={[
                styles.optionText,
                { color: themePreference === 'light' ? '#fff' : theme.text },
              ]}
            >
              فاتح
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.option,
              themePreference === 'dark' && { backgroundColor: theme.primary[400] },
            ]}
            onPress={() => setThemePreference('dark')}
          >
            <Text
              style={[
                styles.optionText,
                { color: themePreference === 'dark' ? '#fff' : theme.text },
              ]}
            >
              داكن
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.option,
              themePreference === 'system' && { backgroundColor: theme.primary[400] },
            ]}
            onPress={() => setThemePreference('system')}
          >
            <Text
              style={[
                styles.optionText,
                { color: themePreference === 'system' ? '#fff' : theme.text },
              ]}
            >
              تلقائي
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>عن التطبيق</Text>
        <Pressable
          style={({ pressed }) => [
            styles.linkButton,
            pressed && styles.linkButtonPressed,
          ]}
          onPress={openApiDocs}
        >
          <Text style={[styles.linkText, { color: theme.secondary[500] }]}>
            وثائق الـ API (Swagger)
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  section: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  optionText: { fontSize: 14, fontWeight: '500' },
  linkButton: { paddingVertical: 8 },
  linkButtonPressed: { opacity: 0.7 },
  linkText: { fontSize: 14, fontWeight: '600' },
});

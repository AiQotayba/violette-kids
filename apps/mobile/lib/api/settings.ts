import { api } from './client';

export interface SettingItem {
  id: number;
  key: string;
  value: string;
}

export interface SettingsResponse {
  data: SettingItem[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * جلب إعداد واحد حسب المفتاح — GET /settings?key=
 * يُرجع نص المحتوى (value) أو null إن لم يُعثر على نتيجة.
 */
export function getSettingByKey(key: string): Promise<string | null> {
  return api
    .get<SettingsResponse>('/settings', { key })
    .then((res) => {
      const item = res.data?.find((item) => item.key === key);
      return item?.value ?? null;
    });
}

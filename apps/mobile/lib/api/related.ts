import { getContentList } from './content';
import type { Content } from '@/types/content';

export type RelatedContentType = 'story' | 'video' | 'game';

const RELATED_LIMIT = 2;
/** نطلب أكثر قليلاً ثم نستبعد الحالي ونأخذ 2 */
const FETCH_LIMIT = 6;

/**
 * جلب محتوى ذي صلة من نفس النوع (عنصرين فقط)، مع استبعاد المحتوى الحالي.
 * يُستدعى بعد تحميل المحتوى نفسه.
 */
export async function getRelatedContent(
  type: RelatedContentType,
  excludeId: number
): Promise<Content[]> {
  const { data } = await getContentList({ type, limit: FETCH_LIMIT });
  const filtered = data.filter((item) => item.id !== excludeId);
  return filtered.slice(0, RELATED_LIMIT);
}

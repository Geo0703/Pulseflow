/**
 * Motor Estatístico Puro — PulseFlow (src/features/analytics/utils/statsEngine.ts)
 * Concentra todos os cálculos de período, média diária, distribuição por quadrante,
 * Top 5 emoções, correlação atividade × humor e matriz Year in Pixels.
 */
import type {
  ActivityTag,
  EmotionQuadrant,
  MoodEntry,
  MoodLevel,
} from '../../../types/domain';
import { EMOTIONS_BY_ID } from '../../../data/emotionsCatalog';

export type StatsPeriod = '7d' | 'month' | '90d' | 'year';

export interface DailyMoodPoint {
  dateKey: string;
  avgMood: number;
  count: number;
  emotions: string[];
}

export interface QuadrantStat {
  quadrant: EmotionQuadrant;
  count: number;
  percentage: number;
}

export interface TopEmotionStat {
  emotionId: string;
  label: string;
  quadrant: EmotionQuadrant;
  count: number;
}

export interface ActivityCorrelationStat {
  activityId: string;
  label: string;
  count: number;
  avgWithTag: number;
  delta: number;
  moodDistribution: Record<MoodLevel, number>;
}

export interface PixelCell {
  monthIndex: number; // 0..11
  day: number;        // 1..31
  valid: boolean;
  dateKey: string | null;
  avgMood: MoodLevel | null;
  entries: MoodEntry[];
}

// Filtra check-ins pertencentes ao período selecionado a partir de uma data de referência
export function filterEntriesByPeriod(
  entries: MoodEntry[],
  period: StatsPeriod,
  referenceDate: Date = new Date()
): MoodEntry[] {
  const end = new Date(referenceDate);
  end.setHours(23, 59, 59, 999);

  let start: Date;
  if (period === '7d') {
    start = new Date(referenceDate);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  } else if (period === '90d') {
    start = new Date(referenceDate);
    start.setDate(start.getDate() - 89);
    start.setHours(0, 0, 0, 0);
  } else if (period === 'month') {
    start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1, 0, 0, 0, 0);
  } else {
    start = new Date(referenceDate.getFullYear(), 0, 1, 0, 0, 0, 0);
  }

  return entries.filter((entry) => {
    const dt = new Date(entry.timestamp);
    return dt >= start && dt <= end;
  });
}

// Calcula média global de humor do conjunto de registros
export function computeAverageMood(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0;
  const sum = entries.reduce((acc, item) => acc + item.moodLevel, 0);
  return Number((sum / entries.length).toFixed(2));
}

// Gera série temporal diária ordenada cronologicamente para o gráfico SVG
export function computeDailyMoodSeries(entries: MoodEntry[]): DailyMoodPoint[] {
  const byDay = new Map<string, { sum: number; count: number; emotions: Set<string> }>();

  for (const entry of entries) {
    const bucket = byDay.get(entry.dateKey) ?? { sum: 0, count: 0, emotions: new Set<string>() };
    bucket.sum += entry.moodLevel;
    bucket.count += 1;
    for (const emoId of entry.emotionIds) {
      const label = EMOTIONS_BY_ID[emoId]?.label;
      if (label) bucket.emotions.add(label);
    }
    byDay.set(entry.dateKey, bucket);
  }

  return Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, data]) => ({
      dateKey,
      avgMood: Number((data.sum / data.count).toFixed(2)),
      count: data.count,
      emotions: Array.from(data.emotions),
    }));
}

// Calcula contagem e percentual de emoções em cada um dos 4 quadrantes (How We Feel)
export function computeQuadrantDistribution(entries: MoodEntry[]): QuadrantStat[] {
  const counts: Record<EmotionQuadrant, number> = {
    'high-unpleasant': 0,
    'high-pleasant': 0,
    'low-unpleasant': 0,
    'low-pleasant': 0,
  };

  let total = 0;
  for (const entry of entries) {
    if (entry.emotionIds.length > 0) {
      for (const emoId of entry.emotionIds) {
        const quad = EMOTIONS_BY_ID[emoId]?.quadrant;
        if (quad) {
          counts[quad] += 1;
          total += 1;
        }
      }
    } else if (entry.primaryQuadrant) {
      counts[entry.primaryQuadrant] += 1;
      total += 1;
    }
  }

  return (Object.keys(counts) as EmotionQuadrant[]).map((quadrant) => ({
    quadrant,
    count: counts[quadrant],
    percentage: total > 0 ? Math.round((counts[quadrant] / total) * 100) : 0,
  }));
}

// Retorna o ranking Top N (padrão Top 5) de emoções mais registradas no período
export function computeTopEmotions(entries: MoodEntry[], limit = 5): TopEmotionStat[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const emoId of entry.emotionIds) {
      counts.set(emoId, (counts.get(emoId) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([emotionId, count]) => {
      const def = EMOTIONS_BY_ID[emotionId];
      if (!def) return null;
      return { emotionId, label: def.label, quadrant: def.quadrant, count };
    })
    .filter((item): item is TopEmotionStat => item !== null)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}

// Calcula impacto relativo (delta = avgWithTag - avgGlobal) e distribuição de humor por atividade
export function computeActivityCorrelations(
  entries: MoodEntry[],
  activities: ActivityTag[]
): ActivityCorrelationStat[] {
  if (entries.length === 0) return [];
  const avgGlobal = computeAverageMood(entries);
  const labelMap = new Map(activities.map((a) => [a.id, a.label]));

  const buckets = new Map<
    string,
    { sum: number; count: number; dist: Record<MoodLevel, number> }
  >();

  for (const entry of entries) {
    for (const actId of entry.activityIds) {
      const curr = buckets.get(actId) ?? {
        sum: 0,
        count: 0,
        dist: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
      curr.sum += entry.moodLevel;
      curr.count += 1;
      curr.dist[entry.moodLevel] += 1;
      buckets.set(actId, curr);
    }
  }

  return Array.from(buckets.entries())
    .map(([activityId, data]) => {
      const avgWithTag = Number((data.sum / data.count).toFixed(2));
      const delta = Number((avgWithTag - avgGlobal).toFixed(2));
      return {
        activityId,
        label: labelMap.get(activityId) ?? activityId,
        count: data.count,
        avgWithTag,
        delta,
        moodDistribution: data.dist,
      };
    })
    .sort((a, b) => b.delta - a.delta);
}

// Constrói a matriz fixa 31 linhas (dias) × 12 colunas (meses) para o Year in Pixels
export function buildYearInPixelsMatrix(entries: MoodEntry[], year: number): PixelCell[][] {
  const entriesByDate = new Map<string, MoodEntry[]>();
  for (const entry of entries) {
    if (!entry.dateKey.startsWith(`${year}-`)) continue;
    const list = entriesByDate.get(entry.dateKey) ?? [];
    list.push(entry);
    entriesByDate.set(entry.dateKey, list);
  }

  const rows: PixelCell[][] = [];
  for (let day = 1; day <= 31; day += 1) {
    const row: PixelCell[] = [];
    for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      if (day > daysInMonth) {
        row.push({
          monthIndex,
          day,
          valid: false,
          dateKey: null,
          avgMood: null,
          entries: [],
        });
        continue;
      }

      const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(
        2,
        '0'
      )}`;
      const dayEntries = entriesByDate.get(dateKey) ?? [];
      const avgMood =
        dayEntries.length > 0
          ? (Math.round(
              dayEntries.reduce((acc, e) => acc + e.moodLevel, 0) / dayEntries.length
            ) as MoodLevel)
          : null;

      row.push({
        monthIndex,
        day,
        valid: true,
        dateKey,
        avgMood,
        entries: dayEntries,
      });
    }
    rows.push(row);
  }
  return rows;
}

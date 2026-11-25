/**
 * Motor de Sequências (Streaks), Metas e Conquistas (src/features/goals/utils/streakCalculator.ts)
 * Calcula streak global, recorde histórico, progresso semanal/mensal das metas
 * vinculadas a atividades e desbloqueio automático das 6 conquistas do MVP.
 */
import type { Goal, MoodEntry, RegulationSession } from '../../../types/domain';
import { toLocalDateKey } from '../../../db/mediaUtils';

export interface GlobalStreakResult {
  currentStreak: number;
  bestStreak: number;
}

export interface GoalProgressResult {
  weekDays: { label: string; dateKey: string; done: boolean }[];
  weekCompletedCount: number;
  monthPercentage: number;
  currentGoalStreak: number;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  unlocked: boolean;
}

// Soma ou subtrai dias de uma chave 'YYYY-MM-DD' sem problemas de fuso horário
function shiftDateKey(dateKey: string, deltaDays: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, m - 1, d + deltaDays);
  return toLocalDateKey(dt);
}

// Calcula a sequência atual (até hoje ou ontem) e o recorde histórico de dias seguidos
export function calculateGlobalStreak(
  entries: MoodEntry[],
  referenceDate: Date = new Date()
): GlobalStreakResult {
  const uniqueDates = Array.from(new Set(entries.map((e) => e.dateKey))).sort();
  if (uniqueDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Recorde histórico percorrendo todas as datas únicas ordenadas
  let bestStreak = 1;
  let running = 1;
  for (let i = 1; i < uniqueDates.length; i += 1) {
    if (shiftDateKey(uniqueDates[i - 1], 1) === uniqueDates[i]) {
      running += 1;
      if (running > bestStreak) bestStreak = running;
    } else {
      running = 1;
    }
  }

  // Sequência atual conta retroativamente a partir de hoje (ou ontem, se ainda não registrou hoje)
  const dateSet = new Set(uniqueDates);
  const todayKey = toLocalDateKey(referenceDate);
  const yesterdayKey = shiftDateKey(todayKey, -1);

  let cursor = dateSet.has(todayKey) ? todayKey : dateSet.has(yesterdayKey) ? yesterdayKey : null;
  let currentStreak = 0;

  while (cursor && dateSet.has(cursor)) {
    currentStreak += 1;
    cursor = shiftDateKey(cursor, -1);
  }

  return { currentStreak, bestStreak };
}

// Calcula progresso semanal (Seg..Dom), percentual mensal e sequência de uma meta
export function calculateGoalProgress(
  goal: Goal,
  entries: MoodEntry[],
  referenceDate: Date = new Date()
): GoalProgressResult {
  const matchingEntries = entries.filter((e) => e.activityIds.includes(goal.activityId));
  const doneDates = new Set(matchingEntries.map((e) => e.dateKey));

  // Determina a segunda-feira da semana corrente
  const refCopy = new Date(referenceDate);
  const dayOfWeek = refCopy.getDay(); // 0=Dom, 1=Seg..6=Sáb
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(refCopy.getFullYear(), refCopy.getMonth(), refCopy.getDate() + diffToMonday);

  const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const weekDays = labels.map((label, idx) => {
    const dt = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + idx);
    const dateKey = toLocalDateKey(dt);
    return { label, dateKey, done: doneDates.has(dateKey) };
  });

  const weekCompletedCount = weekDays.filter((d) => d.done).length;

  // Percentual mensal baseado nos dias decorridos do mês atual
  const monthPrefix = `${referenceDate.getFullYear()}-${String(
    referenceDate.getMonth() + 1
  ).padStart(2, '0')}-`;
  const monthDoneCount = Array.from(doneDates).filter((k) => k.startsWith(monthPrefix)).length;
  const daysElapsed = Math.max(1, referenceDate.getDate());
  const expectedInMonth =
    goal.frequencyType === 'daily'
      ? daysElapsed
      : Math.max(1, Math.ceil((daysElapsed / 7) * goal.targetCount));
  const monthPercentage = Math.min(100, Math.round((monthDoneCount / expectedInMonth) * 100));

  // Sequência de dias consecutivos (ou semanas) em que a atividade da meta foi feita
  const { currentStreak } = calculateGlobalStreak(matchingEntries, referenceDate);

  return {
    weekDays,
    weekCompletedCount,
    monthPercentage,
    currentGoalStreak: currentStreak,
  };
}

// Avalia automaticamente o progresso das 6 conquistas definidas na especificação
export function evaluateAchievements(
  entries: MoodEntry[],
  regulationSessions: RegulationSession[],
  referenceDate: Date = new Date()
): AchievementItem[] {
  const { bestStreak } = calculateGlobalStreak(entries, referenceDate);
  const uniqueEmotions = new Set<string>();
  let notesCount = 0;

  for (const entry of entries) {
    entry.emotionIds.forEach((id) => uniqueEmotions.add(id));
    if (entry.note.trim().length > 0) notesCount += 1;
  }

  const raw: Omit<AchievementItem, 'unlocked'>[] = [
    {
      id: 'first-step',
      title: 'Primeiro Passo',
      description: 'Registrar 1 check-in no PulseFlow.',
      current: Math.min(1, entries.length),
      target: 1,
    },
    {
      id: 'steady-week',
      title: 'Semana Firme',
      description: 'Manter 7 dias seguidos de registros.',
      current: Math.min(7, bestStreak),
      target: 7,
    },
    {
      id: 'solid-habit',
      title: 'Hábito Consolidado',
      description: 'Alcançar 30 dias seguidos de registros.',
      current: Math.min(30, bestStreak),
      target: 30,
    },
    {
      id: 'rich-vocab',
      title: 'Vocabulário Rico',
      description: 'Nomear 10 emoções diferentes na matriz 2D.',
      current: Math.min(10, uniqueEmotions.size),
      target: 10,
    },
    {
      id: 'calm-mind',
      title: 'Mente Calma',
      description: 'Concluir 5 sessões de regulação emocional.',
      current: Math.min(5, regulationSessions.length),
      target: 5,
    },
    {
      id: 'observer',
      title: 'Observador',
      description: 'Escrever 20 notas reflexivas nos check-ins.',
      current: Math.min(20, notesCount),
      target: 20,
    },
  ];

  return raw.map((item) => ({ ...item, unlocked: item.current >= item.target }));
}

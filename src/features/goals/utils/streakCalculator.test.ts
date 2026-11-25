/**
 * Testes do Motor de Streaks e Conquistas (src/features/goals/utils/streakCalculator.test.ts)
 * Valida sequência atual, melhor sequência histórica e desbloqueio de conquistas.
 */
import { describe, expect, it } from 'vitest';
import type { MoodEntry, RegulationSession } from '../../../types/domain';
import { calculateGlobalStreak, evaluateAchievements } from './streakCalculator';

const makeEntry = (dateKey: string, note = '', emotionIds: string[] = []): MoodEntry => ({
  id: crypto.randomUUID(),
  timestamp: `${dateKey}T12:00:00.000Z`,
  dateKey,
  moodLevel: 4,
  emotionIds,
  activityIds: [],
  contextTags: {},
  note,
  attachments: [],
  createdAt: `${dateKey}T12:00:00.000Z`,
  updatedAt: `${dateKey}T12:00:00.000Z`,
});

describe('Cálculo de Streaks e Conquistas (streakCalculator)', () => {
  it('deve calcular sequência atual e melhor sequência histórica corretamente', () => {
    const entries = [
      makeEntry('2026-11-10'),
      makeEntry('2026-11-11'),
      makeEntry('2026-11-12'),
      makeEntry('2026-11-13'),
      makeEntry('2026-11-23'),
      makeEntry('2026-11-24'),
    ];
    const refDate = new Date(2026, 10, 24); // 24/11/2026
    const res = calculateGlobalStreak(entries, refDate);
    expect(res.currentStreak).toBe(2);
    expect(res.bestStreak).toBe(4);
  });

  it('deve desbloquear conquistas conforme critérios do MVP', () => {
    const entries = [
      makeEntry('2026-11-24', 'Nota 1', ['calm']),
    ];
    const sessions: RegulationSession[] = Array.from({ length: 5 }).map((_, i) => ({
      id: `s-${i}`,
      timestamp: '2026-11-24T12:00:00.000Z',
      toolId: 'breathing',
      durationSeconds: 60,
      outcome: 'better',
    }));

    const achievements = evaluateAchievements(entries, sessions, new Date(2026, 10, 24));
    expect(achievements.find((a) => a.id === 'first-step')?.unlocked).toBe(true);
    expect(achievements.find((a) => a.id === 'calm-mind')?.unlocked).toBe(true);
    expect(achievements.find((a) => a.id === 'steady-week')?.unlocked).toBe(false);
  });
});

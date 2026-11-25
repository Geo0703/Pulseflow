/**
 * Testes do Motor Estatístico (src/features/analytics/utils/statsEngine.test.ts)
 * Valida média de humor, quadrantes, Top 5 emoções, correlação atividade × humor
 * e matriz Year in Pixels (incluindo dias inexistentes em fevereiro).
 */
import { describe, expect, it } from 'vitest';
import type { ActivityTag, MoodEntry } from '../../../types/domain';
import {
  buildYearInPixelsMatrix,
  computeActivityCorrelations,
  computeAverageMood,
  computeQuadrantDistribution,
  computeTopEmotions,
} from './statsEngine';

const sampleActivities: ActivityTag[] = [
  { id: 'act-exercicio', groupId: 'grp-corpo', label: 'Exercício', iconName: 'activity', order: 1, archived: false },
  { id: 'act-prazo', groupId: 'grp-trabalho', label: 'Prazo apertado', iconName: 'alert', order: 2, archived: false },
];

const makeEntry = (overrides: Partial<MoodEntry>): MoodEntry => ({
  id: crypto.randomUUID(),
  timestamp: '2026-11-20T12:00:00.000Z',
  dateKey: '2026-11-20',
  moodLevel: 3,
  emotionIds: [],
  activityIds: [],
  contextTags: {},
  note: '',
  attachments: [],
  createdAt: '2026-11-20T12:00:00.000Z',
  updatedAt: '2026-11-20T12:00:00.000Z',
  ...overrides,
});

describe('Motor Estatístico (statsEngine)', () => {
  it('deve calcular média global, distribuição por quadrante e Top 5 emoções', () => {
    const entries = [
      makeEntry({ moodLevel: 5, emotionIds: ['excited', 'grateful'] }),
      makeEntry({ moodLevel: 1, emotionIds: ['anxious'] }),
      makeEntry({ moodLevel: 3, emotionIds: ['excited'] }),
    ];

    expect(computeAverageMood(entries)).toBe(3);

    const quads = computeQuadrantDistribution(entries);
    const yellow = quads.find((q) => q.quadrant === 'high-pleasant');
    const red = quads.find((q) => q.quadrant === 'high-unpleasant');
    expect(yellow?.count).toBeGreaterThan(0);
    expect(red?.count).toBe(1);

    const top = computeTopEmotions(entries, 5);
    expect(top[0].emotionId).toBe('excited');
    expect(top[0].count).toBe(2);
  });

  it('deve calcular delta positivo e negativo na correlação atividade × humor', () => {
    const entries = [
      makeEntry({ moodLevel: 5, activityIds: ['act-exercicio'] }),
      makeEntry({ moodLevel: 5, activityIds: ['act-exercicio'] }),
      makeEntry({ moodLevel: 4, activityIds: ['act-exercicio'] }),
      makeEntry({ moodLevel: 1, activityIds: ['act-prazo'] }),
    ];

    const corr = computeActivityCorrelations(entries, sampleActivities);
    const ex = corr.find((c) => c.activityId === 'act-exercicio');
    const prazo = corr.find((c) => c.activityId === 'act-prazo');
    expect(ex && ex.delta > 0).toBe(true);
    expect(prazo && prazo.delta < 0).toBe(true);
  });

  it('deve marcar 30 de fevereiro como célula inválida na matriz Year in Pixels', () => {
    const matrix2026 = buildYearInPixelsMatrix(
      [makeEntry({ dateKey: '2026-02-14', moodLevel: 5 })],
      2026
    );
    expect(matrix2026).toHaveLength(31);
    expect(matrix2026[13][1].avgMood).toBe(5); // 14 de fevereiro
    expect(matrix2026[29][1].valid).toBe(false); // 30 de fevereiro não existe
    expect(matrix2026[28][1].valid).toBe(false); // 29/02 em ano não bissexto

    const matrix2024 = buildYearInPixelsMatrix([], 2024);
    expect(matrix2024[28][1].valid).toBe(true); // 29/02 válido em ano bissexto
  });
});

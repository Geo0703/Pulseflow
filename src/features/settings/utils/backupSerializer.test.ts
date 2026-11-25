/**
 * Testes de Serialização de Backup e CSV (src/features/settings/utils/backupSerializer.test.ts)
 * Valida exportação/importação JSON, mesclagem sem duplicatas e escape CSV com BOM.
 */
import { describe, expect, it } from 'vitest';
import { DEFAULT_ACTIVITIES, DEFAULT_ACTIVITY_GROUPS } from '../../../data/defaultActivities';
import { DEFAULT_USER_SETTINGS } from '../../../data/defaultSettings';
import type { MoodEntry } from '../../../types/domain';
import {
  buildEntriesCsv,
  createBackupPayload,
  mergeById,
  parseAndValidateBackup,
} from './backupSerializer';

describe('Backup JSON e Exportação CSV (backupSerializer)', () => {
  const sampleEntry: MoodEntry = {
    id: 'e-1',
    timestamp: '2026-11-24T14:30:00.000Z',
    dateKey: '2026-11-24',
    moodLevel: 5,
    emotionIds: ['grateful'],
    primaryQuadrant: 'low-pleasant',
    activityIds: ['act-leitura'],
    contextTags: { location: 'Casa', company: 'Sozinho' },
    note: 'Dia excelente, li "O Pequeno Príncipe"',
    attachments: [],
    createdAt: '2026-11-24T14:30:00.000Z',
    updatedAt: '2026-11-24T14:30:00.000Z',
  };

  it('deve serializar e validar um backup JSON completo', async () => {
    const payload = await createBackupPayload({
      entries: [sampleEntry],
      activityGroups: DEFAULT_ACTIVITY_GROUPS,
      activities: DEFAULT_ACTIVITIES,
      goals: [],
      regulationSessions: [],
      settings: DEFAULT_USER_SETTINGS,
    });

    const parsed = parseAndValidateBackup(JSON.stringify(payload));
    expect(parsed.version).toBe(1);
    expect(parsed.entries).toHaveLength(1);
  });

  it('deve mesclar coleções sem duplicar registros de mesmo ID', () => {
    const merged = mergeById(
      [{ id: '1', name: 'Original' }],
      [
        { id: '1', name: 'Duplicado' },
        { id: '2', name: 'Novo' },
      ]
    );
    expect(merged).toHaveLength(2);
    expect(merged.find((i) => i.id === '1')?.name).toBe('Original');
  });

  it('deve gerar CSV com BOM UTF-8 e escapar vírgulas e aspas corretamente', () => {
    const csv = buildEntriesCsv([sampleEntry], DEFAULT_ACTIVITIES, DEFAULT_USER_SETTINGS);
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('date,time,mood_score,mood_label');
    expect(csv).toContain('"Dia excelente, li ""O Pequeno Príncipe"""');
  });
});

/**
 * Testes dos Repositórios IndexedDB (src/db/repositories/repositories.test.ts)
 * Utiliza fake-indexeddb em memória para validar seed idempotente, CRUD completo,
 * consulta por índice dateKey e soft-delete de atividades.
 */
import { describe, expect, it } from 'vitest';
import type { Goal, MoodEntry, RegulationSession } from '../../types/domain';
import {
  activitiesRepo,
  entriesRepo,
  goalsRepo,
  regulationRepo,
  settingsRepo,
} from './index';

describe('Repositórios Local-First (IndexedDB)', () => {
  it('deve executar o seed inicial de grupos e atividades de forma idempotente', async () => {
    await activitiesRepo.ensureSeeded();
    const firstGroups = await activitiesRepo.getAllGroups();
    const firstActivities = await activitiesRepo.getAllActivities();

    await activitiesRepo.ensureSeeded();
    const secondGroups = await activitiesRepo.getAllGroups();
    const secondActivities = await activitiesRepo.getAllActivities();

    expect(firstGroups.length).toBe(5);
    expect(secondGroups.length).toBe(firstGroups.length);
    expect(firstActivities.length).toBeGreaterThanOrEqual(25);
    expect(secondActivities.length).toBe(firstActivities.length);
  });

  it('deve salvar, consultar por dateKey e excluir check-ins', async () => {
    const entry: MoodEntry = {
      id: 'entry-1',
      timestamp: '2026-11-24T10:00:00.000Z',
      dateKey: '2026-11-24',
      moodLevel: 4,
      emotionIds: ['calm'],
      primaryQuadrant: 'low-pleasant',
      activityIds: ['act-exercicio'],
      contextTags: { location: 'Casa' },
      note: 'Dia produtivo',
      attachments: [],
      createdAt: '2026-11-24T10:00:00.000Z',
      updatedAt: '2026-11-24T10:00:00.000Z',
    };

    await entriesRepo.save(entry);
    const byDate = await entriesRepo.getByDateKey('2026-11-24');
    expect(byDate).toHaveLength(1);
    expect(byDate[0].note).toBe('Dia produtivo');

    await entriesRepo.remove('entry-1');
    expect(await entriesRepo.getById('entry-1')).toBeUndefined();
  });

  it('deve arquivar atividade (soft-delete) sem removê-la do banco histórico', async () => {
    await activitiesRepo.ensureSeeded();
    const all = await activitiesRepo.getAllActivities();
    const target = all[0];

    await activitiesRepo.archiveActivity(target);
    const updated = (await activitiesRepo.getAllActivities()).find((a) => a.id === target.id);
    expect(updated?.archived).toBe(true);
  });

  it('deve persistir metas, sessões de regulação e configurações', async () => {
    const goal: Goal = {
      id: 'goal-1',
      title: 'Caminhar todo dia',
      activityId: 'act-caminhada',
      frequencyType: 'daily',
      targetCount: 1,
      createdAt: '2026-11-24T08:00:00.000Z',
      archived: false,
    };
    await goalsRepo.save(goal);
    expect(await goalsRepo.getAll()).toHaveLength(1);

    const session: RegulationSession = {
      id: 'reg-1',
      timestamp: '2026-11-24T11:00:00.000Z',
      toolId: 'breathing',
      durationSeconds: 64,
      outcome: 'better',
    };
    await regulationRepo.save(session);
    expect(await regulationRepo.getAll()).toHaveLength(1);

    const settings = await settingsRepo.get();
    await settingsRepo.save({ ...settings, themeMode: 'dark' });
    expect((await settingsRepo.get()).themeMode).toBe('dark');
  });
});

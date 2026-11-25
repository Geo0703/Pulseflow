/**
 * Repositório de Grupos e Tags de Atividade (src/db/repositories/activitiesRepo.ts)
 * Gerencia o seed inicial idempotente e o CRUD com soft-delete (archived: true)
 * para preservar integridade referencial nos check-ins históricos.
 */
import type { ActivityGroup, ActivityTag } from '../../types/domain';
import { DEFAULT_ACTIVITIES, DEFAULT_ACTIVITY_GROUPS } from '../../data/defaultActivities';
import {
  clearStore,
  getAllFromStore,
  putInStore,
  putManyInStore,
} from '../indexedDbClient';

export const activitiesRepo = {
  // Popula os grupos e atividades padrão apenas se o banco ainda estiver vazio
  async ensureSeeded(): Promise<void> {
    const existingGroups = await getAllFromStore<ActivityGroup>('activityGroups');
    if (existingGroups.length === 0) {
      await putManyInStore('activityGroups', DEFAULT_ACTIVITY_GROUPS);
    }

    const existingActivities = await getAllFromStore<ActivityTag>('activities');
    if (existingActivities.length === 0) {
      await putManyInStore('activities', DEFAULT_ACTIVITIES);
    }
  },

  // Lista todos os grupos ordenados pelo campo 'order'
  async getAllGroups(): Promise<ActivityGroup[]> {
    const groups = await getAllFromStore<ActivityGroup>('activityGroups');
    return groups.sort((a, b) => a.order - b.order);
  },

  // Lista todas as atividades ordenadas pelo campo 'order'
  async getAllActivities(): Promise<ActivityTag[]> {
    const tags = await getAllFromStore<ActivityTag>('activities');
    return tags.sort((a, b) => a.order - b.order);
  },

  // Cria ou atualiza um grupo de atividades
  async saveGroup(group: ActivityGroup): Promise<ActivityGroup> {
    await putInStore('activityGroups', group);
    return group;
  },

  // Cria ou atualiza uma atividade individual
  async saveActivity(activity: ActivityTag): Promise<ActivityTag> {
    await putInStore('activities', activity);
    return activity;
  },

  // Arquiva (soft-delete) uma atividade sem apagar referências em registros antigos
  async archiveActivity(activity: ActivityTag): Promise<ActivityTag> {
    const updated: ActivityTag = { ...activity, archived: true };
    await putInStore('activities', updated);
    return updated;
  },

  // Arquiva (soft-delete) um grupo de atividades
  async archiveGroup(group: ActivityGroup): Promise<ActivityGroup> {
    const updated: ActivityGroup = { ...group, archived: true };
    await putInStore('activityGroups', updated);
    return updated;
  },

  // Salva coleções inteiras em lote (usado em restauração de backup)
  async saveManyGroups(groups: ActivityGroup[]): Promise<void> {
    await putManyInStore('activityGroups', groups);
  },

  async saveManyActivities(activities: ActivityTag[]): Promise<void> {
    await putManyInStore('activities', activities);
  },

  async clearAll(): Promise<void> {
    await clearStore('activityGroups');
    await clearStore('activities');
  },
};

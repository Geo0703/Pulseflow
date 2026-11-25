/**
 * Repositório de Metas e Hábitos (src/db/repositories/goalsRepo.ts)
 * Gerencia persistência das metas vinculadas às tags de atividade.
 */
import type { Goal } from '../../types/domain';
import {
  clearStore,
  deleteFromStore,
  getAllFromStore,
  putInStore,
  putManyInStore,
} from '../indexedDbClient';

export const goalsRepo = {
  // Retorna todas as metas ordenadas pela data de criação
  async getAll(): Promise<Goal[]> {
    const goals = await getAllFromStore<Goal>('goals');
    return goals.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  // Salva (cria ou edita) uma meta
  async save(goal: Goal): Promise<Goal> {
    await putInStore('goals', goal);
    return goal;
  },

  // Arquiva uma meta mantendo histórico
  async archive(goal: Goal): Promise<Goal> {
    const updated: Goal = { ...goal, archived: true };
    await putInStore('goals', updated);
    return updated;
  },

  // Remove permanentemente uma meta
  async remove(id: string): Promise<void> {
    await deleteFromStore('goals', id);
  },

  async saveMany(goals: Goal[]): Promise<void> {
    await putManyInStore('goals', goals);
  },

  async clear(): Promise<void> {
    await clearStore('goals');
  },
};

/**
 * Repositório de Sessões de Regulação (src/db/repositories/regulationRepo.ts)
 * Armazena o histórico e a avaliação de impacto das micro-estratégias concluídas.
 */
import type { RegulationSession } from '../../types/domain';
import {
  clearStore,
  getAllFromStore,
  putInStore,
  putManyInStore,
} from '../indexedDbClient';

export const regulationRepo = {
  // Lista sessões concluídas da mais recente para a mais antiga
  async getAll(): Promise<RegulationSession[]> {
    const sessions = await getAllFromStore<RegulationSession>('regulationSessions');
    return sessions.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  },

  // Salva uma nova sessão de regulação
  async save(session: RegulationSession): Promise<RegulationSession> {
    await putInStore('regulationSessions', session);
    return session;
  },

  async saveMany(sessions: RegulationSession[]): Promise<void> {
    await putManyInStore('regulationSessions', sessions);
  },

  async clear(): Promise<void> {
    await clearStore('regulationSessions');
  },
};

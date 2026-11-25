/**
 * Repositório de Check-ins (src/db/repositories/entriesRepo.ts)
 * Isola operações de leitura, gravação, filtro por data e exclusão de MoodEntry.
 */
import type { MoodEntry } from '../../types/domain';
import {
  clearStore,
  deleteFromStore,
  getAllFromStore,
  getByIdFromStore,
  openDatabase,
  putInStore,
  putManyInStore,
} from '../indexedDbClient';

export const entriesRepo = {
  // Retorna todos os check-ins ordenados do mais recente para o mais antigo
  async getAll(): Promise<MoodEntry[]> {
    const all = await getAllFromStore<MoodEntry>('entries');
    return all.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  },

  // Busca um check-in específico pelo ID
  async getById(id: string): Promise<MoodEntry | undefined> {
    return getByIdFromStore<MoodEntry>('entries', id);
  },

  // Consulta todos os check-ins de um dia específico usando o índice 'by_dateKey'
  async getByDateKey(dateKey: string): Promise<MoodEntry[]> {
    const db = await openDatabase();
    return new Promise<MoodEntry[]>((resolve, reject) => {
      const tx = db.transaction('entries', 'readonly');
      const index = tx.objectStore('entries').index('by_dateKey');
      const req = index.getAll(IDBKeyRange.only(dateKey));
      req.onsuccess = () => {
        const items = (req.result as MoodEntry[]).sort((a, b) =>
          b.timestamp.localeCompare(a.timestamp)
        );
        resolve(items);
      };
      req.onerror = () => reject(req.error);
    });
  },

  // Salva (cria ou atualiza) um registro de check-in
  async save(entry: MoodEntry): Promise<MoodEntry> {
    await putInStore('entries', entry);
    return entry;
  },

  // Salva múltiplos registros em lote (usado em importação/mesclagem)
  async saveMany(entries: MoodEntry[]): Promise<void> {
    await putManyInStore('entries', entries);
  },

  // Exclui permanentemente um check-in pelo ID
  async remove(id: string): Promise<void> {
    await deleteFromStore('entries', id);
  },

  // Limpa todos os check-ins (usado na opção "Substituir tudo" do backup)
  async clear(): Promise<void> {
    await clearStore('entries');
  },
};

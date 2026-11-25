/**
 * Repositório de Configurações do Usuário (src/db/repositories/settingsRepo.ts)
 * Garante leitura com fallback para DEFAULT_USER_SETTINGS e gravação única.
 */
import type { UserSettings } from '../../types/domain';
import { DEFAULT_USER_SETTINGS } from '../../data/defaultSettings';
import { getByIdFromStore, putInStore } from '../indexedDbClient';

export const settingsRepo = {
  // Recupera as configurações locais ou inicializa com os valores padrão
  async get(): Promise<UserSettings> {
    const stored = await getByIdFromStore<UserSettings>('settings', 'user-settings');
    if (stored) {
      return {
        ...DEFAULT_USER_SETTINGS,
        ...stored,
        moodLabels: {
          ...DEFAULT_USER_SETTINGS.moodLabels,
          ...(stored.moodLabels ?? {}),
        },
      };
    }
    await putInStore('settings', DEFAULT_USER_SETTINGS);
    return DEFAULT_USER_SETTINGS;
  },

  // Persiste as configurações atualizadas do usuário
  async save(settings: UserSettings): Promise<UserSettings> {
    const normalized: UserSettings = { ...settings, id: 'user-settings' };
    await putInStore('settings', normalized);
    return normalized;
  },
};

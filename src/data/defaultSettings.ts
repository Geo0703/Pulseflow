/**
 * Configurações Padrão do Usuário (src/data/defaultSettings.ts)
 * Define tema inicial, paleta de cores, rótulos da escala de humor e bloqueio.
 */
import type { UserSettings } from '../types/domain';

// Registro inicial salvo na store 'settings' caso ainda não exista configuração local
export const DEFAULT_USER_SETTINGS: UserSettings = {
  id: 'user-settings',
  themeMode: 'system',
  colorPalette: 'default',
  moodLabels: {
    1: 'Péssimo',
    2: 'Mal',
    3: 'Neutro',
    4: 'Bem',
    5: 'Ótimo',
  },
  pinEnabled: false,
  pinHash: null,
  pinAutoLockMinutes: 0,
  lastBackupAt: null,
};

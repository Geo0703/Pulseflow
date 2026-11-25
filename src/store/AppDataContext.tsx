/**
 * Contexto Global de Dados Locais (src/store/AppDataContext.tsx)
 * Carrega e sincroniza check-ins, atividades, metas, sessões de regulação e
 * configurações a partir do IndexedDB usando useReducer.
 */
import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import type {
  ActivityGroup,
  ActivityTag,
  Goal,
  MoodEntry,
  RegulationSession,
  UserSettings,
} from '../types/domain';
import { DEFAULT_USER_SETTINGS } from '../data/defaultSettings';
import {
  activitiesRepo,
  entriesRepo,
  goalsRepo,
  regulationRepo,
  settingsRepo,
} from '../db/repositories';
import { useTheme } from './ThemeContext';

// Estado consolidado de dados carregados do banco local
interface AppDataState {
  loading: boolean;
  entries: MoodEntry[];
  activityGroups: ActivityGroup[];
  activities: ActivityTag[];
  goals: Goal[];
  regulationSessions: RegulationSession[];
  settings: UserSettings;
}

type AppDataAction =
  | { type: 'LOADED'; payload: Omit<AppDataState, 'loading'> }
  | { type: 'SET_ENTRIES'; payload: MoodEntry[] }
  | { type: 'SET_GROUPS'; payload: ActivityGroup[] }
  | { type: 'SET_ACTIVITIES'; payload: ActivityTag[] }
  | { type: 'SET_GOALS'; payload: Goal[] }
  | { type: 'SET_REGULATIONS'; payload: RegulationSession[] }
  | { type: 'SET_SETTINGS'; payload: UserSettings };

const initialState: AppDataState = {
  loading: true,
  entries: [],
  activityGroups: [],
  activities: [],
  goals: [],
  regulationSessions: [],
  settings: DEFAULT_USER_SETTINGS,
};

// Reducer puro para manter atualizações previsíveis do estado da aplicação
function appDataReducer(state: AppDataState, action: AppDataAction): AppDataState {
  switch (action.type) {
    case 'LOADED':
      return { ...action.payload, loading: false };
    case 'SET_ENTRIES':
      return { ...state, entries: action.payload };
    case 'SET_GROUPS':
      return { ...state, activityGroups: action.payload };
    case 'SET_ACTIVITIES':
      return { ...state, activities: action.payload };
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    case 'SET_REGULATIONS':
      return { ...state, regulationSessions: action.payload };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    default:
      return state;
  }
}

interface AppDataContextValue extends AppDataState {
  reloadAll: () => Promise<void>;
  saveEntry: (entry: MoodEntry) => Promise<MoodEntry>;
  deleteEntry: (id: string) => Promise<void>;
  saveActivityGroup: (group: ActivityGroup) => Promise<void>;
  archiveActivityGroup: (group: ActivityGroup) => Promise<void>;
  saveActivity: (activity: ActivityTag) => Promise<void>;
  archiveActivity: (activity: ActivityTag) => Promise<void>;
  saveGoal: (goal: Goal) => Promise<void>;
  archiveGoal: (goal: Goal) => Promise<void>;
  saveRegulationSession: (session: RegulationSession) => Promise<void>;
  updateSettings: (partial: Partial<UserSettings>) => Promise<UserSettings>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appDataReducer, initialState);
  const { setThemeMode, setColorPalette } = useTheme();

  // Carrega todos os dados do IndexedDB e garante seed inicial idempotente
  const reloadAll = useCallback(async () => {
    await activitiesRepo.ensureSeeded();
    const [entries, activityGroups, activities, goals, regulationSessions, settings] =
      await Promise.all([
        entriesRepo.getAll(),
        activitiesRepo.getAllGroups(),
        activitiesRepo.getAllActivities(),
        goalsRepo.getAll(),
        regulationRepo.getAll(),
        settingsRepo.get(),
      ]);

    setThemeMode(settings.themeMode);
    setColorPalette(settings.colorPalette);

    dispatch({
      type: 'LOADED',
      payload: { entries, activityGroups, activities, goals, regulationSessions, settings },
    });
  }, [setColorPalette, setThemeMode]);

  // Hidrata os dados na montagem inicial e solicita persistência de armazenamento
  useEffect(() => {
    void reloadAll();
    if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
      void navigator.storage.persist().catch(() => undefined);
    }
  }, [reloadAll]);

  // Salva ou atualiza um check-in no IndexedDB e atualiza a lista ordenada
  const saveEntry = useCallback(async (entry: MoodEntry) => {
    await entriesRepo.save(entry);
    const updated = await entriesRepo.getAll();
    dispatch({ type: 'SET_ENTRIES', payload: updated });
    return entry;
  }, []);

  // Remove um check-in pelo ID
  const deleteEntry = useCallback(async (id: string) => {
    await entriesRepo.remove(id);
    const updated = await entriesRepo.getAll();
    dispatch({ type: 'SET_ENTRIES', payload: updated });
  }, []);

  // Persiste um grupo de atividades
  const saveActivityGroup = useCallback(async (group: ActivityGroup) => {
    await activitiesRepo.saveGroup(group);
    const updated = await activitiesRepo.getAllGroups();
    dispatch({ type: 'SET_GROUPS', payload: updated });
  }, []);

  // Arquiva um grupo de atividades (soft-delete)
  const archiveActivityGroup = useCallback(async (group: ActivityGroup) => {
    await activitiesRepo.archiveGroup(group);
    const updated = await activitiesRepo.getAllGroups();
    dispatch({ type: 'SET_GROUPS', payload: updated });
  }, []);

  // Persiste uma tag de atividade
  const saveActivity = useCallback(async (activity: ActivityTag) => {
    await activitiesRepo.saveActivity(activity);
    const updated = await activitiesRepo.getAllActivities();
    dispatch({ type: 'SET_ACTIVITIES', payload: updated });
  }, []);

  // Arquiva uma tag de atividade preservando histórico
  const archiveActivity = useCallback(async (activity: ActivityTag) => {
    await activitiesRepo.archiveActivity(activity);
    const updated = await activitiesRepo.getAllActivities();
    dispatch({ type: 'SET_ACTIVITIES', payload: updated });
  }, []);

  // Persiste uma meta pessoal
  const saveGoal = useCallback(async (goal: Goal) => {
    await goalsRepo.save(goal);
    const updated = await goalsRepo.getAll();
    dispatch({ type: 'SET_GOALS', payload: updated });
  }, []);

  // Arquiva uma meta pessoal
  const archiveGoal = useCallback(async (goal: Goal) => {
    await goalsRepo.archive(goal);
    const updated = await goalsRepo.getAll();
    dispatch({ type: 'SET_GOALS', payload: updated });
  }, []);

  // Persiste uma sessão concluída de regulação emocional
  const saveRegulationSession = useCallback(async (session: RegulationSession) => {
    await regulationRepo.save(session);
    const updated = await regulationRepo.getAll();
    dispatch({ type: 'SET_REGULATIONS', payload: updated });
  }, []);

  // Atualiza parcialmente as configurações e sincroniza tema/paleta ativos
  const updateSettings = useCallback(
    async (partial: Partial<UserSettings>) => {
      const merged: UserSettings = { ...state.settings, ...partial, id: 'user-settings' };
      const saved = await settingsRepo.save(merged);
      setThemeMode(saved.themeMode);
      setColorPalette(saved.colorPalette);
      dispatch({ type: 'SET_SETTINGS', payload: saved });
      return saved;
    },
    [setColorPalette, setThemeMode, state.settings]
  );

  return (
    <AppDataContext.Provider
      value={{
        ...state,
        reloadAll,
        saveEntry,
        deleteEntry,
        saveActivityGroup,
        archiveActivityGroup,
        saveActivity,
        archiveActivity,
        saveGoal,
        archiveGoal,
        saveRegulationSession,
        updateSettings,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

// Hook de acesso seguro ao estado global de dados
export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData deve ser usado dentro de AppDataProvider.');
  }
  return ctx;
}

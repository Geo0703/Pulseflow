/**
 * Componente Raiz App (src/App.tsx)
 * Orquestra rotas, AppShell responsivo, CheckinModal global, PostCheckinPrompt
 * e guarda de privacidade PinLockOverlay.
 */
import React, { useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import type { MoodEntry, RegulationToolId } from './types/domain';
import { ThemeProvider } from './store/ThemeContext';
import { AppDataProvider } from './store/AppDataContext';
import { LockProvider, useLock } from './store/LockContext';
import { ToastProvider, useToast } from './components/ui/Toast/ToastContext';
import { AppShell } from './components/layout/AppShell/AppShell';
import { CheckinModal } from './features/checkin/CheckinModal';
import {
  PostCheckinPrompt,
  shouldShowRegulationPrompt,
} from './features/checkin/PostCheckinPrompt';
import { TimelinePage } from './features/timeline/TimelinePage';
import { ToolsPage } from './features/regulation/ToolsPage';
import { AnalyticsPage } from './features/analytics/AnalyticsPage';
import { GoalsPage } from './features/goals/GoalsPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { PinLockOverlay } from './features/settings/components/PinLockOverlay/PinLockOverlay';

// Miolo interno que consome os contextos de roteamento, bloqueio e notificações
export const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const { isLocked, unlockWithPin } = useLock();
  const { showToast } = useToast();

  const [checkinOpen, setCheckinOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null);
  const [promptEntry, setPromptEntry] = useState<MoodEntry | null>(null);

  const openNewCheckin = () => {
    setEditingEntry(null);
    setCheckinOpen(true);
  };

  const openEditCheckin = (entry: MoodEntry) => {
    setEditingEntry(entry);
    setCheckinOpen(true);
  };

  // Exibe feedback e aciona convite gentil de regulação quando aplicável
  const handleCheckinSaved = (saved: MoodEntry) => {
    showToast('Check-in salvo com sucesso.');
    if (!editingEntry && shouldShowRegulationPrompt(saved)) {
      setPromptEntry(saved);
    }
  };

  const handleStartRecommendedTool = (toolId: RegulationToolId, entryId: string) => {
    setPromptEntry(null);
    navigate(`/tools?tool=${toolId}&entryId=${entryId}`);
  };

  return (
    <>
      {isLocked && <PinLockOverlay onUnlock={unlockWithPin} />}

      <AppShell onOpenCheckin={openNewCheckin}>
        <Routes>
          <Route path="/" element={<Navigate to="/timeline" replace />} />
          <Route
            path="/timeline"
            element={
              <TimelinePage
                onOpenNewCheckin={openNewCheckin}
                onEditEntry={openEditCheckin}
              />
            }
          />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/timeline" replace />} />
        </Routes>
      </AppShell>

      <CheckinModal
        open={checkinOpen}
        editingEntry={editingEntry}
        onClose={() => setCheckinOpen(false)}
        onSaved={handleCheckinSaved}
      />

      <PostCheckinPrompt
        entry={promptEntry}
        onDismiss={() => setPromptEntry(null)}
        onStartTool={handleStartRecommendedTool}
      />
    </>
  );
};

// Exportação principal envolvendo toda a árvore nos providers globais
export const App: React.FC = () => {
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <ToastProvider>
          <AppDataProvider>
            <LockProvider>
              <AppContent />
            </LockProvider>
          </AppDataProvider>
        </ToastProvider>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;

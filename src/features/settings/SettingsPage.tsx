/**
 * Página SettingsPage (src/features/settings/SettingsPage.tsx)
 * Reúne customização de temas/paletas, rótulos de humor, CRUD de atividades,
 * bloqueio por PIN local e painel de backup/exportação.
 */
import React from 'react';
import { useAppData } from '../../store/AppDataContext';
import { useToast } from '../../components/ui/Toast/ToastContext';
import { PageHeader } from '../../components/layout/PageHeader/PageHeader';
import { Card } from '../../components/ui/Card/Card';
import { ThemePicker } from './components/ThemePicker/ThemePicker';
import { MoodLabelManager } from './components/MoodLabelManager/MoodLabelManager';
import { ActivityManager } from './components/ActivityManager/ActivityManager';
import { PinSettings } from './components/PinSettings/PinSettings';
import { BackupPanel } from './components/BackupPanel/BackupPanel';

export const SettingsPage: React.FC = () => {
  const {
    activityGroups,
    activities,
    settings,
    saveActivityGroup,
    saveActivity,
    archiveActivity,
    updateSettings,
  } = useAppData();
  const { showToast } = useToast();

  return (
    <div className="pf-stack pf-stack--lg">
      <PageHeader
        title="Ajustes e Privacidade"
        subtitle="Personalize aparência, atividades, proteção por PIN e portabilidade local."
      />

      <Card>
        <div className="pf-stack">
          <h2>Aparência e Paletas</h2>
          <ThemePicker
            themeMode={settings.themeMode}
            colorPalette={settings.colorPalette}
            onChangeTheme={(themeMode) => void updateSettings({ themeMode })}
            onChangePalette={(colorPalette) => void updateSettings({ colorPalette })}
          />
        </div>
      </Card>

      <Card>
        <div className="pf-stack">
          <h2>Rótulos da Escala de Humor</h2>
          <MoodLabelManager
            moodLabels={settings.moodLabels}
            onSave={async (moodLabels) => {
              await updateSettings({ moodLabels });
              showToast('Rótulos de humor atualizados.');
            }}
          />
        </div>
      </Card>

      <Card>
        <div className="pf-stack">
          <h2>Grupos e Atividades</h2>
          <ActivityManager
            groups={activityGroups}
            activities={activities}
            onSaveGroup={async (g) => {
              await saveActivityGroup(g);
              showToast('Grupo salvo.');
            }}
            onSaveActivity={async (a) => {
              await saveActivity(a);
              showToast('Atividade adicionada.');
            }}
            onArchiveActivity={async (a) => {
              await archiveActivity(a);
              showToast(`Atividade "${a.label}" arquivada.`);
            }}
          />
        </div>
      </Card>

      <Card>
        <div className="pf-stack">
          <h2>Segurança e PIN Local</h2>
          <PinSettings settings={settings} onUpdate={updateSettings} />
        </div>
      </Card>

      <Card>
        <div className="pf-stack">
          <h2>Backup, Exportação e Impressão</h2>
          <BackupPanel />
        </div>
      </Card>
    </div>
  );
};

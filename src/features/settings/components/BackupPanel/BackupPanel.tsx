/**
 * Componente BackupPanel (src/features/settings/components/BackupPanel/BackupPanel.tsx)
 * Oferece exportação JSON (com mídia), restauração (Substituir ou Mesclar),
 * exportação CSV UTF-8 BOM, impressão PDF e medidor de uso de armazenamento local.
 */
import React, { useEffect, useState } from 'react';
import { useAppData } from '../../../../store/AppDataContext';
import { useToast } from '../../../../components/ui/Toast/ToastContext';
import {
  activitiesRepo,
  entriesRepo,
  goalsRepo,
  regulationRepo,
  settingsRepo,
} from '../../../../db/repositories';
import {
  buildEntriesCsv,
  createBackupPayload,
  deserializeBackupEntries,
  mergeById,
  parseAndValidateBackup,
} from '../../utils/backupSerializer';
import { Button } from '../../../../components/ui/Button/Button';
import { Icon } from '../../../../components/ui/Icon/Icon';

export const BackupPanel: React.FC = () => {
  const {
    entries,
    activityGroups,
    activities,
    goals,
    regulationSessions,
    settings,
    reloadAll,
    updateSettings,
  } = useAppData();
  const { showToast } = useToast();

  const [restoreMode, setRestoreMode] = useState<'merge' | 'replace'>('merge');
  const [storageText, setStorageText] = useState<string>('Calculando armazenamento local...');

  // Consulta estimativa de cota usada no IndexedDB via Storage API
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.storage?.estimate) {
      void navigator.storage
        .estimate()
        .then((est) => {
          const usedMb = ((est.usage ?? 0) / (1024 * 1024)).toFixed(2);
          const quotaMb = ((est.quota ?? 0) / (1024 * 1024)).toFixed(0);
          setStorageText(`Armazenamento usado: ${usedMb} MB de ${quotaMb} MB disponíveis.`);
        })
        .catch(() => setStorageText('Estimativa de armazenamento indisponível neste navegador.'));
    }
  }, [entries.length]);

  const triggerDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Exporta backup completo JSON e registra data do último backup
  const handleExportJson = async () => {
    const payload = await createBackupPayload({
      entries,
      activityGroups,
      activities,
      goals,
      regulationSessions,
      settings,
    });
    const dateStamp = new Date().toISOString().slice(0, 10);
    triggerDownload(
      JSON.stringify(payload, null, 2),
      `pulseflow-backup-${dateStamp}.json`,
      'application/json'
    );
    await updateSettings({ lastBackupAt: new Date().toISOString() });
    showToast('Backup JSON exportado com sucesso.');
  };

  // Exporta planilha CSV compatível com Excel (UTF-8 com BOM)
  const handleExportCsv = () => {
    const csv = buildEntriesCsv(entries, activities, settings);
    const dateStamp = new Date().toISOString().slice(0, 10);
    triggerDownload(csv, `pulseflow-registros-${dateStamp}.csv`, 'text/csv;charset=utf-8');
    showToast('Arquivo CSV exportado.');
  };

  // Restaura arquivo JSON escolhendo entre Substituir tudo ou Mesclar sem duplicar IDs
  const handleImportJson = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const backup = parseAndValidateBackup(text);
      const importedEntries = deserializeBackupEntries(backup.entries);

      if (restoreMode === 'replace') {
        await Promise.all([
          entriesRepo.clear(),
          activitiesRepo.clearAll(),
          goalsRepo.clear(),
          regulationRepo.clear(),
        ]);
        await entriesRepo.saveMany(importedEntries);
        await activitiesRepo.saveManyGroups(backup.activityGroups);
        await activitiesRepo.saveManyActivities(backup.activities);
        await goalsRepo.saveMany(backup.goals);
        await regulationRepo.saveMany(backup.regulationSessions);
        await settingsRepo.save(backup.settings);
      } else {
        await entriesRepo.saveMany(mergeById(entries, importedEntries));
        await activitiesRepo.saveManyGroups(mergeById(activityGroups, backup.activityGroups));
        await activitiesRepo.saveManyActivities(mergeById(activities, backup.activities));
        await goalsRepo.saveMany(mergeById(goals, backup.goals));
        await regulationRepo.saveMany(
          mergeById(regulationSessions, backup.regulationSessions)
        );
      }

      await reloadAll();
      showToast('Backup restaurado com sucesso.');
    } catch {
      showToast('Não foi possível importar: arquivo JSON inválido.', 'error');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="pf-stack">
      <p className="pf-text-xs">{storageText}</p>
      <p className="pf-text-xs">
        Último backup:{' '}
        {settings.lastBackupAt
          ? new Date(settings.lastBackupAt).toLocaleString('pt-BR')
          : 'Nenhum backup realizado ainda — recomenda-se exportar periodicamente.'}
      </p>

      <div className="pf-row">
        <Button
          variant="primary"
          icon={<Icon name="download" size={16} />}
          onClick={() => void handleExportJson()}
        >
          Exportar Backup JSON
        </Button>

        <Button
          variant="secondary"
          icon={<Icon name="download" size={16} />}
          onClick={handleExportCsv}
        >
          Exportar CSV (Excel)
        </Button>

        <Button
          variant="secondary"
          icon={<Icon name="printer" size={16} />}
          onClick={() => window.print()}
        >
          Imprimir / Salvar PDF
        </Button>
      </div>

      <div className="pf-row">
        <select
          aria-label="Modo de restauração do backup"
          className="pf-field__control"
          style={{ width: 'auto' }}
          value={restoreMode}
          onChange={(e) => setRestoreMode(e.target.value as 'merge' | 'replace')}
        >
          <option value="merge">Mesclar (sem duplicar IDs)</option>
          <option value="replace">Substituir tudo</option>
        </select>

        <label className="pf-media__file-label">
          <Icon name="upload" size={16} />
          <span>Restaurar Backup JSON</span>
          <input
            type="file"
            accept="application/json,.json"
            className="pf-sr-only"
            onChange={(e) => void handleImportJson(e)}
          />
        </label>
      </div>
    </div>
  );
};

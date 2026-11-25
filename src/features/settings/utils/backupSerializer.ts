/**
 * Serialização de Backup JSON e Exportação CSV (src/features/settings/utils/backupSerializer.ts)
 * Converte registros e mídias (Base64) para backup/restauração completa (Substituir ou Mesclar)
 * e gera planilhas CSV em UTF-8 com BOM compatíveis com Microsoft Excel.
 */
import type {
  ActivityGroup,
  ActivityTag,
  Goal,
  MoodEntry,
  PulseFlowBackup,
  RegulationSession,
  SerializedMoodEntry,
  UserSettings,
} from '../../../types/domain';
import { EMOTIONS_BY_ID } from '../../../data/emotionsCatalog';
import { blobToDataUrl, dataUrlToBlob } from '../../../db/mediaUtils';

export interface BackupSourceData {
  entries: MoodEntry[];
  activityGroups: ActivityGroup[];
  activities: ActivityTag[];
  goals: Goal[];
  regulationSessions: RegulationSession[];
  settings: UserSettings;
}

// Monta o objeto JSON de backup convertendo anexos Blob para Base64 Data URL
export async function createBackupPayload(data: BackupSourceData): Promise<PulseFlowBackup> {
  const serializedEntries: SerializedMoodEntry[] = await Promise.all(
    data.entries.map(async (entry) => ({
      ...entry,
      attachments: await Promise.all(
        entry.attachments.map(async (att) => ({
          id: att.id,
          type: att.type,
          mimeType: att.mimeType,
          durationSeconds: att.durationSeconds,
          dataUrl: await blobToDataUrl(att.blob),
        }))
      ),
    }))
  );

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    entries: serializedEntries,
    activityGroups: data.activityGroups,
    activities: data.activities,
    goals: data.goals,
    regulationSessions: data.regulationSessions,
    settings: data.settings,
  };
}

// Valida estruturalmente um arquivo JSON importado antes de alterar o banco local
export function parseAndValidateBackup(rawJson: string): PulseFlowBackup {
  const parsed = JSON.parse(rawJson) as Partial<PulseFlowBackup>;
  if (
    !parsed ||
    typeof parsed.version !== 'number' ||
    !Array.isArray(parsed.entries) ||
    !Array.isArray(parsed.activityGroups) ||
    !Array.isArray(parsed.activities) ||
    !Array.isArray(parsed.goals) ||
    !Array.isArray(parsed.regulationSessions) ||
    !parsed.settings
  ) {
    throw new Error('Arquivo de backup inválido ou corrompido.');
  }
  return parsed as PulseFlowBackup;
}

// Reconstrói MoodEntry[] a partir do backup restaurando os Blobs de mídia
export function deserializeBackupEntries(serialized: SerializedMoodEntry[]): MoodEntry[] {
  return serialized.map((entry) => ({
    ...entry,
    attachments: (entry.attachments ?? []).map((att) => ({
      id: att.id,
      type: att.type,
      mimeType: att.mimeType,
      durationSeconds: att.durationSeconds,
      blob: dataUrlToBlob(att.dataUrl, att.mimeType),
    })),
  }));
}

// Mescla listas por ID sem criar duplicatas (mantendo itens existentes e adicionando novos)
export function mergeById<T extends { id: string }>(existing: T[], incoming: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of existing) map.set(item.id, item);
  for (const item of incoming) {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  }
  return Array.from(map.values());
}

// Escapa células CSV contendo aspas, vírgulas ou quebras de linha
function escapeCsvCell(value: string): string {
  const str = value ?? '';
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Gera conteúdo CSV UTF-8 com BOM (\uFEFF) com todas as colunas exigidas pela especificação
export function buildEntriesCsv(
  entries: MoodEntry[],
  activities: ActivityTag[],
  settings: UserSettings
): string {
  const actMap = new Map(activities.map((a) => [a.id, a.label]));
  const header = [
    'date',
    'time',
    'mood_score',
    'mood_label',
    'quadrant',
    'emotions',
    'activities',
    'location',
    'company',
    'note',
  ].join(',');

  const rows = entries.map((entry) => {
    const dt = new Date(entry.timestamp);
    const time = `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(
      2,
      '0'
    )}`;
    const emotions = entry.emotionIds.map((id) => EMOTIONS_BY_ID[id]?.label ?? id).join('; ');
    const acts = entry.activityIds.map((id) => actMap.get(id) ?? id).join('; ');

    return [
      entry.dateKey,
      time,
      String(entry.moodLevel),
      settings.moodLabels[entry.moodLevel],
      entry.primaryQuadrant ?? '',
      emotions,
      acts,
      entry.contextTags.location ?? '',
      entry.contextTags.company ?? '',
      entry.note,
    ]
      .map(escapeCsvCell)
      .join(',');
  });

  return `\uFEFF${[header, ...rows].join('\n')}`;
}

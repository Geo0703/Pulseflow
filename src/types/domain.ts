/**
 * Contratos de Domínio do PulseFlow (src/types/domain.ts)
 * Centraliza todas as interfaces e tipos compartilhados entre IndexedDB,
 * motores de cálculo estatístico, metas, configurações e interface React.
 */

// Escala numérica de humor base de 5 níveis (1 = Péssimo até 5 = Ótimo)
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

// Quatro quadrantes bidimensionais (Energia × Valência) inspirados no How We Feel
export type EmotionQuadrant =
  | 'high-unpleasant' // Vermelho: Alta Energia + Desagradável
  | 'high-pleasant'   // Amarelo: Alta Energia + Agradável
  | 'low-unpleasant'  // Azul: Baixa Energia + Desagradável
  | 'low-pleasant';   // Verde: Baixa Energia + Agradável

// Identificadores das 3 micro-estratégias interativas de regulação
export type RegulationToolId = 'breathing' | 'grounding' | 'reframe';

// Definição estática de uma emoção do catálogo oficial de 64 emoções
export interface EmotionDefinition {
  id: string;
  label: string;
  definition: string;
  quadrant: EmotionQuadrant;
  suggestedMood: MoodLevel;
  suggestedToolId: RegulationToolId | null;
}

// Grupo organizador de tags de atividade (ex.: Sono, Social, Lazer)
export interface ActivityGroup {
  id: string;
  name: string;
  order: number;
  archived: boolean;
}

// Tag individual de atividade selecionável durante o check-in
export interface ActivityTag {
  id: string;
  groupId: string;
  label: string;
  iconName: string;
  order: number;
  archived: boolean;
}

// Anexo local de mídia (foto comprimida ou nota de voz) salvo no IndexedDB
export interface MediaAttachment {
  id: string;
  type: 'image' | 'audio';
  mimeType: string;
  blob: Blob;
  durationSeconds?: number;
}

// Registro completo de check-in híbrido (Daylio + How We Feel)
export interface MoodEntry {
  id: string;                 // Identificador único gerado via crypto.randomUUID()
  timestamp: string;          // Data e hora em formato ISO 8601
  dateKey: string;            // Chave de agrupamento diário 'YYYY-MM-DD'
  moodLevel: MoodLevel;
  emotionIds: string[];       // Entre 0 e 3 IDs de EmotionDefinition
  primaryQuadrant?: EmotionQuadrant;
  activityIds: string[];      // IDs de ActivityTag
  contextTags: {
    location?: string;
    company?: string;
  };
  note: string;
  attachments: MediaAttachment[];
  createdAt: string;
  updatedAt: string;
}

// Meta pessoal vinculada automaticamente a uma atividade existente
export interface Goal {
  id: string;
  title: string;
  activityId: string;
  frequencyType: 'daily' | 'weekly';
  targetCount: number;        // 1 para meta diária; 1..7 para meta semanal
  createdAt: string;
  archived: boolean;
}

// Sessão concluída de micro-estratégia de regulação emocional
export interface RegulationSession {
  id: string;
  timestamp: string;
  linkedEntryId?: string;
  toolId: RegulationToolId;
  durationSeconds: number;
  outcome: 'worse' | 'same' | 'better' | 'much_better';
}

// Preferências globais do usuário persistidas localmente
export interface UserSettings {
  id: 'user-settings';
  themeMode: 'light' | 'dark' | 'system';
  colorPalette: 'default' | 'pastel' | 'high-contrast';
  moodLabels: Record<MoodLevel, string>;
  pinEnabled: boolean;
  pinHash: string | null;     // Hash hexadecimal SHA-256 do PIN de 4 dígitos
  pinAutoLockMinutes: 0 | 1 | 5 | 15;
  lastBackupAt: string | null;
}

// Estrutura de backup completo exportado e importado em formato JSON
export interface SerializedMediaAttachment {
  id: string;
  type: 'image' | 'audio';
  mimeType: string;
  dataUrl: string;
  durationSeconds?: number;
}

export interface SerializedMoodEntry extends Omit<MoodEntry, 'attachments'> {
  attachments: SerializedMediaAttachment[];
}

export interface PulseFlowBackup {
  version: number;
  exportedAt: string;
  entries: SerializedMoodEntry[];
  activityGroups: ActivityGroup[];
  activities: ActivityTag[];
  goals: Goal[];
  regulationSessions: RegulationSession[];
  settings: UserSettings;
}

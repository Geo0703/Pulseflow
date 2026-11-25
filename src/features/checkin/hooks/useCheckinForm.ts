/**
 * Hook useCheckinForm (src/features/checkin/hooks/useCheckinForm.ts)
 * Encapsula o estado e as regras de negócio do check-in híbrido (criação e edição):
 * humor obrigatório, limite de 3 emoções, sugestão automática de humor e mídia local.
 */
import { useEffect, useState } from 'react';
import type {
  EmotionDefinition,
  MediaAttachment,
  MoodEntry,
  MoodLevel,
} from '../../../types/domain';
import { EMOTIONS_BY_ID } from '../../../data/emotionsCatalog';
import { toLocalDateKey } from '../../../db/mediaUtils';

// Formata um objeto Date para valor compatível com <input type="datetime-local">
function toDateTimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export function useCheckinForm(initialEntry: MoodEntry | null, open: boolean) {
  // Estados controlados das 3 camadas do formulário de check-in
  const [dateTimeLocal, setDateTimeLocal] = useState<string>(() => toDateTimeLocalValue(new Date()));
  const [moodLevel, setMoodLevel] = useState<MoodLevel | null>(null);
  const [emotionIds, setEmotionIds] = useState<string[]>([]);
  const [activityIds, setActivityIds] = useState<string[]>([]);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [company, setCompany] = useState<string | undefined>(undefined);
  const [note, setNote] = useState<string>('');
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);

  // Reinicia ou preenche o formulário sempre que o modal abre ou troca de registro em edição
  useEffect(() => {
    if (!open) return;
    if (initialEntry) {
      setDateTimeLocal(toDateTimeLocalValue(new Date(initialEntry.timestamp)));
      setMoodLevel(initialEntry.moodLevel);
      setEmotionIds(initialEntry.emotionIds);
      setActivityIds(initialEntry.activityIds);
      setLocation(initialEntry.contextTags.location);
      setCompany(initialEntry.contextTags.company);
      setNote(initialEntry.note);
      setAttachments(initialEntry.attachments);
    } else {
      setDateTimeLocal(toDateTimeLocalValue(new Date()));
      setMoodLevel(null);
      setEmotionIds([]);
      setActivityIds([]);
      setLocation(undefined);
      setCompany(undefined);
      setNote('');
      setAttachments([]);
    }
  }, [initialEntry, open]);

  // Alterna emoção (máximo 3) e sugere humor caso o usuário ainda não tenha escolhido
  const toggleEmotion = (emotion: EmotionDefinition) => {
    setEmotionIds((prev) => {
      if (prev.includes(emotion.id)) {
        return prev.filter((id) => id !== emotion.id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, emotion.id];
    });
    setMoodLevel((currentMood) => currentMood ?? emotion.suggestedMood);
  };

  // Alterna seleção de uma tag de atividade
  const toggleActivity = (activityId: string) => {
    setActivityIds((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId]
    );
  };

  // Insere template de escrita preservando conteúdo já digitado
  const applyTemplate = (templateContent: string) => {
    setNote((prev) => (prev.trim() ? `${prev.trim()}\n\n${templateContent}` : templateContent));
  };

  const addAttachment = (item: MediaAttachment) => {
    setAttachments((prev) => [...prev, item]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  // Constrói o objeto MoodEntry pronto para persistência no IndexedDB
  const buildEntry = (): MoodEntry | null => {
    if (!moodLevel) return null;
    const parsedDate = new Date(dateTimeLocal);
    const validDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    const nowIso = new Date().toISOString();
    const firstEmotion = emotionIds.length > 0 ? EMOTIONS_BY_ID[emotionIds[0]] : undefined;

    return {
      id: initialEntry?.id ?? crypto.randomUUID(),
      timestamp: validDate.toISOString(),
      dateKey: toLocalDateKey(validDate),
      moodLevel,
      emotionIds,
      primaryQuadrant: firstEmotion?.quadrant,
      activityIds,
      contextTags: {
        ...(location ? { location } : {}),
        ...(company ? { company } : {}),
      },
      note: note.trim(),
      attachments,
      createdAt: initialEntry?.createdAt ?? nowIso,
      updatedAt: nowIso,
    };
  };

  return {
    dateTimeLocal,
    setDateTimeLocal,
    moodLevel,
    setMoodLevel,
    emotionIds,
    toggleEmotion,
    activityIds,
    toggleActivity,
    location,
    setLocation,
    company,
    setCompany,
    note,
    setNote,
    applyTemplate,
    attachments,
    addAttachment,
    removeAttachment,
    buildEntry,
    canSave: moodLevel !== null,
  };
}

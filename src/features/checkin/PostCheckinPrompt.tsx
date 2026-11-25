/**
 * Componente PostCheckinPrompt (src/features/checkin/PostCheckinPrompt.tsx)
 * Exibido automaticamente após salvar um registro com moodLevel <= 2 ou emoções
 * dos quadrantes Vermelho (high-unpleasant) ou Azul (low-unpleasant).
 */
import React from 'react';
import type { MoodEntry, RegulationToolId } from '../../types/domain';
import { EMOTIONS_BY_ID } from '../../data/emotionsCatalog';
import { Modal } from '../../components/ui/Modal/Modal';
import { Button } from '../../components/ui/Button/Button';
import './PostCheckinPrompt.css';

interface PostCheckinPromptProps {
  entry: MoodEntry | null;
  onDismiss: () => void;
  onStartTool: (toolId: RegulationToolId, entryId: string) => void;
}

// Determina se o check-in recém-salvo deve acionar o convite de regulação
export function shouldShowRegulationPrompt(entry: MoodEntry): boolean {
  if (entry.moodLevel <= 2) return true;
  return entry.emotionIds.some((id) => {
    const quad = EMOTIONS_BY_ID[id]?.quadrant;
    return quad === 'high-unpleasant' || quad === 'low-unpleasant';
  });
}

// Escolhe a micro-estratégia mais adequada a partir das emoções ou do humor registrado
export function getRecommendedToolForEntry(entry: MoodEntry): {
  toolId: RegulationToolId;
  title: string;
} {
  for (const id of entry.emotionIds) {
    const emotion = EMOTIONS_BY_ID[id];
    if (emotion?.suggestedToolId === 'grounding') {
      return { toolId: 'grounding', title: 'Aterramento Sensorial 5-4-3-2-1' };
    }
    if (emotion?.suggestedToolId === 'reframe') {
      return { toolId: 'reframe', title: 'Reenquadramento de Pensamento' };
    }
    if (emotion?.suggestedToolId === 'breathing') {
      return { toolId: 'breathing', title: 'Respiração Guiada' };
    }
  }
  if (entry.primaryQuadrant === 'low-unpleasant') {
    return { toolId: 'reframe', title: 'Reenquadramento de Pensamento' };
  }
  return { toolId: 'breathing', title: 'Respiração Guiada' };
}

export const PostCheckinPrompt: React.FC<PostCheckinPromptProps> = ({
  entry,
  onDismiss,
  onStartTool,
}) => {
  if (!entry) return null;
  const recommendation = getRecommendedToolForEntry(entry);

  return (
    <Modal
      open={Boolean(entry)}
      title="Check-in salvo"
      onClose={onDismiss}
      footer={
        <>
          <Button variant="ghost" onClick={onDismiss}>
            Agora não
          </Button>
          <Button
            variant="primary"
            onClick={() => onStartTool(recommendation.toolId, entry.id)}
          >
            Iniciar {recommendation.title}
          </Button>
        </>
      }
    >
      <div className="pf-post-prompt">
        <span className="pf-post-prompt__badge">Sugestão para este momento</span>
        <p>
          Quer fazer um exercício rápido de 2 minutos agora? Recomendamos{' '}
          <strong>{recommendation.title}</strong> para ajudar a regular o ritmo.
        </p>
      </div>
    </Modal>
  );
};

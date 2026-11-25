/**
 * Componente EntryDetailModal (src/features/timeline/components/EntryDetailModal/EntryDetailModal.tsx)
 * Abre todos os detalhes de um registro com fotos, áudios, edição e exclusão com confirmação.
 */
import React, { useEffect, useMemo, useState } from 'react';
import type { ActivityTag, MoodEntry, MoodLevel } from '../../../../types/domain';
import { EMOTIONS_BY_ID } from '../../../../data/emotionsCatalog';
import { Modal } from '../../../../components/ui/Modal/Modal';
import { Button } from '../../../../components/ui/Button/Button';
import './EntryDetailModal.css';

interface EntryDetailModalProps {
  entry: MoodEntry | null;
  moodLabels: Record<MoodLevel, string>;
  activitiesById: Record<string, ActivityTag>;
  onClose: () => void;
  onEdit: (entry: MoodEntry) => void;
  onDelete: (id: string) => Promise<void>;
}

export const EntryDetailModal: React.FC<EntryDetailModalProps> = ({
  entry,
  moodLabels,
  activitiesById,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Gera URLs temporárias para renderizar fotos e áudios armazenados como Blob
  const mediaUrls = useMemo(() => {
    if (!entry) return {};
    const map: Record<string, string> = {};
    for (const att of entry.attachments) {
      map[att.id] = URL.createObjectURL(att.blob);
    }
    return map;
  }, [entry]);

  useEffect(() => {
    setConfirmDelete(false);
    return () => {
      Object.values(mediaUrls).forEach((u) => URL.revokeObjectURL(u));
    };
  }, [mediaUrls]);

  if (!entry) return null;

  const formattedDate = new Date(entry.timestamp).toLocaleString('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const photos = entry.attachments.filter((a) => a.type === 'image');
  const audios = entry.attachments.filter((a) => a.type === 'audio');

  return (
    <Modal
      open={Boolean(entry)}
      title={`Registro — ${moodLabels[entry.moodLevel]}`}
      onClose={onClose}
      footer={
        <>
          {!confirmDelete ? (
            <Button variant="ghost" onClick={() => setConfirmDelete(true)}>
              Excluir
            </Button>
          ) : (
            <Button
              variant="danger"
              onClick={async () => {
                await onDelete(entry.id);
                onClose();
              }}
            >
              Confirmar exclusão
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              onEdit(entry);
            }}
          >
            Editar
          </Button>
        </>
      }
    >
      <div className="pf-stack">
        <p className="pf-text-muted">{formattedDate}</p>

        {entry.emotionIds.length > 0 && (
          <div>
            <strong>Emoções:</strong>{' '}
            {entry.emotionIds.map((id) => EMOTIONS_BY_ID[id]?.label ?? id).join(', ')}
          </div>
        )}

        {entry.activityIds.length > 0 && (
          <div>
            <strong>Atividades:</strong>{' '}
            {entry.activityIds.map((id) => activitiesById[id]?.label ?? id).join(', ')}
          </div>
        )}

        {(entry.contextTags.location || entry.contextTags.company) && (
          <div className="pf-text-muted">
            {entry.contextTags.location && <span>Local: {entry.contextTags.location} · </span>}
            {entry.contextTags.company && <span>Companhia: {entry.contextTags.company}</span>}
          </div>
        )}

        {entry.note && <div className="pf-entry-detail__note">{entry.note}</div>}

        {photos.length > 0 && (
          <div className="pf-entry-detail__photos">
            {photos.map((p) => (
              <img key={p.id} src={mediaUrls[p.id]} alt="Anexo fotográfico" />
            ))}
          </div>
        )}

        {audios.map((a) => (
          <audio key={a.id} controls src={mediaUrls[a.id]} />
        ))}
      </div>
    </Modal>
  );
};

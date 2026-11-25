/**
 * Componente EntryCard (src/features/timeline/components/EntryCard/EntryCard.tsx)
 * Exibe resumo visual de um check-in no feed: barra lateral colorida, horário,
 * humor base, badges de emoções, atividades, nota truncada (2 linhas) e mídia.
 */
import React from 'react';
import type { ActivityTag, MoodEntry, MoodLevel } from '../../../../types/domain';
import { EMOTIONS_BY_ID } from '../../../../data/emotionsCatalog';
import { Icon } from '../../../../components/ui/Icon/Icon';
import './EntryCard.css';

interface EntryCardProps {
  entry: MoodEntry;
  moodLabels: Record<MoodLevel, string>;
  activitiesById: Record<string, ActivityTag>;
  onSelect: (entry: MoodEntry) => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  moodLabels,
  activitiesById,
  onSelect,
}) => {
  const dateObj = new Date(entry.timestamp);
  const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const dayStr = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  const photoCount = entry.attachments.filter((a) => a.type === 'image').length;
  const audioCount = entry.attachments.filter((a) => a.type === 'audio').length;
  const entryColor = `var(--mood-${entry.moodLevel})`;

  return (
    <button
      type="button"
      className="pf-entry-card"
      style={{ '--entry-color': entryColor } as React.CSSProperties}
      onClick={() => onSelect(entry)}
    >
      <span className="pf-entry-card__bar" aria-hidden="true" />

      <div className="pf-entry-card__body">
        <div className="pf-entry-card__header">
          <span className="pf-entry-card__mood">
            <Icon name={`mood${entry.moodLevel}`} size={20} />
            <span>{moodLabels[entry.moodLevel]}</span>
          </span>
          <span className="pf-text-xs">
            {dayStr} · {timeStr}
          </span>
        </div>

        {/* Badges das emoções específicas registradas */}
        {entry.emotionIds.length > 0 && (
          <div className="pf-row">
            {entry.emotionIds.map((id) => {
              const emo = EMOTIONS_BY_ID[id];
              return emo ? (
                <span key={id} className="pf-entry-card__badge">
                  {emo.label}
                </span>
              ) : null;
            })}
          </div>
        )}

        {/* Tags das atividades vinculadas */}
        {entry.activityIds.length > 0 && (
          <div className="pf-row">
            {entry.activityIds.map((id) => {
              const act = activitiesById[id];
              return act ? (
                <span key={id} className="pf-text-xs">
                  #{act.label}
                </span>
              ) : null;
            })}
          </div>
        )}

        {/* Preview truncado da nota em até 2 linhas */}
        {entry.note && <p className="pf-entry-card__note">{entry.note}</p>}

        {/* Indicadores discretos de anexos locais */}
        {(photoCount > 0 || audioCount > 0) && (
          <div className="pf-row pf-text-xs">
            {photoCount > 0 && <span>{photoCount} foto(s)</span>}
            {audioCount > 0 && <span>{audioCount} áudio(s)</span>}
          </div>
        )}
      </div>
    </button>
  );
};

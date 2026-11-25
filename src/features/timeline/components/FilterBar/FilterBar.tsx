/**
 * Componente FilterBar (src/features/timeline/components/FilterBar/FilterBar.tsx)
 * Oferece busca textual com debounce de 250ms e filtros combináveis por humor,
 * quadrante emocional, atividade e presença de mídia.
 */
import React, { useEffect, useState } from 'react';
import type { ActivityTag, EmotionQuadrant, MoodLevel } from '../../../../types/domain';
import { EMOTION_QUADRANTS_META } from '../../../../data/emotionsCatalog';
import { Input } from '../../../../components/ui/Input/Input';
import { Chip } from '../../../../components/ui/Chip/Chip';
import { Button } from '../../../../components/ui/Button/Button';
import './FilterBar.css';

export interface TimelineFilters {
  query: string;
  moodLevel: MoodLevel | null;
  quadrant: EmotionQuadrant | null;
  activityId: string | null;
  mediaFilter: 'note' | 'photo' | 'audio' | null;
}

interface FilterBarProps {
  filters: TimelineFilters;
  moodLabels: Record<MoodLevel, string>;
  activities: ActivityTag[];
  onChange: (next: TimelineFilters) => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  moodLabels,
  activities,
  onChange,
  onReset,
}) => {
  // Mantém input responsivo aplicando debounce de 250ms antes de filtrar a lista
  const [searchInput, setSearchInput] = useState(filters.query);

  useEffect(() => {
    setSearchInput(filters.query);
  }, [filters.query]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchInput !== filters.query) {
        onChange({ ...filters, query: searchInput });
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [filters, onChange, searchInput]);

  const hasActiveFilter = Boolean(
    filters.query ||
      filters.moodLevel ||
      filters.quadrant ||
      filters.activityId ||
      filters.mediaFilter
  );

  return (
    <div className="pf-filter-bar pf-no-print">
      <div className="pf-row pf-row--between">
        <div style={{ flex: 1, minWidth: '220px' }}>
          <Input
            placeholder="Buscar notas, emoções ou atividades..."
            aria-label="Buscar registros na linha do tempo"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        {hasActiveFilter && (
          <Button size="sm" variant="ghost" onClick={onReset}>
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Filtros de nível de humor */}
      <div className="pf-filter-bar__group">
        {([1, 2, 3, 4, 5] as MoodLevel[]).map((level) => (
          <Chip
            key={level}
            size="sm"
            label={moodLabels[level]}
            selected={filters.moodLevel === level}
            onClick={() =>
              onChange({
                ...filters,
                moodLevel: filters.moodLevel === level ? null : level,
              })
            }
          />
        ))}
      </div>

      {/* Filtros de quadrante emocional e mídia */}
      <div className="pf-filter-bar__group">
        {EMOTION_QUADRANTS_META.map((q) => (
          <Chip
            key={q.id}
            size="sm"
            label={q.title}
            tone={q.tone}
            selected={filters.quadrant === q.id}
            onClick={() =>
              onChange({
                ...filters,
                quadrant: filters.quadrant === q.id ? null : q.id,
              })
            }
          />
        ))}

        <Chip
          size="sm"
          label="Tem nota"
          selected={filters.mediaFilter === 'note'}
          onClick={() =>
            onChange({
              ...filters,
              mediaFilter: filters.mediaFilter === 'note' ? null : 'note',
            })
          }
        />
        <Chip
          size="sm"
          label="Tem foto"
          selected={filters.mediaFilter === 'photo'}
          onClick={() =>
            onChange({
              ...filters,
              mediaFilter: filters.mediaFilter === 'photo' ? null : 'photo',
            })
          }
        />
        <Chip
          size="sm"
          label="Tem áudio"
          selected={filters.mediaFilter === 'audio'}
          onClick={() =>
            onChange({
              ...filters,
              mediaFilter: filters.mediaFilter === 'audio' ? null : 'audio',
            })
          }
        />

        {/* Seletor discreto por atividade */}
        <select
          aria-label="Filtrar por atividade"
          className="pf-field__control"
          style={{ width: 'auto', minHeight: '32px', fontSize: 'var(--text-xs)' }}
          value={filters.activityId ?? ''}
          onChange={(e) =>
            onChange({ ...filters, activityId: e.target.value ? e.target.value : null })
          }
        >
          <option value="">Todas as atividades</option>
          {activities
            .filter((a) => !a.archived)
            .map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

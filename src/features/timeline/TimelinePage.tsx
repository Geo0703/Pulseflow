/**
 * Página TimelinePage (src/features/timeline/TimelinePage.tsx)
 * Alterna entre Feed cronológico agrupado por Mês/Ano e Calendário mensal,
 * aplicando busca e filtros combinados em tempo real.
 */
import React, { useMemo, useState } from 'react';
import type { ActivityTag, MoodEntry } from '../../types/domain';
import { EMOTIONS_BY_ID } from '../../data/emotionsCatalog';
import { useAppData } from '../../store/AppDataContext';
import { PageHeader } from '../../components/layout/PageHeader/PageHeader';
import { EmptyState } from '../../components/layout/EmptyState/EmptyState';
import { Card } from '../../components/ui/Card/Card';
import { Tabs } from '../../components/ui/Tabs/Tabs';
import { Button } from '../../components/ui/Button/Button';
import { EntryCard } from './components/EntryCard/EntryCard';
import { EntryDetailModal } from './components/EntryDetailModal/EntryDetailModal';
import { MonthCalendar } from './components/MonthCalendar/MonthCalendar';
import { FilterBar, type TimelineFilters } from './components/FilterBar/FilterBar';
import './TimelinePage.css';

interface TimelinePageProps {
  onOpenNewCheckin: () => void;
  onEditEntry: (entry: MoodEntry) => void;
}

const INITIAL_FILTERS: TimelineFilters = {
  query: '',
  moodLevel: null,
  quadrant: null,
  activityId: null,
  mediaFilter: null,
};

export const TimelinePage: React.FC<TimelinePageProps> = ({
  onOpenNewCheckin,
  onEditEntry,
}) => {
  const { entries, activities, settings, deleteEntry } = useAppData();

  // Estados de modo de visualização, filtros, data do calendário e registro selecionado
  const [viewMode, setViewMode] = useState<'feed' | 'calendar'>('feed');
  const [filters, setFilters] = useState<TimelineFilters>(INITIAL_FILTERS);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const now = new Date();
  const [calendarYM, setCalendarYM] = useState({
    year: now.getFullYear(),
    monthIndex: now.getMonth(),
  });

  // Mapa rápido de atividades por ID para renderização O(1)
  const activitiesById = useMemo(() => {
    const map: Record<string, ActivityTag> = {};
    for (const act of activities) map[act.id] = act;
    return map;
  }, [activities]);

  // Aplica todos os filtros combinados (texto, humor, quadrante, atividade, mídia e data)
  const filteredEntries = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (selectedDateKey && viewMode === 'calendar' && entry.dateKey !== selectedDateKey) {
        return false;
      }
      if (filters.moodLevel && entry.moodLevel !== filters.moodLevel) return false;
      if (filters.quadrant) {
        const matchesQuad =
          entry.primaryQuadrant === filters.quadrant ||
          entry.emotionIds.some((id) => EMOTIONS_BY_ID[id]?.quadrant === filters.quadrant);
        if (!matchesQuad) return false;
      }
      if (filters.activityId && !entry.activityIds.includes(filters.activityId)) return false;
      if (filters.mediaFilter === 'note' && !entry.note.trim()) return false;
      if (
        filters.mediaFilter === 'photo' &&
        !entry.attachments.some((a) => a.type === 'image')
      ) {
        return false;
      }
      if (
        filters.mediaFilter === 'audio' &&
        !entry.attachments.some((a) => a.type === 'audio')
      ) {
        return false;
      }
      if (q) {
        const emoText = entry.emotionIds
          .map((id) => EMOTIONS_BY_ID[id]?.label ?? '')
          .join(' ')
          .toLowerCase();
        const actText = entry.activityIds
          .map((id) => activitiesById[id]?.label ?? '')
          .join(' ')
          .toLowerCase();
        if (
          !entry.note.toLowerCase().includes(q) &&
          !emoText.includes(q) &&
          !actText.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [activitiesById, entries, filters, selectedDateKey, viewMode]);

  // Agrupa registros filtrados por cabeçalho de Mês/Ano (ex.: "novembro de 2026")
  const groupedByMonth = useMemo(() => {
    const groups: { label: string; items: MoodEntry[] }[] = [];
    for (const entry of filteredEntries) {
      const label = new Date(entry.timestamp).toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
      });
      const existing = groups.find((g) => g.label === label);
      if (existing) existing.items.push(entry);
      else groups.push({ label, items: [entry] });
    }
    return groups;
  }, [filteredEntries]);

  return (
    <div className="pf-stack pf-stack--lg">
      <PageHeader
        title="Linha do Tempo"
        subtitle={`${entries.length} registro(s) salvo(s) localmente no seu dispositivo.`}
        actions={
          <Tabs<'feed' | 'calendar'>
            ariaLabel="Modo de visualização da linha do tempo"
            value={viewMode}
            onChange={setViewMode}
            options={[
              { id: 'feed', label: 'Feed' },
              { id: 'calendar', label: 'Calendário' },
            ]}
          />
        }
      />

      <Card>
        <FilterBar
          filters={filters}
          moodLabels={settings.moodLabels}
          activities={activities}
          onChange={setFilters}
          onReset={() => {
            setFilters(INITIAL_FILTERS);
            setSelectedDateKey(null);
          }}
        />
      </Card>

      <div
        className={`pf-timeline__layout ${
          viewMode === 'calendar' ? 'pf-timeline__layout--calendar' : ''
        }`.trim()}
      >
        {viewMode === 'calendar' && (
          <Card>
            <MonthCalendar
              year={calendarYM.year}
              monthIndex={calendarYM.monthIndex}
              entries={entries}
              selectedDateKey={selectedDateKey}
              onChangeMonth={(year, monthIndex) => setCalendarYM({ year, monthIndex })}
              onSelectDate={setSelectedDateKey}
            />
          </Card>
        )}

        <div className="pf-stack">
          {filteredEntries.length === 0 ? (
            <EmptyState
              icon="calendar"
              title="Nenhum registro encontrado"
              description="Faça seu primeiro check-in em poucos segundos ou ajuste os filtros ativos."
              action={
                <Button variant="primary" onClick={onOpenNewCheckin}>
                  Criar check-in
                </Button>
              }
            />
          ) : (
            groupedByMonth.map((group) => (
              <section key={group.label} className="pf-stack pf-stack--sm">
                <h2 className="pf-timeline__month-heading">{group.label}</h2>
                {group.items.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    moodLabels={settings.moodLabels}
                    activitiesById={activitiesById}
                    onSelect={setSelectedEntry}
                  />
                ))}
              </section>
            ))
          )}
        </div>
      </div>

      <EntryDetailModal
        entry={selectedEntry}
        moodLabels={settings.moodLabels}
        activitiesById={activitiesById}
        onClose={() => setSelectedEntry(null)}
        onEdit={onEditEntry}
        onDelete={deleteEntry}
      />
    </div>
  );
};

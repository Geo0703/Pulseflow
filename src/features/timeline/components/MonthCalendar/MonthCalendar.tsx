/**
 * Componente MonthCalendar (src/features/timeline/components/MonthCalendar/MonthCalendar.tsx)
 * Renderiza grade mensal de Domingo a Sábado colorindo cada dia pela média
 * arredondada do humor e permitindo filtrar os registros da data clicada.
 */
import React, { useMemo } from 'react';
import type { MoodEntry } from '../../../../types/domain';
import { Button } from '../../../../components/ui/Button/Button';
import { Icon } from '../../../../components/ui/Icon/Icon';
import './MonthCalendar.css';

interface MonthCalendarProps {
  year: number;
  monthIndex: number; // 0 = Janeiro .. 11 = Dezembro
  entries: MoodEntry[];
  selectedDateKey: string | null;
  onChangeMonth: (year: number, monthIndex: number) => void;
  onSelectDate: (dateKey: string | null) => void;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  year,
  monthIndex,
  entries,
  selectedDateKey,
  onChangeMonth,
  onSelectDate,
}) => {
  // Agrupa check-ins por dateKey e calcula média arredondada do humor por dia
  const daySummary = useMemo(() => {
    const map: Record<string, { avgMood: number; count: number }> = {};
    for (const entry of entries) {
      if (!map[entry.dateKey]) {
        map[entry.dateKey] = { avgMood: 0, count: 0 };
      }
      map[entry.dateKey].avgMood += entry.moodLevel;
      map[entry.dateKey].count += 1;
    }
    Object.values(map).forEach((item) => {
      item.avgMood = Math.round(item.avgMood / item.count);
    });
    return map;
  }, [entries]);

  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const monthLabel = new Date(year, monthIndex, 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  const navigateMonth = (delta: number) => {
    const nextDate = new Date(year, monthIndex + delta, 1);
    onChangeMonth(nextDate.getFullYear(), nextDate.getMonth());
  };

  return (
    <div className="pf-calendar">
      <div className="pf-calendar__header">
        <Button
          size="sm"
          variant="ghost"
          aria-label="Mês anterior"
          onClick={() => navigateMonth(-1)}
        >
          <Icon name="chevronLeft" size={18} />
        </Button>
        <strong style={{ textTransform: 'capitalize' }}>{monthLabel}</strong>
        <Button
          size="sm"
          variant="ghost"
          aria-label="Próximo mês"
          onClick={() => navigateMonth(1)}
        >
          <Icon name="chevronRight" size={18} />
        </Button>
      </div>

      <div className="pf-calendar__weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day} className="pf-calendar__weekday">
            {day}
          </span>
        ))}
      </div>

      <div className="pf-calendar__grid">
        {/* Espaços vazios antes do dia 1 do mês */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="pf-calendar__cell pf-calendar__cell--empty" />
        ))}

        {/* Células clicáveis de cada dia do mês */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(
            day
          ).padStart(2, '0')}`;
          const info = daySummary[dateKey];
          const isSelected = selectedDateKey === dateKey;

          return (
            <button
              key={dateKey}
              type="button"
              aria-label={`Dia ${day} (${info ? `${info.count} registro(s)` : 'sem registros'})`}
              className={[
                'pf-calendar__cell',
                info ? 'pf-calendar__cell--filled' : '',
                isSelected ? 'pf-calendar__cell--selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={
                info
                  ? ({ '--cell-mood': `var(--mood-${info.avgMood})` } as React.CSSProperties)
                  : undefined
              }
              onClick={() => onSelectDate(isSelected ? null : dateKey)}
            >
              <span>{day}</span>
              {info && info.count > 1 && (
                <span className="pf-calendar__count">{info.count}×</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

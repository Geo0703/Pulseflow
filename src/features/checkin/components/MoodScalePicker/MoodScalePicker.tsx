/**
 * Componente MoodScalePicker (src/features/checkin/components/MoodScalePicker/MoodScalePicker.tsx)
 * Exibe a escala horizontal de 5 níveis de humor com ícones SVG, rótulos editáveis
 * e cores semânticas (--mood-1 a --mood-5).
 */
import React from 'react';
import type { MoodLevel } from '../../../../types/domain';
import { Icon } from '../../../../components/ui/Icon/Icon';
import './MoodScalePicker.css';

interface MoodScalePickerProps {
  value: MoodLevel | null;
  moodLabels: Record<MoodLevel, string>;
  onChange: (level: MoodLevel) => void;
}

const LEVELS: MoodLevel[] = [1, 2, 3, 4, 5];

export const MoodScalePicker: React.FC<MoodScalePickerProps> = ({
  value,
  moodLabels,
  onChange,
}) => {
  return (
    <div className="pf-mood-picker" role="radiogroup" aria-label="Escala de humor">
      {LEVELS.map((level) => {
        const selected = value === level;
        const moodVar = `var(--mood-${level})`;
        return (
          <button
            key={level}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`pf-mood-picker__item ${selected ? 'pf-mood-picker__item--selected' : ''}`.trim()}
            style={{ '--mood-color': moodVar } as React.CSSProperties}
            onClick={() => onChange(level)}
          >
            <span className="pf-mood-picker__icon" aria-hidden="true">
              <Icon name={`mood${level}`} size={28} />
            </span>
            <span className="pf-mood-picker__label">{moodLabels[level]}</span>
          </button>
        );
      })}
    </div>
  );
};

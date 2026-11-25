/**
 * Componente ProgressBar (src/components/ui/ProgressBar/ProgressBar.tsx)
 * Barra horizontal acessível utilizada em metas, conquistas, etapas e gráficos.
 */
import React from 'react';
import './ProgressBar.css';

export interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: 'accent' | 'success' | 'red' | 'yellow' | 'blue' | 'green';
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  tone = 'accent',
  label = 'Progresso',
}) => {
  // Garante percentual limitado entre 0% e 100%
  const safeMax = max <= 0 ? 100 : max;
  const percent = Math.max(0, Math.min(100, Math.round((value / safeMax) * 100)));

  return (
    <div
      className="pf-progress"
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`pf-progress__fill ${tone !== 'accent' ? `pf-progress__fill--${tone}` : ''}`.trim()}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

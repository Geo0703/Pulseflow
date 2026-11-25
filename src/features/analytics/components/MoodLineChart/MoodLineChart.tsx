/**
 * Componente MoodLineChart (src/features/analytics/components/MoodLineChart/MoodLineChart.tsx)
 * Gráfico de curva de humor construído manualmente em SVG puro (sem libs externas),
 * exibindo linha tracejada da média global e pontos interativos com tooltip acessível.
 */
import React, { useState } from 'react';
import type { DailyMoodPoint } from '../../utils/statsEngine';
import './MoodLineChart.css';

interface MoodLineChartProps {
  series: DailyMoodPoint[];
  globalAverage: number;
}

export const MoodLineChart: React.FC<MoodLineChartProps> = ({ series, globalAverage }) => {
  const [activePoint, setActivePoint] = useState<DailyMoodPoint | null>(null);

  if (series.length === 0) {
    return <p className="pf-text-muted">Sem dados suficientes para traçar a curva de humor.</p>;
  }

  const width = 600;
  const height = 200;
  const padX = 32;
  const padY = 20;
  const usableW = width - padX * 2;
  const usableH = height - padY * 2;

  // Converte nota de humor (1..5) em coordenada vertical SVG
  const yForMood = (mood: number) => padY + ((5 - mood) / 4) * usableH;
  const xForIndex = (idx: number) =>
    series.length === 1 ? width / 2 : padX + (idx / (series.length - 1)) * usableW;

  const polylinePoints = series
    .map((pt, idx) => `${xForIndex(idx)},${yForMood(pt.avgMood)}`)
    .join(' ');

  const avgY = yForMood(globalAverage);

  return (
    <div className="pf-line-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="pf-line-chart__svg"
        role="img"
        aria-label="Curva de humor médio diário no período"
      >
        {/* Linhas guias horizontais dos níveis 1 a 5 */}
        {[1, 2, 3, 4, 5].map((level) => {
          const y = yForMood(level);
          return (
            <g key={level}>
              <line
                x1={padX}
                y1={y}
                x2={width - padX}
                y2={y}
                stroke="var(--color-border)"
                strokeWidth="1"
              />
              <text x={8} y={y + 4} fontSize="11" fill="var(--color-text-secondary)">
                {level}
              </text>
            </g>
          );
        })}

        {/* Linha tracejada indicando a média global do período */}
        <line
          x1={padX}
          y1={avgY}
          x2={width - padX}
          y2={avgY}
          stroke="var(--color-accent)"
          strokeDasharray="6 4"
          strokeWidth="1.5"
        />

        {/* Polilinha conectando as médias diárias */}
        {series.length > 1 && (
          <polyline
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2.5"
            points={polylinePoints}
          />
        )}

        {/* Pontos interativos focáveis por mouse ou teclado */}
        {series.map((pt, idx) => (
          <circle
            key={pt.dateKey}
            cx={xForIndex(idx)}
            cy={yForMood(pt.avgMood)}
            r={activePoint?.dateKey === pt.dateKey ? 7 : 5}
            fill="var(--color-accent)"
            stroke="var(--color-surface)"
            strokeWidth="2"
            tabIndex={0}
            role="button"
            aria-label={`${pt.dateKey}: média ${pt.avgMood}`}
            onMouseEnter={() => setActivePoint(pt)}
            onFocus={() => setActivePoint(pt)}
            onClick={() => setActivePoint(pt)}
          />
        ))}
      </svg>

      {/* Tooltip acessível detalhando data, humor médio e emoções do ponto ativo */}
      {activePoint && (
        <div className="pf-line-chart__tooltip" role="status">
          <strong>{activePoint.dateKey}</strong> — Humor médio: <strong>{activePoint.avgMood}</strong>{' '}
          ({activePoint.count} check-in(s))
          {activePoint.emotions.length > 0 && ` · Emoções: ${activePoint.emotions.join(', ')}`}
        </div>
      )}
    </div>
  );
};

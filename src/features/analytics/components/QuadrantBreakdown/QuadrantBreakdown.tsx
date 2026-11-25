/**
 * Componente QuadrantBreakdown (src/features/analytics/components/QuadrantBreakdown/QuadrantBreakdown.tsx)
 * Exibe a barra proporcional dos 4 quadrantes emocionais e o ranking Top 5 emoções.
 */
import React from 'react';
import { EMOTION_QUADRANTS_META } from '../../../../data/emotionsCatalog';
import type { QuadrantStat, TopEmotionStat } from '../../utils/statsEngine';
import { ProgressBar } from '../../../../components/ui/ProgressBar/ProgressBar';
import './QuadrantBreakdown.css';

interface QuadrantBreakdownProps {
  quadrants: QuadrantStat[];
  topEmotions: TopEmotionStat[];
}

export const QuadrantBreakdown: React.FC<QuadrantBreakdownProps> = ({
  quadrants,
  topEmotions,
}) => {
  const maxTopCount = topEmotions[0]?.count ?? 1;

  return (
    <div className="pf-stack">
      {/* Barra segmentada proporcional */}
      <div className="pf-quad-breakdown__bar" aria-label="Distribuição proporcional por quadrante">
        {EMOTION_QUADRANTS_META.map((meta) => {
          const stat = quadrants.find((q) => q.quadrant === meta.id);
          if (!stat || stat.percentage === 0) return null;
          return (
            <div
              key={meta.id}
              style={{ width: `${stat.percentage}%`, backgroundColor: meta.cssColorVar }}
              title={`${meta.title}: ${stat.percentage}%`}
            />
          );
        })}
      </div>

      {/* Cartões dos 4 quadrantes */}
      <div className="pf-quad-breakdown__cards">
        {EMOTION_QUADRANTS_META.map((meta) => {
          const stat = quadrants.find((q) => q.quadrant === meta.id) ?? { count: 0, percentage: 0 };
          return (
            <div
              key={meta.id}
              className="pf-quad-breakdown__card"
              style={{ '--quad-bg': meta.cssSoftBgVar } as React.CSSProperties}
            >
              <span className="pf-text-xs" style={{ color: meta.cssColorVar, fontWeight: 700 }}>
                {meta.title}
              </span>
              <strong>
                {stat.count} ({stat.percentage}%)
              </strong>
            </div>
          );
        })}
      </div>

      {/* Ranking Top 5 emoções do período */}
      <div className="pf-stack pf-stack--sm">
        <h3>Top 5 Emoções do Período</h3>
        {topEmotions.length === 0 ? (
          <p className="pf-text-muted">Nenhuma emoção específica registrada neste período.</p>
        ) : (
          topEmotions.map((emo) => {
            const meta = EMOTION_QUADRANTS_META.find((m) => m.id === emo.quadrant);
            return (
              <div key={emo.emotionId} className="pf-quad-breakdown__top-row">
                <div className="pf-row pf-row--between">
                  <span>{emo.label}</span>
                  <span className="pf-text-xs">{emo.count}×</span>
                </div>
                <ProgressBar
                  value={emo.count}
                  max={maxTopCount}
                  tone={meta?.tone ?? 'accent'}
                  label={emo.label}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

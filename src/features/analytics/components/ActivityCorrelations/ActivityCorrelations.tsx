/**
 * Componente ActivityCorrelations (src/features/analytics/components/ActivityCorrelations/ActivityCorrelations.tsx)
 * Exibe correlação Atividade × Humor ordenável, destaques com confiabilidade (count >= 3)
 * e mini barra empilhada com a proporção dos 5 níveis de humor por atividade.
 */
import React, { useMemo, useState } from 'react';
import type { MoodLevel } from '../../../../types/domain';
import type { ActivityCorrelationStat } from '../../utils/statsEngine';
import { Tabs } from '../../../../components/ui/Tabs/Tabs';
import './ActivityCorrelations.css';

interface ActivityCorrelationsProps {
  correlations: ActivityCorrelationStat[];
}

type SortKey = 'positive' | 'negative' | 'frequent';

export const ActivityCorrelations: React.FC<ActivityCorrelationsProps> = ({ correlations }) => {
  const [sortBy, setSortBy] = useState<SortKey>('positive');

  // Regra de confiabilidade: destaques consideram apenas atividades com >= 3 registros
  const reliable = useMemo(
    () => correlations.filter((item) => item.count >= 3),
    [correlations]
  );

  const topBooster = useMemo(
    () => [...reliable].filter((c) => c.delta > 0).sort((a, b) => b.delta - a.delta)[0] ?? null,
    [reliable]
  );

  const topDrainer = useMemo(
    () => [...reliable].filter((c) => c.delta < 0).sort((a, b) => a.delta - b.delta)[0] ?? null,
    [reliable]
  );

  const sorted = useMemo(() => {
    const copy = [...correlations];
    if (sortBy === 'positive') return copy.sort((a, b) => b.delta - a.delta);
    if (sortBy === 'negative') return copy.sort((a, b) => a.delta - b.delta);
    return copy.sort((a, b) => b.count - a.count);
  }, [correlations, sortBy]);

  if (correlations.length === 0) {
    return <p className="pf-text-muted">Nenhuma atividade registrada neste período.</p>;
  }

  return (
    <div className="pf-stack">
      {/* Cartões de destaque confiáveis (mínimo 3 registros) */}
      <div className="pf-corr__highlights">
        <div className="pf-corr__highlight-box">
          <span className="pf-text-xs">O que mais eleva seu humor (≥ 3 registros)</span>
          <div>
            <strong>
              {topBooster ? `${topBooster.label} (+${topBooster.delta.toFixed(2)})` : 'Sem dados suficientes'}
            </strong>
          </div>
        </div>
        <div className="pf-corr__highlight-box">
          <span className="pf-text-xs">O que mais drena seu humor (≥ 3 registros)</span>
          <div>
            <strong>
              {topDrainer ? `${topDrainer.label} (${topDrainer.delta.toFixed(2)})` : 'Sem dados suficientes'}
            </strong>
          </div>
        </div>
      </div>

      <Tabs<SortKey>
        ariaLabel="Ordenação das correlações"
        value={sortBy}
        onChange={setSortBy}
        options={[
          { id: 'positive', label: 'Maior impacto +' },
          { id: 'negative', label: 'Maior impacto -' },
          { id: 'frequent', label: 'Mais frequentes' },
        ]}
      />

      <div>
        {sorted.map((item) => (
          <div key={item.activityId} className="pf-corr__row">
            <div className="pf-row pf-row--between">
              <span>
                <strong>{item.label}</strong>{' '}
                <span className="pf-text-xs">({item.count}× · média {item.avgWithTag})</span>
              </span>
              <span
                className={`pf-corr__delta ${
                  item.delta >= 0 ? 'pf-corr__delta--pos' : 'pf-corr__delta--neg'
                }`}
              >
                {item.delta >= 0 ? `+${item.delta.toFixed(2)}` : item.delta.toFixed(2)}
              </span>
            </div>

            {/* Mini barra empilhada proporcional aos 5 níveis de humor */}
            <div className="pf-corr__stacked">
              {([1, 2, 3, 4, 5] as MoodLevel[]).map((lvl) => {
                const pct = (item.moodDistribution[lvl] / item.count) * 100;
                if (pct === 0) return null;
                return (
                  <div
                    key={lvl}
                    style={{ width: `${pct}%`, backgroundColor: `var(--mood-${lvl})` }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Página AnalyticsPage (src/features/analytics/AnalyticsPage.tsx)
 * Consolida KPIs de resumo, curva de humor SVG, distribuição emocional por quadrante,
 * correlações atividade × humor e matriz Year in Pixels.
 */
import React, { useMemo, useState } from 'react';
import { useAppData } from '../../store/AppDataContext';
import { PageHeader } from '../../components/layout/PageHeader/PageHeader';
import { Card } from '../../components/ui/Card/Card';
import { Tabs } from '../../components/ui/Tabs/Tabs';
import {
  computeActivityCorrelations,
  computeAverageMood,
  computeDailyMoodSeries,
  computeQuadrantDistribution,
  computeTopEmotions,
  filterEntriesByPeriod,
  type StatsPeriod,
} from './utils/statsEngine';
import { calculateGlobalStreak } from '../goals/utils/streakCalculator';
import { MoodLineChart } from './components/MoodLineChart/MoodLineChart';
import { QuadrantBreakdown } from './components/QuadrantBreakdown/QuadrantBreakdown';
import { ActivityCorrelations } from './components/ActivityCorrelations/ActivityCorrelations';
import { YearInPixels } from './components/YearInPixels/YearInPixels';

export const AnalyticsPage: React.FC = () => {
  const { entries, activities, settings } = useAppData();
  const [period, setPeriod] = useState<StatsPeriod>('month');

  // Deriva métricas do período selecionado usando funções puras em statsEngine.ts
  const periodEntries = useMemo(() => filterEntriesByPeriod(entries, period), [entries, period]);
  const avgMood = useMemo(() => computeAverageMood(periodEntries), [periodEntries]);
  const dailySeries = useMemo(() => computeDailyMoodSeries(periodEntries), [periodEntries]);
  const quadrants = useMemo(() => computeQuadrantDistribution(periodEntries), [periodEntries]);
  const topEmotions = useMemo(() => computeTopEmotions(periodEntries, 5), [periodEntries]);
  const correlations = useMemo(
    () => computeActivityCorrelations(periodEntries, activities),
    [activities, periodEntries]
  );
  const streak = useMemo(() => calculateGlobalStreak(entries), [entries]);

  return (
    <div className="pf-stack pf-stack--lg">
      <PageHeader
        title="Estatísticas e Padrões"
        subtitle="Análises processadas 100% localmente no seu navegador."
        actions={
          <Tabs<StatsPeriod>
            ariaLabel="Selecionar período das estatísticas"
            value={period}
            onChange={setPeriod}
            options={[
              { id: '7d', label: 'Últimos 7 dias' },
              { id: 'month', label: 'Mês atual' },
              { id: '90d', label: 'Últimos 90 dias' },
              { id: 'year', label: 'Ano atual' },
            ]}
          />
        }
      />

      {/* Cartões de KPIs principais */}
      <div className="pf-grid-kpi">
        <Card>
          <span className="pf-text-xs">Check-ins no período</span>
          <h2>{periodEntries.length}</h2>
        </Card>
        <Card>
          <span className="pf-text-xs">Média de humor</span>
          <h2>{periodEntries.length > 0 ? avgMood.toFixed(2) : '—'}</h2>
        </Card>
        <Card>
          <span className="pf-text-xs">Sequência atual</span>
          <h2>{streak.currentStreak} dia(s)</h2>
        </Card>
        <Card>
          <span className="pf-text-xs">Emoção mais frequente</span>
          <h2>{topEmotions[0]?.label ?? '—'}</h2>
        </Card>
      </div>

      {/* Curva de humor em SVG puro */}
      <Card>
        <div className="pf-stack">
          <h2>Curva de Humor</h2>
          <MoodLineChart series={dailySeries} globalAverage={avgMood} />
        </div>
      </Card>

      {/* Distribuição por quadrante e correlação de atividades */}
      <div className="pf-grid-2">
        <Card>
          <div className="pf-stack">
            <h2>Distribuição Emocional</h2>
            <QuadrantBreakdown quadrants={quadrants} topEmotions={topEmotions} />
          </div>
        </Card>

        <Card>
          <div className="pf-stack">
            <h2>Correlação Atividade × Humor</h2>
            <ActivityCorrelations correlations={correlations} />
          </div>
        </Card>
      </div>

      {/* Matriz anual Year in Pixels */}
      <Card>
        <div className="pf-stack">
          <h2>Year in Pixels</h2>
          <YearInPixels entries={entries} moodLabels={settings.moodLabels} />
        </div>
      </Card>
    </div>
  );
};

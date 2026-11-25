/**
 * Componente GoalCard (src/features/goals/components/GoalCard/GoalCard.tsx)
 * Exibe título, frequência alvo, bolinhas da semana atual (Seg..Dom), barra
 * de percentual mensal e sequência atual da meta.
 */
import React from 'react';
import type { Goal } from '../../../../types/domain';
import type { GoalProgressResult } from '../../utils/streakCalculator';
import { Card } from '../../../../components/ui/Card/Card';
import { Button } from '../../../../components/ui/Button/Button';
import { ProgressBar } from '../../../../components/ui/ProgressBar/ProgressBar';
import './GoalCard.css';

interface GoalCardProps {
  goal: Goal;
  activityLabel: string;
  progress: GoalProgressResult;
  onEdit: (goal: Goal) => void;
  onArchive: (goal: Goal) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  activityLabel,
  progress,
  onEdit,
  onArchive,
}) => {
  const freqLabel =
    goal.frequencyType === 'daily'
      ? 'Diária'
      : `${goal.targetCount}× por semana (${progress.weekCompletedCount}/${goal.targetCount})`;

  return (
    <Card>
      <div className="pf-stack pf-stack--sm">
        <div className="pf-row pf-row--between">
          <div>
            <h3>{goal.title || activityLabel}</h3>
            <span className="pf-text-xs">
              Atividade: {activityLabel} · {freqLabel}
            </span>
          </div>
          <div className="pf-row">
            <Button size="sm" variant="ghost" onClick={() => onEdit(goal)}>
              Editar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onArchive(goal)}>
              Arquivar
            </Button>
          </div>
        </div>

        {/* Bolinhas da semana atual (Seg a Dom) */}
        <div className="pf-goal-card__dots">
          {progress.weekDays.map((day) => (
            <div key={day.dateKey} className="pf-goal-card__dot">
              <span
                className={`pf-goal-card__circle ${
                  day.done ? 'pf-goal-card__circle--done' : ''
                }`.trim()}
                aria-label={`${day.label}: ${day.done ? 'cumprido' : 'pendente'}`}
              />
              <span>{day.label}</span>
            </div>
          ))}
        </div>

        {/* Percentual mensal e sequência atual */}
        <div className="pf-row pf-row--between pf-text-xs">
          <span>Mês atual: {progress.monthPercentage}%</span>
          <span>Sequência: {progress.currentGoalStreak} dia(s)</span>
        </div>
        <ProgressBar
          value={progress.monthPercentage}
          max={100}
          tone="success"
          label={`Progresso mensal de ${goal.title || activityLabel}`}
        />
      </div>
    </Card>
  );
};

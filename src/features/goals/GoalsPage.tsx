/**
 * Página GoalsPage (src/features/goals/GoalsPage.tsx)
 * Exibe streak global, recorde histórico, gestão de metas vinculadas às atividades
 * e lista automática de conquistas.
 */
import React, { useMemo, useState } from 'react';
import type { Goal } from '../../types/domain';
import { useAppData } from '../../store/AppDataContext';
import { useToast } from '../../components/ui/Toast/ToastContext';
import { PageHeader } from '../../components/layout/PageHeader/PageHeader';
import { EmptyState } from '../../components/layout/EmptyState/EmptyState';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Icon } from '../../components/ui/Icon/Icon';
import {
  calculateGlobalStreak,
  calculateGoalProgress,
  evaluateAchievements,
} from './utils/streakCalculator';
import { GoalCard } from './components/GoalCard/GoalCard';
import { GoalFormModal } from './components/GoalFormModal/GoalFormModal';
import { AchievementList } from './components/AchievementList/AchievementList';

export const GoalsPage: React.FC = () => {
  const { entries, activities, goals, regulationSessions, saveGoal, archiveGoal } = useAppData();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const activeGoals = useMemo(() => goals.filter((g) => !g.archived), [goals]);
  const activityMap = useMemo(
    () => new Map(activities.map((a) => [a.id, a.label])),
    [activities]
  );

  const streak = useMemo(() => calculateGlobalStreak(entries), [entries]);
  const achievements = useMemo(
    () => evaluateAchievements(entries, regulationSessions),
    [entries, regulationSessions]
  );

  return (
    <div className="pf-stack pf-stack--lg">
      <PageHeader
        title="Metas, Hábitos e Sequências"
        subtitle="Progresso atualizado automaticamente a cada check-in."
        actions={
          <Button
            variant="primary"
            icon={<Icon name="plus" size={16} />}
            onClick={() => {
              setEditingGoal(null);
              setModalOpen(true);
            }}
          >
            Nova Meta
          </Button>
        }
      />

      {/* Resumo de Streak Global e Melhor Sequência */}
      <div className="pf-grid-2">
        <Card>
          <span className="pf-text-xs">Sequência atual (Streak)</span>
          <h2>{streak.currentStreak} dia(s)</h2>
        </Card>
        <Card>
          <span className="pf-text-xs">Melhor sequência histórica</span>
          <h2>{streak.bestStreak} dia(s)</h2>
        </Card>
      </div>

      {/* Lista de metas ativas */}
      {activeGoals.length === 0 ? (
        <EmptyState
          icon="target"
          title="Nenhuma meta ativa"
          description="Vincule uma meta a qualquer atividade para acompanhar sua consistência semanal."
          action={
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Criar primeira meta
            </Button>
          }
        />
      ) : (
        <div className="pf-grid-2">
          {activeGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              activityLabel={activityMap.get(goal.activityId) ?? goal.activityId}
              progress={calculateGoalProgress(goal, entries)}
              onEdit={(g) => {
                setEditingGoal(g);
                setModalOpen(true);
              }}
              onArchive={async (g) => {
                await archiveGoal(g);
                showToast('Meta arquivada.');
              }}
            />
          ))}
        </div>
      )}

      {/* Conquistas */}
      <section className="pf-stack">
        <h2>Conquistas</h2>
        <AchievementList items={achievements} />
      </section>

      <GoalFormModal
        open={modalOpen}
        editingGoal={editingGoal}
        activities={activities}
        onClose={() => setModalOpen(false)}
        onSave={async (goal) => {
          await saveGoal(goal);
          showToast('Meta salva com sucesso.');
        }}
      />
    </div>
  );
};

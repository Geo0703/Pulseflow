/**
 * Componente GoalFormModal (src/features/goals/components/GoalFormModal/GoalFormModal.tsx)
 * Modal para criar ou editar uma meta vinculada a uma atividade existente.
 */
import React, { useEffect, useState } from 'react';
import type { ActivityTag, Goal } from '../../../../types/domain';
import { Modal } from '../../../../components/ui/Modal/Modal';
import { Button } from '../../../../components/ui/Button/Button';
import { Input } from '../../../../components/ui/Input/Input';

interface GoalFormModalProps {
  open: boolean;
  editingGoal: Goal | null;
  activities: ActivityTag[];
  onClose: () => void;
  onSave: (goal: Goal) => Promise<void>;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  open,
  editingGoal,
  activities,
  onClose,
  onSave,
}) => {
  const activeActivities = activities.filter((a) => !a.archived);
  const [title, setTitle] = useState('');
  const [activityId, setActivityId] = useState('');
  const [frequencyType, setFrequencyType] = useState<'daily' | 'weekly'>('daily');
  const [targetCount, setTargetCount] = useState(3);

  // Reinicia os campos do formulário apenas quando o modal abre ou troca a meta em edição
  useEffect(() => {
    if (!open) return;
    if (editingGoal) {
      setTitle(editingGoal.title);
      setActivityId(editingGoal.activityId);
      setFrequencyType(editingGoal.frequencyType);
      setTargetCount(editingGoal.targetCount);
    } else {
      setTitle('');
      setActivityId(activeActivities[0]?.id ?? '');
      setFrequencyType('daily');
      setTargetCount(3);
    }
  }, [editingGoal, open]);

  // Define a primeira atividade disponível se a lista terminar de carregar com o modal já aberto
  useEffect(() => {
    if (open && !editingGoal && !activityId && activeActivities.length > 0) {
      setActivityId(activeActivities[0].id);
    }
  }, [activeActivities, activityId, editingGoal, open]);

  const handleSubmit = async () => {
    if (!activityId) return;
    const actLabel = activeActivities.find((a) => a.id === activityId)?.label ?? '';
    await onSave({
      id: editingGoal?.id ?? crypto.randomUUID(),
      title: title.trim() || actLabel,
      activityId,
      frequencyType,
      targetCount: frequencyType === 'daily' ? 1 : Math.max(1, Math.min(7, targetCount)),
      createdAt: editingGoal?.createdAt ?? new Date().toISOString(),
      archived: false,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      title={editingGoal ? 'Editar Meta' : 'Nova Meta'}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" disabled={!activityId} onClick={() => void handleSubmit()}>
            Salvar meta
          </Button>
        </>
      }
    >
      <div className="pf-stack">
        <div className="pf-field">
          <label htmlFor="pf-goal-activity" className="pf-field__label">
            Atividade vinculada
          </label>
          <select
            id="pf-goal-activity"
            className="pf-field__control"
            value={activityId}
            onChange={(e) => setActivityId(e.target.value)}
          >
            {activeActivities.map((act) => (
              <option key={act.id} value={act.id}>
                {act.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Título opcional"
          placeholder="Ex.: Treinar 4 vezes por semana"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="pf-field">
          <label htmlFor="pf-goal-freq" className="pf-field__label">
            Frequência
          </label>
          <select
            id="pf-goal-freq"
            className="pf-field__control"
            value={frequencyType}
            onChange={(e) => setFrequencyType(e.target.value as 'daily' | 'weekly')}
          >
            <option value="daily">Diária</option>
            <option value="weekly">X vezes por semana</option>
          </select>
        </div>

        {frequencyType === 'weekly' && (
          <Input
            type="number"
            min={1}
            max={7}
            label="Vezes por semana (1 a 7)"
            value={targetCount}
            onChange={(e) => setTargetCount(Number(e.target.value))}
          />
        )}
      </div>
    </Modal>
  );
};

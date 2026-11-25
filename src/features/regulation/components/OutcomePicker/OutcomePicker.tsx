/**
 * Componente OutcomePicker (src/features/regulation/components/OutcomePicker/OutcomePicker.tsx)
 * Pergunta única pós-exercício ("Como você se sente agora?") para registrar eficácia.
 */
import React from 'react';
import type { RegulationSession } from '../../../../types/domain';
import { Button } from '../../../../components/ui/Button/Button';
import './OutcomePicker.css';

interface OutcomePickerProps {
  onSelect: (outcome: RegulationSession['outcome']) => void;
}

const OUTCOMES: { value: RegulationSession['outcome']; label: string }[] = [
  { value: 'worse', label: 'Pior' },
  { value: 'same', label: 'Igual' },
  { value: 'better', label: 'Um pouco melhor' },
  { value: 'much_better', label: 'Muito melhor' },
];

export const OutcomePicker: React.FC<OutcomePickerProps> = ({ onSelect }) => {
  return (
    <div className="pf-outcome">
      <h3>Como você se sente agora?</h3>
      <div className="pf-outcome__options">
        {OUTCOMES.map((opt) => (
          <Button key={opt.value} variant="secondary" onClick={() => onSelect(opt.value)}>
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

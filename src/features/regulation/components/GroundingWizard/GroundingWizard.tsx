/**
 * Componente GroundingWizard (src/features/regulation/components/GroundingWizard/GroundingWizard.tsx)
 * Assistente em 5 etapas sequenciais (5-4-3-2-1) para aterramento sensorial em estresse agudo.
 */
import React, { useState } from 'react';
import type { RegulationSession } from '../../../../types/domain';
import { Button } from '../../../../components/ui/Button/Button';
import { Input } from '../../../../components/ui/Input/Input';
import { ProgressBar } from '../../../../components/ui/ProgressBar/ProgressBar';
import { OutcomePicker } from '../OutcomePicker/OutcomePicker';
import './GroundingWizard.css';

interface StepSpec {
  count: number;
  prompt: string;
}

const STEPS: StepSpec[] = [
  { count: 5, prompt: '5 coisas que você consegue ver agora' },
  { count: 4, prompt: '4 coisas que você pode tocar' },
  { count: 3, prompt: '3 sons que você consegue ouvir' },
  { count: 2, prompt: '2 cheiros que você percebe' },
  { count: 1, prompt: '1 sensação presente no seu corpo' },
];

interface GroundingWizardProps {
  onComplete: (durationSeconds: number, outcome: RegulationSession['outcome']) => void;
}

export const GroundingWizard: React.FC<GroundingWizardProps> = ({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startedAt] = useState(() => Date.now());
  const [finished, setFinished] = useState(false);

  const currentStep = STEPS[stepIndex];

  const handleReset = () => {
    setStepIndex(0);
    setAnswers({});
    setFinished(false);
  };

  if (finished) {
    return (
      <OutcomePicker
        onSelect={(outcome) => {
          const duration = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
          onComplete(duration, outcome);
          handleReset();
        }}
      />
    );
  }

  return (
    <div className="pf-grounding">
      <div className="pf-row pf-row--between">
        <span className="pf-text-xs">
          Etapa {stepIndex + 1} de {STEPS.length}
        </span>
        <span className="pf-text-xs">Aterramento 5-4-3-2-1</span>
      </div>

      <ProgressBar value={stepIndex + 1} max={STEPS.length} label="Progresso do aterramento" />

      <h3>{currentStep.prompt}</h3>

      {/* Inputs rápidos correspondentes à contagem da etapa sensorial atual */}
      <div className="pf-grounding__inputs">
        {Array.from({ length: currentStep.count }).map((_, idx) => {
          const key = `${stepIndex}-${idx}`;
          return (
            <Input
              key={key}
              placeholder={`Item ${idx + 1}...`}
              aria-label={`${currentStep.prompt} — item ${idx + 1}`}
              value={answers[key] ?? ''}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [key]: e.target.value }))}
            />
          );
        })}
      </div>

      <div className="pf-row pf-row--between">
        <Button
          variant="ghost"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
        >
          Voltar
        </Button>

        {stepIndex < STEPS.length - 1 ? (
          <Button variant="primary" onClick={() => setStepIndex((i) => i + 1)}>
            Próximo passo
          </Button>
        ) : (
          <Button variant="primary" onClick={() => setFinished(true)}>
            Concluir exercício
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Componente ReframeCards (src/features/regulation/components/ReframeCards/ReframeCards.tsx)
 * Conduz o usuário por 3 perguntas estruturadas de reenquadramento cognitivo,
 * oferecendo opção de anexar o resumo formatado à nota do último check-in.
 */
import React, { useState } from 'react';
import type { RegulationSession } from '../../../../types/domain';
import { Button } from '../../../../components/ui/Button/Button';
import { ProgressBar } from '../../../../components/ui/ProgressBar/ProgressBar';
import { OutcomePicker } from '../OutcomePicker/OutcomePicker';
import './ReframeCards.css';

const QUESTIONS = [
  'Qual pensamento está pesando agora?',
  'Que fato objetivo contradiz ou suaviza esse pensamento?',
  'Qual é o menor passo gentil que você pode dar na próxima hora?',
];

interface ReframeCardsProps {
  hasLatestEntry: boolean;
  onAttachToLatestEntry: (formattedText: string) => Promise<void>;
  onComplete: (durationSeconds: number, outcome: RegulationSession['outcome']) => void;
}

export const ReframeCards: React.FC<ReframeCardsProps> = ({
  hasLatestEntry,
  onAttachToLatestEntry,
  onComplete,
}) => {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<string[]>(['', '', '']);
  const [startedAt] = useState(() => Date.now());
  const [finished, setFinished] = useState(false);
  const [attached, setAttached] = useState(false);

  const updateResponse = (value: string) => {
    setResponses((prev) => prev.map((item, idx) => (idx === step ? value : item)));
  };

  // Formata as 3 respostas para anexar à nota do check-in mais recente
  const handleAttach = async () => {
    const summary = [
      '[Reenquadramento de Pensamento]',
      `1. Pensamento: ${responses[0] || '-'}`,
      `2. Fato objetivo: ${responses[1] || '-'}`,
      `3. Próximo passo gentil: ${responses[2] || '-'}`,
    ].join('\n');
    await onAttachToLatestEntry(summary);
    setAttached(true);
  };

  const reset = () => {
    setStep(0);
    setResponses(['', '', '']);
    setFinished(false);
    setAttached(false);
  };

  if (finished) {
    return (
      <div className="pf-reframe">
        {hasLatestEntry && (
          <Button
            variant="secondary"
            disabled={attached}
            onClick={() => void handleAttach()}
          >
            {attached
              ? 'Reflexão anexada ao último check-in'
              : 'Anexar reflexão ao meu último check-in'}
          </Button>
        )}

        <OutcomePicker
          onSelect={(outcome) => {
            const duration = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
            onComplete(duration, outcome);
            reset();
          }}
        />
      </div>
    );
  }

  return (
    <div className="pf-reframe">
      <span className="pf-text-xs">
        Cartão {step + 1} de {QUESTIONS.length}
      </span>
      <ProgressBar value={step + 1} max={QUESTIONS.length} label="Progresso do reenquadramento" />

      <h3>{QUESTIONS[step]}</h3>

      <textarea
        className="pf-field__control pf-field__textarea"
        aria-label={QUESTIONS[step]}
        placeholder="Escreva sua resposta com sinceridade e gentileza..."
        value={responses[step]}
        onChange={(e) => updateResponse(e.target.value)}
      />

      <div className="pf-row pf-row--between">
        <Button
          variant="ghost"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          Anterior
        </Button>

        {step < QUESTIONS.length - 1 ? (
          <Button variant="primary" onClick={() => setStep((s) => s + 1)}>
            Próximo cartão
          </Button>
        ) : (
          <Button variant="primary" onClick={() => setFinished(true)}>
            Finalizar reflexão
          </Button>
        )}
      </div>
    </div>
  );
};

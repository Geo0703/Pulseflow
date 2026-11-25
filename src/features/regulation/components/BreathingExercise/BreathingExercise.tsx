/**
 * Componente BreathingExercise (src/features/regulation/components/BreathingExercise/BreathingExercise.tsx)
 * Exercício de respiração guiada com seletor de protocolo (Box 4-4-4-4 ou 4-7-8),
 * círculo animado exclusivamente via CSS e controle de 4 ciclos.
 */
import React, { useEffect, useMemo, useState } from 'react';
import type { RegulationSession } from '../../../../types/domain';
import { Button } from '../../../../components/ui/Button/Button';
import { Tabs } from '../../../../components/ui/Tabs/Tabs';
import { OutcomePicker } from '../OutcomePicker/OutcomePicker';
import './BreathingExercise.css';

type ProtocolId = 'box' | 'relax';

interface PhaseSpec {
  label: string;
  seconds: number;
  visual: 'expand' | 'hold' | 'contract';
}

const PROTOCOLS: Record<ProtocolId, PhaseSpec[]> = {
  box: [
    { label: 'Inspire', seconds: 4, visual: 'expand' },
    { label: 'Segure', seconds: 4, visual: 'hold' },
    { label: 'Expire', seconds: 4, visual: 'contract' },
    { label: 'Pausa', seconds: 4, visual: 'contract' },
  ],
  relax: [
    { label: 'Inspire', seconds: 4, visual: 'expand' },
    { label: 'Segure', seconds: 7, visual: 'hold' },
    { label: 'Expire', seconds: 8, visual: 'contract' },
  ],
};

const TOTAL_CYCLES = 4;

interface BreathingExerciseProps {
  onComplete: (durationSeconds: number, outcome: RegulationSession['outcome']) => void;
}

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onComplete }) => {
  // Estados de protocolo, execução, fase atual, contador regressivo e conclusão
  const [protocol, setProtocol] = useState<ProtocolId>('box');
  const [running, setRunning] = useState(false);
  const [cycle, setCycle] = useState(1);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [remaining, setRemaining] = useState(PROTOCOLS.box[0].seconds);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [finished, setFinished] = useState(false);

  const phases = useMemo(() => PROTOCOLS[protocol], [protocol]);
  const currentPhase = phases[phaseIndex] ?? phases[0];

  // Reinicia cronômetro e ciclos ao trocar de protocolo
  const reset = (nextProtocol: ProtocolId = protocol) => {
    setRunning(false);
    setFinished(false);
    setCycle(1);
    setPhaseIndex(0);
    setElapsedSeconds(0);
    setRemaining(PROTOCOLS[nextProtocol][0].seconds);
  };

  // Avança o contador segundo a segundo sincronizando fases e ciclos
  useEffect(() => {
    if (!running || finished) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
      setRemaining((prev) => {
        if (prev > 1) return prev - 1;

        const nextPhaseIdx = phaseIndex + 1;
        if (nextPhaseIdx < phases.length) {
          setPhaseIndex(nextPhaseIdx);
          return phases[nextPhaseIdx].seconds;
        }

        if (cycle < TOTAL_CYCLES) {
          setCycle((c) => c + 1);
          setPhaseIndex(0);
          return phases[0].seconds;
        }

        setRunning(false);
        setFinished(true);
        return 0;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cycle, finished, phaseIndex, phases, running]);

  return (
    <div className="pf-breathing">
      <Tabs<ProtocolId>
        ariaLabel="Protocolo de respiração"
        value={protocol}
        onChange={(next) => {
          setProtocol(next);
          reset(next);
        }}
        options={[
          { id: 'box', label: 'Box Breathing (4-4-4-4)' },
          { id: 'relax', label: 'Relaxamento (4-7-8)' },
        ]}
      />

      <p className="pf-text-muted">
        Ciclo {cycle} de {TOTAL_CYCLES}
      </p>

      {/* Círculo central animado exclusivamente com transform: scale() */}
      <div className="pf-breathing__stage">
        <div
          className={`pf-breathing__circle ${
            running ? `pf-breathing__circle--${currentPhase.visual}` : ''
          }`.trim()}
        >
          <span className="pf-breathing__phase">{currentPhase.label}</span>
          <span className="pf-breathing__count">{remaining}s</span>
        </div>
      </div>

      {!finished ? (
        <div className="pf-row">
          <Button variant="primary" onClick={() => setRunning((r) => !r)}>
            {running ? 'Pausar' : 'Iniciar'}
          </Button>
          <Button variant="secondary" onClick={() => reset()}>
            Reiniciar
          </Button>
          <Button variant="ghost" onClick={() => setFinished(true)}>
            Concluir agora
          </Button>
        </div>
      ) : (
        <OutcomePicker
          onSelect={(outcome) => {
            onComplete(Math.max(1, elapsedSeconds), outcome);
            reset();
          }}
        />
      )}
    </div>
  );
};

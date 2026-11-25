/**
 * Página ToolsPage (src/features/regulation/ToolsPage.tsx)
 * Reúne as 3 micro-estratégias interativas (Respiração, Aterramento 5-4-3-2-1 e
 * Reenquadramento), registra o impacto no IndexedDB e exibe sessões recentes.
 */
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { RegulationSession, RegulationToolId } from '../../types/domain';
import { useAppData } from '../../store/AppDataContext';
import { useToast } from '../../components/ui/Toast/ToastContext';
import { PageHeader } from '../../components/layout/PageHeader/PageHeader';
import { Card } from '../../components/ui/Card/Card';
import { Tabs } from '../../components/ui/Tabs/Tabs';
import { BreathingExercise } from './components/BreathingExercise/BreathingExercise';
import { GroundingWizard } from './components/GroundingWizard/GroundingWizard';
import { ReframeCards } from './components/ReframeCards/ReframeCards';
import './ToolsPage.css';

const TOOL_LABELS: Record<RegulationToolId, string> = {
  breathing: 'Respiração Guiada',
  grounding: 'Aterramento 5-4-3-2-1',
  reframe: 'Reenquadramento',
};

const OUTCOME_LABELS: Record<RegulationSession['outcome'], string> = {
  worse: 'Pior',
  same: 'Igual',
  better: 'Um pouco melhor',
  much_better: 'Muito melhor',
};

export const ToolsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTool = (searchParams.get('tool') as RegulationToolId) || 'breathing';
  const linkedEntryId = searchParams.get('entryId') || undefined;

  const [activeTool, setActiveTool] = useState<RegulationToolId>(
    ['breathing', 'grounding', 'reframe'].includes(initialTool) ? initialTool : 'breathing'
  );

  const { entries, regulationSessions, saveEntry, saveRegulationSession } = useAppData();
  const { showToast } = useToast();

  // Salva a sessão concluída na store 'regulationSessions'
  const handleComplete = async (
    toolId: RegulationToolId,
    durationSeconds: number,
    outcome: RegulationSession['outcome']
  ) => {
    await saveRegulationSession({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      linkedEntryId,
      toolId,
      durationSeconds,
      outcome,
    });
    showToast('Sessão de regulação registrada com sucesso.');
  };

  // Concatena o resumo do reenquadramento à nota do check-in mais recente
  const handleAttachToLatest = async (formattedText: string) => {
    const latest = entries[0];
    if (!latest) return;
    const nextNote = latest.note ? `${latest.note}\n\n${formattedText}` : formattedText;
    await saveEntry({ ...latest, note: nextNote, updatedAt: new Date().toISOString() });
    showToast('Reflexão anexada ao seu último check-in.');
  };

  return (
    <div className="pf-stack pf-stack--lg">
      <PageHeader
        title="Ferramentas de Regulação"
        subtitle="Micro-estratégias rápidas de 2 minutos para agir no presente."
      />

      <Tabs<RegulationToolId>
        ariaLabel="Selecionar ferramenta de regulação"
        value={activeTool}
        onChange={setActiveTool}
        options={[
          { id: 'breathing', label: 'Respiração' },
          { id: 'grounding', label: 'Aterramento 5-4-3-2-1' },
          { id: 'reframe', label: 'Reenquadramento' },
        ]}
      />

      {/* Área principal do exercício ativo */}
      <Card padding="lg">
        {activeTool === 'breathing' && (
          <BreathingExercise
            onComplete={(duration, outcome) => void handleComplete('breathing', duration, outcome)}
          />
        )}
        {activeTool === 'grounding' && (
          <GroundingWizard
            onComplete={(duration, outcome) => void handleComplete('grounding', duration, outcome)}
          />
        )}
        {activeTool === 'reframe' && (
          <ReframeCards
            hasLatestEntry={entries.length > 0}
            onAttachToLatestEntry={handleAttachToLatest}
            onComplete={(duration, outcome) => void handleComplete('reframe', duration, outcome)}
          />
        )}
      </Card>

      {/* Histórico recente de sessões concluídas */}
      {regulationSessions.length > 0 && (
        <Card>
          <div className="pf-stack pf-stack--sm">
            <h3>Sessões recentes ({regulationSessions.length})</h3>
            <div className="pf-tools-page__history">
              {regulationSessions.slice(0, 5).map((session) => (
                <div key={session.id} className="pf-tools-page__session-row">
                  <span>{TOOL_LABELS[session.toolId]}</span>
                  <span className="pf-text-xs">
                    Resultado: <strong>{OUTCOME_LABELS[session.outcome]}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

/**
 * Componente MoodLabelManager (src/features/settings/components/MoodLabelManager/MoodLabelManager.tsx)
 * Permite personalizar os rótulos dos 5 níveis de humor (ex.: mudar "Ótimo" para "Radiante").
 */
import React, { useState } from 'react';
import type { MoodLevel } from '../../../../types/domain';
import { Input } from '../../../../components/ui/Input/Input';
import { Button } from '../../../../components/ui/Button/Button';

interface MoodLabelManagerProps {
  moodLabels: Record<MoodLevel, string>;
  onSave: (nextLabels: Record<MoodLevel, string>) => Promise<void>;
}

export const MoodLabelManager: React.FC<MoodLabelManagerProps> = ({ moodLabels, onSave }) => {
  const [draft, setDraft] = useState<Record<MoodLevel, string>>(moodLabels);

  return (
    <div className="pf-stack">
      <div className="pf-grid-2">
        {([1, 2, 3, 4, 5] as MoodLevel[]).map((level) => (
          <Input
            key={level}
            label={`Nível ${level}`}
            value={draft[level]}
            onChange={(e) => setDraft((prev) => ({ ...prev, [level]: e.target.value }))}
          />
        ))}
      </div>
      <div>
        <Button variant="primary" onClick={() => void onSave(draft)}>
          Salvar rótulos de humor
        </Button>
      </div>
    </div>
  );
};

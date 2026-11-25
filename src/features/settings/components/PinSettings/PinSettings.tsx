/**
 * Componente PinSettings (src/features/settings/components/PinSettings/PinSettings.tsx)
 * Ativa, altera ou desativa o PIN de 4 dígitos armazenando apenas o hash SHA-256.
 */
import React, { useState } from 'react';
import type { UserSettings } from '../../../../types/domain';
import { hashPin, isValidPin } from '../../utils/pinCrypto';
import { Input } from '../../../../components/ui/Input/Input';
import { Button } from '../../../../components/ui/Button/Button';

interface PinSettingsProps {
  settings: UserSettings;
  onUpdate: (partial: Partial<UserSettings>) => Promise<UserSettings>;
}

export const PinSettings: React.FC<PinSettingsProps> = ({ settings, onUpdate }) => {
  const [newPin, setNewPin] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSavePin = async () => {
    if (!isValidPin(newPin)) {
      setFeedback('Informe exatamente 4 dígitos numéricos.');
      return;
    }
    const pinHash = await hashPin(newPin);
    await onUpdate({ pinEnabled: true, pinHash });
    setNewPin('');
    setFeedback('PIN salvo com segurança (SHA-256).');
  };

  const handleDisablePin = async () => {
    await onUpdate({ pinEnabled: false, pinHash: null });
    setFeedback('Bloqueio por PIN desativado.');
  };

  return (
    <div className="pf-stack">
      <div className="pf-row">
        <div style={{ flex: 1, minWidth: '180px' }}>
          <Input
            type="password"
            inputMode="numeric"
            maxLength={4}
            label={settings.pinEnabled ? 'Alterar PIN (4 dígitos)' : 'Definir PIN (4 dígitos)'}
            placeholder="0000"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          />
        </div>
        <Button variant="primary" onClick={() => void handleSavePin()}>
          {settings.pinEnabled ? 'Atualizar PIN' : 'Ativar PIN'}
        </Button>
        {settings.pinEnabled && (
          <Button variant="danger" onClick={() => void handleDisablePin()}>
            Desativar PIN
          </Button>
        )}
      </div>

      <div className="pf-field">
        <label htmlFor="pf-autolock" className="pf-field__label">
          Bloqueio automático por inatividade
        </label>
        <select
          id="pf-autolock"
          className="pf-field__control"
          value={settings.pinAutoLockMinutes}
          onChange={(e) =>
            void onUpdate({
              pinAutoLockMinutes: Number(e.target.value) as UserSettings['pinAutoLockMinutes'],
            })
          }
        >
          <option value={0}>Imediato (apenas ao abrir)</option>
          <option value={1}>Após 1 minuto</option>
          <option value={5}>Após 5 minutos</option>
          <option value={15}>Após 15 minutos</option>
        </select>
      </div>

      {feedback && <p className="pf-text-xs">{feedback}</p>}
    </div>
  );
};

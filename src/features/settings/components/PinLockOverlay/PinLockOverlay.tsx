/**
 * Componente PinLockOverlay (src/features/settings/components/PinLockOverlay/PinLockOverlay.tsx)
 * Bloqueia o conteúdo do aplicativo até a digitação do PIN de 4 dígitos correto.
 */
import React, { useState } from 'react';
import { Icon } from '../../../../components/ui/Icon/Icon';
import './PinLockOverlay.css';

interface PinLockOverlayProps {
  onUnlock: (pin: string) => Promise<boolean>;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Limpar', '0', 'Apagar'];

export const PinLockOverlay: React.FC<PinLockOverlayProps> = ({ onUnlock }) => {
  const [digits, setDigits] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleKey = async (key: string) => {
    setError(null);
    if (key === 'Limpar') {
      setDigits('');
      return;
    }
    if (key === 'Apagar') {
      setDigits((prev) => prev.slice(0, -1));
      return;
    }
    if (digits.length >= 4) return;

    const next = digits + key;
    setDigits(next);

    if (next.length === 4) {
      const ok = await onUnlock(next);
      if (!ok) {
        setError('PIN incorreto. Tente novamente.');
        setDigits('');
      }
    }
  };

  return (
    <div className="pf-pin-overlay" role="dialog" aria-modal="true" aria-label="Bloqueio por PIN">
      <div className="pf-pin-overlay__card">
        <div style={{ margin: '0 auto', color: 'var(--color-accent)' }}>
          <Icon name="lock" size={32} />
        </div>
        <h2>Digite seu PIN</h2>

        <div className="pf-pin-overlay__dots" aria-label={`${digits.length} de 4 dígitos preenchidos`}>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`pf-pin-overlay__dot ${
                i < digits.length ? 'pf-pin-overlay__dot--filled' : ''
              }`.trim()}
            />
          ))}
        </div>

        {error && <p className="pf-pin-overlay__error">{error}</p>}

        <div className="pf-pin-overlay__keypad">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className="pf-pin-overlay__key"
              onClick={() => void handleKey(key)}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

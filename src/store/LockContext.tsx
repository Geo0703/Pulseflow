/**
 * Contexto de Bloqueio por PIN (src/store/LockContext.tsx)
 * Controla o estado de bloqueio inicial e o auto-bloqueio por inatividade.
 */
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAppData } from './AppDataContext';
import { verifyPin } from '../features/settings/utils/pinCrypto';

interface LockContextValue {
  isLocked: boolean;
  unlockWithPin: (pin: string) => Promise<boolean>;
  lockNow: () => void;
}

const LockContext = createContext<LockContextValue | null>(null);

export const LockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, loading } = useAppData();
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const initializedRef = useRef(false);

  // Ativa o bloqueio na abertura do aplicativo caso o PIN esteja habilitado
  useEffect(() => {
    if (!loading && !initializedRef.current) {
      initializedRef.current = true;
      if (settings.pinEnabled && settings.pinHash) {
        setIsLocked(true);
      }
    }
    if (!settings.pinEnabled) {
      setIsLocked(false);
    }
  }, [loading, settings.pinEnabled, settings.pinHash]);

  // Monitora inatividade do usuário para reativar o bloqueio automaticamente
  useEffect(() => {
    if (!settings.pinEnabled || !settings.pinHash || isLocked) return;
    if (settings.pinAutoLockMinutes <= 0) return;

    const timeoutMs = settings.pinAutoLockMinutes * 60 * 1000;
    let timer = window.setTimeout(() => setIsLocked(true), timeoutMs);

    const resetTimer = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIsLocked(true), timeoutMs);
    };

    window.addEventListener('pointerdown', resetTimer);
    window.addEventListener('keydown', resetTimer);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointerdown', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [isLocked, settings.pinAutoLockMinutes, settings.pinEnabled, settings.pinHash]);

  // Valida o PIN digitado comparando o hash SHA-256 salvo
  const unlockWithPin = useCallback(
    async (pin: string): Promise<boolean> => {
      if (!settings.pinHash) {
        setIsLocked(false);
        return true;
      }
      const valid = await verifyPin(pin, settings.pinHash);
      if (valid) {
        setIsLocked(false);
      }
      return valid;
    },
    [settings.pinHash]
  );

  // Permite bloquear manualmente a sessão a qualquer momento
  const lockNow = useCallback(() => {
    if (settings.pinEnabled && settings.pinHash) {
      setIsLocked(true);
    }
  }, [settings.pinEnabled, settings.pinHash]);

  return (
    <LockContext.Provider value={{ isLocked, unlockWithPin, lockNow }}>
      {children}
    </LockContext.Provider>
  );
};

export function useLock(): LockContextValue {
  const ctx = useContext(LockContext);
  if (!ctx) {
    throw new Error('useLock deve ser usado dentro de LockProvider.');
  }
  return ctx;
}

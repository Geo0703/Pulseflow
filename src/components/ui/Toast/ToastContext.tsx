/**
 * Contexto de Notificações Toast (src/components/ui/Toast/ToastContext.tsx)
 * Permite disparar mensagens rápidas de feedback em qualquer parte do app.
 */
import React, { createContext, useCallback, useContext, useState } from 'react';
import { ToastList, type ToastItem } from './Toast';

interface ToastContextValue {
  showToast: (message: string, variant?: 'info' | 'error') => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Remove um toast específico da fila visível
  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Adiciona um novo toast com remoção automática após 3,5 segundos
  const showToast = useCallback(
    (message: string, variant: 'info' | 'error' = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
      window.setTimeout(() => dismiss(id), 3500);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastList items={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast deve ser usado dentro de ToastProvider.');
  }
  return ctx;
}

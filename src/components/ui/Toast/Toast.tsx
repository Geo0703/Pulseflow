/**
 * Componente ToastList (src/components/ui/Toast/Toast.tsx)
 * Renderiza a pilha acessível (role="status") de notificações temporárias.
 */
import React from 'react';
import { Icon } from '../Icon/Icon';
import './Toast.css';

export interface ToastItem {
  id: string;
  message: string;
  variant: 'info' | 'error';
}

export const ToastList: React.FC<{
  items: ToastItem[];
  onDismiss: (id: string) => void;
}> = ({ items, onDismiss }) => {
  if (items.length === 0) return null;

  return (
    <div className="pf-toast-container" aria-live="polite">
      {items.map((item) => (
        <div
          key={item.id}
          role="status"
          className={`pf-toast ${item.variant === 'error' ? 'pf-toast--error' : ''}`.trim()}
        >
          <span>{item.message}</span>
          <button
            type="button"
            className="pf-toast__close"
            onClick={() => onDismiss(item.id)}
            aria-label="Fechar aviso"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

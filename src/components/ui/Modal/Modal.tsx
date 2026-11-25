/**
 * Componente Modal (src/components/ui/Modal/Modal.tsx)
 * Diálogo acessível com fechamento via tecla Escape e clique no backdrop.
 * Adapta-se como BottomSheet no mobile e janela centralizada em telas maiores.
 */
import React, { useEffect } from 'react';
import { Icon } from '../Icon/Icon';
import './Modal.css';

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  onClose,
  footer,
  children,
}) => {
  // Permite fechar o modal pressionando a tecla Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="pf-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {/* Container semântico do diálogo acessível */}
      <div
        className="pf-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="pf-modal__header">
          <h2 className="pf-modal__title">{title}</h2>
          <button
            type="button"
            className="pf-modal__close"
            onClick={onClose}
            aria-label="Fechar janela"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="pf-modal__body">{children}</div>

        {footer && <div className="pf-modal__footer">{footer}</div>}
      </div>
    </div>
  );
};

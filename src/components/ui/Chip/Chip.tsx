/**
 * Componente Chip (src/components/ui/Chip/Chip.tsx)
 * Botão compacto em formato de pílula reutilizado na seleção de atividades,
 * emoções da matriz 2D, contexto do check-in e barra de filtros.
 */
import React from 'react';
import './Chip.css';

export interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  tone?: 'default' | 'red' | 'yellow' | 'blue' | 'green';
  size?: 'sm' | 'md';
  onClick?: () => void;
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  selected = false,
  tone = 'default',
  size = 'md',
  onClick,
  disabled = false,
}) => {
  // Monta dinamicamente as classes BEM combinando tamanho, tom semântico e seleção
  const classes = [
    'pf-chip',
    `pf-chip--${size}`,
    `pf-chip--tone-${tone}`,
    selected ? 'pf-chip--selected' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Renderiza um botão acessível usando aria-pressed para leitores de tela
  return (
    <button
      type="button"
      className={classes}
      aria-pressed={selected}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <span className="pf-chip__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="pf-chip__label">{label}</span>
    </button>
  );
};

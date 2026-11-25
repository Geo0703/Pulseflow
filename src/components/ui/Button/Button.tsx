/**
 * Componente Button (src/components/ui/Button/Button.tsx)
 * Botão primitivo reutilizável do Design System com variantes semânticas.
 */
import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  children,
  type = 'button',
  ...rest
}) => {
  // Combina classes BEM de variante, tamanho e largura total
  const classes = [
    'pf-btn',
    `pf-btn--${variant}`,
    size !== 'md' ? `pf-btn--${size}` : '',
    fullWidth ? 'pf-btn--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Renderiza o botão nativo preservando todas as props de acessibilidade
  return (
    <button type={type} className={classes} {...rest}>
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

/**
 * Componente Card (src/components/ui/Card/Card.tsx)
 * Contêiner visual padronizado para painéis, estatísticas, metas e registros.
 */
import React from 'react';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'md' | 'lg';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  padding = 'md',
  interactive = false,
  className = '',
  children,
  ...rest
}) => {
  // Monta classes BEM de espaçamento e interatividade
  const classes = [
    'pf-card',
    padding === 'lg' ? 'pf-card--padded-lg' : '',
    interactive ? 'pf-card--interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};

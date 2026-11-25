/**
 * Componente EmptyState (src/components/layout/EmptyState/EmptyState.tsx)
 * Exibe orientação amigável quando uma lista ou filtro ainda não possui registros.
 */
import React from 'react';
import { Icon } from '../../ui/Icon/Icon';
import './EmptyState.css';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'sparkles',
  title,
  description,
  action,
}) => {
  return (
    <div className="pf-empty-state">
      <div className="pf-empty-state__icon" aria-hidden="true">
        <Icon name={icon} size={24} />
      </div>
      <h3>{title}</h3>
      <p className="pf-empty-state__desc">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

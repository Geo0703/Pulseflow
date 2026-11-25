/**
 * Componente PageHeader (src/components/layout/PageHeader/PageHeader.tsx)
 * Cabeçalho consistente exibindo título, subtítulo opcional e ações rápidas.
 */
import React from 'react';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <header className="pf-page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="pf-page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="pf-page-header__actions pf-no-print">{actions}</div>}
    </header>
  );
};

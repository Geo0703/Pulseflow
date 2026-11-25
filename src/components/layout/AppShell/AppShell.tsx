/**
 * Componente AppShell (src/components/layout/AppShell/AppShell.tsx)
 * Estrutura de navegação responsiva com Sidebar no desktop e BottomNav no mobile.
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../../ui/Button/Button';
import { Icon } from '../../ui/Icon/Icon';
import './AppShell.css';

interface AppShellProps {
  onOpenCheckin: () => void;
  children: React.ReactNode;
}

// Itens principais de navegação compartilhados entre Sidebar e BottomNav
const NAV_ITEMS = [
  { to: '/timeline', label: 'Diário', icon: 'list' },
  { to: '/analytics', label: 'Estatísticas', icon: 'chart' },
  { to: '/tools', label: 'Ferramentas', icon: 'wind' },
  { to: '/goals', label: 'Metas', icon: 'target' },
  { to: '/settings', label: 'Ajustes', icon: 'settings' },
];

export const AppShell: React.FC<AppShellProps> = ({ onOpenCheckin, children }) => {
  return (
    <div className="pf-shell">
      {/* Navegação lateral fixa exibida em telas desktop (>= 1024px) */}
      <aside className="pf-shell__sidebar" aria-label="Navegação principal">
        <div className="pf-shell__brand">
          <span className="pf-shell__brand-mark" aria-hidden="true" />
          <span>PulseFlow</span>
        </div>

        <Button
          variant="primary"
          fullWidth
          icon={<Icon name="plus" size={18} />}
          onClick={onOpenCheckin}
        >
          Novo Check-in
        </Button>

        <nav className="pf-shell__nav-list">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `pf-shell__nav-link ${isActive ? 'pf-shell__nav-link--active' : ''}`.trim()
              }
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Conteúdo principal da rota ativa */}
      <main className="pf-shell__content">{children}</main>

      {/* Barra inferior mobile com botão central '+' para check-in rápido */}
      <nav className="pf-shell__bottom-nav" aria-label="Navegação inferior">
        <NavLink
          to="/timeline"
          className={({ isActive }) =>
            `pf-shell__bottom-item ${isActive ? 'pf-shell__bottom-item--active' : ''}`.trim()
          }
        >
          <Icon name="list" size={20} />
          <span>Diário</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `pf-shell__bottom-item ${isActive ? 'pf-shell__bottom-item--active' : ''}`.trim()
          }
        >
          <Icon name="chart" size={20} />
          <span>Dados</span>
        </NavLink>

        <button
          type="button"
          className="pf-shell__fab"
          onClick={onOpenCheckin}
          aria-label="Novo Check-in"
        >
          <Icon name="plus" size={24} />
        </button>

        <NavLink
          to="/tools"
          className={({ isActive }) =>
            `pf-shell__bottom-item ${isActive ? 'pf-shell__bottom-item--active' : ''}`.trim()
          }
        >
          <Icon name="wind" size={20} />
          <span>Ação</span>
        </NavLink>

        <NavLink
          to="/goals"
          className={({ isActive }) =>
            `pf-shell__bottom-item ${isActive ? 'pf-shell__bottom-item--active' : ''}`.trim()
          }
        >
          <Icon name="target" size={20} />
          <span>Metas</span>
        </NavLink>
      </nav>
    </div>
  );
};

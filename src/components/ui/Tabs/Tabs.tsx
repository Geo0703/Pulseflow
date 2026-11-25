/**
 * Componente Tabs (src/components/ui/Tabs/Tabs.tsx)
 * Alternador segmentado com papéis ARIA (tablist/tab) para alternar visões.
 */
import React from 'react';
import './Tabs.css';

export interface TabOption<T extends string> {
  id: T;
  label: string;
}

export interface TabsProps<T extends string> {
  options: TabOption<T>[];
  value: T;
  onChange: (next: T) => void;
  ariaLabel?: string;
}

export function Tabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel = 'Abas de visualização',
}: TabsProps<T>) {
  return (
    <div className="pf-tabs" role="tablist" aria-label={ariaLabel}>
      {options.map((opt) => {
        const isActive = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`pf-tabs__tab ${isActive ? 'pf-tabs__tab--active' : ''}`.trim()}
            onClick={() => onChange(opt.id)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

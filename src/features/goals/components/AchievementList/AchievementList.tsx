/**
 * Componente AchievementList (src/features/goals/components/AchievementList/AchievementList.tsx)
 * Renderiza as 6 conquistas desbloqueáveis automaticamente com estado e barra de progresso.
 */
import React from 'react';
import type { AchievementItem } from '../../utils/streakCalculator';
import { ProgressBar } from '../../../../components/ui/ProgressBar/ProgressBar';
import './AchievementList.css';

export const AchievementList: React.FC<{ items: AchievementItem[] }> = ({ items }) => {
  return (
    <div className="pf-grid-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`pf-achievement ${item.unlocked ? 'pf-achievement--unlocked' : ''}`.trim()}
        >
          <div className="pf-row pf-row--between">
            <strong>{item.title}</strong>
            <span className="pf-text-xs">
              {item.unlocked ? 'Desbloqueada' : `${item.current}/${item.target}`}
            </span>
          </div>
          <p className="pf-text-xs">{item.description}</p>
          <ProgressBar
            value={item.current}
            max={item.target}
            tone={item.unlocked ? 'success' : 'accent'}
            label={item.title}
          />
        </div>
      ))}
    </div>
  );
};

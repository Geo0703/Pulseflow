/**
 * Componente ActivitySelector (src/features/checkin/components/ActivitySelector/ActivitySelector.tsx)
 * Exibe as atividades agrupadas por categorias expansíveis usando Chips reutilizáveis.
 */
import React from 'react';
import type { ActivityGroup, ActivityTag } from '../../../../types/domain';
import { Chip } from '../../../../components/ui/Chip/Chip';
import { Icon } from '../../../../components/ui/Icon/Icon';
import './ActivitySelector.css';

interface ActivitySelectorProps {
  groups: ActivityGroup[];
  activities: ActivityTag[];
  selectedIds: string[];
  onToggle: (activityId: string) => void;
}

export const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  groups,
  activities,
  selectedIds,
  onToggle,
}) => {
  // Exibe apenas grupos e tags ativas (não arquivadas)
  const activeGroups = groups.filter((g) => !g.archived);

  return (
    <div className="pf-act-selector">
      {activeGroups.map((group, index) => {
        const groupTags = activities.filter((a) => a.groupId === group.id && !a.archived);
        if (groupTags.length === 0) return null;

        return (
          <details key={group.id} className="pf-act-selector__group" open={index < 2}>
            <summary className="pf-act-selector__summary">
              <span>{group.name}</span>
              <span className="pf-text-xs">{groupTags.length} itens</span>
            </summary>

            <div className="pf-act-selector__chips">
              {groupTags.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.label}
                  size="sm"
                  icon={<Icon name={tag.iconName} size={14} />}
                  selected={selectedIds.includes(tag.id)}
                  onClick={() => onToggle(tag.id)}
                />
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
};

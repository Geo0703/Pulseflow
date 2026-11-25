/**
 * Componente ActivityManager (src/features/settings/components/ActivityManager/ActivityManager.tsx)
 * CRUD completo de grupos e tags de atividade com seletor de ícones SVG e soft-delete.
 */
import React, { useState } from 'react';
import type { ActivityGroup, ActivityTag } from '../../../../types/domain';
import { ACTIVITY_ICON_OPTIONS } from '../../../../components/ui/Icon/iconRegistry';
import { Input } from '../../../../components/ui/Input/Input';
import { Button } from '../../../../components/ui/Button/Button';
import { Chip } from '../../../../components/ui/Chip/Chip';
import { Icon } from '../../../../components/ui/Icon/Icon';

interface ActivityManagerProps {
  groups: ActivityGroup[];
  activities: ActivityTag[];
  onSaveGroup: (group: ActivityGroup) => Promise<void>;
  onSaveActivity: (activity: ActivityTag) => Promise<void>;
  onArchiveActivity: (activity: ActivityTag) => Promise<void>;
}

export const ActivityManager: React.FC<ActivityManagerProps> = ({
  groups,
  activities,
  onSaveGroup,
  onSaveActivity,
  onArchiveActivity,
}) => {
  const activeGroups = groups.filter((g) => !g.archived);
  const [newGroupName, setNewGroupName] = useState('');
  const [newActLabel, setNewActLabel] = useState('');
  const [newActGroupId, setNewActGroupId] = useState(activeGroups[0]?.id ?? '');
  const [newActIcon, setNewActIcon] = useState(ACTIVITY_ICON_OPTIONS[0]);

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) return;
    await onSaveGroup({
      id: `grp-${crypto.randomUUID().slice(0, 8)}`,
      name: newGroupName.trim(),
      order: groups.length + 1,
      archived: false,
    });
    setNewGroupName('');
  };

  const handleAddActivity = async () => {
    const targetGroup = newActGroupId || activeGroups[0]?.id;
    if (!newActLabel.trim() || !targetGroup) return;
    await onSaveActivity({
      id: `act-${crypto.randomUUID().slice(0, 8)}`,
      groupId: targetGroup,
      label: newActLabel.trim(),
      iconName: newActIcon,
      order: activities.length + 1,
      archived: false,
    });
    setNewActLabel('');
  };

  return (
    <div className="pf-stack">
      {/* Criar novo grupo */}
      <div className="pf-row">
        <div style={{ flex: 1, minWidth: '180px' }}>
          <Input
            label="Novo grupo de atividades"
            placeholder="Ex.: Finanças"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
        </div>
        <Button variant="secondary" onClick={() => void handleAddGroup()}>
          Criar grupo
        </Button>
      </div>

      {/* Criar nova tag de atividade */}
      <div className="pf-grid-2">
        <Input
          label="Nova atividade"
          placeholder="Ex.: Yoga"
          value={newActLabel}
          onChange={(e) => setNewActLabel(e.target.value)}
        />
        <div className="pf-field">
          <label htmlFor="pf-new-act-group" className="pf-field__label">
            Grupo
          </label>
          <select
            id="pf-new-act-group"
            className="pf-field__control"
            value={newActGroupId || activeGroups[0]?.id || ''}
            onChange={(e) => setNewActGroupId(e.target.value)}
          >
            {activeGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Seletor visual de ícones internos */}
      <div className="pf-row">
        {ACTIVITY_ICON_OPTIONS.slice(0, 12).map((iconName) => (
          <Chip
            key={iconName}
            size="sm"
            label={iconName}
            icon={<Icon name={iconName} size={14} />}
            selected={newActIcon === iconName}
            onClick={() => setNewActIcon(iconName)}
          />
        ))}
      </div>

      <div>
        <Button variant="primary" onClick={() => void handleAddActivity()}>
          Adicionar atividade
        </Button>
      </div>

      {/* Lista de atividades ativas com botão de arquivar (soft-delete) */}
      <div className="pf-stack pf-stack--sm">
        {activeGroups.map((group) => {
          const groupItems = activities.filter((a) => a.groupId === group.id && !a.archived);
          return (
            <div key={group.id}>
              <strong className="pf-text-xs">{group.name}</strong>
              <div className="pf-row" style={{ marginTop: '4px' }}>
                {groupItems.map((act) => (
                  <Chip
                    key={act.id}
                    size="sm"
                    label={`${act.label} ×`}
                    icon={<Icon name={act.iconName} size={14} />}
                    onClick={() => void onArchiveActivity(act)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

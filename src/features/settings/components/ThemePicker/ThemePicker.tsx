/**
 * Componente ThemePicker (src/features/settings/components/ThemePicker/ThemePicker.tsx)
 * Permite alternar modo de tema (Claro, Escuro, Sistema) e paleta (Padrão, Pastel, Alto Contraste).
 */
import React from 'react';
import type { UserSettings } from '../../../../types/domain';
import { Tabs } from '../../../../components/ui/Tabs/Tabs';

interface ThemePickerProps {
  themeMode: UserSettings['themeMode'];
  colorPalette: UserSettings['colorPalette'];
  onChangeTheme: (mode: UserSettings['themeMode']) => void;
  onChangePalette: (palette: UserSettings['colorPalette']) => void;
}

export const ThemePicker: React.FC<ThemePickerProps> = ({
  themeMode,
  colorPalette,
  onChangeTheme,
  onChangePalette,
}) => {
  return (
    <div className="pf-stack">
      <div className="pf-stack pf-stack--sm">
        <strong>Tema da interface</strong>
        <Tabs<UserSettings['themeMode']>
          ariaLabel="Modo de tema"
          value={themeMode}
          onChange={onChangeTheme}
          options={[
            { id: 'light', label: 'Claro' },
            { id: 'dark', label: 'Escuro' },
            { id: 'system', label: 'Seguir Sistema' },
          ]}
        />
      </div>

      <div className="pf-stack pf-stack--sm">
        <strong>Paleta da escala de humor</strong>
        <Tabs<UserSettings['colorPalette']>
          ariaLabel="Paleta de cores"
          value={colorPalette}
          onChange={onChangePalette}
          options={[
            { id: 'default', label: 'Padrão' },
            { id: 'pastel', label: 'Pastel' },
            { id: 'high-contrast', label: 'Alto Contraste' },
          ]}
        />
      </div>
    </div>
  );
};

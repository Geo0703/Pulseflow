/**
 * Testes da Página de Configurações (src/features/settings/__tests__/SettingsPage.test.tsx)
 */
import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { SettingsPage } from '../SettingsPage';

describe('Página de Ajustes e Privacidade (SettingsPage)', () => {
  it('deve alternar tema para Escuro aplicando data-theme=dark no HTML', async () => {
    renderWithProviders(<SettingsPage />, { initialRoute: '/settings' });

    await userEvent.click(screen.getByRole('tab', { name: 'Escuro' }));
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });
});

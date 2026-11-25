/**
 * Testes Integrados da Aplicação (src/App.test.tsx)
 * Valida roteamento principal e desbloqueio via PinLockOverlay quando o PIN está ativo.
 */
import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test/renderWithProviders';
import { AppContent } from './App';
import { settingsRepo } from './db/repositories';
import { DEFAULT_USER_SETTINGS } from './data/defaultSettings';
import { hashPin } from './features/settings/utils/pinCrypto';

describe('Aplicação Principal (AppContent)', () => {
  it('deve exigir PIN na abertura quando pinEnabled=true e liberar após digitar o PIN correto', async () => {
    const pinHash = await hashPin('1234');
    await settingsRepo.save({
      ...DEFAULT_USER_SETTINGS,
      pinEnabled: true,
      pinHash,
    });

    renderWithProviders(<AppContent />, { initialRoute: '/timeline' });

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Bloqueio por PIN' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: '1' }));
    await userEvent.click(screen.getByRole('button', { name: '2' }));
    await userEvent.click(screen.getByRole('button', { name: '3' }));
    await userEvent.click(screen.getByRole('button', { name: '4' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Bloqueio por PIN' })).not.toBeInTheDocument();
    });
  });
});

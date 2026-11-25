/**
 * Testes da Página de Metas (src/features/goals/__tests__/GoalsPage.test.tsx)
 */
import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { GoalsPage } from '../GoalsPage';

describe('Página de Metas e Conquistas (GoalsPage)', () => {
  it('deve criar uma nova meta vinculada a uma atividade e exibir conquistas', async () => {
    renderWithProviders(<GoalsPage />, { initialRoute: '/goals' });

    await waitFor(() => {
      expect(screen.getByText('Primeiro Passo')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /Nova Meta/i }));
    await userEvent.type(screen.getByLabelText('Título opcional'), 'Dormir cedo');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar meta' }));

    await waitFor(() => {
      expect(screen.getByText('Dormir cedo')).toBeInTheDocument();
    });
  });
});

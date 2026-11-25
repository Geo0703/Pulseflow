/**
 * Testes da Página de Micro-Estratégias (src/features/regulation/__tests__/ToolsPage.test.tsx)
 * Valida conclusão do exercício de respiração e gravação do impacto no IndexedDB.
 */
import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { ToolsPage } from '../ToolsPage';

describe('Página de Ferramentas de Regulação (ToolsPage)', () => {
  it('deve concluir exercício de respiração e registrar o resultado escolhido', async () => {
    renderWithProviders(<ToolsPage />, { initialRoute: '/tools' });

    await userEvent.click(screen.getByRole('button', { name: 'Concluir agora' }));
    expect(screen.getByText('Como você se sente agora?')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Muito melhor' }));
    await waitFor(() => {
      expect(screen.getByText(/Sessões recentes \(1\)/i)).toBeInTheDocument();
    });
  });
});

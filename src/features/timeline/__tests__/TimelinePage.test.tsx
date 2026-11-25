/**
 * Testes da Linha do Tempo (src/features/timeline/__tests__/TimelinePage.test.tsx)
 */
import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { TimelinePage } from '../TimelinePage';

describe('Página Linha do Tempo (TimelinePage)', () => {
  it('deve alternar entre visualização Feed e Calendário', async () => {
    renderWithProviders(
      <TimelinePage onOpenNewCheckin={vi.fn()} onEditEntry={vi.fn()} />
    );

    await userEvent.click(screen.getByRole('tab', { name: 'Calendário' }));
    expect(screen.getByText('Dom')).toBeInTheDocument();
  });
});

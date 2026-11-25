/**
 * Testes do Componente AppShell (src/components/layout/AppShell/AppShell.test.tsx)
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppShell } from './AppShell';

describe('Componente AppShell', () => {
  it('deve exibir navegação e acionar abertura do check-in rápido', async () => {
    const onOpen = vi.fn();
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppShell onOpenCheckin={onOpen}>
          <div>Conteúdo principal</div>
        </AppShell>
      </MemoryRouter>
    );
    expect(screen.getByText('Conteúdo principal')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button', { name: /Novo Check-in/i });
    await userEvent.click(buttons[0]);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});

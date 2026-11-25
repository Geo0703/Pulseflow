/**
 * Testes do Componente Tabs (src/components/ui/Tabs/Tabs.test.tsx)
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';

describe('Componente Tabs', () => {
  it('deve alternar aba selecionada via clique', async () => {
    const onChange = vi.fn();
    render(
      <Tabs
        value="feed"
        onChange={onChange}
        options={[
          { id: 'feed', label: 'Feed' },
          { id: 'calendar', label: 'Calendário' },
        ]}
      />
    );
    await userEvent.click(screen.getByRole('tab', { name: 'Calendário' }));
    expect(onChange).toHaveBeenCalledWith('calendar');
  });
});

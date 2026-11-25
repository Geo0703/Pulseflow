/**
 * Testes do Calendário Mensal (src/features/timeline/__tests__/MonthCalendar.test.tsx)
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MonthCalendar } from '../components/MonthCalendar/MonthCalendar';

describe('Calendário Mensal (MonthCalendar)', () => {
  it('deve exibir dias do mês e disparar seleção de data ao clicar', async () => {
    const onSelect = vi.fn();
    render(
      <MonthCalendar
        year={2026}
        monthIndex={10}
        entries={[]}
        selectedDateKey={null}
        onChangeMonth={vi.fn()}
        onSelectDate={onSelect}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /Dia 15/i }));
    expect(onSelect).toHaveBeenCalledWith('2026-11-15');
  });
});

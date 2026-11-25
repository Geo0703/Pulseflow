/**
 * Testes do Componente Chip (src/components/ui/Chip/Chip.test.tsx)
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chip } from './Chip';

describe('Componente Chip', () => {
  it('deve refletir estado selecionado via aria-pressed e responder ao clique', async () => {
    const onClick = vi.fn();
    render(<Chip label="Ansioso" tone="red" selected onClick={onClick} />);
    const chip = screen.getByRole('button', { name: 'Ansioso' });
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(chip).toHaveClass('pf-chip--tone-red');
    await userEvent.click(chip);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

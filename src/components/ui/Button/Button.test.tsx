/**
 * Testes do Componente Button (src/components/ui/Button/Button.test.tsx)
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Componente Button', () => {
  it('deve renderizar com variante escolhida e acionar onClick', async () => {
    const onClick = vi.fn();
    render(<Button variant="danger" onClick={onClick}>Excluir</Button>);
    const btn = screen.getByRole('button', { name: 'Excluir' });
    expect(btn).toHaveClass('pf-btn--danger');
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

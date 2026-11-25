/**
 * Testes do Componente Input (src/components/ui/Input/Input.test.tsx)
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Componente Input', () => {
  it('deve associar label acessível ao campo de texto', async () => {
    render(<Input label="Nome" hint="Obrigatório" />);
    const field = screen.getByLabelText('Nome');
    await userEvent.type(field, 'PulseFlow');
    expect(field).toHaveValue('PulseFlow');
    expect(screen.getByText('Obrigatório')).toBeInTheDocument();
  });
});

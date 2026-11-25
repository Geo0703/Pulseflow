/**
 * Testes do Componente Toast (src/components/ui/Toast/Toast.test.tsx)
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './ToastContext';

const Trigger = () => {
  const { showToast } = useToast();
  return <button onClick={() => showToast('Salvo localmente')}>Disparar</button>;
};

describe('Componente Toast', () => {
  it('deve exibir notificação com role=status ao chamar showToast', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Disparar' }));
    expect(screen.getByRole('status')).toHaveTextContent('Salvo localmente');
  });
});

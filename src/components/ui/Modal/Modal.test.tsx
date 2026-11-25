/**
 * Testes do Componente Modal (src/components/ui/Modal/Modal.test.tsx)
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Componente Modal', () => {
  it('deve renderizar role=dialog e fechar ao pressionar Escape', async () => {
    const onClose = vi.fn();
    render(
      <Modal open title="Título Teste" onClose={onClose}>
        Corpo do modal
      </Modal>
    );
    expect(screen.getByRole('dialog', { name: 'Título Teste' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

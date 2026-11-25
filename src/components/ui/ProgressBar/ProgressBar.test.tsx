/**
 * Testes do Componente ProgressBar (src/components/ui/ProgressBar/ProgressBar.test.tsx)
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('Componente ProgressBar', () => {
  it('deve calcular percentual acessível entre 0 e 100', () => {
    render(<ProgressBar value={3} max={4} label="Meta semanal" />);
    const bar = screen.getByRole('progressbar', { name: 'Meta semanal' });
    expect(bar).toHaveAttribute('aria-valuenow', '75');
  });
});

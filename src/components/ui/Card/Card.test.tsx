/**
 * Testes do Componente Card (src/components/ui/Card/Card.test.tsx)
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Componente Card', () => {
  it('deve renderizar o conteúdo filho com classe pf-card', () => {
    render(<Card interactive>Conteúdo do cartão</Card>);
    const el = screen.getByText('Conteúdo do cartão');
    expect(el).toHaveClass('pf-card', 'pf-card--interactive');
  });
});

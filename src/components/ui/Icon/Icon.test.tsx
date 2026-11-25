/**
 * Testes do Componente Icon (src/components/ui/Icon/Icon.test.tsx)
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';

describe('Componente Icon', () => {
  it('deve renderizar SVG rotulado quando a prop label é fornecida', () => {
    render(<Icon name="heart" label="Coração" />);
    expect(screen.getByRole('img', { name: 'Coração' })).toBeInTheDocument();
  });
});

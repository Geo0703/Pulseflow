/**
 * Testes da Matriz Emocional 2D (src/features/checkin/__tests__/EmotionMatrix.test.tsx)
 * Valida seleção de quadrante, exibição de definição e bloqueio acima de 3 emoções.
 */
import { describe, expect, it } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmotionMatrix } from '../components/EmotionMatrix/EmotionMatrix';

const Harness = () => {
  const [ids, setIds] = useState<string[]>([]);
  return (
    <EmotionMatrix
      selectedIds={ids}
      onToggleEmotion={(emo) =>
        setIds((prev) =>
          prev.includes(emo.id) ? prev.filter((x) => x !== emo.id) : [...prev, emo.id]
        )
      }
    />
  );
};

describe('Matriz Emocional 2D (EmotionMatrix)', () => {
  it('deve impedir a seleção de mais de 3 emoções no mesmo check-in', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: /Alta Energia · Desagradável/i }));

    const buttons = ['Ansioso', 'Tenso', 'Irritado', 'Frustrado'];
    for (const label of buttons) {
      const btn = screen.getByRole('button', { name: label });
      if (!btn.hasAttribute('disabled')) {
        await userEvent.click(btn);
      }
    }

    expect(screen.getByText(/\(3\/3\)/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Frustrado' })).toBeDisabled();
  });
});

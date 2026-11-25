/**
 * Testes do Fluxo de Check-in Híbrido (src/features/checkin/__tests__/CheckinModal.test.tsx)
 * Valida salvamento rápido com apenas humor e verificação do gatilho de regulação.
 */
import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { CheckinModal } from '../CheckinModal';
import { shouldShowRegulationPrompt } from '../PostCheckinPrompt';

describe('Fluxo de Check-in (CheckinModal)', () => {
  it('deve habilitar o botão Salvar somente após escolher um nível de humor', async () => {
    const onSaved = vi.fn();
    renderWithProviders(
      <CheckinModal open onClose={vi.fn()} onSaved={onSaved} />
    );

    const saveBtn = screen.getByRole('button', { name: 'Salvar' });
    expect(saveBtn).toBeDisabled();

    await userEvent.click(screen.getByRole('radio', { name: 'Mal' }));
    expect(saveBtn).toBeEnabled();

    await userEvent.click(saveBtn);
    await waitFor(() => expect(onSaved).toHaveBeenCalledTimes(1));

    const savedEntry = onSaved.mock.calls[0][0];
    expect(savedEntry.moodLevel).toBe(2);
    expect(shouldShowRegulationPrompt(savedEntry)).toBe(true);
  });
});

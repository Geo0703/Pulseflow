/**
 * Testes da Página de Estatísticas (src/features/analytics/__tests__/AnalyticsPage.test.tsx)
 */
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { AnalyticsPage } from '../AnalyticsPage';

describe('Página de Estatísticas (AnalyticsPage)', () => {
  it('deve renderizar os blocos de KPIs, distribuição emocional e Year in Pixels', () => {
    renderWithProviders(<AnalyticsPage />, { initialRoute: '/analytics' });
    expect(screen.getByText('Estatísticas e Padrões')).toBeInTheDocument();
    expect(screen.getByText('Year in Pixels')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Exportar imagem PNG/i })).toBeInTheDocument();
  });
});

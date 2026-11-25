/**
 * Helper de Renderização com Providers (src/test/renderWithProviders.tsx)
 * Envolve componentes sob teste nos contextos reais (Router, Theme, Toast,
 * AppData e Lock) para validar fluxos integrados de forma fiel.
 */
import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../store/ThemeContext";
import { AppDataProvider } from "../store/AppDataContext";
import { LockProvider } from "../store/LockContext";
import { ToastProvider } from "../components/ui/Toast/ToastContext";

interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialRoute?: string;
}

// Renderiza qualquer árvore React com todos os providers globais do PulseFlow
export function renderWithProviders(
  ui: React.ReactElement,
  { initialRoute = "/timeline", ...options }: ExtendedRenderOptions = {},
) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MemoryRouter
      initialEntries={[initialRoute]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <ThemeProvider>
        <ToastProvider>
          <AppDataProvider>
            <LockProvider>{children}</LockProvider>
          </AppDataProvider>
        </ToastProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Configuração do Vite e do Vitest (vite.config.ts)
 * Define o plugin React e o ambiente jsdom com setup global de testes.
 */
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Exporta a configuração combinada de build (Vite) e testes automatizados (Vitest)
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/features/**/utils/**/*.ts', 'src/db/**/*.ts', 'src/data/**/*.ts'],
    },
  },
});

/**
 * Setup Global de Testes Automatizados (src/test/setup.ts)
 * Configura fake-indexeddb em memória, matchers do jest-dom, limpeza entre
 * testes e mocks seguros para APIs de navegador ausentes no jsdom.
 */
import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { resetDatabase } from '../db/indexedDbClient';

// Mock de window.matchMedia para suporte ao tema do sistema nos testes
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mocks para manipulação de URLs de blobs (fotos, áudios e exportações)
if (typeof URL.createObjectURL !== 'function') {
  URL.createObjectURL = vi.fn(() => 'blob:mock-url');
}
if (typeof URL.revokeObjectURL !== 'function') {
  URL.revokeObjectURL = vi.fn();
}

// Mock leve do contexto 2D de Canvas para exportação PNG e compressão de imagens
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillStyle: '',
    strokeStyle: '',
    font: '',
    textAlign: 'left',
    fillRect: vi.fn(),
    fillText: vi.fn(),
    drawImage: vi.fn(),
    beginPath: vi.fn(),
    roundRect: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;

  HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,MOCK');
}

// Mock da API de estimativa e persistência de armazenamento local
Object.defineProperty(navigator, 'storage', {
  writable: true,
  value: {
    estimate: vi.fn(async () => ({ usage: 1024 * 120, quota: 1024 * 1024 * 50 })),
    persist: vi.fn(async () => true),
  },
});

// Garante isolamento completo do DOM e do IndexedDB após cada caso de teste
afterEach(async () => {
  cleanup();
  await resetDatabase();
});

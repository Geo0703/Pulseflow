/**
 * Testes do Catálogo Oficial de Emoções (src/data/emotionsCatalog.test.ts)
 * Valida a integridade estrutural das 64 emoções, distribuição exata nos 4 quadrantes,
 * unicidade de IDs, definições preenchidas e busca sem acento.
 */
import { describe, expect, it } from 'vitest';
import {
  EMOTION_QUADRANTS_META,
  EMOTIONS_BY_ID,
  EMOTIONS_CATALOG,
  getEmotionsByQuadrant,
  searchEmotions,
} from './emotionsCatalog';

describe('Catálogo oficial das 64 emoções (emotionsCatalog)', () => {
  it('deve conter exatamente 64 emoções com IDs únicos e definições preenchidas', () => {
    expect(EMOTIONS_CATALOG).toHaveLength(64);
    const ids = new Set(EMOTIONS_CATALOG.map((e) => e.id));
    expect(ids.size).toBe(64);

    for (const emotion of EMOTIONS_CATALOG) {
      expect(emotion.label.trim().length).toBeGreaterThan(0);
      expect(emotion.definition.trim().length).toBeGreaterThan(10);
      expect(EMOTIONS_BY_ID[emotion.id]).toEqual(emotion);
      expect([null, 'breathing', 'grounding', 'reframe']).toContain(emotion.suggestedToolId);
    }
  });

  it('deve distribuir exatamente 16 emoções em cada um dos 4 quadrantes', () => {
    expect(EMOTION_QUADRANTS_META).toHaveLength(4);
    for (const quad of EMOTION_QUADRANTS_META) {
      expect(getEmotionsByQuadrant(quad.id)).toHaveLength(16);
    }
  });

  it('deve encontrar emoções ignorando acentos e maiúsculas na busca', () => {
    const results = searchEmotions('ansioso');
    expect(results.some((e) => e.id === 'anxious')).toBe(true);
  });
});

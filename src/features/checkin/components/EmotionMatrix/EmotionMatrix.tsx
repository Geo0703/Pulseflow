/**
 * Componente EmotionMatrix (src/features/checkin/components/EmotionMatrix/EmotionMatrix.tsx)
 * Implementa a matriz emocional 2D (Energia × Valência) em 2 níveis usando o
 * catálogo oficial de 64 emoções, com busca, definição de 1 frase e limite de 3 seleções.
 */
import React, { useMemo, useState } from 'react';
import type { EmotionDefinition, EmotionQuadrant } from '../../../../types/domain';
import {
  EMOTION_QUADRANTS_META,
  EMOTIONS_BY_ID,
  searchEmotions,
} from '../../../../data/emotionsCatalog';
import { Chip } from '../../../../components/ui/Chip/Chip';
import { Input } from '../../../../components/ui/Input/Input';
import './EmotionMatrix.css';

interface EmotionMatrixProps {
  selectedIds: string[];
  maxSelections?: number;
  onToggleEmotion: (emotion: EmotionDefinition) => void;
}

// Mapeia o ID do quadrante para o tom visual aceito pelo componente Chip
function quadrantToTone(quadrant: EmotionQuadrant): 'red' | 'yellow' | 'blue' | 'green' {
  const meta = EMOTION_QUADRANTS_META.find((q) => q.id === quadrant);
  return meta?.tone ?? 'blue';
}

export const EmotionMatrix: React.FC<EmotionMatrixProps> = ({
  selectedIds,
  maxSelections = 3,
  onToggleEmotion,
}) => {
  // Controla quadrante ativo, termo de busca e última emoção destacada para exibir definição
  const [activeQuadrant, setActiveQuadrant] = useState<EmotionQuadrant | null>(null);
  const [query, setQuery] = useState('');
  const [focusedEmotion, setFocusedEmotion] = useState<EmotionDefinition | null>(null);

  // Filtra emoções do catálogo oficial respeitando quadrante ativo e busca sem acento
  const visibleEmotions = useMemo(() => {
    if (!activeQuadrant && !query.trim()) return [];
    return searchEmotions(query, activeQuadrant ?? undefined);
  }, [activeQuadrant, query]);

  const limitReached = selectedIds.length >= maxSelections;

  // Alterna seleção de uma emoção respeitando o limite máximo de 3 por check-in
  const handleSelect = (emotion: EmotionDefinition) => {
    setFocusedEmotion(emotion);
    const alreadySelected = selectedIds.includes(emotion.id);
    if (!alreadySelected && limitReached) return;
    onToggleEmotion(emotion);
  };

  return (
    <div className="pf-matrix">
      {/* Resumo das emoções já selecionadas */}
      {selectedIds.length > 0 && (
        <div className="pf-row">
          {selectedIds.map((id) => {
            const emotion = EMOTIONS_BY_ID[id];
            if (!emotion) return null;
            return (
              <Chip
                key={id}
                label={emotion.label}
                size="sm"
                selected
                tone={quadrantToTone(emotion.quadrant)}
                onClick={() => handleSelect(emotion)}
              />
            );
          })}
        </div>
      )}

      {/* Nível A: Grade 2x2 dos 4 quadrantes (Energia x Valência) */}
      <div className="pf-matrix__quadrants" role="group" aria-label="Quadrantes emocionais">
        {EMOTION_QUADRANTS_META.map((quad) => {
          const isActive = activeQuadrant === quad.id;
          return (
            <button
              key={quad.id}
              type="button"
              aria-pressed={isActive}
              className={`pf-matrix__quad-btn ${isActive ? 'pf-matrix__quad-btn--active' : ''}`.trim()}
              style={
                {
                  '--quad-solid': quad.cssColorVar,
                  '--quad-soft': quad.cssSoftBgVar,
                } as React.CSSProperties
              }
              onClick={() => setActiveQuadrant(isActive ? null : quad.id)}
            >
              <span className="pf-matrix__quad-title">{quad.title}</span>
              <span className="pf-matrix__quad-sub">{quad.subtitle}</span>
            </button>
          );
        })}
      </div>

      {/* Campo de busca instantânea por nome ou definição da emoção */}
      <Input
        placeholder="Buscar emoção (ex.: ansioso, grato, calmo)..."
        aria-label="Buscar emoção específica"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Definição de 1 frase da emoção em foco */}
      {focusedEmotion && (
        <div className="pf-matrix__definition" role="status">
          <strong>{focusedEmotion.label}:</strong> {focusedEmotion.definition}
        </div>
      )}

      {/* Nível B: Lista de emoções filtradas do quadrante ou busca */}
      {visibleEmotions.length > 0 && (
        <>
          <span className="pf-matrix__limit-hint">
            Selecione até {maxSelections} emoções ({selectedIds.length}/{maxSelections}).
          </span>
          <div className="pf-matrix__list">
            {visibleEmotions.map((emotion) => {
              const isSelected = selectedIds.includes(emotion.id);
              return (
                <Chip
                  key={emotion.id}
                  label={emotion.label}
                  size="sm"
                  selected={isSelected}
                  disabled={!isSelected && limitReached}
                  tone={quadrantToTone(emotion.quadrant)}
                  onClick={() => handleSelect(emotion)}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

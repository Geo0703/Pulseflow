/**
 * Componente YearInPixels (src/features/analytics/components/YearInPixels/YearInPixels.tsx)
 * Matriz anual 12 colunas (Jan..Dez) × 31 linhas (1..31), com popover diário e
 * exportação de imagem PNG desenhada em <canvas> oculto.
 */
import React, { useMemo, useState } from 'react';
import type { MoodEntry, MoodLevel } from '../../../../types/domain';
import { buildYearInPixelsMatrix, type PixelCell } from '../../utils/statsEngine';
import { Button } from '../../../../components/ui/Button/Button';
import { Modal } from '../../../../components/ui/Modal/Modal';
import { Icon } from '../../../../components/ui/Icon/Icon';
import './YearInPixels.css';

interface YearInPixelsProps {
  entries: MoodEntry[];
  moodLabels: Record<MoodLevel, string>;
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const FALLBACK_COLORS: Record<MoodLevel, string> = {
  1: '#e55353',
  2: '#f2994a',
  3: '#8c9bb0',
  4: '#4db6ac',
  5: '#27ae60',
};

export const YearInPixels: React.FC<YearInPixelsProps> = ({ entries, moodLabels }) => {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [selectedCell, setSelectedCell] = useState<PixelCell | null>(null);

  const matrix = useMemo(() => buildYearInPixelsMatrix(entries, year), [entries, year]);

  // Desenha a grade anual completa com título e legenda em um <canvas> e baixa PNG
  const handleExportPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 840;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const getMoodHex = (lvl: MoodLevel) =>
      styles.getPropertyValue(`--mood-${lvl}`).trim() || FALLBACK_COLORS[lvl];

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#1a202c';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`PulseFlow — Year in Pixels (${year})`, 32, 42);

    const startX = 64;
    const startY = 82;
    const cellW = 42;
    const cellH = 20;

    ctx.font = '12px sans-serif';
    MONTHS.forEach((m, idx) => {
      ctx.fillStyle = '#5a6577';
      ctx.fillText(m, startX + idx * cellW + 8, startY - 10);
    });

    matrix.forEach((row, dayIdx) => {
      ctx.fillStyle = '#5a6577';
      ctx.fillText(String(dayIdx + 1), 32, startY + dayIdx * (cellH + 3) + 14);
      row.forEach((cell, monthIdx) => {
        if (!cell.valid) return;
        ctx.fillStyle = cell.avgMood ? getMoodHex(cell.avgMood) : '#e2e8f0';
        ctx.fillRect(
          startX + monthIdx * cellW,
          startY + dayIdx * (cellH + 3),
          cellW - 6,
          cellH - 2
        );
      });
    });

    // Legenda de cores na base do PNG
    ([1, 2, 3, 4, 5] as MoodLevel[]).forEach((lvl, idx) => {
      const lx = 32 + idx * 118;
      const ly = 805;
      ctx.fillStyle = getMoodHex(lvl);
      ctx.fillRect(lx, ly - 12, 14, 14);
      ctx.fillStyle = '#1a202c';
      ctx.fillText(moodLabels[lvl], lx + 20, ly);
    });

    const link = document.createElement('a');
    link.download = `pulseflow-year-in-pixels-${year}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="pf-stack">
      <div className="pf-row pf-row--between">
        <div className="pf-row">
          <Button size="sm" variant="secondary" onClick={() => setYear((y) => y - 1)}>
            {year - 1}
          </Button>
          <strong>{year}</strong>
          <Button size="sm" variant="secondary" onClick={() => setYear((y) => y + 1)}>
            {year + 1}
          </Button>
        </div>

        <Button
          size="sm"
          variant="primary"
          icon={<Icon name="download" size={16} />}
          onClick={handleExportPng}
        >
          Exportar imagem PNG
        </Button>
      </div>

      <div className="pf-pixels__scroll">
        <table className="pf-pixels__table" aria-label={`Year in Pixels de ${year}`}>
          <thead>
            <tr>
              <th className="pf-pixels__th">Dia</th>
              {MONTHS.map((m) => (
                <th key={m} className="pf-pixels__th">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, dayIdx) => (
              <tr key={dayIdx + 1}>
                <td className="pf-pixels__day-label">{dayIdx + 1}</td>
                {row.map((cell) => (
                  <td key={`${cell.monthIndex}-${cell.day}`}>
                    {!cell.valid ? (
                      <span className="pf-pixels__cell pf-pixels__cell--invalid" />
                    ) : (
                      <button
                        type="button"
                        className={`pf-pixels__cell ${
                          cell.avgMood ? 'pf-pixels__cell--filled' : ''
                        }`.trim()}
                        style={
                          cell.avgMood
                            ? ({ '--pixel-mood': `var(--mood-${cell.avgMood})` } as React.CSSProperties)
                            : undefined
                        }
                        aria-label={`${cell.dateKey}: ${
                          cell.avgMood ? moodLabels[cell.avgMood] : 'Sem registro'
                        }`}
                        disabled={cell.entries.length === 0}
                        onClick={() => setSelectedCell(cell)}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de registros do pixel clicado */}
      <Modal
        open={Boolean(selectedCell)}
        title={`Registros de ${selectedCell?.dateKey ?? ''}`}
        onClose={() => setSelectedCell(null)}
      >
        <div className="pf-stack pf-stack--sm">
          {selectedCell?.entries.map((entry) => (
            <div key={entry.id} className="pf-card">
              <strong>{moodLabels[entry.moodLevel]}</strong>
              {entry.note && <p className="pf-text-muted">{entry.note}</p>}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

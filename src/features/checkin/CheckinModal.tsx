/**
 * Componente CheckinModal (src/features/checkin/CheckinModal.tsx)
 * Modal principal de criação e edição de check-ins estruturado em 3 camadas:
 * 1) Humor base + data/hora; 2) Matriz emocional 2D opcional; 3) Atividades, contexto, nota e mídia.
 */
import React, { useState } from 'react';
import type { MoodEntry } from '../../types/domain';
import { useAppData } from '../../store/AppDataContext';
import { Modal } from '../../components/ui/Modal/Modal';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { MoodScalePicker } from './components/MoodScalePicker/MoodScalePicker';
import { EmotionMatrix } from './components/EmotionMatrix/EmotionMatrix';
import { ActivitySelector } from './components/ActivitySelector/ActivitySelector';
import { ContextSelector } from './components/ContextSelector/ContextSelector';
import { NoteTemplates } from './components/NoteTemplates/NoteTemplates';
import { MediaAttachments } from './components/MediaAttachments/MediaAttachments';
import { useCheckinForm } from './hooks/useCheckinForm';
import './CheckinModal.css';

interface CheckinModalProps {
  open: boolean;
  editingEntry?: MoodEntry | null;
  onClose: () => void;
  onSaved: (entry: MoodEntry) => void;
}

export const CheckinModal: React.FC<CheckinModalProps> = ({
  open,
  editingEntry = null,
  onClose,
  onSaved,
}) => {
  const { activityGroups, activities, settings, saveEntry } = useAppData();
  const form = useCheckinForm(editingEntry, open);

  // Controla Progressive Disclosure para manter o check-in inicial limpo e rápido
  const [showMatrix, setShowMatrix] = useState(Boolean(editingEntry?.emotionIds.length));
  const [showExtras, setShowExtras] = useState(
    Boolean(editingEntry?.note || editingEntry?.attachments.length)
  );
  const [saving, setSaving] = useState(false);

  // Persiste o registro no IndexedDB e notifica o container pai
  const handleSave = async () => {
    const built = form.buildEntry();
    if (!built) return;
    setSaving(true);
    try {
      const saved = await saveEntry(built);
      onSaved(saved);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={editingEntry ? 'Editar Check-in' : 'Novo Check-in'}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={!form.canSave || saving}
            onClick={() => void handleSave()}
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </>
      }
    >
      <div className="pf-stack">
        {/* Passo 1: Data/hora retroativa e Escala de Humor Base (obrigatória) */}
        <section className="pf-checkin__section">
          <Input
            type="datetime-local"
            label="Data e hora"
            value={form.dateTimeLocal}
            onChange={(e) => form.setDateTimeLocal(e.target.value)}
          />
          <span className="pf-checkin__section-title">Como você está se sentindo?</span>
          <MoodScalePicker
            value={form.moodLevel}
            moodLabels={settings.moodLabels}
            onChange={form.setMoodLevel}
          />
        </section>

        {/* Passo 2: Matriz Emocional 2D expansível sob demanda (How We Feel) */}
        <section className="pf-checkin__toggle-box">
          <div className="pf-checkin__toggle-header">
            <span className="pf-checkin__section-title">
              Precisão emocional ({form.emotionIds.length}/3)
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowMatrix((prev) => !prev)}
            >
              {showMatrix ? 'Ocultar matriz' : 'Especificar emoção exata'}
            </Button>
          </div>

          {showMatrix && (
            <div style={{ marginTop: 'var(--space-3)' }}>
              <EmotionMatrix
                selectedIds={form.emotionIds}
                onToggleEmotion={form.toggleEmotion}
              />
            </div>
          )}
        </section>

        {/* Passo 3: Atividades agrupadas */}
        <section className="pf-checkin__section">
          <span className="pf-checkin__section-title">O que você fez?</span>
          <ActivitySelector
            groups={activityGroups}
            activities={activities}
            selectedIds={form.activityIds}
            onToggle={form.toggleActivity}
          />
        </section>

        {/* Camada expansível de Contexto, Notas, Templates e Mídia Local */}
        <section className="pf-checkin__toggle-box">
          <div className="pf-checkin__toggle-header">
            <span className="pf-checkin__section-title">Contexto, nota e mídia (opcional)</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowExtras((prev) => !prev)}
            >
              {showExtras ? 'Recolher' : 'Adicionar detalhes'}
            </Button>
          </div>

          {showExtras && (
            <div className="pf-stack" style={{ marginTop: 'var(--space-3)' }}>
              <ContextSelector
                location={form.location}
                company={form.company}
                onChangeLocation={form.setLocation}
                onChangeCompany={form.setCompany}
              />

              <div className="pf-field">
                <div className="pf-row pf-row--between">
                  <label htmlFor="pf-checkin-note" className="pf-field__label">
                    Nota do momento
                  </label>
                  <NoteTemplates onApply={form.applyTemplate} />
                </div>
                <textarea
                  id="pf-checkin-note"
                  className="pf-field__control pf-field__textarea"
                  placeholder="Escreva livremente sobre este momento..."
                  value={form.note}
                  onChange={(e) => form.setNote(e.target.value)}
                />
              </div>

              <MediaAttachments
                attachments={form.attachments}
                onAdd={form.addAttachment}
                onRemove={form.removeAttachment}
              />
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
};

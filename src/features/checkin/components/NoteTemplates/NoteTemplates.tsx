/**
 * Componente NoteTemplates (src/features/checkin/components/NoteTemplates/NoteTemplates.tsx)
 * Exibe botões rápidos para inserir estruturas prontas de reflexão na nota.
 */
import React, { useState } from 'react';
import { NOTE_TEMPLATES } from '../../../../data/noteTemplates';
import { Button } from '../../../../components/ui/Button/Button';
import './NoteTemplates.css';

interface NoteTemplatesProps {
  onApply: (templateText: string) => void;
}

export const NoteTemplates: React.FC<NoteTemplatesProps> = ({ onApply }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="pf-note-templates">
      <Button size="sm" variant="secondary" onClick={() => setOpen((prev) => !prev)}>
        Usar template
      </Button>

      {open &&
        NOTE_TEMPLATES.map((tpl) => (
          <Button
            key={tpl.id}
            size="sm"
            variant="ghost"
            onClick={() => {
              onApply(tpl.content);
              setOpen(false);
            }}
          >
            {tpl.title}
          </Button>
        ))}
    </div>
  );
};

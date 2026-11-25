/**
 * Componente ContextSelector (src/features/checkin/components/ContextSelector/ContextSelector.tsx)
 * Permite marcar rapidamente onde o usuário está e com quem está.
 */
import React from 'react';
import { COMPANY_OPTIONS, LOCATION_OPTIONS } from '../../../../data/contextOptions';
import { Chip } from '../../../../components/ui/Chip/Chip';
import './ContextSelector.css';

interface ContextSelectorProps {
  location?: string;
  company?: string;
  onChangeLocation: (value?: string) => void;
  onChangeCompany: (value?: string) => void;
}

export const ContextSelector: React.FC<ContextSelectorProps> = ({
  location,
  company,
  onChangeLocation,
  onChangeCompany,
}) => {
  return (
    <div className="pf-context-selector">
      {/* Bloco de seleção de local */}
      <div>
        <div className="pf-context-selector__title">Onde estou?</div>
        <div className="pf-row">
          {LOCATION_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              size="sm"
              selected={location === opt}
              onClick={() => onChangeLocation(location === opt ? undefined : opt)}
            />
          ))}
        </div>
      </div>

      {/* Bloco de seleção de companhia */}
      <div>
        <div className="pf-context-selector__title">Com quem estou?</div>
        <div className="pf-row">
          {COMPANY_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              size="sm"
              selected={company === opt}
              onClick={() => onChangeCompany(company === opt ? undefined : opt)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

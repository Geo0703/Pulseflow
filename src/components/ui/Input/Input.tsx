/**
 * Componente Input (src/components/ui/Input/Input.tsx)
 * Campo de formulário acessível com rótulo vinculado e texto auxiliar opcional.
 */
import React, { useId } from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  hint,
  id,
  className = '',
  ...rest
}) => {
  // Gera ID estável para associar <label htmlFor> ao <input>
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={`pf-field ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="pf-field__label">
          {label}
        </label>
      )}
      <input id={inputId} className="pf-field__control" {...rest} />
      {hint && <span className="pf-field__hint">{hint}</span>}
    </div>
  );
};

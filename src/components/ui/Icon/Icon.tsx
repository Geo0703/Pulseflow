/**
 * Componente Icon (src/components/ui/Icon/Icon.tsx)
 * Renderiza ícones SVG inline padronizados herdando a cor atual (currentColor).
 */
import React from 'react';
import { ICON_PATHS } from './iconRegistry';

export interface IconProps {
  name: string;
  size?: number | string;
  className?: string;
  label?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = '1em',
  className = '',
  label,
}) => {
  // Busca o markup interno do ícone ou utiliza fallback de estrela
  const markup = ICON_PATHS[name] ?? ICON_PATHS.star;

  // Renderiza SVG acessível (decorativo por padrão ou rotulado via aria-label)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`pf-icon ${className}`.trim()}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
};

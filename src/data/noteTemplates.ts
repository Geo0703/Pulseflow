/**
 * Templates Rápidos de Escrita (src/data/noteTemplates.ts)
 * Estruturas pré-prontas inseríveis com um clique no campo de notas do check-in.
 */

export interface NoteTemplate {
  id: string;
  title: string;
  content: string;
}

// Coleção de templates inspirados em journaling reflexivo de baixo atrito
export const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: 'tpl-reflexao',
    title: 'Reflexão rápida',
    content: '1. O que aconteceu?\n\n2. O que pensei?\n\n3. Pelo que sou grato?',
  },
  {
    id: 'tpl-energia',
    title: 'Energia do dia',
    content: 'O que me deu energia hoje:\n- \n\nO que drenou minha energia:\n- ',
  },
  {
    id: 'tpl-fechamento',
    title: 'Fechamento noturno',
    content: 'Ponto alto do dia:\n\nAlgo que aprendi ou quero levar para amanhã:\n',
  },
];

/**
 * Catálogo Oficial das 64 Emoções do PulseFlow (src/data/emotionsCatalog.ts)
 *
 * Baseado na matriz bidimensional de Energia × Valência (modelo RULER / How We Feel):
 * - 16 emoções no quadrante Vermelho (high-unpleasant: Alta Energia + Desagradável)
 * - 16 emoções no quadrante Amarelo (high-pleasant: Alta Energia + Agradável)
 * - 16 emoções no quadrante Azul (low-unpleasant: Baixa Energia + Desagradável)
 * - 16 emoções no quadrante Verde (low-pleasant: Baixa Energia + Agradável)
 *
 * Cada emoção inclui uma definição curta em português do Brasil para ajudar o usuário
 * a nomear com precisão o que está sentindo, além do humor sugerido e da ferramenta
 * de regulação mais indicada quando aplicável.
 */

import type { EmotionDefinition, EmotionQuadrant } from '../types/domain';

// Interface de metadados visuais e descritivos para cada um dos 4 quadrantes da matriz 2D
export interface QuadrantMetadata {
  id: EmotionQuadrant;
  title: string;
  subtitle: string;
  energyLabel: 'Alta Energia' | 'Baixa Energia';
  valenceLabel: 'Desagradável' | 'Agradável';
  tone: 'red' | 'yellow' | 'blue' | 'green';
  cssColorVar: string;
  cssSoftBgVar: string;
}

// Metadados dos 4 quadrantes na ordem de exibição da grade 2×2 (superior-esq -> inferior-dir)
export const EMOTION_QUADRANTS_META: QuadrantMetadata[] = [
  {
    id: 'high-unpleasant',
    title: 'Alta Energia · Desagradável',
    subtitle: 'Tensão, pressa, desconforto ativo ou sobrecarga',
    energyLabel: 'Alta Energia',
    valenceLabel: 'Desagradável',
    tone: 'red',
    cssColorVar: 'var(--quad-red)',
    cssSoftBgVar: 'var(--quad-red-soft)',
  },
  {
    id: 'high-pleasant',
    title: 'Alta Energia · Agradável',
    subtitle: 'Entusiasmo, foco, vitalidade ou motivação',
    energyLabel: 'Alta Energia',
    valenceLabel: 'Agradável',
    tone: 'yellow',
    cssColorVar: 'var(--quad-yellow)',
    cssSoftBgVar: 'var(--quad-yellow-soft)',
  },
  {
    id: 'low-unpleasant',
    title: 'Baixa Energia · Desagradável',
    subtitle: 'Cansaço, desânimo, tristeza ou esgotamento',
    energyLabel: 'Baixa Energia',
    valenceLabel: 'Desagradável',
    tone: 'blue',
    cssColorVar: 'var(--quad-blue)',
    cssSoftBgVar: 'var(--quad-blue-soft)',
  },
  {
    id: 'low-pleasant',
    title: 'Baixa Energia · Agradável',
    subtitle: 'Calma, contentamento, segurança ou descanso',
    energyLabel: 'Baixa Energia',
    valenceLabel: 'Agradável',
    tone: 'green',
    cssColorVar: 'var(--quad-green)',
    cssSoftBgVar: 'var(--quad-green-soft)',
  },
];

// Lista completa e imutável com exatamente 64 emoções (16 por quadrante)
export const EMOTIONS_CATALOG: EmotionDefinition[] = [
  // =========================================================================
  // QUADRANTE VERMELHO — Alta Energia + Desagradável (16 emoções)
  // =========================================================================
  {
    id: 'anxious',
    label: 'Ansioso',
    definition: 'Sensação de inquietação e apreensão diante de incertezas ou eventos futuros.',
    quadrant: 'high-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'breathing',
  },
  {
    id: 'stressed',
    label: 'Estressado',
    definition: 'Pressão física e mental causada por demandas que parecem exceder seus recursos atuais.',
    quadrant: 'high-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'breathing',
  },
  {
    id: 'irritated',
    label: 'Irritado',
    definition: 'Incômodo crescente e baixa tolerância diante de contratempos ou comportamentos alheios.',
    quadrant: 'high-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'breathing',
  },
  {
    id: 'overwhelmed',
    label: 'Sobrecarregado',
    definition: 'Sentimento de ter tarefas ou estímulos demais ao mesmo tempo sem saber por onde começar.',
    quadrant: 'high-unpleasant',
    suggestedMood: 1,
    suggestedToolId: 'grounding',
  },
  {
    id: 'frustrated',
    label: 'Frustrado',
    definition: 'Desconforto ao encontrar obstáculos repetidos que impedem um objetivo esperado.',
    quadrant: 'high-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'reframe',
  },
  {
    id: 'tense',
    label: 'Tenso',
    definition: 'Estado de rigidez corporal e alerta contínuo, com dificuldade para relaxar.',
    quadrant: 'high-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'breathing',
  },
  {
    id: 'worried',
    label: 'Preocupado',
    definition: 'Pensamentos recorrentes focados em problemas possíveis e no desejo de evitá-los.',
    quadrant: 'high-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'reframe',
  },
  {
    id: 'restless',
    label: 'Inquieto',
    definition: 'Sensação de energia acumulada sem direção clara, dificultando permanecer parado ou focado.',
    quadrant: 'high-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'grounding',
  },
  {
    id: 'impatient',
    label: 'Impaciente',
    definition: 'Urgência desconfortável diante de esperas, atrasos ou ritmos mais lentos que o desejado.',
    quadrant: 'high-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'breathing',
  },
  {
    id: 'angry',
    label: 'Com raiva',
    definition: 'Reação intensa diante de algo percebido como injusto, desrespeitoso ou violação de limites.',
    quadrant: 'high-unpleasant',
    suggestedMood: 1,
    suggestedToolId: 'breathing',
  },
  {
    id: 'afraid',
    label: 'Amedrontado',
    definition: 'Sinal de perigo ou ameaça percebida que desperta o impulso de proteção ou fuga.',
    quadrant: 'high-unpleasant',
    suggestedMood: 1,
    suggestedToolId: 'grounding',
  },
  {
    id: 'pressured',
    label: 'Pressionado',
    definition: 'Sensação de cobrança intensa — externa ou interna — para entregar resultados rapidamente.',
    quadrant: 'high-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'breathing',
  },
  {
    id: 'alert',
    label: 'Em alerta',
    definition: 'Vigilância elevada esperando que algo dê errado a qualquer momento.',
    quadrant: 'high-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'grounding',
  },
  {
    id: 'ashamed',
    label: 'Envergonhado',
    definition: 'Desconforto agudo ao sentir que uma falha pessoal foi exposta ou julgada por outros.',
    quadrant: 'high-unpleasant',
    suggestedMood: 1,
    suggestedToolId: 'reframe',
  },
  {
    id: 'jealous',
    label: 'Ciumento',
    definition: 'Medo de perder algo ou alguém valioso somado à comparação dolorosa com terceiros.',
    quadrant: 'high-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'reframe',
  },
  {
    id: 'agitated',
    label: 'Agitado',
    definition: 'Aceleração interna de pensamentos e batimentos que dificulta manter a serenidade.',
    quadrant: 'high-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'grounding',
  },

  // =========================================================================
  // QUADRANTE AMARELO — Alta Energia + Agradável (16 emoções)
  // =========================================================================
  {
    id: 'excited',
    label: 'Empolgado',
    definition: 'Entusiasmo vibrante diante de uma oportunidade, novidade ou acontecimento positivo.',
    quadrant: 'high-pleasant',
    suggestedMood: 5,
    suggestedToolId: null,
  },
  {
    id: 'energized',
    label: 'Energizado',
    definition: 'Sensação física e mental de vigor elevado e prontidão para agir.',
    quadrant: 'high-pleasant',
    suggestedMood: 5,
    suggestedToolId: null,
  },
  {
    id: 'inspired',
    label: 'Inspirado',
    definition: 'Estímulo criativo e clareza que despertam vontade de criar ou transformar ideias.',
    quadrant: 'high-pleasant',
    suggestedMood: 5,
    suggestedToolId: null,
  },
  {
    id: 'focused',
    label: 'Focado',
    definition: 'Atenção concentrada e fluida no que importa, sem dispersão excessiva.',
    quadrant: 'high-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'motivated',
    label: 'Motivado',
    definition: 'Impulso interno claro e disposição consistente para avançar em direção a uma meta.',
    quadrant: 'high-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'joyful',
    label: 'Alegre',
    definition: 'Sentimento leve e expansivo de felicidade no momento presente.',
    quadrant: 'high-pleasant',
    suggestedMood: 5,
    suggestedToolId: null,
  },
  {
    id: 'enthusiastic',
    label: 'Entusiasmado',
    definition: 'Interesse intenso e prazer ativo ao se envolver com uma atividade ou projeto.',
    quadrant: 'high-pleasant',
    suggestedMood: 5,
    suggestedToolId: null,
  },
  {
    id: 'confident',
    label: 'Confiante',
    definition: 'Crença firme na própria capacidade de lidar bem com os desafios atuais.',
    quadrant: 'high-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'proud',
    label: 'Orgulhoso',
    definition: 'Satisfação genuína ao reconhecer o próprio esforço ou uma conquista importante.',
    quadrant: 'high-pleasant',
    suggestedMood: 5,
    suggestedToolId: null,
  },
  {
    id: 'curious',
    label: 'Curioso',
    definition: 'Desejo aberto e ativo de explorar, aprender e descobrir algo novo.',
    quadrant: 'high-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'optimistic',
    label: 'Otimista',
    definition: 'Confiança construtiva de que as coisas podem evoluir bem e gerar bons frutos.',
    quadrant: 'high-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'creative',
    label: 'Criativo',
    definition: 'Mente flexível e cheia de conexões originais para resolver problemas ou se expressar.',
    quadrant: 'high-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'lively',
    label: 'Animado',
    definition: 'Bom humor contagiante e disposição positiva para aproveitar o dia.',
    quadrant: 'high-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'determined',
    label: 'Determinado',
    definition: 'Firmeza de propósito para persistir mesmo diante de tarefas exigentes.',
    quadrant: 'high-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'amazed',
    label: 'Surpreso',
    definition: 'Admiração positiva diante de algo inesperado que despertou encantamento.',
    quadrant: 'high-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'radiant',
    label: 'Radiante',
    definition: 'Sensação plena de brilho interno, bem-estar intenso e gratidão transbordante.',
    quadrant: 'high-pleasant',
    suggestedMood: 5,
    suggestedToolId: null,
  },

  // =========================================================================
  // QUADRANTE AZUL — Baixa Energia + Desagradável (16 emoções)
  // =========================================================================
  {
    id: 'tired',
    label: 'Cansado',
    definition: 'Queda de disposição física ou mental que sinaliza necessidade de pausa ou descanso.',
    quadrant: 'low-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'breathing',
  },
  {
    id: 'sad',
    label: 'Triste',
    definition: 'Dor emocional suave ou profunda ligada a perda, decepção ou sensibilidade aumentada.',
    quadrant: 'low-unpleasant',
    suggestedMood: 1,
    suggestedToolId: 'reframe',
  },
  {
    id: 'unmotivated',
    label: 'Desmotivado',
    definition: 'Falta de impulso ou sentido claro para iniciar ou continuar atividades.',
    quadrant: 'low-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'reframe',
  },
  {
    id: 'lonely',
    label: 'Solitário',
    definition: 'Sensação de desconexão emocional ou falta de companhia significativa.',
    quadrant: 'low-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'reframe',
  },
  {
    id: 'exhausted',
    label: 'Exausto',
    definition: 'Fadiga extrema em que corpo e mente parecem sem reserva mínima de energia.',
    quadrant: 'low-unpleasant',
    suggestedMood: 1,
    suggestedToolId: 'grounding',
  },
  {
    id: 'bored',
    label: 'Entediado',
    definition: 'Falta de estímulo ou envolvimento com o que está acontecendo ao redor.',
    quadrant: 'low-unpleasant',
    suggestedMood: 3,
    suggestedToolId: 'grounding',
  },
  {
    id: 'discouraged',
    label: 'Desanimado',
    definition: 'Perda temporária de confiança ou fôlego após esforços sem o retorno esperado.',
    quadrant: 'low-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'reframe',
  },
  {
    id: 'apathetic',
    label: 'Apático',
    definition: 'Indiferença emocional em que poucas coisas parecem despertar interesse ou reação.',
    quadrant: 'low-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'grounding',
  },
  {
    id: 'melancholic',
    label: 'Melancólico',
    definition: 'Tristeza reflexiva e silenciosa, muitas vezes acompanhada de saudade ou introspecção.',
    quadrant: 'low-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'reframe',
  },
  {
    id: 'insecure',
    label: 'Inseguro',
    definition: 'Dúvida sobre o próprio valor, preparo ou aceitação em determinada situação.',
    quadrant: 'low-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'reframe',
  },
  {
    id: 'guilty',
    label: 'Culpado',
    definition: 'Peso interno por sentir que agiu contra os próprios valores ou prejudicou alguém.',
    quadrant: 'low-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'reframe',
  },
  {
    id: 'empty',
    label: 'Vazio',
    definition: 'Sensação de entorpecimento ou ausência de conexão com emoções e propósitos.',
    quadrant: 'low-unpleasant',
    suggestedMood: 1,
    suggestedToolId: 'grounding',
  },
  {
    id: 'drained',
    label: 'Esgotado mentalmente',
    definition: 'Saturação cognitiva após longas horas de decisões, telas ou esforço emocional.',
    quadrant: 'low-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'breathing',
  },
  {
    id: 'disappointed',
    label: 'Desapontado',
    definition: 'Tristeza específica quando a realidade fica abaixo de uma expectativa importante.',
    quadrant: 'low-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'reframe',
  },
  {
    id: 'vulnerable',
    label: 'Vulnerável',
    definition: 'Sensação de estar emocionalmente exposto e mais sensível a críticas ou rejeições.',
    quadrant: 'low-unpleasant',
    suggestedMood: 2,
    suggestedToolId: 'reframe',
  },
  {
    id: 'hopeless',
    label: 'Sem esperança',
    definition: 'Crença dolorosa e temporária de que a situação atual não vai melhorar.',
    quadrant: 'low-unpleasant',
    suggestedMood: 1,
    suggestedToolId: 'reframe',
  },

  // =========================================================================
  // QUADRANTE VERDE — Baixa Energia + Agradável (16 emoções)
  // =========================================================================
  {
    id: 'calm',
    label: 'Calmo',
    definition: 'Ausência de agitação interna, com mente estável e respiração serena.',
    quadrant: 'low-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'grateful',
    label: 'Grato',
    definition: 'Reconhecimento caloroso pelo que há de bom na vida, nas pessoas ou no dia.',
    quadrant: 'low-pleasant',
    suggestedMood: 5,
    suggestedToolId: null,
  },
  {
    id: 'relaxed',
    label: 'Relaxado',
    definition: 'Corpo solto e mente livre de urgências, aproveitando um momento de descanso.',
    quadrant: 'low-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'satisfied',
    label: 'Satisfeito',
    definition: 'Sensação tranquila de dever cumprido e de que o momento atual é suficiente.',
    quadrant: 'low-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'peaceful',
    label: 'Em paz',
    definition: 'Harmonia profunda consigo mesmo e aceitação serena do que está acontecendo.',
    quadrant: 'low-pleasant',
    suggestedMood: 5,
    suggestedToolId: null,
  },
  {
    id: 'tranquil',
    label: 'Tranquilo',
    definition: 'Estado suave de leveza sem preocupações imediatas pressionando a mente.',
    quadrant: 'low-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'supported',
    label: 'Acolhido',
    definition: 'Sensação reconfortante de ser compreendido, cuidado ou apoiado por alguém.',
    quadrant: 'low-pleasant',
    suggestedMood: 5,
    suggestedToolId: null,
  },
  {
    id: 'balanced',
    label: 'Equilibrado',
    definition: 'Estabilidade emocional em que razão, energia e sentimentos caminham em sintonia.',
    quadrant: 'low-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'serene',
    label: 'Sereno',
    definition: 'Quietude clara e estável mesmo quando o ambiente externo é movimentado.',
    quadrant: 'low-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'comfortable',
    label: 'Confortável',
    definition: 'Bem-estar físico e emocional em um espaço ou companhia que traz aconchego.',
    quadrant: 'low-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'relieved',
    label: 'Aliviado',
    definition: 'Sensação de peso retirado após a resolução de uma tensão ou preocupação.',
    quadrant: 'low-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'safe',
    label: 'Seguro',
    definition: 'Percepção de proteção, estabilidade e confiança no ambiente atual.',
    quadrant: 'low-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'present',
    label: 'Presente',
    definition: 'Atenção plena ao momento atual, sem ficar preso ao passado ou ao futuro.',
    quadrant: 'low-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'hopeful',
    label: 'Esperançoso',
    definition: 'Abertura tranquila para acreditar que dias e caminhos melhores são possíveis.',
    quadrant: 'low-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'content',
    label: 'Contente',
    definition: 'Alegria discreta e serena pelas pequenas coisas boas do cotidiano.',
    quadrant: 'low-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
  {
    id: 'rested',
    label: 'Descansado',
    definition: 'Sensação restauradora de recuperação física e clareza mental após repouso.',
    quadrant: 'low-pleasant',
    suggestedMood: 4,
    suggestedToolId: null,
  },
];

// Mapa indexado por ID para consultas em tempo constante O(1) em cards e estatísticas
export const EMOTIONS_BY_ID: Record<string, EmotionDefinition> = EMOTIONS_CATALOG.reduce(
  (acc, emotion) => {
    acc[emotion.id] = emotion;
    return acc;
  },
  {} as Record<string, EmotionDefinition>
);

// Retorna a definição de uma emoção pelo ID, ou undefined caso não exista
export function getEmotionById(id: string): EmotionDefinition | undefined {
  return EMOTIONS_BY_ID[id];
}

// Filtra o catálogo retornando apenas as 16 emoções pertencentes ao quadrante informado
export function getEmotionsByQuadrant(quadrant: EmotionQuadrant): EmotionDefinition[] {
  return EMOTIONS_CATALOG.filter((emotion) => emotion.quadrant === quadrant);
}

// Pesquisa emoções por nome ou definição ignorando maiúsculas e acentuação
export function searchEmotions(query: string, quadrant?: EmotionQuadrant): EmotionDefinition[] {
  const normalizedQuery = query
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const baseList = quadrant ? getEmotionsByQuadrant(quadrant) : EMOTIONS_CATALOG;

  // Se o campo de busca estiver vazio, devolve a lista completa do escopo escolhido
  if (!normalizedQuery) {
    return baseList;
  }

  return baseList.filter((emotion) => {
    const normalizedLabel = emotion.label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const normalizedDef = emotion.definition
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return normalizedLabel.includes(normalizedQuery) || normalizedDef.includes(normalizedQuery);
  });
}
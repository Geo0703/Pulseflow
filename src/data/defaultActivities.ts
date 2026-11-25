/**
 * Seed Inicial de Grupos e Atividades (src/data/defaultActivities.ts)
 * Fornece os 5 grupos padrão e suas tags iniciais na primeira abertura do app.
 */
import type { ActivityGroup, ActivityTag } from '../types/domain';

// Grupos padrão ordenados conforme a especificação do MVP 1.0
export const DEFAULT_ACTIVITY_GROUPS: ActivityGroup[] = [
  { id: 'grp-sono', name: 'Sono', order: 1, archived: false },
  { id: 'grp-corpo', name: 'Corpo e Saúde', order: 2, archived: false },
  { id: 'grp-trabalho', name: 'Trabalho e Estudo', order: 3, archived: false },
  { id: 'grp-social', name: 'Social', order: 4, archived: false },
  { id: 'grp-lazer', name: 'Lazer e Casa', order: 5, archived: false },
];

// Lista completa de atividades iniciais vinculadas aos seus respectivos grupos
export const DEFAULT_ACTIVITIES: ActivityTag[] = [
  // Sono
  { id: 'act-dormi-bem', groupId: 'grp-sono', label: 'Dormi bem', iconName: 'moon', order: 1, archived: false },
  { id: 'act-dormi-pouco', groupId: 'grp-sono', label: 'Dormi pouco', iconName: 'cloud', order: 2, archived: false },
  { id: 'act-soneca', groupId: 'grp-sono', label: 'Soneca', iconName: 'sun', order: 3, archived: false },
  { id: 'act-acordei-cedo', groupId: 'grp-sono', label: 'Acordei cedo', iconName: 'clock', order: 4, archived: false },

  // Corpo e Saúde
  { id: 'act-exercicio', groupId: 'grp-corpo', label: 'Exercício', iconName: 'activity', order: 1, archived: false },
  { id: 'act-caminhada', groupId: 'grp-corpo', label: 'Caminhada', iconName: 'compass', order: 2, archived: false },
  { id: 'act-alimentacao', groupId: 'grp-corpo', label: 'Boa alimentação', iconName: 'heart', order: 3, archived: false },
  { id: 'act-hidratacao', groupId: 'grp-corpo', label: 'Hidratação', iconName: 'droplet', order: 4, archived: false },
  { id: 'act-alongamento', groupId: 'grp-corpo', label: 'Alongamento', iconName: 'sparkles', order: 5, archived: false },
  { id: 'act-meditacao', groupId: 'grp-corpo', label: 'Meditação', iconName: 'wind', order: 6, archived: false },

  // Trabalho e Estudo
  { id: 'act-foco', groupId: 'grp-trabalho', label: 'Trabalho focado', iconName: 'briefcase', order: 1, archived: false },
  { id: 'act-reunioes', groupId: 'grp-trabalho', label: 'Reuniões', iconName: 'users', order: 2, archived: false },
  { id: 'act-estudos', groupId: 'grp-trabalho', label: 'Estudos', iconName: 'book', order: 3, archived: false },
  { id: 'act-projeto', groupId: 'grp-trabalho', label: 'Projeto pessoal', iconName: 'star', order: 4, archived: false },
  { id: 'act-prazo', groupId: 'grp-trabalho', label: 'Prazo apertado', iconName: 'alert', order: 5, archived: false },

  // Social
  { id: 'act-familia', groupId: 'grp-social', label: 'Família', iconName: 'home', order: 1, archived: false },
  { id: 'act-amigos', groupId: 'grp-social', label: 'Amigos', iconName: 'users', order: 2, archived: false },
  { id: 'act-encontro', groupId: 'grp-social', label: 'Encontro', iconName: 'heart', order: 3, archived: false },
  { id: 'act-conversa', groupId: 'grp-social', label: 'Conversa boa', iconName: 'message', order: 4, archived: false },
  { id: 'act-sozinho', groupId: 'grp-social', label: 'Tempo sozinho', iconName: 'coffee', order: 5, archived: false },

  // Lazer e Casa
  { id: 'act-leitura', groupId: 'grp-lazer', label: 'Leitura', iconName: 'book', order: 1, archived: false },
  { id: 'act-filmes', groupId: 'grp-lazer', label: 'Filmes/Séries', iconName: 'film', order: 2, archived: false },
  { id: 'act-musica', groupId: 'grp-lazer', label: 'Música', iconName: 'music', order: 3, archived: false },
  { id: 'act-jogos', groupId: 'grp-lazer', label: 'Jogos', iconName: 'gamepad', order: 4, archived: false },
  { id: 'act-cozinhar', groupId: 'grp-lazer', label: 'Cozinhar', iconName: 'utensils', order: 5, archived: false },
  { id: 'act-casa', groupId: 'grp-lazer', label: 'Arrumar a casa', iconName: 'home', order: 6, archived: false },
  { id: 'act-ar-livre', groupId: 'grp-lazer', label: 'Ar livre', iconName: 'sun', order: 7, archived: false },
];

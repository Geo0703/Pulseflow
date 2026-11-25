# PulseFlow — Micro-Journaling e Precisão Emocional (MVP 1.0)








O **PulseFlow** é uma aplicação web responsiva (*mobile-first*, instalável como PWA) que une o registro ultrarrápido de humor, atividades, metas e *Year in Pixels* (inspirado no **Daylio**) com a nomeação emocional granular em matriz bidimensional e micro-estratégias de regulação (inspirado no **How We Feel**).

Todo o armazenamento acontece localmente no navegador via **IndexedDB** — sem necessidade de criar conta, sem backend e sem enviar dados íntimos para servidores externos.

---

## Principais Funcionalidades

| Módulo | O que entrega no MVP 1.0 |
| :--- | :--- |
| **Check-in Híbrido** | Registro em menos de 10 segundos com escala de 5 humores, matriz emocional 2D opcional (64 emoções em 4 quadrantes *Energia × Valência*, até 3 por check-in), atividades agrupadas, contexto rápido (*onde* e *com quem*), notas com templates, até 3 fotos comprimidas via Canvas e notas de voz via `MediaRecorder`. |
| **Micro-Estratégias de Regulação** | Convite gentil pós-check-in para humores baixos ou quadrantes desconfortáveis e acesso direto a 3 exercícios interativos: **Respiração Guiada** (*Box 4-4-4-4* e *4-7-8* com animação em CSS puro), **Aterramento Sensorial 5-4-3-2-1** e **Reenquadramento de Pensamento** (com opção de anexar ao último check-in), além de avaliação de impacto. |
| **Linha do Tempo e Calendário** | Alternância entre **Feed** agrupado por Mês/Ano e **Calendário mensal** colorido pela média diária, com busca (debounce de `250ms`) e filtros combináveis por humor, quadrante, atividade e mídia. |
| **Estatísticas e *Year in Pixels*** | Seletor de período (`7 dias`, `Mês atual`, `90 dias`, `Ano atual`), curva de humor construída manualmente em **SVG puro**, distribuição pelos 4 quadrantes, **Top 5 emoções**, correlação **Atividade × Humor** (com regra de confiabilidade `≥ 3` registros) e grade anual **Year in Pixels** com exportação de imagem **PNG**. |
| **Metas, Streaks e Conquistas** | Metas diárias ou semanais vinculadas a atividades com atualização automática a cada check-in, cálculo de sequência atual e melhor sequência histórica, e 6 conquistas desbloqueáveis (*Primeiro Passo*, *Semana Firme*, *Hábito Consolidado*, *Vocabulário Rico*, *Mente Calma* e *Observador*). |
| **Customização, Privacidade e Backup** | Temas **Claro / Escuro / Sistema**, paletas **Padrão / Pastel / Alto Contraste**, edição dos rótulos de humor, CRUD de grupos e atividades com *soft-delete*, bloqueio por **PIN de 4 dígitos** (hash **SHA-256** via Web Crypto API), backup/restauração **JSON** (mesclar ou substituir), exportação **CSV** (UTF-8 com BOM para Excel) e relatório para impressão/PDF via `@media print`. |

## Decisões de Arquitetura

* **100% CSS Puro (Design Tokens + BEM):** Nenhum framework CSS externo (sem Tailwind, Bootstrap, MUI ou CSS-in-JS). Todos os estilos usam variáveis nativas em `:root` (`src/styles/tokens.css`, `themes.css`) e convenção BEM com prefixo `pf-`.
* **100% Local-First (`pulseflow_db`):** Persistência nativa no navegador via IndexedDB encapsulada pelo padrão **Repository** (`entries`, `activityGroups`, `activities`, `goals`, `regulationSessions`, `settings`), completamente desacoplada dos componentes React.
* **Catálogo Oficial de 64 Emoções:** Seed completo em `src/data/emotionsCatalog.ts` com 16 emoções por quadrante, definições em português do Brasil, humor sugerido e ferramenta de regulação recomendada.
* **Código Comentado em Português (PT-BR):** Todos os módulos `.ts`, `.tsx` e `.css` seguem documentação clara por bloco lógico.

## Estrutura do Projeto

```text
pulseflow/
├── .github/workflows/
│   └── deploy.yml              # CI/CD: testes, build e publicação no GitHub Pages
├── public/
│   ├── manifest.json           # Metadados PWA
│   └── icons/                  # Ícones vetoriais PWA (192x192 e 512x512)
├── src/
│   ├── components/
│   │   ├── ui/                 # Design System reutilizável (Button, Card, Chip, Modal, Input, Tabs, Toast, Icon...)
│   │   └── layout/             # AppShell responsivo (BottomNav mobile / Sidebar desktop), PageHeader, EmptyState
│   ├── data/                   # Catálogo das 64 emoções, atividades padrão, templates e configurações iniciais
│   ├── db/                     # Cliente IndexedDB, utilitários de mídia/compressão e repositórios
│   ├── features/
│   │   ├── checkin/            # Check-in híbrido em 3 camadas e gatilho pós-check-in
│   │   ├── regulation/         # Respiração, Aterramento 5-4-3-2-1 e Reenquadramento
│   │   ├── timeline/           # Feed, Calendário mensal, FilterBar e detalhes do registro
│   │   ├── analytics/          # statsEngine, curva SVG, quadrantes, correlações e Year in Pixels
│   │   ├── goals/              # streakCalculator, metas automáticas e conquistas
│   │   └── settings/           # Temas, rótulos, CRUD de atividades, PIN SHA-256 e Backup JSON/CSV
│   ├── store/                  # Contextos globais (ThemeContext, AppDataContext, LockContext)
│   ├── styles/                 # Camada global de CSS Puro (reset, tokens, themes, typography, layout, print)
│   ├── test/                   # Setup global (fake-indexeddb, jest-dom, mocks de browser) e renderWithProviders
│   └── types/                  # Contratos TypeScript de domínio (domain.ts)
├── index.html
├── package.json
└── vite.config.ts
```

## Como Executar Localmente

**Pré-requisitos:** Node.js 18+ (recomendado Node 20) e npm.

```bash
# 1. Acesse a pasta do projeto
cd pulseflow

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse a URL exibida no terminal (por padrão `http://localhost:5173`).

## Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local de desenvolvimento com Vite. |
| `npm test` | Executa toda a suíte de testes automatizados (Vitest + React Testing Library + fake-indexeddb). |
| `npm run test:watch` | Executa os testes em modo interativo (*watch*). |
| `npm run test:coverage` | Executa os testes gerando relatório de cobertura de código. |
| `npm run build` | Verifica tipos com TypeScript (`tsc`) e gera o bundle de produção em `dist/`. |
| `npm run preview` | Pré-visualiza localmente o build gerado em `dist/`. |

## Publicação no GitHub Pages

O projeto já está configurado com `HashRouter`, `base: './'` no Vite, caminhos relativos de PWA e workflow automatizado em `.github/workflows/deploy.yml`:

1. Rode `npm install` localmente para garantir que o arquivo `package-lock.json` exista antes do primeiro commit.
2. Envie o conteúdo da pasta `pulseflow/` para a branch `main` do seu repositório no GitHub.
3. No GitHub, abra **Settings → Pages** e, em **Build and deployment → Source**, selecione **GitHub Actions**.
4. A cada push na branch `main`, o workflow executará `npm test`, `npm run build` e publicará a pasta `dist/` automaticamente.

## Privacidade e Portabilidade

* **Sem rastreamento ou nuvem obrigatória:** Seus registros, fotos e gravações de voz ficam salvos exclusivamente no IndexedDB do navegador.
* **Proteção local:** Quando o PIN está ativo, apenas o hash **SHA-256** é armazenado nas configurações locais.
* **Seus dados são seus:** Faça backups periódicos em **Ajustes → Exportar Backup JSON** (inclui mídias em Base64) ou exporte para planilhas em **Exportar CSV (Excel)**.

## Roadmap Futuro (Fora do MVP 1.0)

* **Fase 2:** Integração com dados fisiológicos (sono, passos, HRV), sintomas físicos e medicamentos com correlação defasada ($t$ vs. $t+1$).
* **Fase 3:** Rituais matinais/noturnos dinâmicos, cartões avançados de TCC e experimentos pessoais de 7 dias.
* **Fase 4:** Relatório clínico estruturado para acompanhamento terapêutico e sincronização criptografada ponta a ponta (E2EE) opcional.

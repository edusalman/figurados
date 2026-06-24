<h1 align="center">
  <img src="public/pwa-192x192.png" alt="Figurados" />
  <br />
  Figurados
</h1>

<p align="center">
  Gerencie sua coleção de figurinhas da Copa do Mundo FIFA 2026 de forma rápida, offline e gratuita.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="Zustand" src="https://img.shields.io/badge/Zustand-Immer-FF6B35?style=flat-square" />
  <img alt="PWA" src="https://img.shields.io/badge/PWA-Installable-5A0FC8?style=flat-square&logo=pwa&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-22C55E?style=flat-square" />
</p>

<p align="center">
  <a href="figurados-app.vercel.app" target="_blank"><strong>🌐 Ver Demo ao Vivo</strong></a>
</p>

---

## 📸 Visão Geral

**Figurados** é um Progressive Web App (PWA) para gerenciamento de coleções de figurinhas do Álbum Panini da Copa do Mundo FIFA 2026. Desenvolvido como projeto de portfólio com foco em **arquitetura Local-First**, **performance**, **privacidade** e uma **experiência mobile-first** de alta qualidade.

Sem cadastro. Sem internet obrigatória. Seus dados ficam no seu dispositivo.

---

## ✨ Funcionalidades

### 📊 Dashboard de Estatísticas
- Progresso geral do álbum em porcentagem, com totais de figurinhas coladas, faltantes e repetidas
- Barras de progresso individuais por seleção (48 times) e por seções especiais (FWC e Coca-Cola)

### 📖 Catálogo Interativo
- Listagem completa das 994 figurinhas do álbum
- Filtros rápidos: **Todas · Faltam · Tenho · Repetidas**
- Navegação por seção e busca por código (ex: `BRA01`, `FWC03`)

### 🎁 Pack Opener — Simulador de Pacotinhos
- Registre as figurinhas de cada pacote físico de forma simples e rápida
- O app identifica automaticamente o que é **novo**, **repetido** ou **inválido**
- Histórico das últimas **50 aberturas** persistido localmente

### 📤 Exportação para Trocas
- **WhatsApp:** Copia texto formatado (Markdown com emojis de bandeiras) direto para a área de transferência, pronto para colar em qualquer conversa
- **PDF:** Gera um relatório profissional agrupado por seleção, ideal para listar faltantes e repetidas com clareza

---

## 🏗️ Decisões Arquiteturais

### Local-First com IndexedDB

> A decisão de design mais importante do projeto.

A maioria das aplicações similares usa `localStorage` ou depende de um backend em nuvem. Aqui, a escolha foi diferente — e intencional.

| Critério | `localStorage` | Supabase / Firebase | **Figurados (IndexedDB)** |
|---|---|---|---|
| Custo de infra | Zero | Pode gerar custos | **Zero** |
| Funciona offline | ✅ | ❌ | **✅** |
| Performance | ⚠️ Síncrono (bloqueia UI) | Depende da rede | **✅ Assíncrono** |
| Limite de dados | ~5MB | Plano-dependente | **~50% do disco** |
| Privacidade | Dado no browser | Dado em servidor terceiro | **100% no dispositivo** |
| Complexidade | Baixa | Alta (auth, infra) | **Baixa** |

**Implementação:** [`idb-keyval`](https://github.com/jakearchibald/idb-keyval) é usado como engine customizado dentro do middleware `persist` do Zustand. Isso permite que toda a camada de estado (stores) use IndexedDB de forma transparente, sem alterar nenhuma lógica de negócio.

```ts
// storage abstraction — trocar por Supabase no futuro sem mudar os stores
const idbStorage: StateStorage = {
  getItem: (name) => get(name),
  setItem: (name, value) => set(name, value),
  removeItem: (name) => del(name),
}
```

A arquitetura foi desenhada para que a migração para Supabase (multiusuário, sync entre dispositivos) seja feita apenas substituindo esse adapter — sem reescrever stores, hooks ou componentes.

---

### Gerenciamento de Estado com Zustand + Immer

O estado global é dividido em **3 stores independentes** com responsabilidades claras:

- **`useCollectionStore`** — inventário de figurinhas (owned, duplicates, timestamps)
- **`usePackStore`** — histórico das aberturas de pacotes
- **`useUIStore`** — estado efêmero de UI (filtros, busca, seção ativa)

O uso do middleware `immer` permite mutações diretas e legíveis no estado, eliminando spreads profundos e reduzindo o risco de bugs em atualizações complexas.

---

### Tipagem Forte de Domínio

Os 48 `TeamCode`s (ex: `'BRA'`, `'GER'`) são modelados como um **union type literal**, não como `string`. Isso garante que qualquer código de time inválido seja capturado em **tempo de compilação**, antes de chegar à produção.

```ts
export type TeamCode =
  | 'ARG' | 'BRA' | 'FRA' | 'GER' | 'ENG' | 'ESP'
  // ... todos os 48 times
```

---

### Separação de Dados e Lógica

- **`src/data/stickers.ts`** — gera programaticamente as 994 figurinhas, com `STICKERS_MAP` (O(1) lookup) e `STICKERS_BY_SECTION`
- **`src/utils/statistics.ts`** — computação derivada de stats, pura e sem efeitos colaterais
- **`src/hooks/`** — encapsulam a lógica de negócio (ex: `usePackOpener`) longe dos componentes visuais

---

## 🛠️ Stack Tecnológica

| Categoria | Tecnologia | Decisão |
|---|---|---|
| Core | React 18 + TypeScript | Tipagem forte, ecossistema robusto |
| Build | Vite 5 | HMR instantâneo, build ultra-rápido |
| Estilização | Tailwind CSS v4 | Utility-first, sem CSS morto em produção |
| Estado | Zustand + Immer | Simples, performático, sem boilerplate |
| Persistência | idb-keyval (IndexedDB) | Assíncrono, ilimitado, offline-ready |
| Roteamento | React Router DOM v6 | Padrão da indústria |
| PWA | vite-plugin-pwa | Service Worker + manifesto automático |
| PDF | jsPDF + jspdf-autotable | Geração client-side, sem servidor |
| Ícones | lucide-react | Tree-shakeable, consistente |
| Toasts | sonner | Leve e acessível |

---

## 🚀 Rodando Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- npm v9+

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/figurados.git
cd figurados

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no navegador.

### Build de Produção

```bash
# Gera os arquivos otimizados em /dist
npm run build

# Pré-visualiza o build localmente
npm run preview
```

---

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── layout/        # Header, BottomNav, Layout wrapper
│   ├── sticker/       # StickerCard e variantes
│   └── ui/            # Button, Badge, ProgressBar, Modal, Card
├── constants/         # album.ts → ALBUM, TEAM_NAMES, TEAM_FLAGS, GROUPS
├── data/              # stickers.ts → ALL_STICKERS, STICKERS_MAP
├── hooks/             # useCollection, usePackOpener, useSearch
├── pages/             # Dashboard, Catalog, PackOpener, Stats
├── store/             # Zustand stores (collection, pack, UI)
├── types/             # Interfaces e union types de domínio
└── utils/             # statistics.ts, stickerParser.ts
```

---

## 🗺️ Roadmap

- [x] Dashboard com estatísticas gerais
- [x] Catálogo completo com filtros
- [x] Pack Opener com histórico
- [x] Exportação WhatsApp e PDF
- [ ] Estatísticas avançadas (gráficos)
- [ ] Modo de troca — matching entre coleções de amigos
- [ ] Sincronização entre dispositivos (Supabase)
- [ ] Sistema de usuários e perfis públicos

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

<p align="center">
  Feito com ☕ e muita figurinha repetida.
</p>

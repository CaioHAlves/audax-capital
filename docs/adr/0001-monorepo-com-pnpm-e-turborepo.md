# ADR 0001 — Monorepo com pnpm workspaces e Turborepo

- Status: Aceito
- Data: 2026-07-16

## Contexto

O teste exige um monorepo contendo backend (NestJS) e frontend (Next.js), com
liberdade de escolha entre pnpm workspaces, Turborepo ou Nx, desde que a
escolha seja justificada.

## Decisão

Usar **pnpm workspaces** para gerenciamento de pacotes e **Turborepo** como
orquestrador de tarefas (`build`, `test`, `dev`, `typecheck`, `lint`).

## Justificativa

- **pnpm** instala dependências com _content-addressable store_ e links,
  economizando disco e acelerando a instalação. `workspaces` cobre a ligação
  entre `apps/api` e `apps/web` sem ferramenta extra.
- **Turborepo** adiciona cache de tarefas e execução paralela com configuração
  mínima (um `turbo.json`), sem a curva de aprendizado nem os _generators_ e
  convenções mais opinativos do Nx.
- Para duas aplicações independentes, Nx seria peso desnecessário. pnpm +
  Turborepo entrega paralelismo e cache com baixíssima cerimônia.

## Consequências

- Comandos na raiz (`pnpm test`, `pnpm build`) abrangem todo o monorepo.
- Cada app mantém seu próprio `package.json` e ferramentas de teste.
- Se o repositório crescer muito, pode-se reavaliar Nx pelos _generators_.

# ADR 0003 — Estratégia de testes e TDD

- Status: Aceito
- Data: 2026-07-16

## Contexto

O teste exige TDD com ciclo red-green-refactor visível no histórico, em fatias
verticais. As regras de negócio devem ser testadas em nível de domínio/caso de
uso, sem depender de banco ou HTTP, e os testes devem sobreviver a refactors
(verificar comportamento pela interface pública).

## Decisão

- **Backend: Jest.** É a ferramenta padrão do ecossistema NestJS, com bom
  suporte a `ts-jest` e a testes e2e via `supertest`.
- **Frontend: Vitest.** Rápido e integrado ao ecossistema Vite/Next para testar
  lógica de UI (validação de formulário) com Testing Library.
- Os testes de domínio e de casos de uso não instanciam o Nest nem tocam banco:
  usam objetos puros e um repositório in-memory que implementa a mesma porta
  usada em produção.
- Testes verificam **comportamento** (criar, listar, atualizar, rejeitar SKU
  duplicado), não detalhes internos, para sobreviverem a refactors.

## Justificativa

- Usar a mesma porta `ProductRepository` no teste e em produção garante que o
  in-memory seja um _fake_ fiel, não um mock frágil.
- Separar unidades (domínio/aplicação) de e2e (HTTP) mantém o feedback rápido.

## Consequências

- Duas ferramentas de teste no monorepo (Jest e Vitest); cada app roda a sua.
- O histórico de commits alterna `test:` (red) e `feat:` (green) nas fatias
  verticais do domínio.

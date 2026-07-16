# ADR 0004 — Persistência plugável (porta + adapters)

- Status: Aceito
- Data: 2026-07-16

## Contexto

Deve ser possível trocar o repositório (ex.: in-memory → Postgres) sem tocar no
domínio. Isso exige uma porta bem definida e adapters intercambiáveis.

## Decisão

- Definir a porta `ProductRepository` (interface) no **domínio**, junto de um
  token de injeção `PRODUCT_REPOSITORY` (um `Symbol`, JavaScript puro, sem
  dependência de framework).
- Implementar dois adapters na **infraestrutura**:
  - `InMemoryProductRepository` — padrão, usado em testes e para rodar a API
    sem banco.
  - `TypeOrmProductRepository` — adapter Postgres via TypeORM.
- Selecionar o adapter por variável de ambiente `DB_DRIVER` (`memory` |
  `postgres`). O padrão é `memory`, para que a aplicação e os testes rodem sem
  infraestrutura externa.

## Justificativa

- A porta no domínio inverte a dependência: a aplicação depende da abstração, e
  a infraestrutura depende do domínio.
- Um `Symbol` como token evita acoplar o domínio ao Nest e ainda permite a
  injeção por token exigida pelo container.
- Default in-memory mantém o projeto executável e testável imediatamente após o
  clone, sem subir Postgres.

## Consequências

- Trocar de persistência é mudar `DB_DRIVER` e prover as variáveis de conexão.
- O adapter TypeORM traduz entre a entidade de domínio e a entidade ORM por um
  mapper explícito, mantendo o domínio livre de decorators de ORM.

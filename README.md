# Audax Capital — Catálogo de Produtos

CRUD completo de **Produtos** em um monorepo, aplicando **DDD**, **arquitetura
hexagonal (Ports & Adapters)** e **TDD**. Backend em NestJS, frontend em
Next.js (App Router).

## Sumário

- [Domínio escolhido](#domínio-escolhido)
- [Stack](#stack)
- [Estrutura do monorepo](#estrutura-do-monorepo)
- [Setup](#setup)
- [Execução](#execução)
- [Testes](#testes)
- [API](#api)
- [Decisões de arquitetura e trade-offs](#decisões-de-arquitetura-e-trade-offs)
- [Documentação de design](#documentação-de-design)

## Domínio escolhido

**Produtos** (`nome`, `SKU`, `preço`, `estoque`), com regras de negócio reais:

- **SKU único** no catálogo (verificado no caso de uso, não só no banco).
- **SKU imutável** após a criação.
- **SKU** com formato validado (`^[A-Z0-9-]{3,32}$`, normalizado em maiúsculas).
- **Preço** sempre positivo (armazenado em centavos para evitar erros de ponto
  flutuante).
- **Estoque** inteiro e não negativo.

O detalhamento do domínio está em [`CONTEXT.md`](./CONTEXT.md).

## Stack

- **Monorepo:** pnpm workspaces + Turborepo ([ADR 0001](./docs/adr/0001-monorepo-com-pnpm-e-turborepo.md))
- **Backend:** NestJS + TypeScript
- **Frontend:** Next.js (App Router) + TypeScript
- **Testes:** Jest (backend) e Vitest (frontend)
- **Persistência:** in-memory (padrão) ou Postgres via TypeORM (plugável)

## Estrutura do monorepo

```
audax-capital/
├── apps/
│   ├── api/                      # NestJS (backend)
│   │   └── src/product/
│   │       ├── domain/           # entidade, value objects, regras, portas
│   │       ├── application/      # casos de uso + DTOs de fronteira
│   │       └── infrastructure/   # HTTP, adapters de repositório, módulo Nest
│   └── web/                      # Next.js (frontend)
├── docs/adr/                     # Architecture Decision Records
├── CONTEXT.md                    # contexto e linguagem ubíqua do domínio
├── turbo.json
└── pnpm-workspace.yaml
```

## Setup

Requisitos: **Node >= 20** e **pnpm >= 9** (`corepack enable`).

```bash
pnpm install
```

Copie os arquivos de ambiente de exemplo (opcional; há defaults):

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

## Execução

Suba os dois apps (em terminais separados ou via Turborepo):

```bash
# backend em http://localhost:3000/api  (repositório in-memory por padrão)
pnpm --filter @audax/api dev

# frontend em http://localhost:3001
pnpm --filter @audax/web dev
```

Ou tudo de uma vez a partir da raiz:

```bash
pnpm dev
```

### Usando Postgres

O repositório é plugável. Para trocar in-memory por Postgres, sem tocar no
domínio, defina no `apps/api/.env`:

```bash
DB_DRIVER=postgres
DATABASE_URL=postgres://user:password@localhost:5432/audax
DB_SYNCHRONIZE=true
```

## Testes

```bash
# tudo
pnpm test

# só o backend (unitários de domínio/aplicação)
pnpm --filter @audax/api test

# e2e do backend (HTTP ponta a ponta, sem banco)
pnpm --filter @audax/api test:e2e

# só o frontend
pnpm --filter @audax/web test
```

Os testes de domínio e de casos de uso não dependem de banco nem de HTTP: usam
objetos puros e o repositório in-memory, que implementa a mesma porta usada em
produção. Eles verificam comportamento pela interface pública e sobrevivem a
refactors.

## API

Base: `http://localhost:3000/api`

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/products` | Cria um produto |
| `GET` | `/products?page=1&limit=10` | Lista paginada |
| `GET` | `/products/:id` | Busca por id |
| `PUT` | `/products/:id` | Atualiza nome, preço e estoque |
| `DELETE` | `/products/:id` | Remove |

Erros de domínio são mapeados para HTTP: validação → `400`, não encontrado →
`404`, SKU duplicado → `409`.

Exemplo:

```bash
curl -X POST http://localhost:3000/api/products \
  -H 'Content-Type: application/json' \
  -d '{"name":"Teclado","sku":"kbd-01","price":199.90,"stock":10}'
```

## Decisões de arquitetura e trade-offs

### Camadas e dependências apontando para dentro

O backend é dividido em `domain`, `application` e `infrastructure`. As
dependências só apontam para dentro: o **domínio** é TypeScript puro (sem
NestJS, ORM ou HTTP), a **aplicação** depende apenas da porta
`ProductRepository`, e a **infraestrutura** é a única camada que conhece
framework, ORM e HTTP. Ver [ADR 0002](./docs/adr/0002-arquitetura-hexagonal-e-ddd.md).

**Trade-off:** os casos de uso não usam `@Injectable()` para não acoplar a
aplicação ao Nest; em troca, o `ProductModule` faz o _wiring_ com
`useFactory`, que é mais verboso. Preferimos um núcleo desacoplado à
conveniência dos decorators.

### Persistência plugável (porta + adapters)

`ProductRepository` é uma interface no domínio, com um token `Symbol` para
injeção. Há dois adapters: `InMemoryProductRepository` (padrão) e
`TypeOrmProductRepository` (Postgres). Trocar de um para o outro é mudar a
variável `DB_DRIVER` — o domínio e a aplicação não mudam. Ver
[ADR 0004](./docs/adr/0004-persistencia-plugavel.md).

**Trade-off:** o default in-memory mantém o projeto executável e testável logo
após o clone, sem subir Postgres, ao custo de não persistir entre reinícios —
uma escolha consciente para o contexto do teste.

### Value Objects

`Sku` e `Money` concentram validação e tornam estados inválidos
irrepresentáveis. `Money` guarda centavos (inteiro) para evitar erros de ponto
flutuante. Ver [ADR 0005](./docs/adr/0005-value-objects-money-e-sku.md).

### Testes e TDD

Jest no backend (padrão do ecossistema Nest, com e2e via `supertest`) e Vitest
no frontend. O ciclo red-green-refactor está refletido no histórico de commits,
em fatias verticais (`test:` seguido de `feat:`). Ver
[ADR 0003](./docs/adr/0003-estrategia-de-testes-e-tdd.md).

**Trade-off:** duas ferramentas de teste no monorepo, cada app rodando a sua;
em troca, cada lado usa a ferramenta mais natural do seu ecossistema.

## Documentação de design

- [`CONTEXT.md`](./CONTEXT.md) — contexto, linguagem ubíqua e regras de negócio.
- [`docs/adr/`](./docs/adr) — decisões de arquitetura registradas como ADRs.

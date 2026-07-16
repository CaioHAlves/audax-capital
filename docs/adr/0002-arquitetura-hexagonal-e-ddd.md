# ADR 0002 — Arquitetura hexagonal (Ports & Adapters) com DDD

- Status: Aceito
- Data: 2026-07-16

## Contexto

O requisito central do teste é a arquitetura: separar domínio, aplicação e
infraestrutura, com dependências apontando para dentro. O domínio não pode
conhecer NestJS, ORM ou detalhes de framework.

## Decisão

Organizar o backend em três camadas por _feature_ (`product`):

```
apps/api/src/product/
  domain/        entidade, value objects, regras, porta de repositório
  application/   casos de uso (orquestração do domínio) + DTOs de fronteira
  infrastructure/  controllers HTTP, adapters de repositório, módulo Nest
```

Regras:

- O **domínio** é TypeScript puro: sem decorators do Nest, sem ORM, sem HTTP.
- A **aplicação** depende apenas da porta `ProductRepository` (interface no
  domínio) e de erros/DTOs próprios. Os casos de uso são classes puras,
  instanciadas via _factory providers_ do Nest — eles não têm `@Injectable()`,
  para não acoplar a aplicação ao framework.
- A **infraestrutura** é a única camada que importa `@nestjs/*`, `typeorm` e
  lida com HTTP. É onde os _adapters_ implementam as portas.

## Justificativa

- Dependências apontando para dentro tornam o núcleo testável sem banco nem
  HTTP e resistente a troca de framework.
- Manter casos de uso sem decorators garante que a regra "aplicação não conhece
  Nest" seja verdadeira no código, não apenas no diagrama.

## Consequências

- O `ProductModule` faz o _wiring_ com `useFactory`, um pouco mais verboso que
  `@Injectable()`, em troca de um núcleo desacoplado.
- Há mapeamento explícito entre DTOs de fronteira e objetos de domínio.
